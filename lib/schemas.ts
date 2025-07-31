import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

export const teamSchema = z.object({
  name: z.string().min(1, "Team name is required").max(50, "Team name must be less than 50 characters"),
})

export const memberSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  sentiment: z.enum(["happy", "neutral", "sad"], {
    required_error: "Please select a sentiment",
  }),
})

export const settingsSchema = z.object({
  enableCheckins: z.boolean(),
  checkinFrequency: z.enum(["daily", "weekly", "monthly"]),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type TeamFormData = z.infer<typeof teamSchema>
export type MemberFormData = z.infer<typeof memberSchema>
export type SettingsFormData = z.infer<typeof settingsSchema>
