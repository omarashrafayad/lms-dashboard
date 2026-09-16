import { z } from "zod";

export const createStudentSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phoneNumber: z.string().min(3, "Phone number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  genderId: z.string().min(1, "Gender ID is required"),
  academicStageId: z.string().min(1, "Academic Stage ID is required"),
  gradeId: z.string().min(1, "Grade ID is required"),
  educationSystemId: z.string().min(1, "Education System ID is required"),
});

export type CreateStudentFormData = z.infer<typeof createStudentSchema>;
