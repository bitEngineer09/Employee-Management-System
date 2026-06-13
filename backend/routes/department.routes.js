import express from 'express';
import {
    createDepartment,
    deactivateDepartment,
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

// department attendance routes
router.get("/attendance", departmentWiseTodayAttendance);

// department dashboard routes
router.get("/admin-dept-stats", getDepartmentStats);

router.post("/", createDepartment);
router.get("/", getDepartments);
router.get("/:id", getDepartmentById);
router.patch("/:id", updateDepartment);
router.delete("/:id", deactivateDepartment);

export default router;