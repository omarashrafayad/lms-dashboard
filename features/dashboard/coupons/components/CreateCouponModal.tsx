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
    .min(3, "Code must be at least 3 characters")
    .max(20, "Code cannot exceed 20 characters")
    .regex(/^[A-Za-z0-9_-]+$/, "Code must contain only letters, numbers, hyphens or underscores"),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.coerce.number().positive("Discount value must be greater than 0"),
  applicableTo: z.enum(["all", "courses", "subscriptions"]),
  usageLimit: z.string().optional(),
  minPurchaseAmount: z.string().optional(),
  endDate: z.string().optional(),
  status: z.enum(["active", "disabled"]),
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
  const form = useForm({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: "",
      discountType: "percentage",
      discountValue: 10,
      applicableTo: "all",
      usageLimit: "",
      minPurchaseAmount: "",
      endDate: "",
      status: "active",
    },
  })

  React.useEffect(() => {
    if (open) {
      form.reset({
        code: "",
        discountType: "percentage",
        discountValue: 10,
        applicableTo: "all",
        usageLimit: "",
        minPurchaseAmount: "",
        endDate: "",
        status: "active",
      })
    }
  }, [open, form])

  const onSubmit = async (values: any) => {
    await onSubmitCoupon({
      code: values.code.trim().toUpperCase(),
      discountType: values.discountType,
      discountValue: Number(values.discountValue),
      applicableTo: values.applicableTo,
      usageLimit: values.usageLimit ? Number(values.usageLimit) : null,
      minPurchaseAmount: values.minPurchaseAmount
        ? Number(values.minPurchaseAmount)
        : null,
      endDate: values.endDate ? new Date(values.endDate).toISOString() : null,
      status: values.status,
    })
  }

  const discountTypeOptions = [
    { label: "Percentage Discount (%)", value: "percentage" },
    { label: "Fixed Amount Discount ($)", value: "fixed" },
  ]

  const scopeOptions = [
    { label: "All Items (Courses & Subscriptions)", value: "all" },
    { label: "Courses Only", value: "courses" },
    { label: "Subscriptions Only", value: "subscriptions" },
  ]

  const statusOptions = [
    { label: "Active (Immediately Available)", value: "active" },
    { label: "Disabled (Draft)", value: "disabled" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onClose={() => onOpenChange(false)}
        className="max-w-[520px] p-6 max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader className="gap-1">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="size-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Ticket className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-zinc-900">
                Create Promo Coupon
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Generate a discount coupon code with custom rates and usage limits.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit as any)} className="flex flex-col gap-4 mt-2">
          {/* Code */}
          <UniInput
            control={form.control as any}
            name="code"
            label="Coupon Code"
            placeholder="e.g. SUMMER2026"
            required
          />

          {/* Row: Type & Value */}
          <div className="grid grid-cols-2 gap-3">
            <UniSelect
              control={form.control as any}
              name="discountType"
              label="Discount Type"
              options={discountTypeOptions}
              required
            />

            <UniInput
              control={form.control as any}
              name="discountValue"
              label="Discount Value"
              type="number"
              placeholder="e.g. 20"
              required
            />
          </div>

          {/* Applicable Scope */}
          <UniSelect
            control={form.control as any}
            name="applicableTo"
            label="Applicable Scope"
            options={scopeOptions}
            required
          />

          {/* Row: Usage Limit & Min Purchase */}
          <div className="grid grid-cols-2 gap-3">
            <UniInput
              control={form.control as any}
              name="usageLimit"
              label="Usage Limit (Optional)"
              type="number"
              placeholder="e.g. 100"
            />

            <UniInput
              control={form.control as any}
              name="minPurchaseAmount"
              label="Min Order Amount ($)"
              type="number"
              placeholder="e.g. 50"
            />
          </div>

          {/* Row: Expiry Date & Status */}
          <div className="grid grid-cols-2 gap-3">
            <UniInput
              control={form.control as any}
              name="endDate"
              label="Expiry Date (Optional)"
              type="date"
            />

            <UniSelect
              control={form.control as any}
              name="status"
              label="Initial Status"
              options={statusOptions}
              required
            />
          </div>

          <DialogFooter className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
              className="h-10 px-4 rounded-xl border-zinc-200/80 text-zinc-700 text-xs font-medium hover:bg-zinc-50 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 px-5 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-semibold shadow-2xs cursor-pointer flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
              <span>{isSubmitting ? "Generating..." : "Create Coupon"}</span>
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
    </Dialog>
  )
}

