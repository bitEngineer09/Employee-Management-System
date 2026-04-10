import { getDaysBetween } from '../../helpers/getDaysBetween.js';
import { prisma } from '../../utils/client.js';
import asyncHandler from '../../utils/asyncHandler.js';
import AppError from '../../utils/AppError.js';

// apply leave
export const applyLeave = asyncHandler(async (req, res) => {
    const employeeId = req.user.id;
    const { fromDate, toDate, type, reason } = req.body;

    if (!fromDate || !toDate || !type) throw new AppError("fromDate, toDate and type are required", 400);

    if (!["CASUAL", "SICK", "PAID", "UNPAID"].includes(type)) throw new AppError("Invalid leave type", 400);

    const start = new Date(fromDate);
    const end = new Date(toDate);

    if (start > end) throw new AppError("fromDate cannot be greater than toDate", 400);

    const existingLeave = await prisma.leave.findFirst({
        where: {
            employeeId,
            OR: [
                {
                    fromDate: { lte: end },
                    toDate: { gte: start },
                },
            ],
        },
    });

    if (existingLeave) throw new AppError("Leave already exists in selected date range", 400);

    if (type !== "UNPAID") {
        const year = new Date().getFullYear();

        const balance = await prisma.leaveBalance.findUnique({
            where: {
                employeeId_year: {
                    employeeId,
                    year,
                },
            },
        });

        if (!balance) throw new AppError("Leave balance not found", 400);

        const days = getDaysBetween(start, end);

        if (type === "CASUAL" && balance.casualLeft < days) throw new AppError("Insufficient casual leaves", 400);

        if (type === "SICK" && balance.sickLeft < days) throw new AppError("Insufficient sick leaves", 400);

        if (type === "PAID" && balance.paidLeft < days) throw new AppError("Insufficient paid leaves", 400);
    }

    const leave = await prisma.leave.create({
        data: {
            employeeId,
            fromDate: start,
            toDate: end,
            type,
            reason: reason || null,
        },
    });

    return res.status(201).json({
        success: true,
        message: "Leave request generated successfully",
        leave,
    });
});

// get leave balance
export const getLeaveBalance = asyncHandler(async (req, res) => {
    const employeeId = Number(req.user.id);
    const year = new Date().getFullYear();

    let balance = await prisma.leaveBalance.findUnique({
        where: {
            employeeId_year: {
                employeeId,
                year,
            },
        },
    });

    if (!balance) {
        balance = await prisma.leaveBalance.create({
            data: {
                employeeId,
                year,
            },
        });
    }

    return res.status(200).json({
        success: true,
        message: "leave balance fetched successfully",
        balance,
    });
});

// get my active leaves
export const getMyActiveLeaves = asyncHandler(async (req, res) => {
    const employeeId = req.user.id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const leaves = await prisma.leave.findMany({
        where: {
            employeeId,
            toDate: {
                gte: today
            }
        },
        include: {
            approvedByUser: {
                select: {
                    id: true,
                    name: true,
                    department: true,
                    designation: true
                }
            }
        },
        orderBy: {
            fromDate: "asc"
        }
    });

    return res.status(200).json({
        success: true,
        leaves
    });
});