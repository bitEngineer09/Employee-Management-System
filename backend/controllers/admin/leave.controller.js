import { prisma } from "../../utils/client.js";
import { getDaysBetween } from '../../helpers/getDaysBetween.js'
import AppError from "../../utils/AppError.js";
import asyncHandler from "../../utils/asyncHandler.js";

// create holiyday leave
export const createHoliday = asyncHandler(async (req, res) => {
    const { date, name } = req.body;
    if (!date || !name) throw new AppError("Please provide all fields", 400);

    const isHolidayExisits = await prisma.holiday.findUnique({
        where: { date: new Date(date) }
    });

    if (isHolidayExisits) throw new AppError("Holiday already exists for this date", 400);

    const holiday = await prisma.holiday.create({
        data: {
            date: new Date(date),
            name
        }
    });

    return res.status(200).json({
        success: true,
        message: "Holiday created successfully",
        holiday
    });
});

// delete holiday
export const deleteHoliday = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw new AppError("Please provide holiday id", 400)

    const deleted = await prisma.holiday.delete({
        where: { id: Number(id) }
    });

    return res.status(200).json({
        success: true,
        message: "Holiday deleted successfully",
        deleted
    })
});

// get holidays
export const getHolidays = asyncHandler(async (req, res) => {
    const holidays = await prisma.holiday.findMany({
        orderBy: {
            date: "asc"
        }
    });

    return res.status(200).json({
        success: true,
        message: "Holidays fetched successfully",
        holidays
    });
});

// get all leaves (admin ko saari leaves dikhani hai)
export const getAllLeaves = asyncHandler(async (req, res) => {
    const leaves = await prisma.leave.findMany({
        include: {
            employee: {
                select: {
                    name: true, employeeId: true
                }
            },
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return res.status(200).json({
        success: true,
        message: "All leaves fetched successfully",
        leaves
    });
});

// approve/reject leaves
export const approveRejectLeave = asyncHandler(async (req, res) => {
    const adminId = req.user.id;
    const { status } = req.body;
    const leaveId = Number(req.params.id);

    if (!["APPROVED", "REJECTED"].includes(status)) throw new AppError("Invalid status. Must be APPROVED or REJECTED", 400);


    const existingLeave = await prisma.leave.findUnique({
        where: { id: leaveId },
    });

    if (!existingLeave) throw new AppError("Leave request not found", 404);

    if (existingLeave.status !== "PENDING") throw new AppError("Leave already processed", 400);


    const result = await prisma.$transaction(async (tx) => {
        // 1. Update leave status
        const leave = await tx.leave.update({
            where: { id: leaveId },
            data: {
                status,
                approvedBy: adminId,
            },
        });

        // Agar reject hai to yahin return
        if (status === "REJECTED") return leave;

        // 2. Leave approved → balance + attendance handle karo
        const year = new Date(leave.fromDate).getFullYear();
        const days = getDaysBetween(leave.fromDate, leave.toDate);

        const balance = await tx.leaveBalance.findUnique({
            where: {
                employeeId_year: {
                    employeeId: leave.employeeId,
                    year,
                },
            },
        });

        if (!balance) throw new AppError("Leave balance not found for employee", 404);

        let updateBalanceData = {};

        if (leave.type === "CASUAL") {
            if (balance.casualLeft < days) throw new AppError("Insufficient casual leave balance", 400);
            updateBalanceData.casualLeft = balance.casualLeft - days;
        }

        if (leave.type === "SICK") {
            if (balance.sickLeft < days) throw new AppError("Insufficient sick leave balance", 400);
            updateBalanceData.sickLeft = balance.sickLeft - days;
        }

        if (leave.type === "PAID") {
            if (balance.paidLeft < days) throw new AppError("Insufficient paid leave balance", 400);
            updateBalanceData.paidLeft = balance.paidLeft - days;
        }

        if (Object.keys(updateBalanceData).length > 0) {
            await tx.leaveBalance.update({
                where: { id: balance.id },
                data: updateBalanceData,
            });
        }

        // 3. Attendance mark karo for leave duration
        const start = new Date(leave.fromDate);
        const end = new Date(leave.toDate);
        const current = new Date(start);

        while (current <= end) {
            await tx.attendance.upsert({
                where: {
                    employeeId_date: {
                        employeeId: leave.employeeId,
                        date: new Date(current),
                    },
                },
                update: {
                    status:
                        leave.type === "UNPAID"
                            ? "LEAVE_UNPAID"
                            : "LEAVE_PAID",
                },
                create: {
                    employeeId: leave.employeeId,
                    date: new Date(current),
                    status:
                        leave.type === "UNPAID"
                            ? "LEAVE_UNPAID"
                            : "LEAVE_PAID",
                },
            });

            current.setDate(current.getDate() + 1);
        }

        return leave;
    });

    return res.status(200).json({
        success: true,
        message: `Leave ${status.toLowerCase()} successfully`,
        leave: result,
    })
});
