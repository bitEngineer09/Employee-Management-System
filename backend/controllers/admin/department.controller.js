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
            where: { isActive: true },
            select: {
                id: true,
                name: true,
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

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const department = await prisma.department.findUnique({
            where: { id: Number(departmentId) },
            include: {
                users: {
                    where: { isActive: true },
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
                                date: today,
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
        let present = 0;
        let absent = 0;
        let onLeave = 0;

        department.users.forEach(user => {
            const status = user.attendances[0]?.status;

            if (status === "PRESENT" || status === "HALF_DAY") present++;
            else if (status === "ABSENT") absent++;
            else if (status === "LEAVE_PAID" || status === "LEAVE_UNPAID") onLeave++;
            else absent++;
        });

        return res.status(200).json({
            success: true,
            department: {
                id: department.id,
                name: department.name,
                createdAt: department.createdAt,
                totalEmployees,
                activeEmployees: totalEmployees,
                inactiveEmployees: 0,
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
                    salary: emp.salary,
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
        const today = new Date();
        today.setHours(0, 0, 0,);

        const employees = await prisma.user.findMany({
            where: {
                role: "EMPLOYEE",
                isActive: true,
                department: {
                    isActive: true,
                },
            },
            select: {
                id: true,
                department: {
                    select: { name: true },
                },
                attendances: {
                    where: {
                        date: today,
                    },
                    select: {
                        status: true
                    },
                },
            },
        });

        const result = {};
        employees.forEach(emp => {
            const departmentName = emp?.department?.name;
            if (!result[departmentName]) {
                result[departmentName] = {
                    department: departmentName,
                    total: 0,
                    present: 0,
                };
            }

            result[departmentName].total += 1;
            const status = emp.attendances[0]?.status;

            if (status === "PRESENT" || status === "HALF_DAY") {
                result[departmentName].present += 1;
            }
        });

        return res.status(200).json({
            success: true,
            data: Object.values(result),
        });

    } catch (error) {
        console.error("departmentWiseTodayAttendance error", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
}