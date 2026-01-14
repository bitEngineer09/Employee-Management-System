import express from 'express';

// controllers
import {
    signupController,
    loginController,
    logoutController,
    getUserInfo,
    forgotPassword,
    resetPassword,
} from '../controllers/auth.controller.js';

// zod imports
import { validate } from "../middlewares/zodValidator.js";
import {
    registerSchema,
    loginSchema,
    newPasswordSchema
} from '../validators/auth.zod.js';

// middlewares
import { isAuth } from '../middlewares/isAuth.js';
import { requireAuth } from '../middlewares/requireAuth.js';

const router = express.Router();

router.post("/signup", validate(registerSchema), signupController);
router.post("/login", validate(loginSchema), loginController);
router.post("/logout", logoutController);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", validate(newPasswordSchema), resetPassword);

router.get("/me", isAuth, requireAuth, getUserInfo);

export default router;