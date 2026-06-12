import { z } from "zod";

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const signupClientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z
    .string()
    .min(10, "Password must be at least 10 characters")
    .regex(/[A-Z]/, "Must include an uppercase letter")
    .regex(/[a-z]/, "Must include a lowercase letter")
    .regex(/[0-9]/, "Must include a number"),
});

export const signupCreatorSchema = signupClientSchema.extend({
  role: z.string().min(1, "Select your primary role"),
  phone: z.string().min(10, "Enter a valid phone number"),
  city: z.string().min(2, "Enter your city"),
  creatorType: z.enum(["freelancer", "studio_owner"]),
  dayRate: z.coerce.number().min(0, "Enter your day rate"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

// ─── Booking ──────────────────────────────────────────────────────────────────
export const bookingStep5Schema = z.object({
  eventDate: z.string().optional(),
  bookingLocation: z.string().min(2, "Enter a location"),
  estimatedDays: z.coerce.number().min(1, "Must be at least 1 day"),
  budgetTier: z.enum(["budget", "standard", "premium"]).optional(),
  additionalNotes: z.string().optional(),
});

// ─── Profile ──────────────────────────────────────────────────────────────────
export const profileUpdateSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  city: z.string().optional(),
  bio: z.string().max(500, "Bio must be under 500 characters").optional(),
  dayRate: z.coerce.number().min(0).optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupClientFormData = z.infer<typeof signupClientSchema>;
export type SignupCreatorFormData = z.infer<typeof signupCreatorSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type BookingStep5Data = z.infer<typeof bookingStep5Schema>;
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;
