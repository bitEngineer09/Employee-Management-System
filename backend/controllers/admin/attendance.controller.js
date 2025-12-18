import { prisma } from "../../utils/client.js";
import { getMonthRange } from '../../utils/getMonthRange.js';

// update attendance admin
export const adminAttendance = async (req, res) => {
    try {
        const { status } = req.body;
        const adminId = req.user.id;

        const allowedStatus = ["PRESENT", "ABSENT", "HALF_DAY", "LEAVE_PAID", "LEAVE_UNPAID"];
        if (!allowedStatus.includes(status)) return res.status(400).json({
            success: false,
            message: "Invalid Status",
        });

        const attendance = await prisma.attendance.findUnique({
            where: { id: Number(req.params.id) },
        });

        if (!attendance) {
            return res.status(404).json({ message: "Attendance not found" });
        }

        const updated = await prisma.attendance.update({
            where: { id: attendance.id },
            data: { status },
        });

        await prisma.attendanceLog.create({
            data: {
                attendanceId: attendance.id,
                action: "UPDATE",
                oldStatus: attendance.status,
                newStatus: status,
                changedBy: adminId,
            },
        });

        res.json({ message: "Attendance updated", updated });
    } catch (error) {
        console.error("adminAttendance error", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

// get employee attendance report 
export const getEmpAttendance = async (req, res) => {
    try {
        const { employeeId, from, to } = req.query;
        if (!employeeId || !from || !to) return res.status(400).json({
            success: false,
            message: "Please provide all fields"
        });

        const employee = await prisma.user.findUnique({
            where: { id: Number(employeeId) },
        });

        if (!employee || employee.role !== "EMPLOYEE") return res.status(400).json({
            success: false,
            message: "Employee not found",
        });

        const attendanceReport = await prisma.attendance.findMany({
            where: {
                employeeId: Number(employeeId),
                date: {
                    gte: new Date(from),
                    lte: new Date(to),
                },
            },
            include: {
                attendanceLogs: true,
            },
            orderBy: { date: "asc" },
        });

        return res.status(200).json({
            success: true,
            employee: {
                id: employee.id,
                name: employee.name,
                employeeId: employee.employeeId,
            },
            data: attendanceReport,
        });

    } catch (error) {
        console.error("getEmpAttendance error", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

// get monthly attendance summary 
export const getMonthlyAttendanceSummary = async (req, res) => {
    try {
        const { employeeId, month } = req.query;
        if (!employeeId || !month) return res.status(400).json({
            success: false,
            message: "Please provide all fields",
        });

        const employee = await prisma.user.findUnique({
            where: { id: Number(employeeId) }
        });

        if (!employee || employee.role !== "EMPLOYEE") return res.status(400).json({
            success: false,
            message: "Employee not found",
        });

        const { startDate, endDate } = getMonthRange(month);
        if (!startDate || !endDate) return res.status(400).json({
            success: false,
            message: "get montRange method error",
        });

        const attendance = await prisma.attendance.findMany({
            where: {
                employeeId: Number(employeeId),
                date: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                }
            },
            select: {
                status: true,
                workingHours: true
            },
        });

        // count holidays
        const holidays = await prisma.holiday.findMany({
            where: {
                date: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                },
            },
        });

        let summary = {
            PRESENT: 0,
            HALF_DAY: 0,
            ABSENT: 0,
            HOLIDAY: holidays.length,
            LEAVE_PAID: 0,
            LEAVE_UNPAID: 0,
            totalWorkingHours: 0,
        };

        attendance.forEach(a => {
            if (summary[a.status] !== undefined) {
                summary[a.status]++;
            }
            summary.totalWorkingHours += a.workingHours || 0;
        });

        summary.totalWorkingHours = Number(summary.totalWorkingHours.toFixed(2));

        return res.status(200).json({
            success: true,
            employee: {
                id: employee.id,
                name: employee.name,
                employeeId: employee.employeeId
            },
            month,
            summary
        });

    } catch (error) {
        console.error("getMonthlyAttendanceSummary error", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

// admin check in
export const adminCheckin = async (req, res) => {
    try {
        const adminId = req.user.id;

        const now = new Date();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existingAttendance = await prisma.attendance.findUnique({
            where: {
                employeeId_date: {
                    employeeId: adminId,
                    date: today,
                },
            },
        });

        if (existingAttendance) return res.status(400).json({
            success: false,
            message: "Today attendance already marked",
        });

        const attendance = await prisma.attendance.create({
            data: {
                employeeId: adminId,
                date: today,
                checkIn: now,
                status: "PRESENT",
            },
        });

        await prisma.attendanceLog.create({
            data: {
                attendanceId: attendance.id,
                action: "CHECK_IN",
                newStatus: "PRESENT",
                changedBy: adminId,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Admin check-in successful",
            attendance,
        });

    } catch (error) {
        console.error("adminCheckin error", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
}

// admin ckeck out
export const adminCheckout = async (req, res) => {
    try {
        const adminId = req.user.id;
        const now = new Date();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const attendance = await prisma.attendance.findUnique({
            where: {
                employeeId_date: {
                    employeeId: adminId,
                    date: today,
                },
            },
        });

        if (!attendance) return res.status(400).json({
            success: false,
            message: "Check-in not found for today",
        });

        if (attendance.checkOut) return res.status(400).json({
            success: false,
            message: "Already checked out",
        });

        const workingHours = (now.getTime() - attendance.checkIn.getTime()) / (1000 * 60 * 60);

        const updatedAttendance = await prisma.attendance.update({
            where: { id: attendance.id },
            data: {
                checkOut: now,
                workingHours: Number(workingHours.toFixed(2)),
            },
        });

        await prisma.attendanceLog.create({
            data: {
                attendanceId: attendance.id,
                action: "CHECK_OUT",
                oldStatus: attendance.status,
                newStatus: attendance.status,
                changedBy: adminId,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Admin check-out successful",
            attendance: updatedAttendance,
        });

    } catch (error) {
        console.error("adminCheckout error", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
}