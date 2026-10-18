import { z } from "zod"

export function isTimeInFuture(timeStr: string, dateStr?: string): boolean {
  if (!timeStr) return false
  if (timeStr.includes("T")) {
    return new Date(timeStr).getTime() > Date.now()
  }

  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i)
  if (!match) return true

  let hours = parseInt(match[1], 10)
  const minutes = parseInt(match[2], 10)
  const meridian = match[3]?.toUpperCase()

  if (meridian === "PM" && hours < 12) hours += 12
  if (meridian === "AM" && hours === 12) hours = 0

  const baseDate = dateStr ? new Date(dateStr) : new Date()
  const targetDate = new Date(baseDate)
  targetDate.setHours(hours, minutes, 0, 0)

  // Buffer 1 minute for small clock difference
  return targetDate.getTime() > Date.now() - 60000
}

export const scheduleSessionSchema = z
  .object({
    studentId: z.string().min(1, "Please select a student"),
    studentName: z.string().optional(),
    educationStage: z.string().optional(),
    academicStage: z.string().optional(),

    teacherId: z.string().min(1, "Please select a teacher"),
    teacherName: z.string().optional(),

    date: z.string().min(1, "Date is required"),
    startTime: z.string().min(1, "Please select a time slot"),

    targetType: z.enum(["subject", "course"], {
      message: "Please select Course or Subject",
    }),
    subjectId: z.string().optional(),
    subjectName: z.string().optional(),
    courseId: z.string().optional(),
    courseName: z.string().optional(),

    durationMinutes: z.string().min(1, "Duration is required"),
    sessionType: z.string().min(1, "Session type is required"),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Validate Start Time must be in future
    if (data.startTime && !isTimeInFuture(data.startTime, data.date)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Start time must be in the future",
        path: ["startTime"],
      })
    }

    // Validate Subject or Course based on targetType
    if (data.targetType === "subject" && (!data.subjectId || !data.subjectId.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select a subject",
        path: ["subjectId"],
      })
    }

    if (data.targetType === "course" && (!data.courseId || !data.courseId.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select a course",
        path: ["courseId"],
      })
    }
  })

export type ScheduleSessionFormData = z.infer<typeof scheduleSessionSchema>

export const updateSessionSchema = z
  .object({
    teacherId: z.string().optional(),
    teacherName: z.string().optional(),
    date: z.string().optional(),
    startTime: z.string().optional(),
    durationMinutes: z.string().optional(),
    sessionType: z.string().optional(),
    targetType: z.enum(["subject", "course"]).optional(),
    subjectId: z.string().optional(),
    subjectName: z.string().optional(),
    courseId: z.string().optional(),
    courseName: z.string().optional(),
    notes: z.string().optional(),
    status: z.string().optional(),
  })

export type UpdateSessionFormData = z.infer<typeof updateSessionSchema>
