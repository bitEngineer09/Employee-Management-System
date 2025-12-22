import { prisma } from '../../utils/client.js';
import argon2 from 'argon2';
import { generateEmployeeId } from '../../utils/employeeIdGenerator.js';

// employe create
export const createEmployee = async (req, res) => {
    try {
        const {
            name,
            email,
            departmentId,
            designation,
            monthlySalary
        } = req.body;

        if (!name || !email || !departmentId || !designation || !monthlySalary) {
            return res.status(400).json({
                success: false,
                message: "Please provide all fields"
            });
        }
        const empId = await generateEmployeeId();
        const basicSalary = Number(monthlySalary) * 0.4;

        const isUserExisits = await prisma.user.findUnique({
            where: { email }
        });

        if (isUserExisits) return res.status(400).json({
            success: false,
            message: "User already exists. Try with different email id"
        });

        const tempPassword = "Welcome@123";
        const hashedPasword = await argon2.hash(tempPassword);

        if (!hashedPasword) return res.status(400).json({
            success: false,
            message: "Password hashing error",
        });

        const newEmployee = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPasword,
                employeeId: empId,
                department: {
                    connect: { id: Number(departmentId) }
                },
                designation,
                role: "EMPLOYEE",
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

    } catch (error) {
        console.error("Employee create controller", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
};

// get all emp data
export const getAllEmployees = async (req, res) => {
    try {
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

    } catch (error) {
        console.error("getAllEmployees error", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        })
    }
};

// get emp data by id
export const getEmployeeById = async (req, res) => {
    try {

        const empId = req.params.id;
        if (!empId) return res.status(400).json({
            success: false,
            message: "employee id not provided",
        });

        const employee = await prisma.user.findFirst({
            where: { id: Number(empId), role: "EMPLOYEE" },
            select: {
                name: true,
                email: true,
                employeeId: true,
                department: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                designation: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "fetched employee data successfully",
            data: employee,
        });

    } catch (error) {
        console.error("getAllEmployeeById error", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        })
    }
};

// update emp data
export const updateEmployee = async (req, res) => {
    try {
        const empId = req.params.id;

        if (!empId) return res.status(400).json({
            success: false,
            message: "Employee id not provided",
        });

        const { name, departmentId, designation, monthlySalary } = req.body;

        let basicSalary;
        if (monthlySalary) {
            basicSalary = monthlySalary * 0.4;
        }

        const employee = await prisma.user.findUnique({
            where: { id: Number(empId) }
        });

        if (!employee || employee.role !== "EMPLOYEE") return res.status(400).json({
            success: false,
            message: "Employee not found",
        });

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

    } catch (error) {
        console.error("updateEmployee error", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        })
    }
};

// update emp status
export const updateEmployeeStatus = async (req, res) => {
    try {
        const empId = req.params.id;
        const { status } = req.body;

        if (!empId) return res.status(400).json({
            success: false,
            message: "Employee id not provided"
        });

        if (!["ACTIVE", "INACTIVE"].includes(status)) return res.status(400).json({
            success: false,
            message: "Invalid status",
        });

        const employee = await prisma.user.findUnique({
            where: { id: Number(empId) }
        });

        if (!employee || employee.role !== "EMPLOYEE") {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

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

    } catch (error) {
        console.error("updateEmployeeStatus error", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};