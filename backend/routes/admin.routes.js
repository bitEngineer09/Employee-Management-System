import express from "express";
import {
    createEmployee,
    getAllEmployees,
    getAllEmployeeById,
    updateEmployee,
    updateEmployeeStatus,
    adminAttendance,
    getEmpAttendance,
    getMonthlyAttendanceSummary
} from "../controllers/admin.controller.js";

import { isAuth } from "../middlewares/isAuth.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

router.use(isAuth, requireAuth, isAdmin);

router.post("/employees", createEmployee);
router.get("/employees", getAllEmployees);
router.get("/employees/:id", getAllEmployeeById);
router.put("/employees/:id", updateEmployee);
router.patch("/employees/:id/status", updateEmployeeStatus);

// attendance routes
router.patch("/attendance/:id", adminAttendance);
router.get("/empAttendance", getEmpAttendance);
router.get("/attendance/summary", getMonthlyAttendanceSummary);

export default router;
