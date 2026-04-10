import PDFDocument from "pdfkit";
import { prisma } from "../../utils/client.js";
import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/AppError.js";

// get payslip
export const getPaySlip = asyncHandler(async (req, res) => {
    const employeeId = req.user.id;
    const { month } = req.query;

    if (!employeeId || !month) throw new AppError("Please provide all fields", 400);

    const employee = await prisma.user.findUnique({
        where: { id: Number(employeeId) }
    });

    if (!employee || employee.role !== "EMPLOYEE") throw new AppError("Employee not found", 400);

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

    if (!payroll) throw new AppError("Payroll not generated for this month", 404);

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
});

// generate payslip pdf
export const generatePayslipPDF = asyncHandler(async (req, res) => {
    const employeeId = req.user.id;
    const { month } = req.query;

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

    if (!payroll) throw new AppError("Payroll not found", 404);

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
        "Content-Disposition",
        `attachment; filename=payslip-${month}.pdf`
    );

    doc.pipe(res);

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
});