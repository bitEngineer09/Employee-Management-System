import PDFDocument from "pdfkit";
import { prisma } from "../../utils/client.js";

// get payslip
export const getPaySlip = async (req, res) => {
    try {
        const employeeId = req.user.id;
        const { month } = req.query;
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

// generate payslip pdf
export const generatePayslipPDF = async (req, res) => {
    try {
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