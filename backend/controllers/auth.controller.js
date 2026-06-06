import { prisma } from '../utils/client.js';
import argon2 from 'argon2';
import { authenticate, clearSession } from '../services/auth.services.js';
import { generateOtp } from '../utils/generateOtp.js'
import { sendOtpToEmail } from '../utils/sendOtpEmail.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';

// user sign up
export const signupController = asyncHandler(async (req, res) => {
    const {
        name,
        email,
        password,
        confirmPassword,
        adminCode,
    } = req.body;

    if (!name || !email || !password || !confirmPassword || !adminCode) {
        throw new AppError("Please provide all fields", 400);
    }

    if (adminCode !== process.env.ADMIN_CODE) throw new AppError("Admin Code not Matched", 400);

    const isAdminExists = await prisma.user.findUnique({
        where: { email }
    });

    if (isAdminExists) throw new AppError("Admin already exists", 400);

    if (password !== confirmPassword) throw new AppError("Please enter same password", 400);

    const hashedPaswd = await argon2.hash(password);
    if (!hashedPaswd) throw new AppError("Password hashing error", 400);

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
    });
});

// user login
export const loginController = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) throw new AppError("Please provide all fields", 400);

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) throw new AppError("Invalid Credentials", 400);

    const validPasswd = await argon2.verify(user.password, String(password).trim());

    if (!validPasswd) throw new AppError("Invalid Credentials", 400);

    await authenticate(req, res, user);

    return res.status(200).json({
        success: true,
        message: "User logged in successfully"
    });
});

// logout controller
export const logoutController = asyncHandler(async (req, res) => {
    if (req.user?.sessionId) await clearSession(req.user?.sessionId);
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    return res.status(200).json({
        success: true,
        message: "User logged out successfully"
    });
});

// forgot password
export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) throw new AppError("Email is required", 400);

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) throw new AppError("User not found", 400);

    const otp = generateOtp();
    const hashedOtp = await argon2.hash(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await prisma.passwordResetOtp.create({
        data: {
            email,
            otp: hashedOtp,
            expiresAt,
        },
    });

    await sendOtpToEmail(email, otp);

    return res.status(200).json({
        success: true,
        message: "Otp sent to email",
    });
});

// reset password
export const resetPassword = asyncHandler(async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) throw new AppError("Please provide all fields", 400);

    // find the latest unused otp for the email
    const otpRecord = await prisma.passwordResetOtp.findFirst({
        where: {
            email,
            used: false,
            expiresAt: {
                gt: new Date(),
            },
        },
    });

    if (!otpRecord) throw new AppError("Invalid or expired OTP", 400);

    const isValidOtp = await argon2.verify(otpRecord.otp, otp);

    if (!isValidOtp) throw new AppError("Invalid or expired OTP", 400);

    const hashedPassword = await argon2.hash(newPassword);

    await prisma.user.update({
        where: { email },
        data: {
            password: hashedPassword,
        },
    });

    await prisma.passwordResetOtp.update({
        where: { id: otpRecord.id },
        data: { used: true },
    });

    return res.status(200).json({
        success: true,
        message: "Password reset successful",
    });
});

// get current user info
export const getUserInfo = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
        omit: { password: true },
    });

    if (!user) throw new AppError("user not found", 400);

    return res.status(200).json({
        success: true,
        message: "User info fetched successfully",
        user,
    });
});