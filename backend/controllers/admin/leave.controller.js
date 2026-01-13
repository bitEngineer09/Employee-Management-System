import { prisma } from "../../utils/client.js";
import { getDaysBetween } from '../../helpers/getDaysBetween.js'

// create holiyday leave
export const createHoliday = async (req, res) => {
    try {
        const { date, name } = req.body;
        if (!date || !name) return res.status(400).json({
            success: false,
            message: "Please provide all fields",
        });

        const isHolidayExisits = await prisma.holiday.findUnique({
            where: { date: new Date(date) }
        });

        if (isHolidayExisits) {
            return res.status(400).json({
                success: false,
                message: "Holiday already exists for this date"
            });
        }


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

    } catch (error) {
        console.error("createHoliday error", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

// delete holiday
export const deleteHoliday = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({
            success: false,
            message: "Please provide holiday id",
        });

        const deleted = await prisma.holiday.delete({
            where: { id: Number(id) }
        });

        return res.status(200).json({
            success: true,
            message: "Holiday deleted successfully",
            deleted
        })
    } catch (error) {
        console.error("deleteHoliday error", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
}

// get holidays
export const getHolidays = async (req, res) => {
    try {
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

    } catch (error) {
        console.error("createHoliday error", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

// get all leaves (admin ko saari leaves dikhani hai)
export const getAllLeaves = async (req, res) => {
    try {
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

    } catch (error) {
        console.error("getAllLeaves error", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

// approve/reject leaves
export const approveRejectLeave = async (req, res) => {
    try {
        const adminId = req.user.id;
        const { status } = req.body;
        const leaveId = Number(req.params.id);

        if (!["APPROVED", "REJECTED"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Must be APPROVED or REJECTED",
            });
        }

        const existingLeave = await prisma.leave.findUnique({
            where: { id: leaveId },
        });

        if (!existingLeave) {
            return res.status(404).json({
                success: false,
                message: "Leave request not found",
            });
        }

        if (existingLeave.status !== "PENDING") {
            return res.status(400).json({
                success: false,
                message: "Leave already processed",
            });
        }

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
            if (status === "REJECTED") {
                return leave;
            }

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

            if (!balance) {
                throw new Error("Leave balance not found for employee");
            }

            let updateBalanceData = {};

            if (leave.type === "CASUAL") {
                if (balance.casualLeft < days) {
                    throw new Error("Insufficient casual leave balance");
                }
                updateBalanceData.casualLeft = balance.casualLeft - days;
            }

            if (leave.type === "SICK") {
                if (balance.sickLeft < days) {
                    throw new Error("Insufficient sick leave balance");
                }
                updateBalanceData.sickLeft = balance.sickLeft - days;
            }

            if (leave.type === "PAID") {
                if (balance.paidLeft < days) {
                    throw new Error("Insufficient paid leave balance");
                }
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
        });
    } catch (error) {
        console.error("approveRejectLeave error:", error.message);

        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};
