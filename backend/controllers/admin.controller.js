import { prisma } from "../utils/client.js";
import argon2 from 'argon2';
import { getMonthRange } from '../utils/monthRange.js';

// employe create
export const createEmployee = async (req, res) => {
    try {
        const {
            name,
            email,
            employeeId,
            department,
            designation
        } = req.body;

        if (!name || !email || !employeeId || !department || !designation) {
            return res.status(400).json({
                success: false,
                message: "Please provide all fields"
            });
        }

        const isUserExisits = await prisma.user.findUnique({
            where: { email }
        });

        if (isUserExisits) return res.status(400).json({
            success: false,
            message: "User already exists. Try with different email id"
        });

        const isSameEmpIdExists = await prisma.user.findFirst({
            where: { employeeId }
        });

        if (isSameEmpIdExists) return res.status(400).json({
            success: false,
            message: "User already exists with this employee id"
        });

        const tempPassword = "Welcome@User"
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
                employeeId,
                department,
                designation,
                role: "EMPLOYEE"
            }
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
                department: true,
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
export const getAllEmployeeById = async (req, res) => {
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
                department: true,
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

        const { name, department, designation } = req.body;

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
                department,
                designation
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

// update attendance admin
export const adminAttendance = async (req, res) => {
    try {
        const { status } = req.body;
        const adminId = req.user.id;

        const allowedStatus = ["PRESENT", "ABSENT", "HALF_DAY"];
        if (!allowedStatus.includes(status)) return res.status(400).json({
            success: false,
            message: "Invalid Status",
        });

        const attendance = await prisma.attendance.findUnique({
            where: { id: Number(req.params.id) },
        });

        if (!attendance) {
            return res.status(404).json({ message: "Attendance not found" });
        }

        const updated = await prisma.attendance.update({
            where: { id: attendance.id },
            data: { status },
        });

        await prisma.attendanceLog.create({
            data: {
                attendanceId: attendance.id,
                action: "UPDATE",
                oldStatus: attendance.status,
                newStatus: status,
                changedBy: adminId,
            },
        });

        res.json({ message: "Attendance updated", updated });
    } catch (error) {
        console.error("adminAttendance error", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

// get employee attendance report 
export const getEmpAttendance = async (req, res) => {
    try {
        const { employeeId, from, to } = req.query;
        if (!employeeId || !from || !to) return res.status(400).json({
            success: false,
            message: "Please provide all fields"
        });

        const employee = await prisma.user.findUnique({
            where: { id: Number(employeeId) },
        });

        if (!employee || employee.role !== "EMPLOYEE") return res.status(400).json({
            success: false,
            message: "Employee not found",
        });

        const attendanceReport = await prisma.attendance.findMany({
            where: {
                employeeId: Number(employeeId),
                date: {
                    gte: new Date(from),
                    lte: new Date(to),
                },
            },
            include: {
                attendanceLogs: true,
            },
            orderBy: { date: "asc" },
        });

        return res.status(200).json({
            success: true,
            employee: {
                id: employee.id,
                name: employee.name,
                employeeId: employee.employeeId,
            },
            data: attendanceReport,
        });

    } catch (error) {
        console.error("getEmpAttendance error", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

// get monthly attendance summary 
export const getMonthlyAttendanceSummary = async (req, res) => {
    try {
        const { employeeId, month } = req.query;
        if (!employeeId || !month) return res.status(400).json({
            success: false,
            message: "Please provide all fields",
        });

        const employee = await prisma.user.findUnique({
            where: { id: Number(employeeId) }
        });

        if (!employee || employee.role !== "EMPLOYEE") return res.status(400).json({
            success: false,
            message: "Employee not found",
        });

        const { startDate, endDate } = getMonthRange(month);
        if (!startDate || !endDate) return res.status(400).json({
            success: false,
            message: "get montRange method error",
        });

        const attendance = await prisma.findMany({
            where: {
                employeeId_date: {
                    employeeId: Number(employeeId),
                    date: {
                        gte: startDate,
                        lte: endDate,
                    }
                }
            },
            select: {
                status: true,
                workingHours: true
            },
        });

        let summary = {
            PRESENT: 0,
            HALF_DAY: 0,
            ABSENT: 0,
            totalWorkingHours: 0,
        };

        attendance.forEach(a => {
            summary[a.status]++;
            summary.totalWorkingHours += a.workingHours || 0;
        });

        summary.totalWorkingHours = Number(summary.totalWorkingHours.toFixed(2));

        return res.status(200).json({
            success: true,
            employee: {
                id: employee.id,
                name: employee.name,
                employeeId: employee.employeeId
            },
            month,
            summary
        });

    } catch (error) {
        console.error("getMonthlyAttendanceSummary error", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

// create holiyday leave
export const createHoliday = async (req, res) => {
    try {
        const { date, name } = req.body;
        if (!date || !name) return res.status(400).json({
            success: false,
            message: "Please provide all fields",
        });

        const holiday = await prisma.holiday.create({
            data: {
                date: new Date(date),
                name
            }
        });

        return res.status(200).json({
            success: true,
            message: "Holiday created successfully",
            holiday
        });

    } catch (error) {
        console.error("createHoliday error", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

// delete holiday
export const deleteHoliday = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({
            success: false,
            message: "Please provide holiday id",
        });

        const deleted = await prisma.holiday.delete({
            where: { id: Number(id) }
        });

        return res.status(200).json({
            success: true,
            message: "Holiday deleted successfully",
            deleted
        })
    } catch (error) {
        console.error("deleteHoliday error", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
}

// get holidays
export const getHolidays = async (req, res) => {
    try {
        const holidays = await prisma.holiday.findMany({
            orderBy: {
                date: "asc"
            }
        });

        return res.status(200).json({
            success: true,
            message: "Holidays fetched successfully",
            holidays
        });

    } catch (error) {
        console.error("createHoliday error", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
}

// get all leaves (admin ko saari leaves dikhani hai)
export const getAllLeaves = async (req, res) => {
    try {
        const leaves = await prisma.leave.findMany({
            include: {
                employee: {
                    select: {
                        name: true, employeeId: true
                    }
                },
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return res.status(200).json({
            success: true,
            message: "All leaves fetched successfully",
            leaves
        });

    } catch (error) {
        console.error("getAllLeaves error", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
}

// approve/reject leaves
export const approveRejectLeave = async (req, res) => {
    try {
        const adminId = req.user.id;
        const { status } = req.body;

        if (!["APPROVED", "REJECTED"].includes(status)) return res.status(400).json({
            success: false,
            message: "Invalid status",
        });

        const leave = await prisma.leave.update({
            where: {
                id: Number(req.params.id),
            },
            data: {
                status,
                approvedBy: adminId
            },
        });

        return res.status(200).json({
            success: true,
            leave,
        });

    } catch (error) {
        console.error("approveRejectLeave error", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
}