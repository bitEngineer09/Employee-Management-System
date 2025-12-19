import express from 'express';
import {
    createDepartment,
    deactivateDepartment,
    departmentAttendanceReport,
    departmentAttendanceSummary,
    getDepartmentById,
    getDepartments,
    updateDepartment
} from '../controllers/admin/department.controller.js';
import { isAuth } from '../middlewares/isAuth.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();

router.use(isAuth, requireAuth, isAdmin);

router.post("/create", createDepartment);
router.get("/get-all", getDepartments);
router.get("/get/:id", getDepartmentById);
router.patch("/update/:id", updateDepartment);
router.delete("/deactivate/:id", deactivateDepartment);

router.get("/attendance/report/:id", departmentAttendanceReport);
router.get("/attendance/summary/:id", departmentAttendanceSummary);

export default router;