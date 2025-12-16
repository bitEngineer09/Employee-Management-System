import { prisma } from '../utils/client.js';
import argon2 from 'argon2';
import { authenticate, clearSession } from '../services/auth.services.js';

// user sign up
export const signupController = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            adminCode
        } = req.body;

        if (!name || !email || !password || !adminCode) {
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
}

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

        if (!user) return res.status(400).json({
            success: false,
            message: "Invalid Credentials"
        });

        const validPasswd = await argon2.verify(user.password, password);

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
}

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
}