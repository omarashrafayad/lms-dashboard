import { z } from "zod"

export const createTeacherSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    phoneNumber: z.string().min(3, "Phone number is required"),
    nationalId: z.string().min(3, "National ID is required"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    genderId: z.string().min(1, "Gender is required"),
    qualifications: z.string().optional(),
    yearsOfExperience: z.union([z.number(), z.string()]).optional(),
    bio: z.string().optional(),
    history: z.string().optional(),
    isActive: z.boolean(),
    isAvailable: z.boolean(),
    subjectIds: z.array(z.string()),
    teachingLevelIds: z.array(z.string()),
    educationStageIds: z.array(z.string()),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type CreateTeacherFormData = z.infer<typeof createTeacherSchema>

export const updateTeacherSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().optional(),
  phoneNumber: z.string().min(3, "Phone number is required"),
  nationalId: z.string().min(3, "National ID is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  genderId: z.string().min(1, "Gender is required"),
  qualifications: z.string().optional(),
  yearsOfExperience: z.union([z.number(), z.string()]).optional(),
  bio: z.string().optional(),
  history: z.string().optional(),
  isActive: z.boolean(),
  isAvailable: z.boolean(),
  subjectIds: z.array(z.string()),
  teachingLevelIds: z.array(z.string()),
  educationStageIds: z.array(z.string()),
})

export type UpdateTeacherFormData = z.infer<typeof updateTeacherSchema>
