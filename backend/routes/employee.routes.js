import express from 'express';
import {
    checkin,
    checkout,
    getAttendance,
    getMonthySummary,
} from '../controllers/employee.controller.js'
import { isAuth } from '../middlewares/isAuth.js';
import { requireAuth } from '../middlewares/requireAuth.js';

const router = express.Router();

router.use(isAuth, requireAuth);

router.post("/check-in", checkin);
router.post("/check-out", checkout);
router.get("/attendance", getAttendance);
router.get("/attendance/summary", getMonthySummary);

export default router;