import express from "express";
import {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    updateEmployeeStatus,
} from "../controllers/admin/user.controller.js";

import {
    adminAttendance,
    adminCheckin,
    adminCheckout,
    getEmpAttendance,
    getMonthlyAttendanceSummary,
} from "../controllers/admin/attendance.controller.js";

import {
    createHoliday,
    getHolidays,
    deleteHoliday,
    getAllLeaves,
    approveRejectLeave,
} from "../controllers/admin/leave.controller.js";

import {
    getPayRoll,
    getPaySlip,
    generatePayroll,
    generatePayslipPDF,
    regeneratePayroll,
} from "../controllers/admin/payroll.controller.js";

import { isAuth } from "../middlewares/isAuth.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { forgotPassword, resetPassword } from "../controllers/auth.controller.js";
import { getDashboardStats } from "../controllers/admin/dashboardStats.controller.js";

const router = express.Router();

// password routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.use(isAuth, requireAuth, isAdmin);

// employee routes
router.post("/employee", createEmployee);
router.get("/employees", getAllEmployees);
router.get("/employee/:id", getEmployeeById);
router.put("/employee/:id", updateEmployee);
router.patch("/employee/:id/status", updateEmployeeStatus);

// attendance routes
router.patch("/attendance/:id", adminAttendance);
router.get("/empAttendance", getEmpAttendance);
router.get("/attendance/summary", getMonthlyAttendanceSummary);
router.post("/attendance/check-in", adminCheckin);
router.patch("/attendance/check-out", adminCheckout);

// holiday routes
router.post("/holiday", createHoliday);
router.delete("/holiday/:id", deleteHoliday);
router.get("/holiday", getHolidays);

// leave routes
router.get("/leaves", getAllLeaves);
router.patch("/leaves/:id", approveRejectLeave);

// pay roll routes
router.get("/payroll", getPayRoll);
router.post("/payroll/generate", generatePayroll);
router.get("/payslip", getPaySlip);
router.get("/payslip/pdf", generatePayslipPDF);
router.post("/payroll/regenerate", regeneratePayroll);

// dashboard routes
router.get("/admin-stats", getDashboardStats);

export default router;
