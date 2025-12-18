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

        if (!["APPROVED", "REJECTED"].includes(status)) return res.status(400).json({
            success: false,
            message: "Invalid status",
        });

        const leave = await prisma.leave.update({
            where: {
                id: Number(req.params.id),
            },
            data: {
                status,
                approvedBy: adminId
            },
        });

        // if status got approved then deduct the casual leaves balance
        if (status === "APPROVED" && leave.type === "CASUAL") {
            const year = new Date(leave.fromDate).getFullYear();
            const days = getDaysBetween(leave.fromDate, leave.toDate);

            const balance = await prisma.leaveBalance.findUnique({
                where: {
                    employeeId_year: {
                        employeeId: leave.employeeId,
                        year
                    },
                },
            });

            if (!balance || balance.casualLeft < days) return res.status(400).json({
                success: false,
                message: "Insuffucient casual leaves balance",
            });

            await prisma.leaveBalance.update({
                where: { id: balance.id },
                data: {
                    casualLeft: balance.casualLeft - days,
                },
            });

            const current = new Date(leave.fromDate);
            const end = new Date(leave.toDate);


            // jab tak leave hai, tab tak employee ka status me leave show karna hai
            while (current <= end) {
                await prisma.attendance.upsert({
                    where: {
                        employeeId_date: {
                            employeeId: leave.employeeId,
                            date: new Date(current)
                        }
                    },
                    update: {
                        status: leave.type === "PAID" ? "LEAVE_PAID" : "LEAVE_UNPAID"
                    },
                    create: {
                        employeeId,
                        date,
                        status: leave.type === "PAID" ? "LEAVE_PAID" : "LEAVE_UNPAID"
                    }
                });

                current.setDate(current.getDate() + 1);
            }
        }

        return res.status(200).json({
            success: true,
            leave,
        });

    } catch (error) {
        console.error("approveRejectLeave error", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};