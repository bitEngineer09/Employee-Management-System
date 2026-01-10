import { getDaysBetween } from '../../helpers/getDaysBetween.js';
import { prisma } from '../../utils/client.js';

// apply leave
export const applyLeave = async (req, res) => {
    try {
        const employeeId = req.user.id;
        const { fromDate, toDate, type, reason } = req.body;

        if (!fromDate || !toDate || !type) {
            return res.status(400).json({
                success: false,
                message: "fromDate, toDate and type are required",
            });
        }

        if (!["CASUAL", "SICK", "PAID", "UNPAID"].includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Invalid leave type",
            });
        }

        const start = new Date(fromDate);
        const end = new Date(toDate);

        if (start > end) {
            return res.status(400).json({
                success: false,
                message: "fromDate cannot be greater than toDate",
            });
        }

        // check existing leaves
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

        if (existingLeave) {
            return res.status(400).json({
                success: false,
                message: "Leave already exists in selected date range",
            });
        }

        // checks leave balance (for paid types)
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

            if (!balance) {
                return res.status(400).json({
                    success: false,
                    message: "Leave balance not found",
                });
            }

            const days = getDaysBetween(start, end);

            if (type === "CASUAL" && balance.casualLeft < days) {
                return res.status(400).json({
                    success: false,
                    message: "Insufficient casual leaves",
                });
            }

            if (type === "SICK" && balance.sickLeft < days) {
                return res.status(400).json({
                    success: false,
                    message: "Insufficient sick leaves",
                });
            }

            if (type === "PAID" && balance.paidLeft < days) {
                return res.status(400).json({
                    success: false,
                    message: "Insufficient paid leaves",
                });
            }
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

    } catch (error) {
        console.error("applyLeave error", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// get leave balance
export const getLeaveBalance = async (req, res) => {
    try {
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

    } catch (error) {
        console.error("getLeaveBalance error", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// get my active leaves 
export const getMyActiveLeaves = async (req, res) => {
    try {
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
            orderBy: {
                fromDate: "asc"
            }
        });

        return res.status(200).json({
            success: true,
            leaves
        });

    } catch (error) {
        console.error("getMyActiveLeaves error", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};