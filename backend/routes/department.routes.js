import express from 'express';
import {
    createDepartment,
    deactivateDepartment,
    departmentAttendanceReport,
    departmentAttendanceSummary,
    departmentWiseTodayAttendance,
    getDepartmentById,
    getDepartments,
    updateDepartment
} from '../controllers/admin/department.controller.js';
import { isAuth } from '../middlewares/isAuth.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { getDepartmentStats } from '../controllers/admin/dashboardStats.controller.js';

const router = express.Router();

router.use(isAuth, requireAuth, isAdmin);

router.post("/create", createDepartment);
router.get("/get-all", getDepartments);
router.get("/get/:id", getDepartmentById);
router.patch("/update/:id", updateDepartment);
router.delete("/deactivate/:id", deactivateDepartment);

// department attendance routes
router.get("/attendance/report/:id", departmentAttendanceReport);
router.get("/attendance/summary/:id", departmentAttendanceSummary);
router.get("/department-attendance", departmentWiseTodayAttendance);

// department dashboard routes
router.get("/admin-dept-stats", getDepartmentStats);

export default router;