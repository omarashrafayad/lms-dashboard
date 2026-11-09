import * as z from "zod"

export const bannerSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(120, "Title cannot exceed 120 characters"),
  linkUrl: z
    .string()
    .optional()
    .or(z.literal("")),
  order: z.coerce
    .number()
    .min(0, "Order must be 0 or higher")
    .default(0),
  isActive: z.boolean().default(true),
  image: z.any().optional(),
})

export type BannerFormData = z.infer<typeof bannerSchema>

