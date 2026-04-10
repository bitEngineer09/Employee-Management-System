import { prisma } from "../../utils/client.js";
import { getPayrollCalculator } from "../../utils/payRollCalc.js";
import { deductionCalculator } from "../../utils/deductionCalculator.js";
import { getWorkingDaysInMonth } from "../../utils/getWorkingDaysInMonth.js";
import { getMonthRange } from "../../utils/getMonthRange.js";
import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/AppError.js";

// get pay roll of employee
export const getPayRoll = asyncHandler(async (req, res) => {
    const { employeeId, month } = req.query;
    if (!employeeId || !month) throw new AppError("Please provide all fields", 400)

    const employee = await prisma.user.findUnique({
        where: { id: Number(employeeId) }
    });

    if (!employee || employee.role !== "EMPLOYEE") throw new AppError("Employee not found", 400);

    if (!employee.monthlySalary || !employee.basicSalary) throw new AppError("Salary not configured for employee", 400);

    const { startDate, endDate } = getMonthRange(month);
    if (!startDate || !endDate) throw new AppError("get monthRange method error", 400);

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
});

// generate payroll
export const generatePayroll = asyncHandler(async (req, res) => {
    const { employeeId, month } = req.body;
    if (!employeeId || !month) throw new AppError("Please provide all fields", 400);

    const employee = await prisma.user.findUnique({
        where: { id: Number(employeeId) }
    });

    if (!employee || employee.role !== "EMPLOYEE") throw new AppError("Employee not found", 400);

    if (!employee.monthlySalary || !employee.basicSalary) throw new AppError("Employee salary is not configured", 400)

    const isPayrollExists = await prisma.payroll.findUnique({
        where: {
            employeeId_month: {
                employeeId: employee.id,
                month,
            },
        },
    });

    if (isPayrollExists) throw new AppError("Payroll already generated for this month", 400);

    const { startDate, endDate } = getMonthRange(month);
    if (!startDate || !endDate) throw new AppError("get monthRange method error", 400);

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
})

// regenerate pay slip by admin only
export const regeneratePayroll = asyncHandler(async (req, res) => {
    const { employeeId, month } = req.body;

    if (!employeeId || !month) throw new AppError("Please provide all fields", 400);

    await prisma.payroll.delete({
        where: {
            employeeId_month: {
                employeeId: Number(employeeId),
                month,
            },
        },
    });

    return generatePayroll(req, res);
});

