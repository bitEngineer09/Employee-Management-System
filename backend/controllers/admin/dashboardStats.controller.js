import { prisma } from "../../utils/client.js";

export const getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalEmployees = await prisma.user.count({
            where: { role: "EMPLOYEE" },
        });

        const activeEmployees = await prisma.user.count({
            where: {
                role: "EMPLOYEE",
                isActive: true
            },
        });

        const inactiveEmployees = await prisma.user.count({
            where: { isActive: false }
        });

        const onLeaveEmployees = await prisma.leave.findMany({
            where: {
                status: "APPROVED",
                fromDate: { lte: today },
                toDate: { gte: today },
            },
            distinct: ["employeeId"],
        });

        const onLeaveCount = onLeaveEmployees.length;

        const absentEmployees = await prisma.attendance.count({
            where: {
                date: today,
                status: "ABSENT",
                employeeId: {
                    notIn: onLeaveEmployees.map(l => l.employeeId),
                },
            },
        });

        const departments = await prisma.department.count();

        return res.status(200).json({
            success: true,
            message: "admin dashboard stats fetched successfully",
            totalEmployees,
            activeEmployees,
            absentEmployees,
            onLeaveEmployees: onLeaveCount,
            inactiveEmployees,
            departments,
        });

    } catch (error) {
        console.error("getDashboardStats error", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
}

export const getDepartmentStats = async (req, res) => {
    try {

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

    } catch (error) {
        console.error("getEmployeeFromDept error", error);
        return res.status(400).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        })
    }
}