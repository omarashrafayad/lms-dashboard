"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { X, CreditCard, Sparkles } from "lucide-react"
import { RecordPaymentPayload } from "../../types/subscriptions.types"
import { recordPaymentSchema, RecordPaymentFormData } from "../../schema/subscription.schema"
import { Button } from "@/components/ui/button"
import { UniInput } from "@/components/shared/UniInput"
import { UniSelect } from "@/components/shared/UniSelect"
import { Form } from "@/components/ui/form"
import { useStudents } from "@/features/dashboard/student/hooks/useStudents"
import { useSubscriptionPlans } from "../../hooks/useSubscriptions"
import { toast } from "sonner"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"

interface RecordPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onRecord: (payload: RecordPaymentPayload) => void
}

const PAYMENT_METHODS = [
  { label: "VisaMastercard", value: "VisaMastercard" },
  { label: "InstaPay", value: "InstaPay" },
  { label: "VodafoneCash", value: "VodafoneCash" },
  { label: "Fawry", value: "Fawry" },
  { label: "Wallet", value: "Wallet" },
  { label: "BankTransfer", value: "BankTransfer" },
]

export function RecordPaymentModal({
  isOpen,
  onClose,
  onRecord,
}: RecordPaymentModalProps) {
  const { data: studentsResponse } = useStudents({ pageSize: 100 })
  const students = Array.isArray(studentsResponse) ? studentsResponse : studentsResponse?.items || []

  const { data: plans = [] } = useSubscriptionPlans()

  const studentOptions = React.useMemo(() => {
    return students.map((s) => ({
      label: `${s.fullName} (${s.email || "No Email"})`,
      value: s.id,
    }))
  }, [students])

  const planOptions = React.useMemo(() => {
    return [
      { label: "None / Custom Payment", value: "" },
      ...plans.map((p) => ({
        label: `${p.name} (${p.monthlyPrice ?? p.priceMonthly ?? 0} EGP)`,
        value: p.id,
      })),
    ]
  }, [plans])

  const form = useForm({
    resolver: zodResolver(recordPaymentSchema),
    defaultValues: {
      studentId: "",
      studentName: "",
      planId: "",
      amount: 750,
      discountAmount: 0,
      couponCode: "",
      method: "Visa / Mastercard",
      gatewayReference: "",
      itemDescription: "Subscription Payment",
    },
  })

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        studentId: "",
        studentName: "",
        planId: "",
        amount: 750,
        discountAmount: 0,
        couponCode: "",
        method: "Visa / Mastercard",
        gatewayReference: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
        itemDescription: "Subscription Payment",
      })
    }
  }, [isOpen, form])

  if (!isOpen) return null

  const handleStudentSelect = (selectedId: string) => {
    const student = students.find((s) => s.id === selectedId)
    if (student) {
      form.setValue("studentName", student.fullName)
    }
  }

  const handlePlanSelect = (selectedPlanId: string) => {
    if (!selectedPlanId) return
    const plan = plans.find((p) => p.id === selectedPlanId)
    if (plan) {
      form.setValue("itemDescription", `${plan.name} Subscription`)
      form.setValue("amount", plan.monthlyPrice ?? plan.priceMonthly ?? 750)
    }
  }

  const onSubmit = (data: RecordPaymentFormData) => {
    try {
      const selectedStudent = students.find((s) => s.id === data.studentId)
      onRecord({
        ...data,
        studentName: data.studentName || selectedStudent?.fullName || "Student",
        studentGrade: selectedStudent?.grade || "Secondary",
        payerName: data.studentName || selectedStudent?.fullName || "Student",
        itemKind: "Subscription",
      })
      onClose()
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-xl rounded-2xl border border-zinc-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CreditCard className="size-4.5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900">
                Record New Payment
              </h2>
              <p className="text-xs text-zinc-500">
                Register an incoming student payment or manual transaction.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-lg hover:bg-zinc-200/60 flex items-center justify-center text-zinc-500 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form Body */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit as any)}
            className="flex-1 overflow-y-auto p-6 flex flex-col gap-4.5"
          >
            <UniSelect
              control={form.control as any}
              name="studentId"
              label="Select Student"
              placeholder="Search or select student"
              options={studentOptions}
              onChangeCallback={handleStudentSelect}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UniSelect
                control={form.control as any}
                name="planId"
                label="Associated Plan (Optional)"
                placeholder="Select plan"
                options={planOptions}
                onChangeCallback={handlePlanSelect}
              />

              <UniSelect
                control={form.control as any}
                name="method"
                label="Payment Method"
                placeholder="Select method"
                options={PAYMENT_METHODS}
                required
              />
            </div>

            <UniInput
              control={form.control as any}
              name="itemDescription"
              label="Item / Payment Description"
              placeholder="e.g. Standard Scholar Plan - Term 1"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UniInput
                control={form.control as any}
                name="amount"
                label="Amount (EGP)"
                type="number"
                placeholder="750"
                required
              />

              <UniInput
                control={form.control as any}
                name="discountAmount"
                label="Discount Amount (EGP)"
                type="number"
                placeholder="0"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UniInput
                control={form.control as any}
                name="gatewayReference"
                label="Reference / Receipt #"
                placeholder="e.g. REF-123456"
              />

              <UniInput
                control={form.control as any}
                name="couponCode"
                label="Coupon Code (Optional)"
                placeholder="e.g. SAVE20"
              />
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-zinc-100 mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="h-10 px-4 rounded-xl text-xs text-zinc-600 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-10 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-2xs cursor-pointer active:scale-[0.98]"
              >
                Record Payment
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

