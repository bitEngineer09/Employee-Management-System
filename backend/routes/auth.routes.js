import express from 'express';
import {
    signupController,
    loginController,
    logoutController,
} from '../controllers/auth.controller.js';

// zod imports
import { validate } from "../middlewares/zodValidator.js";
import {
    registerSchema,
    loginSchema
} from '../validators/auth.zod.js';

const router = express.Router();

router.post("/signup", validate(registerSchema), signupController);
router.post("/login", loginController);
router.post("/logout", logoutController);

export default router;