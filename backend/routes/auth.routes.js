import express from 'express';
import {
    signupController,
    loginController,
    logoutController,
    getUserInfo,
} from '../controllers/auth.controller.js';

// zod imports
import { validate } from "../middlewares/zodValidator.js";
import {
    registerSchema,
    loginSchema
} from '../validators/auth.zod.js';
import { isAuth } from '../middlewares/isAuth.js';
import { requireAuth } from '../middlewares/requireAuth.js';

const router = express.Router();

router.post("/signup", validate(registerSchema), signupController);
router.post("/login", validate(loginSchema) ,loginController);
router.post("/logout", logoutController);

router.get("/me", isAuth, requireAuth, getUserInfo);

export default router;