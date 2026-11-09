"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { UniInput } from "@/components/shared/UniInput"
import { UniSelect } from "@/components/shared/UniSelect"
import { Ticket, Loader2 } from "lucide-react"
import { CreateCouponPayload } from "../types/coupons.types"

const couponSchema = z.object({
  code: z
    .string()
    .min(2, "Code must be at least 2 characters")
    .max(30, "Code cannot exceed 30 characters")
    .regex(/^[A-Za-z0-9_-]+$/, "Code must contain only letters, numbers, hyphens or underscores"),
  discountType: z.string().min(1, "Please select discount type"),
  discountValue: z.coerce.number().positive("Discount value must be greater than 0"),
  applicableScope: z.string().min(1, "Please select applicable scope"),
  usageLimit: z.string().optional(),
  minOrderAmount: z.string().optional(),
  expiresAt: z.string().optional(),
  isActive: z.boolean().default(true),
})

type CouponFormData = z.infer<typeof couponSchema>

export interface CreateCouponModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmitCoupon: (payload: CreateCouponPayload) => Promise<void>
  isSubmitting?: boolean
}

export function CreateCouponModal({
  open,
  onOpenChange,
  onSubmitCoupon,
  isSubmitting = false,
}: CreateCouponModalProps) {
  const form = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema) as any,
    defaultValues: {
      code: "",
      discountType: "Percentage",
      discountValue: 10,
      applicableScope: "All",
      usageLimit: "",
      minOrderAmount: "",
      expiresAt: "",
      isActive: true,
    },
  })

  React.useEffect(() => {
    if (open) {
      form.reset({
        code: "",
        discountType: "Percentage",
        discountValue: 10,
        applicableScope: "All",
        usageLimit: "",
        minOrderAmount: "",
        expiresAt: "",
        isActive: true,
      })
    }
  }, [open, form])

  const onSubmit = async (values: CouponFormData) => {
    await onSubmitCoupon({
      code: values.code.trim().toUpperCase(),
      discountType: values.discountType,
      discountValue: Number(values.discountValue),
      applicableScope: values.applicableScope,
      usageLimit: values.usageLimit && values.usageLimit.trim() ? Number(values.usageLimit) : null,
      minOrderAmount:
        values.minOrderAmount && values.minOrderAmount.trim()
          ? Number(values.minOrderAmount)
          : null,
      expiresAt: values.expiresAt && values.expiresAt.trim() ? new Date(values.expiresAt).toISOString() : null,
      isActive: Boolean(values.isActive),
    })
  }

  const discountTypeOptions = [
    { label: "Percentage (%)", value: "Percentage" },
    { label: "Fixed Amount ($)", value: "Fixed" },
  ]

  const scopeOptions = [
    { label: "All Items / Plans", value: "All" },
    { label: "Courses", value: "Courses" },
    { label: "Subscriptions", value: "Subscriptions" },
    { label: "Bundles", value: "Bundles" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl rounded-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1.5 pb-2 border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-amber-50 text-brand-orange flex items-center justify-center">
              <Ticket className="size-4.5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-zinc-900">
                Create New Coupon
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Add a promotional discount code for students or courses.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            {/* Coupon Code */}
            <UniInput
              control={form.control}
              name="code"
              label="Coupon Code *"
              placeholder="e.g. SUMMER25, PROMO2026"
              inputClassName="font-mono uppercase tracking-wider"
              helperText="Uppercase alphanumeric characters, numbers and dashes"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Discount Type */}
              <UniSelect
                control={form.control}
                name="discountType"
                label="Discount Type *"
                placeholder="Select Type"
                options={discountTypeOptions}
              />

              {/* Discount Value */}
              <UniInput
                control={form.control}
                name="discountValue"
                label="Discount Value *"
                type="number"
                placeholder="e.g. 20"
                min={1}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Applicable Scope */}
              <UniSelect
                control={form.control}
                name="applicableScope"
                label="Applicable Scope *"
                placeholder="Select Scope"
                options={scopeOptions}
              />

              {/* Expiration Date */}
              <UniInput
                control={form.control}
                name="expiresAt"
                label="Expiration Date (Optional)"
                type="date"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Usage Limit */}
              <UniInput
                control={form.control}
                name="usageLimit"
                label="Max Usage Limit (Optional)"
                type="number"
                placeholder="e.g. 100 (empty for unlimited)"
                min={1}
              />

              {/* Minimum Purchase Amount */}
              <UniInput
                control={form.control}
                name="minOrderAmount"
                label="Min Order Amount (Optional)"
                type="number"
                placeholder="e.g. 50"
                min={0}
              />
            </div>

            {/* Is Active Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-zinc-900">
                  Activate Coupon Immediately
                </span>
                <span className="text-[11px] text-zinc-500">
                  Allow users to redeem this code immediately upon creation
                </span>
              </div>
              <input
                type="checkbox"
                checked={form.watch("isActive")}
                onChange={(e) => form.setValue("isActive", e.target.checked)}
                className="size-4.5 rounded border-zinc-300 text-brand-orange focus:ring-brand-orange cursor-pointer accent-[#D97706]"
              />
            </div>

            <DialogFooter className="pt-4 border-t border-zinc-100 gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="rounded-xl text-xs h-9"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl text-xs h-9 bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Creating...</span>
                  </span>
                ) : (
                  "Create Coupon"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
