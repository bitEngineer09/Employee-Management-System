import express from 'express';
import {
    applyLeave,
    changeDefaultPassword,
    checkin,
    checkout,
    getAttendance,
    getLeaveBalance,
    getMonthlySummary,
} from '../controllers/employee.controller.js'
import { isAuth } from '../middlewares/isAuth.js';
import { requireAuth } from '../middlewares/requireAuth.js';

// zod imports
import { validate } from '../middlewares/zodValidator.js';
import { changeDefaultPasswordSchema } from '../validators/auth.zod.js';

const router = express.Router();

router.use(isAuth, requireAuth);

router.post("/check-in", checkin);
router.post("/check-out", checkout);

// attendance routes
router.get("/attendance", getAttendance);
router.get("/attendance/summary", getMonthlySummary);

// leave routes
router.post("/leave", applyLeave);
router.get("/leave-balance", getLeaveBalance);

// change default password
router.patch("/change-password",
    validate(changeDefaultPasswordSchema),
    changeDefaultPassword);
export default router;