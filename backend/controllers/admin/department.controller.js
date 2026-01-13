import { prisma } from '../../utils/client.js';

// create department
export const createDepartment = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) return res.status(400).json({
            success: false,
            message: "Department name is required",
        });

        const isDepartmentExists = await prisma.department.findUnique({
            where: { name },
        });

        if (isDepartmentExists) return res.status(400).json({
            success: false,
            message: "Department already exists",
        });

        const department = await prisma.department.create({
            data: {
                name,
                description,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Department created successfully",
            department
        });

    } catch (error) {
        console.error("createDepartment error", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
}

// get all departments
export const getDepartments = async (req, res) => {
    try {
        const departments = await prisma.department.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                createdAt: true,
                isActive: true,
                users: {
                    select: {
                        id: true,
                        isActive: true,
                    },
                },
            },
        });

        if (departments.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No Departments found",
            });
        }

        const totalDepartments = departments.length;
        const activeDepartments = departments.filter(dept => dept.isActive).length;
        const inactiveDepartments = departments.filter(dept => !dept.isActive).length;

        const formattedDepartments = departments.map((dept) => {
            const totalEmployees = dept.users.length;
            const activeEmployees = dept.users.filter(u => u.isActive).length;
            const inactiveEmployees = dept.users.filter(u => !u.isActive).length;

            return {
                id: dept.id,
                name: dept.name,
                createdAt: dept.createdAt,
                isActive: dept.isActive,
                description: dept.description,
                totalEmployees,
                activeEmployees,
                inactiveEmployees,
            };
        });

        return res.status(200).json({
            success: true,
            message: "Departments fetched successfully",
            summary: {
                totalDepartments,
                activeDepartments,
                inactiveDepartments,
            },
            departments: formattedDepartments,
        });

    } catch (error) {
        console.error("getDepartments error", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
}

// get department by id
export const getDepartmentById = async (req, res) => {
    try {
        const departmentId = req.params.id;
        if (!departmentId) {
            return res.status(400).json({
                success: false,
                message: "Department id not provided",
            });
        }

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const department = await prisma.department.findUnique({
            where: { id: Number(departmentId) },
            include: {
                users: {
                    select: {
                        id: true,
                        name: true,
                        designation: true,
                        email: true,
                        phoneNumber: true,
                        isActive: true,
                        createdAt: true,
                        monthlySalary: true,
                        attendances: {
                            where: {
                                date: {
                                    gte: startOfDay,
                                    lte: endOfDay,
                                },
                            },
                            select: { status: true },
                        },
                    },
                },
            },
        });

        if (!department || !department.isActive) {
            return res.status(404).json({
                success: false,
                message: "Department not found",
            });
        }

        const totalEmployees = department.users.length;
        const activeEmployees = department.users.filter(u => u.isActive).length;
        const inactiveEmployees = department.users.filter(u => !u.isActive).length;

        let present = 0;
        let absent = 0;
        let onLeave = 0;

        department.users.forEach(user => {
            const status = user.attendances[0]?.status;

            if (status === "PRESENT" || status === "HALF_DAY") present++;
            else if (status === "ABSENT") absent++;
            else if (status === "LEAVE_PAID" || status === "LEAVE_UNPAID") onLeave++;
        });

        return res.status(200).json({
            success: true,
            department: {
                id: department.id,
                name: department.name,
                createdAt: department.createdAt,
                totalEmployees,
                activeEmployees,
                inactiveEmployees,
                attendance: {
                    present,
                    absent,
                    onLeave,
                },
                employees: department.users.map(emp => ({
                    id: emp.id,
                    name: emp.name,
                    designation: emp.designation,
                    email: emp.email,
                    phone: emp.phoneNumber,
                    salary: emp.monthlySalary,
                    isActive: emp.isActive,
                    joinedOn: emp.createdAt,
                })),
            },
        });

    } catch (error) {
        console.error("getDepartmentById error", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

// update department
export const updateDepartment = async (req, res) => {
    try {
        const departmentId = req.params.id;
        const { name, description } = req.body;

        if (!departmentId) return res.status(400).json({
            success: false,
            message: "Id is not present",
        });

        const isDepartmentExists = await prisma.department.findUnique({
            where: { id: Number(departmentId) },
        });

        if (!isDepartmentExists) return res.status(400).json({
            success: false,
            message: "Department not found",
        });

        const updatedDepartment = await prisma.department.update({
            where: { id: Number(departmentId) },
            data: {
                name,
                description,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Department updated successfully",
            updatedDepartment,
        });


    } catch (error) {
        console.error("updateDepartment error", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
}

// delete department
export const deactivateDepartment = async (req, res) => {
    try {
        const departmentId = req.params.id;
        if (!departmentId) return res.status(400).json({
            success: false,
            message: "Please provide department id",
        });

        const isDepartmentExists = await prisma.department.findUnique({
            where: { id: Number(departmentId) },
        });

        if (!isDepartmentExists) return res.status(400).json({
            success: false,
            message: "Department not found",
        });

        const employeeCount = await prisma.user.count({
            where: {
                departmentId: Number(departmentId),
            },
        });

        if (employeeCount > 0) return res.status(400).json({
            success: false,
            message: "Department has employees. Please check"
        })

        await prisma.department.update({
            where: { id: Number(departmentId) },
            data: { isActive: false },
        });

        return res.status(200).json({
            success: true,
            message: "Department deactivated successfully",
        });

    } catch (error) {
        console.error("deactivateDepartment error", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
}

// department attendance report 
export const departmentAttendanceReport = async (req, res) => {
    try {
        const departmentId = req.params.id;
        const { from, to } = req.query;

        if (!departmentId || !from || !to) {
            return res.status(400).json({
                success: false,
                message: "departmentId, from and to dates are required",
            });
        }

        const department = await prisma.department.findUnique({
            where: { id: Number(departmentId) },
        });

        if (!department || !department.isActive) {
            return res.status(404).json({
                success: false,
                message: "Department not found",
            });
        }

        // Fetch users with attendance
        const users = await prisma.user.findMany({
            where: {
                departmentId: Number(departmentId),
                isActive: true,
            },
            include: {
                attendances: {
                    where: {
                        date: {
                            gte: new Date(from),
                            lte: new Date(to),
                        },
                    },
                    orderBy: { date: "asc" },
                },
            },
        });

        return res.status(200).json({
            success: true,
            department: department.name,
            from,
            to,
            totalEmployees: users.length,
            data: users,
        });
    } catch (error) {
        console.error("departmentAttendanceReport error", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

// department attendance summary
export const departmentAttendanceSummary = async (req, res) => {
    try {
        const departmentId = req.params.id;
        const { from, to } = req.query;

        if (!departmentId || !from || !to) {
            return res.status(400).json({
                success: false,
                message: "departmentId, from and to are required",
            });
        }

        const summary = await prisma.attendance.groupBy({
            by: ["status"],
            where: {
                employee: {
                    departmentId: Number(departmentId),
                },
                date: {
                    gte: new Date(from),
                    lte: new Date(to),
                },
            },
            _count: {
                status: true,
            },
        });

        return res.status(200).json({
            success: true,
            departmentId,
            from,
            to,
            summary,
        });
    } catch (error) {
        console.error("departmentAttendanceSummary error", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

// department wise attendance summary
export const departmentWiseTodayAttendance = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const departments = await prisma.department.findMany({
            where: { isActive: true },
            select: {
                id: true,
                name: true,
                users: {
                    where: {
                        isActive: true,
                        role: "EMPLOYEE",
                    },
                    select: {
                        id: true,
                        attendances: {
                            where: {
                                date: {
                                    gte: startOfDay,
                                    lte: endOfDay,
                                },
                            },
                            select: {
                                status: true,
                            },
                        },
                    },
                },
            },
        });

        const result = departments.map(dept => {
            let present = 0;

            dept.users.forEach(user => {
                const status = user.attendances[0]?.status;
                if (status === "PRESENT" || status === "HALF_DAY") {
                    present++;
                }
            });

            return {
                department: dept.name,
                total: dept.users.length,
                present,
            };
        });

        return res.status(200).json({
            success: true,
            data: result,
        });

    } catch (error) {
        console.error("departmentWiseTodayAttendance error", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
