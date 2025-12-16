import { prisma } from '../utils/client.js';
import {
    OFFICE_START_HOUR,
    LATE_CHECKIN_MINUTES,
    HALF_DAY_HOURS,
    FULL_DAY_HOURS
} from "../utils/attendanceRules.js";
import { getMonthRange } from '../utils/monthRange.js';

// employee check in
export const checkin = async (req, res) => {
    try {
        const employeeId = req.user.id;

        const today = new Date();
        // ye karne se date same rehti hai, bas hrs 0 set ho jaate hai
        // taaki one attendance record per employee per day maintain rahe,
        // koi bhi timestamp-based duplication issues naa aaye
        today.setHours(0, 0, 0, 0);

        const now = new Date();

        // check existing attendance
        const existing = await prisma.attendance.findUnique({
            where: {
                employeeId_date: {
                    employeeId,
                    date: today
                }
            }
        });

        if (existing?.checkIn) {
            return res.status(400).json({
                success: false,
                message: "Already checked in today"
            });
        }

        // Late check-in logic
        const officeStart = new Date(today);
        officeStart.setHours(OFFICE_START_HOUR, LATE_CHECKIN_MINUTES, 0, 0);

        const status = now > officeStart ? "HALF_DAY" : "PRESENT";

        const attendance = await prisma.attendance.upsert({
            where: {
                employeeId_date: {
                    employeeId,
                    date: today
                }
            },
            update: {
                checkIn: now,
                status
            },
            create: {
                employeeId,
                date: today,
                checkIn: now,
                status
            }
        });

        await prisma.attendanceLog.create({
            data: {
                attendanceId: attendance.id,
                action: "CHECK_IN",
                newStatus: status,
                changedBy: employeeId
            }
        });

        return res.status(200).json({
            success: true,
            message: `Checked in successfully (${status})`,
            attendance
        });

    } catch (error) {
        console.error("checkin error", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// employee check out
export const checkout = async (req, res) => {
    try {
        const employeeId = req.user.id;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const attendance = await prisma.attendance.findUnique({
            where: {
                employeeId_date: {
                    employeeId,
                    date: today
                }
            }
        });

        if (!attendance || !attendance.checkIn) {
            return res.status(400).json({
                success: false,
                message: "No check-in found"
            });
        }

        if (attendance.checkOut) {
            return res.status(400).json({
                success: false,
                message: "Already checked out"
            });
        }

        const checkOutTime = new Date();

        const workingHours =
            (checkOutTime.getTime() - attendance.checkIn.getTime()) / 3600000;

        let finalStatus = "ABSENT";

        if (workingHours >= FULL_DAY_HOURS) {
            finalStatus = "PRESENT";
        } else if (workingHours >= HALF_DAY_HOURS) {
            finalStatus = "HALF_DAY";
        }

        const updatedAttendance = await prisma.attendance.update({
            where: {
                id: attendance.id
            },
            data: {
                checkOut: checkOutTime,
                workingHours: Number(workingHours.toFixed(2)),
                status: finalStatus
            }
        });

        await prisma.attendanceLog.create({
            data: {
                attendanceId: attendance.id,
                action: "CHECK_OUT",
                oldStatus: attendance.status,
                newStatus: finalStatus,
                changedBy: employeeId
            }
        });

        return res.status(200).json({
            success: true,
            message: `Checked out (${finalStatus})`,
            updatedAttendance
        });

    } catch (error) {
        console.error("checkout error", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// get attendance report
export const getAttendance = async (req, res) => {
    try {
        const employeeId = req.user.id;
        const { from, to } = req.query;

        if (!from || !to) {
            return res.status(400).json({ message: "From & To required" });
        }

        const data = await prisma.attendance.findMany({
            where: {
                employeeId,
                date: {
                    gte: new Date(from),
                    lte: new Date(to)
                }
            },
            include: {
                attendanceLogs: true
            },
            orderBy: { date: "asc" }
        });

        return res.status(200).json({
            success: false,
            message: "Attendance fetched successfully",
            attendanceReport: data,
        });

    } catch (error) {
        console.error("getAttendance error", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// get monthly summary
export const getMonthySummary = async (req, res) => {
    try {
        const { employeeId, month } = req.query;
        if (!employeeId || !month) return res.status(400).json({
            success: false,
            message: "Please provide all fields",
        });

        const { startDate, endDate } = getMonthRange(month);
        if (!startDate || !endDate) return res.status(400).json({
            success: false,
            message: "get monthRange method error",
        });

        const employee = await prisma.user.findUnique({
            where: { id: Number(employeeId) },
        });

        if (!employee || employee !== "EMPLOYEE") return res.status(400).json({
            success: false,
            message: "Employee not found",
        });

        const attendance = await prisma.attendance.findMany({
            where: {
                employeeId_date: {
                    employeeId: Number(employeeId),
                    date: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            },
            select: {
                status: true,
                workingHours: true,
            },
        });

        let summary = {
            PRESENT: 0,
            HALF_DAY: 0,
            ABSENT: 0,
            totalWorkingHours: 0,
        };

        attendance.forEach(a => {
            summary[a.status]++;
            summary.totalWorkingHours += a.workingHours || 0;
        });

        summary.totalWorkingHours = Number(summary.totalWorkingHours.toFixed(2));

        return res.status(200).json({
            success: false,
            message: "Your Monthly report fetched successfully",
            month,
            summary,
        });

    } catch (error) {
        console.error("getMonthySummary error", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}