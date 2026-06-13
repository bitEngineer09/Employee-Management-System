import { prisma } from '../../utils/client.js';
import argon2 from 'argon2';
import { generateEmployeeId } from '../../utils/employeeIdGenerator.js';
import AppError from '../../utils/AppError.js';
import asyncHandler from '../../utils/asyncHandler.js';

// employe create
export const createEmployee = asyncHandler(async (req, res) => {
    const {
        name,
        email,
        departmentId,
        designation,
        gender,
        dob,
        phoneNumber,
        monthlySalary
    } = req.body;

    if (
        !name
        || !email
        || !departmentId
        || !designation
        || !monthlySalary
        || !gender
        || !dob
        || !phoneNumber
    ) throw new AppError("Please provide all fields", 400);


    const empId = await generateEmployeeId();
    const basicSalary = Number(monthlySalary) * 0.4;

    const isUserExisits = await prisma.user.findUnique({
        where: { email }
    });

    if (isUserExisits) throw new AppError("User already exists. Try with different email id", 400);

    const tempPassword = "Welcome@123";
    const hashedPasword = await argon2.hash(tempPassword);

    if (!hashedPasword) throw new AppError("Password hashing error", 400);

    const newEmployee = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPasword,
            employeeId: empId,
            department: {
                connect: { id: Number(departmentId) }
            },
            role: "EMPLOYEE",
            designation,
            gender,
            dob: new Date(dob),
            phoneNumber,
            monthlySalary: Number(monthlySalary),
            basicSalary
        }
    });

    // adding by default 12 casual leaves
    const currentYear = new Date().getFullYear();
    await prisma.leaveBalance.create({
        data: {
            employeeId: newEmployee.id,
            year: currentYear,
            casualLeft: 12,
        },
    });

    return res.status(201).json({
        success: true,
        message: "Employee created successfully",
        empData: {
            name: newEmployee.name,
            email: newEmployee.email,
            employeeId: newEmployee.employeeId,
            department: newEmployee.department,
            designation: newEmployee.designation,
            role: newEmployee.role,
        }
    });
})

// get all emp data
export const getAllEmployees = asyncHandler(async (req, res) => {
    const employees = await prisma.user.findMany({
        where: { role: "EMPLOYEE" },
        select: {
            id: true,
            name: true,
            email: true,
            employeeId: true,
            department: {
                select: {
                    id: true,
                    name: true
                }
            },
            monthlySalary: true,
            phoneNumber: true,
            gender: true,
            dob: true,
            designation: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
        }
    });

    return res.status(200).json({
        success: true,
        message: "fetched data of all employees successfully",
        data: employees
    });
});

// get emp data by id
export const getEmployeeById = asyncHandler(async (req, res) => {
    const empId = req.params.id;
    // console.log(empId);

    if (!empId) throw new AppError("Employee id not provided", 400);

    const employee = await prisma.user.findFirst({
        where: { id: Number(empId), role: "EMPLOYEE" },
        select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            employeeId: true,
            department: {
                select: {
                    id: true,
                    name: true
                },
            },
            designation: true,
            monthlySalary: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
        }
    });

    if (!employee) throw new AppError("Employee not found", 400);

    return res.status(200).json({
        success: true,
        message: "fetched employee data successfully",
        data: employee,
    });
});

// update emp data
export const updateEmployee = asyncHandler(async (req, res) => {
    const empId = req.params.id;
    // console.log(empId)

    if (!empId) throw new AppError("Employee id not provided", 400);

    const { name, departmentId, designation, monthlySalary } = req.body;

    let basicSalary;
    if (monthlySalary) {
        basicSalary = monthlySalary * 0.4;
    }

    const employee = await prisma.user.findUnique({
        where: { id: Number(empId) }
    });

    if (!employee || employee.role !== "EMPLOYEE") throw new AppError("Employee not found", 400);

    const updatedEmployee = await prisma.user.update({
        where: { id: Number(empId) },
        data: {
            name,
            designation,
            monthlySalary,
            basicSalary,
            department: departmentId
                ? { connect: { id: Number(departmentId) } }
                : undefined
        },
    });

    return res.status(200).json({
        success: true,
        message: "Employee updated successfully",
        updatedData: updatedEmployee,
    })
});

// update emp status
export const updateEmployeeStatus = asyncHandler(async (req, res) => {
    const empId = req.params.id;
    const { status } = req.body;

    if (!empId) throw new AppError("Employee id not provided", 400);

    if (!["ACTIVE", "INACTIVE"].includes(status)) throw new AppError("Invalid status", 400);

    const employee = await prisma.user.findUnique({
        where: { id: Number(empId) }
    });

    if (!employee || employee.role !== "EMPLOYEE") throw new AppError("Employee not found", 400);

    const isActive = status === "ACTIVE";

    const updatedStatus = await prisma.user.update({
        where: { id: Number(empId) },
        data: { isActive }
    });

    return res.status(200).json({
        success: true,
        message: `Employee ${status.toLowerCase()} successfully`,
        data: {
            id: updatedStatus.id,
            isActive: updatedStatus.isActive
        }
    });
});

// delete employee
export const deactivateEmployee = asyncHandler(async (req, res) => {
    const empId = Number(req.params.id);
    if (!empId) throw new AppError("employee id not found", 400);

    const employee = await prisma.user.findUnique({
        where: {
            id: empId,
        },
    });

    if (!employee) throw new AppError("No employee found", 400);

    if (!employee.isActive) throw new AppError("Employee is already deactivated", 400);

    await prisma.user.update({
        where: { id: empId },
        data: { isActive: false },
    });

    return res.status(200).json({
        success: true,
        message: "Employee deactivated successfully",
    });
});

// permanent delete employee
export const permanentDeleteEmployee = asyncHandler(async (req, res) => {
    const empId = Number(req.params.id);

    if (!empId) throw new AppError("Employee id not provided", 400);

    const employee = await prisma.user.findUnique({
        where: { id: empId },
    });

    if (!employee) throw new AppError("Employee not found", 400);

    await prisma.user.delete({
        where: { id: empId },
    });

    return res.status(200).json({
        success: true,
        message: "Employee permanently deleted",
    });
});

// seach employes
export const searchEmployees = asyncHandler(async (req, res) => {
    const { query } = req.query;

    if (!query || query.trim() === "") throw new AppError("Search query is required", 400);

    const employees = await prisma.user.findMany({
        where: {
            role: "EMPLOYEE",
            OR: [
                {
                    name: {
                        contains: query
                    }
                },
                {
                    email: {
                        contains: query
                    }
                },
                {
                    employeeId: {
                        contains: query
                    }
                },
                {
                    designation: {
                        contains: query
                    }
                },
                {
                    department: {
                        name: {
                            contains: query
                        }
                    }
                }
            ]
        },
        include: {
            department: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return res.status(200).json({
        success: true,
        data: employees
    });
});
