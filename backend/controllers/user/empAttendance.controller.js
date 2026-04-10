import { prisma } from '../../utils/client.js';
import { getMonthRange } from '../../utils/getMonthRange.js';
import argon2 from 'argon2';
import {
    OFFICE_START_HOUR,
    LATE_CHECKIN_MINUTES,
    HALF_DAY_HOURS,
    FULL_DAY_HOURS
} from "../../utils/attendanceRules.js";
import { isSameDay } from '../../helpers/isSameDay.js';
import { getDatesBetween } from '../../helpers/getDatesBetween.js';
import asyncHandler from '../../utils/asyncHandler.js';
import AppError from '../../utils/AppError.js';

// check in
export const checkin = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const role = req.user?.role;

    if (role !== "EMPLOYEE") throw new AppError("Only employees can mark attendance", 403);

    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await prisma.attendance.findUnique({
        where: {
            employeeId_date: {
                employeeId: userId,
                date: today,
            },
        },
    });

    if (existing?.checkIn) throw new AppError("Already checked in today", 400);

    let status = "PRESENT";

    const officeStart = new Date(today);
    officeStart.setHours(OFFICE_START_HOUR, LATE_CHECKIN_MINUTES, 0, 0);

    if (now > officeStart) {
        status = "HALF_DAY";
    }

    const attendance = await prisma.attendance.upsert({
        where: {
            employeeId_date: {
                employeeId: userId,
                date: today,
            },
        },
        update: {
            checkIn: now,
            status,
        },
        create: {
            employeeId: userId,
            date: today,
            checkIn: now,
            status,
        },
    });

    return res.status(200).json({
        success: true,
        message: `Checked in successfully (${status})`,
        attendance,
    });
});

// check out
export const checkout = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const role = req.user?.role;

    if (role !== "EMPLOYEE") throw new AppError("Only employees can mark attendance", 403);

    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await prisma.attendance.findUnique({
        where: {
            employeeId_date: {
                employeeId: userId,
                date: today,
            },
        },
    });

    if (!attendance || !attendance.checkIn) throw new AppError("No check-in found for today", 400);

    if (attendance.checkOut) throw new AppError("Already checked out", 400);

    const workingHours =
        (now.getTime() - attendance.checkIn.getTime()) / 3600000;

    let finalStatus = "ABSENT";

    if (workingHours >= FULL_DAY_HOURS) {
        finalStatus = "PRESENT";
    } else if (workingHours >= HALF_DAY_HOURS) {
        finalStatus = "HALF_DAY";
    }

    const updatedAttendance = await prisma.attendance.update({
        where: { id: attendance.id },
        data: {
            checkOut: now,
            workingHours: Number(workingHours.toFixed(2)),
            status: finalStatus,
        },
    });

    return res.status(200).json({
        success: true,
        message: `Checked out successfully (${finalStatus})`,
        attendance: updatedAttendance,
    });
});

// get attendance report
export const getAttendance = asyncHandler(async (req, res) => {
    const employeeId = Number(req.user.id);
    const { from, to } = req.query;

    if (!from || !to) throw new AppError("From & To required", 400);

    const start = new Date(from);
    const end = new Date(to);

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const data = await prisma.attendance.findMany({
        where: {
            employeeId,
            date: {
                gte: start,
                lte: end,
            },
        },
        orderBy: { date: "asc" },
    });

    const allDates = getDatesBetween(start, end);

    const attendanceReport = allDates.map((date) => {
        const record = data.find((d) => isSameDay(d.date, date));

        if (!record) {
            return {
                date,
                status: "ABSENT",
                checkIn: null,
                checkOut: null,
                workingHours: 0,
            };
        }

        return {
            date: record.date,
            status: record.status,
            checkIn: record.checkIn,
            checkOut: record.checkOut,
            workingHours: record.workingHours,
        };
    });

    return res.status(200).json({
        success: true,
        message: "Attendance fetched successfully",
        data: {
            from,
            to,
            totalDays: attendanceReport.length,
            attendance: attendanceReport,
        },
    });
});

// get today attendance
export const getTodayAttendance = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const attendance = await prisma.attendance.findFirst({
        where: {
            employeeId: userId,
            date: {
                gte: start,
                lte: end,
            },
        },
        select: {
            id: true,
            checkIn: true,
            checkOut: true,
            status: true,
            workingHours: true,
        },
    });

    if (!attendance) {
        return res.status(200).json({
            success: true,
            data: {
                checkIn: null,
                checkOut: null,
                status: "ABSENT",
            },
            message: "No attendance found for today",
        });
    }

    return res.status(200).json({
        success: true,
        data: attendance,
    });
});

// get monthly summary
export const getMonthlySummary = asyncHandler(async (req, res) => {
    const { month } = req.query;
    const employeeId = req.user.id;

    if (!month) throw new AppError("Please provide month", 400);

    const { startDate, endDate } = getMonthRange(month);
    if (!startDate || !endDate) throw new AppError("get monthRange method error", 400);

    const employee = await prisma.user.findUnique({
        where: { id: employeeId },
    });

    if (!employee || employee.role !== "EMPLOYEE") throw new AppError("Employee not found", 400);

    const attendance = await prisma.attendance.findMany({
        where: {
            employeeId: Number(employeeId),
            date: {
                gte: startDate,
                lte: endDate,
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
        success: true,
        message: "Your Monthly report fetched successfully",
        month,
        summary,
    });
});

// change default password
export const changeDefaultPassword = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    const employee = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!oldPassword || !newPassword) throw new AppError("Please provide all fields", 400);

    const verifyOldPassword = await argon2.verify(employee.password, oldPassword);
    if (!verifyOldPassword) throw new AppError("Old password is incorrect", 400);

    const isPasswordSame = await argon2.verify(employee.password, newPassword);
    if (isPasswordSame) throw new AppError("New password cannot be same as old password", 400);

    const hashedPassword = await argon2.hash(newPassword);

    await prisma.user.update({
        where: { id: userId },
        data: {
            password: hashedPassword,
        },
    });

    return res.status(200).json({
        success: true,
        message: "Password updated successfully",
    });
});