import express from 'express';
import {
    applyLeave,
    checkin,
    checkout,
    getAttendance,
    getLeaveBalance,
<<<<<<< HEAD
    getMonthySummary,
=======
    getMonthlySummary,
>>>>>>> 015168a (payrole, payslip)
} from '../controllers/employee.controller.js'
import { isAuth } from '../middlewares/isAuth.js';
import { requireAuth } from '../middlewares/requireAuth.js';

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
export default router;