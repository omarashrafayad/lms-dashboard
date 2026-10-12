import { z } from "zod"

export const createCourseSchema = z.object({
  name: z.string().min(2, "Course name must be at least 2 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  category: z.string().min(1, "Category is required"),
  difficultyLevel: z.string().min(1, "Difficulty level is required"),
  leadInstructor: z.string().min(2, "Lead instructor is required"),
  instructionLanguage: z.string().min(1, "Instruction language is required"),
  targetAudience: z.string().min(1, "Target audience is required"),
  prerequisites: z.string().min(1, "Prerequisites are required"),
  estimatedDurationHours: z.coerce
    .number()
    .min(0, "Duration must be 0 or more"),
  coverImageUrl: z.string().optional().or(z.literal("")),
  order: z.coerce
    .number()
    .min(0, "Order must be 0 or more")
    .optional()
    .default(0),
})

export type CreateCourseFormData = z.infer<typeof createCourseSchema>

export const updateCourseSchema = z.object({
  name: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 2, {
      message: "Course name must be at least 2 characters",
    }),
  description: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 3, {
      message: "Description must be at least 3 characters",
    }),
  category: z.string().optional(),
  difficultyLevel: z.string().optional(),
  leadInstructor: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 2, {
      message: "Lead instructor must be at least 2 characters",
    }),
  instructionLanguage: z.string().optional(),
  targetAudience: z.string().optional(),
  prerequisites: z.string().optional(),
  estimatedDurationHours: z.coerce
    .number()
    .min(0, "Duration must be 0 or more")
    .optional(),
  coverImageUrl: z.string().optional().or(z.literal("")),
  order: z.coerce
    .number()
    .min(0, "Order must be 0 or more")
    .optional(),
  status: z.string().optional(),
})

export type UpdateCourseFormData = z.infer<typeof updateCourseSchema>
