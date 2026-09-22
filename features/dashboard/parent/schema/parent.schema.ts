import { z } from "zod"

export const createParentSchema = z.object({
  firstName: z.string().trim().min(2, "First name must be at least 2 characters"),
  lastName: z.string().trim().min(2, "Last name must be at least 2 characters"),
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phoneNumber: z.string().trim().min(3, "Phone number is required"),
  isActive: z.boolean().default(true),
})

export const updateParentSchema = z.object({
  firstName: z.string().trim().min(2, "First name must be at least 2 characters"),
  lastName: z.string().trim().min(2, "Last name must be at least 2 characters"),
  email: z.string().trim().email("Invalid email address"),
  phoneNumber: z.string().trim().min(3, "Phone number is required"),
  isActive: z.boolean().default(true),
})

export type CreateParentFormData = z.infer<typeof createParentSchema>
export type UpdateParentFormData = z.infer<typeof updateParentSchema>
