import { z } from 'zod';

// register user schema
export const registerSchema = z.object({
    name: z.string().min(4, "Name must be at least 2 characters long"),
    email: z.email("Invalid email format"),
    password: z.string().min(3, "Password must be at least 8 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    role: z.enum(["ADMIN", "EMPLOYEE"]).optional()
});

// login user schema
export const loginSchema = z.object({
    email: z.email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
});

// change default password schema
export const changeDefaultPasswordSchema = z.object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z.string()
        .min(3, "New password must be at least 3 characters long")
        .regex(/[A-Z]/, "New password must contain at least one uppercase letter")
        .regex(/[a-z]/, "New password must contain at least one lowercase letter")
        .regex(/[0-9]/, "New password must contain at least one number"),
});
