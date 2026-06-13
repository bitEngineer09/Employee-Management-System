import express from "express";

// employees
import {
    createEmployee,
    deactivateEmployee,
    getAllEmployees,
    getEmployeeById,
    permanentDeleteEmployee,
    searchEmployees,
    updateEmployee,
    updateEmployeeStatus,
} from "../controllers/admin/user.controller.js";

// attendance
import {
    adminAttendance,
    getMonthlyEmployeeAttendanceSummary,
    getTodayEmployeesAttendance,
} from "../controllers/admin/attendance.controller.js";

// leaves
import {
    createHoliday,
    getHolidays,
    deleteHoliday,
    getAllLeaves,
    approveRejectLeave,
} from "../controllers/admin/leave.controller.js";

// payroll
import {
    getPayRoll,
    generatePayroll,
    regeneratePayroll,
} from "../controllers/admin/payroll.controller.js";

// password
import { forgotPassword, resetPassword } from "../controllers/auth.controller.js";
import { getDashboardStats } from "../controllers/admin/dashboardStats.controller.js";

// middlewares
import { isAuth } from "../middlewares/isAuth.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { getMonthlyDepartmentAttendanceSummary } from "../controllers/admin/department.controller.js";


const router = express.Router();

// get holiday
router.get("/holidays", getHolidays);
router.get("/employees/search", searchEmployees);

router.use(isAuth, requireAuth, isAdmin);

// employee routes
router.post("/employee", createEmployee);
router.get("/employee", getAllEmployees);
router.get("/employee/:id", getEmployeeById);
router.put("/employee/:id", updateEmployee);
router.patch("/employee/:id/status", updateEmployeeStatus);
router.patch("/employee/:id", deactivateEmployee);
router.delete("/employee/:id", permanentDeleteEmployee);

// attendance routes
// router.patch("/attendance/:id", adminAttendance);
router.get("/attendance/employee-summary", getMonthlyEmployeeAttendanceSummary);
router.get("/attendance/today-employees", getTodayEmployeesAttendance);
router.get("/attendance/department-summary/:id", getMonthlyDepartmentAttendanceSummary);

// holiday routes
router.post("/holidays", createHoliday);
router.delete("/holidays/:id", deleteHoliday);

// leave routes
router.get("/leaves", getAllLeaves);
router.patch("/leaves/:id", approveRejectLeave);

// pay roll routes
router.get("/payroll", getPayRoll);
router.post("/payroll/generate", generatePayroll);
router.post("/payroll/regenerate", regeneratePayroll);

// dashboard routes
router.get("/stats", getDashboardStats);

export default router;
