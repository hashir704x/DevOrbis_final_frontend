import { z } from "zod";

export const signUpSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export const verifyOtpSchema = z.object({
    otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits and numbers only"),
});

export const loginSchema = z.object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});
