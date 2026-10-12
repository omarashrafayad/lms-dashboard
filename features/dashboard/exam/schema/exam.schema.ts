import { z } from "zod"

export const examQuestionSchema = z.object({
  id: z.string().optional(),
  questionText: z.string().min(1, "Question text is required"),
  questionType: z.string().default("Multiple Choice"),
  points: z.coerce.number().min(1, "Points must be at least 1"),
  options: z.string().optional().default(""),
  correctAnswer: z.string().min(1, "Correct answer is required"),
  isRequired: z.boolean().default(true),
})

export type ExamQuestionFormData = z.infer<typeof examQuestionSchema>

export const createExamSchema = z
  .object({
    title: z.string().min(2, "Exam title must be at least 2 characters"),
    description: z.string().optional().or(z.literal("")),
    examType: z.enum(["Monthly", "Subject", "Course"]),
    level: z.string().min(1, "Difficulty level is required"),
    educationStage: z.string().optional().or(z.literal("")),
    academicYear: z.string().optional().or(z.literal("")),
    term: z.string().optional().or(z.literal("")),
    month: z.string().optional().or(z.literal("")),
    subjects: z.array(z.string()).optional().default([]),
    courseId: z.string().optional().nullable().or(z.literal("")),
    courseName: z.string().optional().nullable().or(z.literal("")),
    durationMinutes: z.coerce
      .number()
      .min(1, "Duration must be at least 1 minute"),
    attemptsAllowed: z.coerce
      .number()
      .min(1, "Attempts allowed must be at least 1"),
    passingScore: z.coerce
      .number()
      .min(0, "Passing score must be at least 0")
      .max(100, "Passing score cannot exceed 100"),
    availability: z.string().optional().default("Always available"),
    availableFrom: z.string().optional().nullable(),
    availableTo: z.string().optional().nullable(),
    status: z.string().optional().default("Published"),
    questions: z.array(examQuestionSchema).min(1, "At least one question is required"),
  })
  .superRefine((data, ctx) => {
    if (data.examType === "Course" && (!data.courseId || !data.courseId.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["courseId"],
        message: "Please select a course for Course Exam",
      })
    }
    if (data.examType === "Monthly" && (!data.month || !data.month.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["month"],
        message: "Please select a month for Monthly Exam",
      })
    }
    if (data.examType === "Subject" && (!data.subjects || data.subjects.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["subjects"],
        message: "Please select at least one subject for Subject Exam",
      })
    }
  })

export type CreateExamFormData = z.infer<typeof createExamSchema>

export const updateExamSchema = z.object({
  title: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 2, {
      message: "Exam title must be at least 2 characters",
    }),
  description: z.string().optional().or(z.literal("")),
  examType: z.enum(["Monthly", "Subject", "Course"]).optional(),
  level: z.string().optional(),
  educationStage: z.string().optional().or(z.literal("")),
  academicYear: z.string().optional().or(z.literal("")),
  term: z.string().optional().or(z.literal("")),
  month: z.string().optional().or(z.literal("")),
  subjects: z.array(z.string()).optional(),
  courseId: z.string().optional().nullable().or(z.literal("")),
  courseName: z.string().optional().nullable().or(z.literal("")),
  durationMinutes: z.coerce.number().min(1).optional(),
  attemptsAllowed: z.coerce.number().min(1).optional(),
  passingScore: z.coerce.number().min(0).max(100).optional(),
  availability: z.string().optional(),
  availableFrom: z.string().optional().nullable(),
  availableTo: z.string().optional().nullable(),
  status: z.string().optional(),
})

export type UpdateExamFormData = z.infer<typeof updateExamSchema>
