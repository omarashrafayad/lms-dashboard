import { z } from "zod"

export const createParentSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phoneNumber: z.string().min(3, "Phone number is required"),
  isActive: z.boolean(),
  sendWelcomeEmail: z.boolean(),
  childIds: z.array(z.string()),
})

export const updateParentSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(3, "Phone number is required"),
  isActive: z.boolean(),
  sendWelcomeEmail: z.boolean().optional(),
  childIds: z.array(z.string()),
})

export type CreateParentFormData = z.infer<typeof createParentSchema>
export type UpdateParentFormData = z.infer<typeof updateParentSchema>
