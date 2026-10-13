"use client"

import * as React from "react"
import { X, Sparkles, UserCheck } from "lucide-react"
import { SubscriptionPlan, PaymentMethod } from "../../types/subscriptions.types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AssignSubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  onAssign: (data: any) => void
  plans: SubscriptionPlan[]
  initialPlan?: SubscriptionPlan | null
}

export function AssignSubscriptionModal({
  isOpen,
  onClose,
  onAssign,
  plans,
  initialPlan,
}: AssignSubscriptionModalProps) {
  const [studentName, setStudentName] = React.useState("")
  const [studentCode, setStudentCode] = React.useState("")
  const [studentGrade, setStudentGrade] = React.useState("Grade 11 - Secondary 2")
  const [parentName, setParentName] = React.useState("")
  const [parentPhone, setParentPhone] = React.useState("+20 ")
  const [selectedPlanId, setSelectedPlanId] = React.useState(
    initialPlan?.id || (plans[0]?.id ?? "")
  )
  const [billingCycle, setBillingCycle] = React.useState<"Monthly" | "Quarterly" | "Annual">("Monthly")
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>("Visa / Mastercard")
  const [autoRenew, setAutoRenew] = React.useState(true)

  React.useEffect(() => {
    if (initialPlan) {
      setSelectedPlanId(initialPlan.id)
    } else if (plans.length > 0 && !selectedPlanId) {
      setSelectedPlanId(plans[0].id)
    }
  }, [initialPlan, plans])

  if (!isOpen) return null

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans[0]

  const calculateAmount = () => {
    if (!selectedPlan) return 0
    if (billingCycle === "Annual") return selectedPlan.priceAnnually
    if (billingCycle === "Quarterly") return Math.round(selectedPlan.priceMonthly * 2.8)
    return selectedPlan.priceMonthly
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentName.trim() || !selectedPlan) return

    onAssign({
      studentName,
      studentCode: studentCode.trim() || `STU-${Math.floor(10000 + Math.random() * 90000)}`,
      studentGrade,
      parentName: parentName.trim() || `${studentName} Guardian`,
      parentPhone: parentPhone.trim() || "+20 100 000 0000",
      planId: selectedPlan.id,
      billingCycle,
      paymentMethod,
      amount: calculateAmount(),
      autoRenew,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-xl rounded-2xl border border-zinc-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
          <div>
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <UserCheck className="size-4.5 text-[#F59E0B]" />
              <span>Assign Subscription to Student</span>
            </h2>
            <p className="text-xs text-zinc-500">
              Enroll a student into an academic plan and record payment details.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-lg hover:bg-zinc-200/60 flex items-center justify-center text-zinc-500 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700">Student Full Name *</label>
              <Input
                required
                placeholder="e.g. Youssef Mohamed"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="rounded-xl h-10 text-xs border-zinc-200"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700">Student ID / Code</label>
              <Input
                placeholder="e.g. STU-00492 (auto if empty)"
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value)}
                className="rounded-xl h-10 text-xs border-zinc-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700">Grade & Stage</label>
              <select
                value={studentGrade}
                onChange={(e) => setStudentGrade(e.target.value)}
                className="rounded-xl h-10 px-3 text-xs border border-zinc-200 bg-white text-zinc-800"
              >
                <option value="Grade 10 - Secondary 1">Grade 10 - Secondary 1</option>
                <option value="Grade 11 - Secondary 2">Grade 11 - Secondary 2</option>
                <option value="Grade 12 - Thanawiya Amma">Grade 12 - Thanawiya Amma</option>
                <option value="Grade 9 - Prep 3">Grade 9 - Prep 3</option>
                <option value="Grade 8 - Prep 2">Grade 8 - Prep 2</option>
                <option value="Grade 7 - Prep 1">Grade 7 - Prep 1</option>
                <option value="Grade 6 - Primary 6">Grade 6 - Primary 6</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700">Parent / Guardian Name</label>
              <Input
                placeholder="e.g. Mohamed Ali"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className="rounded-xl h-10 text-xs border-zinc-200"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-700">Parent Contact Phone</label>
            <Input
              placeholder="+20 100 123 4567"
              value={parentPhone}
              onChange={(e) => setParentPhone(e.target.value)}
              className="rounded-xl h-10 text-xs border-zinc-200"
            />
          </div>

          {/* Plan Selection */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-zinc-100">
            <label className="text-xs font-semibold text-zinc-700">Choose Subscription Plan *</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {plans.map((p) => {
                const isSelected = p.id === selectedPlanId
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPlanId(p.id)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? "border-[#F59E0B] bg-amber-50/50 ring-2 ring-[#F59E0B]/20"
                        : "border-zinc-200 hover:bg-zinc-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-900">{p.name}</span>
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-100/60 px-1.5 py-0.5 rounded-full">
                        {p.tier}
                      </span>
                    </div>
                    <div className="mt-2 text-xs font-semibold text-zinc-700">
                      {p.priceMonthly} EGP / mo
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700">Billing Cycle</label>
              <select
                value={billingCycle}
                onChange={(e) => setBillingCycle(e.target.value as any)}
                className="rounded-xl h-10 px-3 text-xs border border-zinc-200 bg-white text-zinc-800"
              >
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly (3 Months)</option>
                <option value="Annual">Annual (1 Year - Save 20%)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700">Payment Gateway / Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="rounded-xl h-10 px-3 text-xs border border-zinc-200 bg-white text-zinc-800"
              >
                <option value="Visa / Mastercard">Visa / Mastercard</option>
                <option value="Vodafone Cash">Vodafone Cash</option>
                <option value="InstaPay">InstaPay</option>
                <option value="Fawry">Fawry</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash / Front Desk">Cash / Front Desk</option>
              </select>
            </div>
          </div>

          {/* Amount Calculation Summary */}
          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-center justify-between mt-1">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-zinc-700">Total Billed Today</span>
              <span className="text-[11px] text-zinc-400">
                Includes all fees and active platform permissions
              </span>
            </div>
            <div className="text-lg font-bold text-zinc-900">
              {calculateAmount().toLocaleString()} EGP
            </div>
          </div>

          {/* Auto renew toggle */}
          <label className="flex items-center gap-2 text-xs text-zinc-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoRenew}
              onChange={(e) => setAutoRenew(e.target.checked)}
              className="rounded accent-[#F59E0B] size-3.5"
            />
            <span>Enable automatic recurring renewal at period end</span>
          </label>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-zinc-100 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl h-9.5 text-xs text-zinc-600"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#F59E0B] hover:bg-amber-500 text-white font-medium rounded-xl h-9.5 px-5 text-xs shadow-2xs"
            >
              Confirm & Activate
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
