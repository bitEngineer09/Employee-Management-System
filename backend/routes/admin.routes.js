import express from "express";
import {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    updateEmployeeStatus,
    adminAttendance,
    getEmpAttendance,
    getMonthlyAttendanceSummary,
    createHoliday,
    getHolidays,
    deleteHoliday,
    getAllLeaves,
    approveRejectLeave,
    getPayRoll,
    getPaySlip,
    generatePayroll,
    generatePayslipPDF,
    regeneratePayroll
} from "../controllers/admin.controller.js";

import { isAuth } from "../middlewares/isAuth.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

router.use(isAuth, requireAuth, isAdmin);

router.post("/employee", createEmployee);
router.get("/employees", getAllEmployees);
router.get("/employee/:id", getEmployeeById);
router.put("/employee/:id", updateEmployee);
router.patch("/employee/:id/status", updateEmployeeStatus);

// attendance routes
router.patch("/attendance/:id", adminAttendance);
router.get("/empAttendance", getEmpAttendance);
router.get("/attendance/summary", getMonthlyAttendanceSummary);

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

export default router;
