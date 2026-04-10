import AppError from "../../utils/AppError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { prisma } from "../../utils/client.js";
import { getMonthRange } from '../../utils/getMonthRange.js';

// update attendance admin
export const adminAttendance = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const adminId = req.user.id;

    const allowedStatus = ["PRESENT", "ABSENT", "HALF_DAY", "LEAVE_PAID", "LEAVE_UNPAID"];
    if (!allowedStatus.includes(status)) throw new AppError("Invalid Status", 400);


    const attendance = await prisma.attendance.findUnique({
        where: { id: Number(req.params.id) },
    });

    if (!attendance) throw new AppError("Attendance not found", 404);

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
})

// get employee attendance report 
export const getEmpAttendance = async (req, res) => {
    const { employeeId, from, to } = req.query;
    if (!employeeId || !from || !to) throw new AppError("Please provide all fields", 400);

    const employee = await prisma.user.findUnique({
        where: { id: Number(employeeId) },
    });

    if (!employee || employee.role !== "EMPLOYEE") throw new AppError("Employee not found", 400);

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
};

// get monthly attendance summary 
export const getMonthlyAttendanceSummary = asyncHandler(async (req, res) => {
    const { employeeId, month } = req.query;
    if (!employeeId || !month) throw new AppError("Please provide all fields", 400);

    const employee = await prisma.user.findUnique({
        where: { id: Number(employeeId) }
    });

    if (!employee || employee.role !== "EMPLOYEE") throw new AppError("Employee not found", 400);

    const { startDate, endDate } = getMonthRange(month);
    if (!startDate || !endDate) throw new AppError("get monthRange method error", 400);

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
});

// get today attendance summary
export const getTodayEmployeesAttendance = asyncHandler(async (req, res) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const employees = await prisma.user.findMany({
        where: { role: "EMPLOYEE" },
        select: {
            id: true,
            name: true,
            employeeId: true,
            isActive: true,
            department: {
                select: { id: true, name: true }
            },
            designation: true,
            attendances: {
                where: {
                    date: {
                        gte: startOfDay,
                        lte: endOfDay,
                    }
                },
                select: {
                    status: true,
                }
            }
        }
    });

    return res.status(200).json({
        success: true,
        message: "Today attendance fetched successfully",
        data: employees,
    });
});
