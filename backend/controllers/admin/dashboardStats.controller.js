import asyncHandler from "../../utils/asyncHandler.js";
import { prisma } from "../../utils/client.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const totalEmployees = await prisma.user.count();

    const presentEmployees = await prisma.attendance.count({
        where: {
            date: {
                gte: startOfDay,
                lte: endOfDay,
            },
            status: "PRESENT",
        },
    });

    const onLeaveEmployees = await prisma.attendance.findMany({
        where: {
            date: {
                gte: startOfDay,
                lte: endOfDay,
            },
            status: {
                in: ["LEAVE_PAID", "LEAVE_UNPAID"],
            },
        },
        distinct: ["employeeId"],
    });


    const leaveIds = onLeaveEmployees.map(l => l.employeeId);

    const absentEmployees = await prisma.attendance.count({
        where: {
            date: {
                gte: startOfDay,
                lte: endOfDay,
            },
            status: "ABSENT",
            ...(leaveIds.length > 0 && {
                employeeId: { notIn: leaveIds },
            }),
        },
    });

    const activeEmployees = await prisma.user.count({
        where: { isActive: true },
    });

    const inactiveEmployees = await prisma.user.count({
        where: { isActive: false },
    });

    const departments = await prisma.department.count();

    return res.status(200).json({
        success: true,
        totalEmployees,
        activeEmployees,
        presentEmployees,
        absentEmployees,
        onLeaveEmployees: onLeaveEmployees.length,
        inactiveEmployees,
        departments,
    });
});

export const getDepartmentStats = asyncHandler(async (req, res) => {
    const totalDepartment = await prisma.department.count();

    const departmentsWithCount = await prisma.department.findMany({
        select: {
            name: true,
            isActive: true,
            _count: {
                select: { users: true }
            }
        }
    });

    return res.status(200).json({
        success: true,
        message: "employees in each department data",
        totalDepartment,
        data: departmentsWithCount,
    });
});