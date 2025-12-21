import { prisma } from "../../utils/client.js";

export const getDashboardStats = async (req, res) => {
    try {
        const totalEmployees = await prisma.user.count({
            where: { role: "EMPLOYEE" },
        });

        const activeEmployees = await prisma.user.count({
            where: { 
                role: "EMPLOYEE",
                isActive: true
            },
        });

        const absentEmployees = totalEmployees - activeEmployees;

        const departments = await prisma.department.count();

        return res.status(200).json({
            success: true,
            message: "admin dashboard stats fetched successfully",
            totalEmployees,
            activeEmployees,
            absentEmployees,
            departments,
        });

    } catch (error) {
        console.error("getDashboardStats error", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}