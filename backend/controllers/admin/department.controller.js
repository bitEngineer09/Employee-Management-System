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
            include: {
                _count: {
                    select: { users: true },
                },
            },
        });

        if (departments.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No Departments found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "departments fetched successfully",
            departments,
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
        if (!departmentId) return res.status(400).json({
            success: false,
            message: "Department id not provided",
        });

        const department = await prisma.department.findUnique({
            where: { id: Number(departmentId) },
            include: { users: true },
        });

        if (!department || !department.isActive) {
            return res.status(404).json({ success: false, message: "Department not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Department fetched successfully",
            department,
        });

    } catch (error) {
        console.error("getDepartmentById error", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
}

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
