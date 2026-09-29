import { z } from "zod"

export const subjectSchema = z.object({
  name: z.string().trim().min(1, "Subject name is required"),
  educationStageId: z.string().min(1, "Please select an education stage"),
  gradeId: z.string().min(1, "Please select an academic year / grade"),
  educationSystemId: z.string().min(1, "Please select an education system"),
  term: z.string().min(1, "Please select a term"),
  status: z.string().min(1, "Please select a status"),
})

export type SubjectFormData = z.infer<typeof subjectSchema>
