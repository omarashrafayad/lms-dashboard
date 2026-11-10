"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { X, UserCheck, Loader2 } from "lucide-react"
import { SubscriptionPlan, AssignPlanPayload } from "../../types/subscriptions.types"
import { assignPlanSchema, AssignPlanFormData } from "../../schema/subscription.schema"
import { Button } from "@/components/ui/button"
import { UniInput } from "@/components/shared/UniInput"
import { UniSelect } from "@/components/shared/UniSelect"
import { Form } from "@/components/ui/form"
import { useStudents } from "@/features/dashboard/student/hooks/useStudents"
import { toast } from "sonner"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"

interface AssignSubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  onAssign: (data: AssignPlanPayload) => Promise<void> | void
  plans: SubscriptionPlan[]
  initialPlan?: SubscriptionPlan | null
}

const BILLING_CYCLE_OPTIONS = [
  { label: "Monthly", value: "Monthly" },
  { label: "Annual", value: "Annual" },
]

export function AssignSubscriptionModal({
  isOpen,
  onClose,
  onAssign,
  plans,
  initialPlan,
}: AssignSubscriptionModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const { data: studentsResponse } = useStudents({ pageSize: 100 })
  const students = Array.isArray(studentsResponse) ? studentsResponse : studentsResponse?.items || []

  const studentOptions = React.useMemo(() => {
    return students.map((s) => ({
      label: `${s.fullName} (${s.email || "No Email"})`,
      value: s.id,
    }))
  }, [students])

  const planOptions = React.useMemo(() => {
    return plans.map((p) => ({
      label: `${p.name} (${p.monthlyPrice ?? p.priceMonthly ?? 0} EGP/mo)`,
      value: p.id,
    }))
  }, [plans])

  const form = useForm({
    resolver: zodResolver(assignPlanSchema),
    defaultValues: {
      studentId: "",
      studentName: "",
      studentGrade: "Secondary 1",
      planId: initialPlan?.id || (plans[0]?.id ?? ""),
      billingCycle: "Monthly",
      // parentId: "",
      parentName: "",
      parentPhone: "",
      autoRenew: true,
      notes: "",
    },
  })

  React.useEffect(() => {
    if (initialPlan) {
      form.setValue("planId", initialPlan.id)
    } else if (plans.length > 0 && !form.getValues("planId")) {
      form.setValue("planId", plans[0].id)
    }
  }, [initialPlan, plans, form])

  if (!isOpen) return null

  const handleStudentSelect = (selectedId: string) => {
    const student = students.find((s) => s.id === selectedId)
    if (student) {
      form.setValue("studentName", student.fullName)
      form.setValue("studentGrade", student.grade || "Secondary 1")
      if (student.parents && student.parents.length > 0) {
        form.setValue("parentName", student.parents[0].fullName)
        form.setValue("parentPhone", student.parents[0].phoneNumber)
      }
    }
  }

  const onSubmit = async (data: AssignPlanFormData) => {
    try {
      setIsSubmitting(true)
      const selectedStudent = students.find((s) => s.id === data.studentId)
      const studentName = data.studentName || selectedStudent?.fullName || "Student"
      await onAssign({
        ...data,
        studentName,
        studentGrade: data.studentGrade || selectedStudent?.grade || "Secondary 1",
      })
      onClose()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-xl rounded-2xl border border-zinc-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-amber-100 text-[#D97706] flex items-center justify-center">
              <UserCheck className="size-4.5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900">
                Assign Subscription to Student
              </h2>
              <p className="text-xs text-zinc-500">
                Enroll a student into an academic plan and record payment details.
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
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UniSelect
                control={form.control as any}
                name="planId"
                label="Subscription Plan"
                placeholder="Select plan"
                options={planOptions}
                required
              />

              <UniSelect
                control={form.control as any}
                name="billingCycle"
                label="Billing Cycle"
                placeholder="Select cycle"
                options={BILLING_CYCLE_OPTIONS}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UniInput
                control={form.control as any}
                name="parentName"
                label="Parent Name (Optional)"
                placeholder="Guardian Full Name"
              />

              <UniInput
                control={form.control as any}
                name="parentPhone"
                label="Parent Phone"
                placeholder="+20 100 000 0000"
              />
            </div>

            <UniInput
              control={form.control as any}
              name="notes"
              label="Administrative Notes"
              placeholder="e.g. Paid in cash at reception"
            />

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-zinc-100 mt-2">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={onClose}
                className="h-10 px-4 rounded-xl text-xs text-zinc-600 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-10 px-5 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-white font-medium text-xs shadow-2xs cursor-pointer active:scale-[0.98] disabled:opacity-60 flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="size-4 animate-spin text-white" />}
                <span>Assign Plan</span>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
