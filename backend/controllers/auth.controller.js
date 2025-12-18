import { prisma } from '../utils/client.js';
import argon2 from 'argon2';
import { authenticate, clearSession } from '../services/auth.services.js';
import { generateOtp } from '../utils/generateOtp.js'

// user sign up
export const signupController = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            confirmPassword,
            adminCode,
        } = req.body;

        if (!name || !email || !password || !confirmPassword || !adminCode) {
            return res.status(400).json({
                success: false,
                message: "Please provide all fields"
            });
        }

        if (adminCode !== process.env.ADMIN_CODE) return res.status(400).json({
            success: false,
            message: "Admin Code not Matched"
        });

        const isAdminExists = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (isAdminExists) return res.status(400).json({
            success: false,
            message: "Admin already exists"
        });

        if (password !== confirmPassword) return res.status(400).json({
            success: false,
            message: "Please enter same password",
        });

        const hashedPaswd = await argon2.hash(password);
        if (!hashedPaswd) return res.status(400).json({
            success: false,
            message: "Password hashing error"
        });

        const newAdmin = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPaswd,
                role: "ADMIN",
            }
        });

        await authenticate(req, res, newAdmin);

        return res.status(201).json({
            success: true,
            message: "Admin created successfully",
            userData: {
                id: newAdmin?.id,
                name: newAdmin?.name,
                email: newAdmin?.email,
                role: newAdmin?.role,
            }
        })
    } catch (error) {
        console.error("signup controller error", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// user login
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({
            success: false,
            message: "Please provide all fields",
        });

        const user = await prisma.user.findUnique({
            where: { email }
        });
        // console.log(password)

        if (!user) return res.status(400).json({
            success: false,
            message: "Invalid Credentials"
        });
        // console.log(user.password)
        const validPasswd = await argon2.verify(user.password, String(password).trim());

        // console.log(validPasswd);

        if (!validPasswd) return res.status(400).json({
            success: false,
            message: "Invalid Credentials"
        });

        await authenticate(req, res, user);

        return res.status(200).json({
            success: true,
            message: "User logged in successfully"
        });

    } catch (error) {
        console.error("loginController error", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
};

// logout controller
export const logoutController = async (req, res) => {
    try {
        if (req.user?.sessionId) await clearSession(req.user?.sessionId);
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");

        res.status(200).json({
            success: true,
            message: "User logged out successfully"
        });
    } catch (error) {
        console.error("logout controller error", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
};

// forgot password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({
            success: false,
            message: "Email is required",
        });

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) return res.status(400).json({
            success: false,
            message: "User not found",
        });

        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

        await prisma.passwordResetOtp.create({
            data: {
                email,
                otp,
                expiresAt,
            },
        });

        await sendOtpToEmail(email, otp);

        return res.status(200).json({
            success: true,
            message: "Otp sent to email",
        });

    } catch (error) {
        console.error("forgotPassword error", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        })
    }
};

// reset password
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) return res.status(400).json({
            success: false,
            message: "Please provide all fields",
        });

        const otpRecord = await prisma.passwordResetOtp.findUnique({
            where: {
                email,
                otp,
                used: false,
                expiresAt: {
                    gt: new Date(),
                },
            },
        });

        if (!otpRecord) return res.status(400).json({
            success: false,
            message: "Invalid or expired OTP",
        });

        const hashedPassword = await argon2.hash(newPassword);

        await prisma.user.update({
            where: { email },
            password: hashedPassword,
        });

        await prisma.passwordResetOtp.update({
            where: { id: otpRecord.id },
            data: { used: true },
        });

        return res.status(200).json({
            success: true,
            message: "Password reset successful",
        });

    } catch (error) {
        console.error("resetPassword error", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
