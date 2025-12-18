import { prisma } from "../utils/client.js";
import argon2 from 'argon2';
import { getMonthRange } from '../utils/getMonthRange.js';
import { getDaysBetween } from '../helpers/getDaysBetween.js'
import { getPayrollCalculator } from "../utils/payRollCalc.js";
import { deductionCalculator } from "../utils/deductionCalculator.js";
import { getWorkingDaysInMonth } from "../utils/getWorkingDaysInMonth.js";
import PDFDocument from "pdfkit";

// employe create
export const createEmployee = async (req, res) => {
    try {
        const {
            name,
            email,
            employeeId,
            department,
            designation,
            monthlySalary
        } = req.body;

        if (!name || !email || !employeeId || !department || !designation || !monthlySalary) {
            return res.status(400).json({
                success: false,
                message: "Please provide all fields"
            });
        }

        const basicSalary = monthlySalary * 0.4;

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
                role: "EMPLOYEE",
                monthlySalary,
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

        const { name, department, designation, monthlySalary } = req.body;

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
                department,
                designation,
                monthlySalary,
                basicSalary,
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

// update attendance admin
export const adminAttendance = async (req, res) => {
    try {
        const { status } = req.body;
        const adminId = req.user.id;

        const allowedStatus = ["PRESENT", "ABSENT", "HALF_DAY", "LEAVE"];
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

        const attendance = await prisma.attendance.findMany({
            where: {
                employeeId: Number(employeeId),
                date: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                }
            },
            select: {
                status: true,
                workingHours: true
            },
        });

        // count holidays
        const holidays = await prisma.holiday.findMany({
            where: {
                date: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                },
            },
        });

        let summary = {
            PRESENT: 0,
            HALF_DAY: 0,
            ABSENT: 0,
            HOLIDAY: holidays.length,
            LEAVE_PAID: 0,
            LEAVE_UNPAID: 0,
            totalWorkingHours: 0,
        };

        attendance.forEach(a => {
            if (summary[a.status] !== undefined) {
                summary[a.status]++;
            }
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

        const isHolidayExisits = await prisma.holiday.findUnique({
            where: { date: new Date(date) }
        });

        if (isHolidayExisits) {
            return res.status(400).json({
                success: false,
                message: "Holiday already exists for this date"
            });
        }


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
};

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
};

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

        // if status got approved then deduct the casual leaves balance
        if (status === "APPROVED" && leave.type === "CASUAL") {
            const year = new Date(leave.fromDate).getFullYear();
            const days = getDaysBetween(leave.fromDate, leave.toDate);

            const balance = await prisma.leaveBalance.findUnique({
                where: {
                    employeeId_year: {
                        employeeId: leave.employeeId,
                        year
                    },
                },
            });

            if (!balance || balance.casualLeft < days) return res.status(400).json({
                success: false,
                message: "Insuffucient casual leaves balance",
            });

            await prisma.leaveBalance.update({
                where: { id: balance.id },
                data: {
                    casualLeft: balance.casualLeft - days,
                },
            });

            const current = new Date(leave.fromDate);
            const end = new Date(leave.toDate);


            // jab tak leave hai, tab tak employee ka status me leave show karna hai
            while (current <= end) {
                await prisma.attendance.upsert({
                    where: {
                        employeeId_date: {
                            employeeId: leave.employeeId,
                            date: new Date(current)
                        }
                    },
                    update: {
                        status: leave.type === "PAID" ? "LEAVE_PAID" : "LEAVE_UNPAID"
                    },
                    create: {
                        employeeId,
                        date,
                        status: leave.type === "PAID" ? "LEAVE_PAID" : "LEAVE_UNPAID"
                    }
                });

                current.setDate(current.getDate() + 1);
            }
        }

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
};

// get pay roll of employee
export const getPayRoll = async (req, res) => {
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
            message: "Employee not found"
        });

        if (!employee.monthlySalary || !employee.basicSalary) {
            return res.status(400).json({
                success: false,
                message: "Salary not configured for employee"
            });
        }

        const { startDate, endDate } = getMonthRange(month);
        if (!startDate || !endDate) return res.status(400).json({
            success: false,
            message: "get monthRange method error",
        });

        const attendance = await prisma.attendance.findMany({
            where: {
                employeeId: Number(employeeId),
                date: {
                    gte: new Date(startDate),
                    lte: new Date(endDate)
                },
            },
        });

        // calculate total working days for current month
        const workingDays = await getWorkingDaysInMonth(month, prisma);
        const payRoll = getPayrollCalculator(attendance, employee.monthlySalary, workingDays);

        return res.status(200).json({
            success: true,
            message: "Pay Roll calculted successfully",
            employee: {
                employeeId: employee.id,
                name: employee.name,
            },
            month,
            payRoll,
        });

    } catch (error) {
        console.error("getPayRoll error", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

// get payslip
export const getPaySlip = async (req, res) => {
    try {
        const { employeeId, month } = req.query;
        if (!employeeId || !month) return res.status(400).json({
            success: false,
            message: "Please provide all fields"
        });

        const employee = await prisma.user.findUnique({
            where: { id: Number(employeeId) }
        });

        if (!employee || employee.role !== "EMPLOYEE") return res.status(400).json({
            success: false,
            message: "Employee not found",
        });

        const payroll = await prisma.payroll.findUnique({
            where: {
                employeeId_month: {
                    employeeId: Number(employeeId),
                    month,
                },
            },
            include: {
                employee: {
                    select: {
                        id: true,
                        name: true,
                        department: true,
                        designation: true
                    },
                },
            },
        });

        if (!payroll) {
            return res.status(404).json({
                success: false,
                message: "Payroll not generated for this month"
            });
        }

        return res.status(200).json({
            success: true,
            payslip: {
                employee: payroll.employee,
                month: payroll.month,
                totalWorkingDays: payroll.totalWorkingDays,
                payableDays: payroll.payableDays,
                earnings: {
                    gross: payroll.grossSalary
                },
                deductions: {
                    pf: payroll.pf,
                    tax: payroll.tax
                },
                netSalary: payroll.netSalary,
                generatedAt: payroll.createdAt,
            },
        });

    } catch (error) {
        console.error("getPaySlip error", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

// generate payroll
export const generatePayroll = async (req, res) => {
    try {
        const { employeeId, month } = req.body;
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

        if (!employee.monthlySalary || !employee.basicSalary) return res.status(400).json({
            success: false,
            message: "Employee salary is not configured",
        });

        const isPayrollExists = await prisma.payroll.findUnique({
            where: {
                employeeId_month: {
                    employeeId: employee.id,
                    month,
                },
            },
        });

        if (isPayrollExists) return res.status(400).json({
            success: false,
            message: "Payroll already generated for this month"
        })

        const { startDate, endDate } = getMonthRange(month);
        if (!startDate || !endDate) return res.status(400).json({
            success: false,
            message: "get monthRange method error",
        });

        const attendance = await prisma.attendance.findMany({
            where: {
                employeeId,
                date: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                },
            },
        });

        const totalWorkingDays = await getWorkingDaysInMonth(month, prisma);
        const payrollCalc = getPayrollCalculator(attendance, employee.monthlySalary, totalWorkingDays);
        const { pf, tax, netSalary } = deductionCalculator(payrollCalc.grossSalary, employee.basicSalary);

        const payroll = await prisma.payroll.create({
            data: {
                employeeId: employee.id,
                month,
                grossSalary: payrollCalc.grossSalary,
                pf,
                tax,
                netSalary,
                totalWorkingDays,
                payableDays: payrollCalc.payableDays,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Payroll generated successfully",
            payroll
        });

    } catch (error) {
        console.error("generatePayroll  error", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

// generate payslip pdf
export const generatePayslipPDF = async (req, res) => {
    try {
        const { employeeId, month } = req.query;

        const payroll = await prisma.payroll.findUnique({
            where: {
                employeeId_month: {
                    employeeId: Number(employeeId),
                    month,
                },
            },
            include: {
                employee: true,
            },
        });

        if (!payroll) return res.status(404).json({
            success: false,
            message: "Payroll not found",
        });

        const doc = new PDFDocument();
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=payslip-${month}.pdf`
        );

        doc.pipe(res);

        // payslip data
        doc.fontSize(18).text("PAYSLIP", { align: "center" });
        doc.moveDown();

        doc.fontSize(12).text(`Employee Name: ${payroll.employee.name}`);
        doc.text(`Month: ${payroll.month}`);
        doc.text(`Department: ${payroll.employee.department || "-"}`);
        doc.text(`Designation: ${payroll.employee.designation || "-"}`);

        doc.moveDown();
        doc.text(`Total Working Days: ${payroll.totalWorkingDays}`);
        doc.text(`Payable Days: ${payroll.payableDays}`);

        doc.moveDown();
        doc.text(`Gross Salary: ₹${payroll.grossSalary}`);
        doc.text(`PF Deduction: ₹${payroll.pf}`);
        doc.text(`Tax Deduction: ₹${payroll.tax}`);

        doc.moveDown();
        doc.fontSize(14).text(`Net Salary: ₹${payroll.netSalary}`, {
            underline: true,
        });

        doc.end();

    } catch (error) {
        console.error("generatePayslipPDF error", error);
        res.status(500).json({
            success: false,
            message: "PDF generation failed",
            error: error.message,
        });
    }
};

// regenerate pay slip by admin only
export const regeneratePayroll = async (req, res) => {
    try {
        const { employeeId, month } = req.body;
        if (!employeeId || !month) return res.status(400).json({
            success: false,
            message: "Please provide all fields",
        });

        const deleted = await prisma.payroll.deleteMany({
            where: {
                employeeId_month: {
                    employeeId: Number(employeeId),
                    month,
                },
            },
        });

        if (deleted.count === 0) return res.status(400).json({
            success: false,
            message: "No existing payroll found",
        });

        return generatePayroll(req, res);

    } catch (error) {
        console.error("regeneratePayroll error", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
}
