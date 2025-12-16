import { prisma } from "../utils/client.js";

// auto absent
export const markAutoAbsent = async () => {
    try {
        const today = new Date().toISOString().split("T")[0];
        const employees = await prisma.user.findMany({
            where: {
                role: "EMPLOYEE",
                isActive: true,
            },
        });
        for (const emp of employees) {
            const attendance = await prisma.attendance.findUnique({
                where: {
                    employeeId_date: {
                        employeeId: emp.id,
                        date: new Date(today),
                    },
                },
            });

            if (!attendance) {
                const absent = await prisma.attendance.create({
                    data: {
                        employeeId: emp.id,
                        date: new Date(today),
                        status: "ABSENT"
                    },
                });

                await prisma.attendanceLog.create({
                    data: {
                        attendanceId: absent.id,
                        action: "AUTO_ABSENT",
                        newStatus: "ABSENT",
                    },
                })
            }

        }
    } catch (error) {
        console.error("markAutoAbsent error", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
}