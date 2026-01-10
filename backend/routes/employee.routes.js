import express from 'express';

// middlewares
import { isAuth } from '../middlewares/isAuth.js';
import { requireAuth } from '../middlewares/requireAuth.js';

// auth 
import { forgotPassword, resetPassword } from '../controllers/auth.controller.js';

// payslip
import { generatePayslipPDF, getPaySlip } from '../controllers/user/payslip.controller.js';

// emp leaves
import {
    applyLeave,
    getLeaveBalance,
    getMyActiveLeaves,
} from '../controllers/user/empLeave.controller.js';

// emp attendance
import {
    changeDefaultPassword,
    checkin,
    checkout,
    getAttendance,
    getMonthlySummary,
    getTodayAttendance
} from '../controllers/user/empAttendance.controller.js';

// zod imports
import { validate } from '../middlewares/zodValidator.js';
import { changeDefaultPasswordSchema } from '../validators/auth.zod.js';




const router = express.Router();

// password routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.use(isAuth, requireAuth);

// attendance routes
router.post("/attendance/check-in", checkin);
router.patch("/attendance/check-out", checkout);
router.get("/attendance", getAttendance);
router.get("/attendance/summary", getMonthlySummary);
router.get("/attendance/today", getTodayAttendance);

// leave routes
router.post("/leave", applyLeave);
router.get("/leave-balance", getLeaveBalance);
router.get("/active-leave", getMyActiveLeaves);

// payslip
router.get("/payslip", getPaySlip);
router.get("/payslip/pdf", generatePayslipPDF);

// change default password
router.patch("/change-password",
    validate(changeDefaultPasswordSchema),
    changeDefaultPassword);

export default router;