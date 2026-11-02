import { z } from "zod"

export const createPlanSchema = z.object({
  name: z.string().min(2, "Plan name must be at least 2 characters"),
  tier: z.string().min(1, "Plan tier is required"),
  tagline: z.string().optional(),
  targetGradeLevel: z.string().optional(),
  gradeScope: z.string().optional(),
  monthlyPrice: z.number().min(0, "Monthly price must be 0 or greater"),
  annualPrice: z.number().min(0, "Annual price must be 0 or greater"),
  badgeLabel: z.string().optional(),
  liveSessionsPerMonth: z.number().min(0, "Live sessions count must be 0 or greater"),
  examAccess: z.string().optional(),
  supportLevel: z.string().optional(),
  features: z.array(z.string()).optional(),
})

export type CreatePlanFormData = z.infer<typeof createPlanSchema>

export const updatePlanSchema = createPlanSchema.partial().extend({
  isActive: z.boolean().optional(),
  order: z.number().optional(),
})

export type UpdatePlanFormData = z.infer<typeof updatePlanSchema>

export const assignPlanSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  studentName: z.string().optional(),
  studentGrade: z.string().optional(),
  planId: z.string().min(1, "Subscription plan is required"),
  billingCycle: z.string().min(1, "Billing cycle is required"),
  parentId: z.string().optional(),
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
  autoRenew: z.boolean(),
  notes: z.string().optional(),
})

export type AssignPlanFormData = z.infer<typeof assignPlanSchema>

export const refundPaymentSchema = z.object({
  note: z.string().min(3, "Refund reason must be at least 3 characters"),
})

export type RefundPaymentFormData = z.infer<typeof refundPaymentSchema>

export const recordPaymentSchema = z.object({
  studentId: z.string().optional(),
  studentName: z.string().optional(),
  planId: z.string().optional(),
  amount: z.number().min(1, "Amount must be greater than 0"),
  discountAmount: z.number().optional(),
  couponCode: z.string().optional(),
  method: z.string().min(1, "Payment method is required"),
  gatewayReference: z.string().optional(),
  itemDescription: z.string().optional(),
})

export type RecordPaymentFormData = z.infer<typeof recordPaymentSchema>
