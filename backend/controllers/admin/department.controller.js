import asyncHandler from '../../utils/asyncHandler.js';
import AppError from '../../utils/AppError.js';
import { prisma } from '../../utils/client.js';

// create department
export const createDepartment = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    if (!name) throw new AppError("Department name is required", 400);

    const isDepartmentExists = await prisma.department.findUnique({
        where: { name },
    });

    if (isDepartmentExists) throw new AppError("Department already exists", 400);

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
});

// get all departments
export const getDepartments = asyncHandler(async (req, res) => {
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

    if (departments.length === 0) throw new AppError("No Departments found", 404);

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
});

// get department by id
export const getDepartmentById = asyncHandler(async (req, res) => {
    const departmentId = req.params.id;
    if (!departmentId) throw new AppError("Department id not provided", 400);

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

    if (!department || !department.isActive) throw new AppError("Department not found", 404);

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
});

// update department
export const updateDepartment = asyncHandler(async (req, res) => {
    const departmentId = req.params.id;
    const { name, description } = req.body;

    if (!departmentId) throw new AppError("Id is not present", 400);

    const isDepartmentExists = await prisma.department.findUnique({
        where: { id: Number(departmentId) },
    });

    if (!isDepartmentExists) throw new AppError("Department not found", 400);

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
});

// delete department
export const deactivateDepartment = asyncHandler(async (req, res) => {
    const departmentId = req.params.id;
    if (!departmentId) throw new AppError("Please provide department id", 400);

    const isDepartmentExists = await prisma.department.findUnique({
        where: { id: Number(departmentId) },
    });

    if (!isDepartmentExists) throw new AppError("Department not found", 400);

    const employeeCount = await prisma.user.count({
        where: {
            departmentId: Number(departmentId),
        },
    });

    if (employeeCount > 0) throw new AppError("Department has employees. Please check", 400);

    await prisma.department.update({
        where: { id: Number(departmentId) },
        data: { isActive: false },
    });

    return res.status(200).json({
        success: true,
        message: "Department deactivated successfully",
    });
});

// department attendance summary
export const getMonthlyDepartmentAttendanceSummary = asyncHandler(async (req, res) => {
    const departmentId = req.params.id;
    const { from, to } = req.query;

    if (!departmentId || !from || !to) throw new AppError("departmentId, from and to are required", 400);

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
});

// department wise today attendance
export const departmentWiseTodayAttendance = asyncHandler(async (req, res) => {
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
});