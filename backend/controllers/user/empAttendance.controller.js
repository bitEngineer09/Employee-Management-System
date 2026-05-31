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
import { compareFaces } from '../../services/faceComparison.service.js';
import { isWithinOffice } from '../../services/locationValidation.service.js';

// check in
export const checkin = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const role = req.user?.role;

    if (role !== "EMPLOYEE") throw new AppError("Only employees can mark attendance", 403);

    const { faceDescriptor, lat, lng, deviceInfo } = req.body;

    // Validate required fields 
    if (!faceDescriptor || !Array.isArray(faceDescriptor) || faceDescriptor.length !== 128) {
        return res.status(400).json({
            success: false,
            message: "Invalid or missing face descriptor (expected 128-element array)",
        });
    }

    if (lat === undefined || lng === undefined) {
        return res.status(400).json({
            success: false,
            message: "Location (lat, lng) is required for check-in",
        });
    }

    // Load user's stored face descriptor 
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { faceDescriptor: true },
    });

    if (!user?.faceDescriptor) {
        return res.status(400).json({
            success: false,
            message: "Face not registered. Please register your face first.",
        });
    }

    // Face comparison
    // Handle case where faceDescriptor might be stored as an object (Prisma's JSON) instead of array
    const storedDescriptor = Array.isArray(user.faceDescriptor)
        ? user.faceDescriptor
        : Object.values(user.faceDescriptor);

    const { match, distance } = compareFaces(storedDescriptor, faceDescriptor);
    if (!match) {
        return res.status(403).json({
            success: false,
            message: "Face verification failed. Please try again.",
            distance,
        });
    }

    // --- Location validation ---
    const { valid, distanceMeters } = isWithinOffice(parseFloat(lat), parseFloat(lng));
    if (!valid) {
        return res.status(403).json({
            success: false,
            message: `You are not within office premises (${distanceMeters}m away).`,
            distanceMeters,
        });
    }

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

    if (existing?.checkIn) {
        return res.status(400).json({
            success: false,
            message: "Already checked in today",
        });
    }

    let status = "PRESENT";
    const officeStart = new Date(today);
    officeStart.setHours(OFFICE_START_HOUR, LATE_CHECKIN_MINUTES, 0, 0);
    if (now > officeStart) {
        status = "HALF_DAY";
    }

    // --- Upsert attendance record with location ---
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
            checkInLat: parseFloat(lat),
            checkInLng: parseFloat(lng),
        },
        create: {
            employeeId: userId,
            date: today,
            checkIn: now,
            status,
            checkInLat: parseFloat(lat),
            checkInLng: parseFloat(lng),
        },
    });

    // --- Create attendance log entry ---
    await prisma.attendanceLog.create({
        data: {
            attendanceId: attendance.id,
            action: "CHECK_IN",
            newStatus: status,
            locationLat: parseFloat(lat),
            locationLng: parseFloat(lng),
            deviceInfo: deviceInfo || null,
            changedBy: userId,
        },
    });

    return res.status(200).json({
        success: true,
        message: `Checked in successfully (${status})`,
        attendance,
    });
});

// check out (with geolocation validation)
export const checkout = async (req, res) => {
    try {
        const userId = req.user?.id;
        const role = req.user?.role;

        if (role !== "EMPLOYEE") throw new AppError("Only employees can mark attendance", 403);

        const { lat, lng, deviceInfo } = req.body;

        // Validate location 
        if (lat === undefined || lng === undefined) {
            return res.status(400).json({
                success: false,
                message: "Location (lat, lng) is required for check-out",
            });
        }

        const { valid, distanceMeters } = isWithinOffice(parseFloat(lat), parseFloat(lng));
        if (!valid) {
            return res.status(403).json({
                success: false,
                message: `You are not within office premises (${distanceMeters}m away).`,
                distanceMeters,
            });
        }

        const now = new Date(); // stores actual check-out time for accurate working hours calculation
        const today = new Date(); // normalize to today's date for lookup
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


        const workingHours = (now.getTime() - attendance.checkIn.getTime()) / 3600000;

        let finalStatus = "ABSENT";
        if (workingHours >= FULL_DAY_HOURS) {
            finalStatus = "PRESENT";
        } else if (workingHours >= HALF_DAY_HOURS) {
            finalStatus = "HALF_DAY";
        }

        // Update attendance record with checkout location 
        const updatedAttendance = await prisma.attendance.update({
            where: { id: attendance.id },
            data: {
                checkOut: now,
                workingHours: Number(workingHours.toFixed(2)),
                status: finalStatus,
                checkOutLat: parseFloat(lat),
                checkOutLng: parseFloat(lng),
            },
        });

        //  Create attendance log entry
        await prisma.attendanceLog.create({
            data: {
                attendanceId: attendance.id,
                action: "CHECK_OUT",
                oldStatus: attendance.status,
                newStatus: finalStatus,
                locationLat: parseFloat(lat),
                locationLng: parseFloat(lng),
                deviceInfo: deviceInfo || null,
                changedBy: userId,
            },
        });

        return res.status(200).json({
            success: true,
            message: `Checked out successfully (${finalStatus})`,
            attendance: updatedAttendance,
        });
    } catch (error) {
        console.error("checkout error", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
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
};

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

    if (!oldPassword || !newPassword) {
        throw new AppError("Please provide all fields", 400);
    }

    const verifyOldPassword = await argon2.verify(employee.password, oldPassword);

    if (!verifyOldPassword) {
        throw new AppError("Old password is incorrect", 400);
    }

    const isPasswordSame = await argon2.verify(employee.password, newPassword);

    if (isPasswordSame) {
        throw new AppError("New password cannot be same as old password", 400);
    }

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

// register face descriptor (called once per employee for initial face enrollment)
export const registerFace = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { faceDescriptor } = req.body;

        if (!faceDescriptor || !Array.isArray(faceDescriptor) || faceDescriptor.length !== 128) {
            return res.status(400).json({
                success: false,
                message: "Invalid face descriptor. Expected a 128-element float array.",
            });
        }

        await prisma.user.update({
            where: { id: userId },
            data: { faceDescriptor },
        });

        return res.status(200).json({
            success: true,
            message: "Face registered successfully.",
        });
    } catch (error) {
        console.error("registerFace error", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
