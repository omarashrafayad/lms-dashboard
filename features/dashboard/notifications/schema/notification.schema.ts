import { z } from "zod"

export const createNotificationSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  summary: z.string().min(2, "Summary must be at least 2 characters"),
  content: z.string().min(5, "Content must be at least 5 characters"),
  audience: z.string().min(1, "Please select an audience"),
  category: z.string().default("general"),
  priority: z.string().default("normal"),
  courseId: z.string().optional().nullable(),
  planId: z.string().optional().nullable(),
  academicStageId: z.string().optional().nullable(),
  gradeId: z.string().optional().nullable(),
  educationSystemId: z.string().optional().nullable(),
  actionUrl: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  channels: z.array(z.string()).default(["in_app", "push"]),
  publish: z.boolean().default(true),
})

export type CreateNotificationFormData = z.infer<typeof createNotificationSchema>

export const updateNotificationSchema = createNotificationSchema.partial()
export type UpdateNotificationFormData = z.infer<typeof updateNotificationSchema>

