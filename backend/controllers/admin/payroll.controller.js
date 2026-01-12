import { prisma } from "../../utils/client.js";
import { getPayrollCalculator } from "../../utils/payRollCalc.js";
import { deductionCalculator } from "../../utils/deductionCalculator.js";
import { getWorkingDaysInMonth } from "../../utils/getWorkingDaysInMonth.js";
import { getMonthRange } from "../../utils/getMonthRange.js";

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
        };

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
                employeeId: Number(employeeId),
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

// regenerate pay slip by admin only
export const regeneratePayroll = async (req, res) => {
    try {
        const { employeeId, month } = req.body;

        if (!employeeId || !month) {
            return res.status(400).json({
                success: false,
                message: "Please provide all fields",
            });
        }

        await prisma.payroll.delete({
            where: {
                employeeId_month: {
                    employeeId: Number(employeeId),
                    month,
                },
            },
        });

        return generatePayroll(req, res);

    } catch (error) {
        console.error("regeneratePayroll error", error.message);

        // Prisma error when record not found
        if (error.code === "P2025") {
            return res.status(400).json({
                success: false,
                message: "No existing payroll found to regenerate",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

