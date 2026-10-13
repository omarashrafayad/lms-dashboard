"use client"

import * as React from "react"
import {
  Check,
  X,
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Users,
  Video,
  FileCheck,
  Headphones,
} from "lucide-react"
import { SubscriptionPlan } from "../../types/subscriptions.types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PlansGridViewProps {
  plans: SubscriptionPlan[]
  onAddNewPlan: () => void
  onEditPlan: (plan: SubscriptionPlan) => void
  onDeletePlan: (id: string) => void
  onAssignPlan: (plan: SubscriptionPlan) => void
}

export function PlansGridView({
  plans,
  onAddNewPlan,
  onEditPlan,
  onDeletePlan,
  onAssignPlan,
}: PlansGridViewProps) {
  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "annually">("monthly")

  return (
    <div className="flex flex-col gap-6">
      {/* Top Controls: Billing Interval Toggle + Add Plan Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Billing Cycle:
          </span>
          <div className="inline-flex items-center p-1 bg-zinc-100 rounded-xl border border-zinc-200/60">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
                billingCycle === "monthly"
                  ? "bg-white text-zinc-900 font-semibold shadow-2xs"
                  : "text-zinc-500 hover:text-zinc-900"
              )}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("annually")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
                billingCycle === "annually"
                  ? "bg-white text-zinc-900 font-semibold shadow-2xs"
                  : "text-zinc-500 hover:text-zinc-900"
              )}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={onAddNewPlan}
            className="bg-[#F59E0B] hover:bg-amber-500 text-white font-medium rounded-xl h-9.5 px-4 gap-2 text-xs shadow-2xs cursor-pointer transition-all active:scale-[0.98]"
          >
            <Plus className="size-4 stroke-[2.5]" />
            <span>Create New Plan</span>
          </Button>
        </div>
      </div>

      {/* Grid of Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {plans.map((plan) => {
          const isAnnual = billingCycle === "annually"
          const price = isAnnual ? plan.priceAnnually : plan.priceMonthly
          const intervalLabel = isAnnual ? "/ year" : "/ month"
          const isPopular = plan.isPopular || plan.tier === "Standard"

          return (
            <div
              key={plan.id}
              className={cn(
                "bg-white rounded-2xl border p-6 flex flex-col justify-between transition-all duration-200 relative group hover:shadow-md",
                isPopular
                  ? "border-[#FFB543] ring-2 ring-[#FFB543]/20 shadow-xs"
                  : "border-zinc-200/80 shadow-2xs"
              )}
            >
              {/* Badge if Popular or Custom */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#F59E0B] text-white shadow-xs">
                    <Sparkles className="size-3" />
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Top Details */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    {plan.targetGrade}
                  </span>
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      title="Edit Plan"
                      onClick={() => onEditPlan(plan)}
                      className="size-7 rounded-lg hover:bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-zinc-800 transition-colors"
                    >
                      <Edit2 className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Delete Plan"
                      onClick={() => onDeletePlan(plan.id)}
                      className="size-7 rounded-lg hover:bg-rose-50 flex items-center justify-center text-zinc-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-zinc-900 tracking-tight">
                  {plan.name}
                </h3>
                <p className="text-xs text-zinc-500 line-clamp-2 mt-1 min-h-[32px]">
                  {plan.tagline}
                </p>

                {/* Price Display */}
                <div className="mt-4 pt-4 border-t border-zinc-100 flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold text-zinc-900 tracking-tight">
                    {price.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-zinc-600">
                    {plan.currency}
                  </span>
                  <span className="text-xs text-zinc-400 font-normal">
                    {intervalLabel}
                  </span>
                </div>

                {/* Metrics Pill */}
                <div className="flex items-center justify-between mt-3 py-2 px-3 rounded-xl bg-zinc-50 border border-zinc-100 text-xs">
                  <div className="flex items-center gap-1.5 text-zinc-600">
                    <Users className="size-3.5 text-zinc-400" />
                    <span className="font-semibold text-zinc-900">
                      {plan.subscribersCount}
                    </span>{" "}
                    subscribers
                  </div>
                  <span className="text-[11px] text-zinc-500 font-medium">
                    {plan.totalRevenueFormatted}
                  </span>
                </div>

                {/* Limits summary row */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-zinc-100 text-[11px]">
                  <div className="flex flex-col items-center text-center p-1.5 rounded-lg bg-zinc-50/70">
                    <Video className="size-3 text-zinc-400 mb-0.5" />
                    <span className="font-bold text-zinc-800">
                      {plan.limits.liveSessionsPerMonth}x
                    </span>
                    <span className="text-[10px] text-zinc-400">Live / mo</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-1.5 rounded-lg bg-zinc-50/70">
                    <FileCheck className="size-3 text-zinc-400 mb-0.5" />
                    <span className="font-bold text-zinc-800">
                      {plan.limits.practiceExamsAccess}
                    </span>
                    <span className="text-[10px] text-zinc-400">Exams</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-1.5 rounded-lg bg-zinc-50/70">
                    <Headphones className="size-3 text-zinc-400 mb-0.5" />
                    <span className="font-bold text-zinc-800">
                      {plan.limits.supportPriority}
                    </span>
                    <span className="text-[10px] text-zinc-400">Support</span>
                  </div>
                </div>

                {/* Features List */}
                <div className="mt-4 pt-3 border-t border-zinc-100 flex flex-col gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                    What's Included:
                  </span>
                  {plan.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-xs leading-snug"
                    >
                      {feature.included ? (
                        <div className="size-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="size-2.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="size-4 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center shrink-0 mt-0.5">
                          <X className="size-2.5 stroke-[3]" />
                        </div>
                      )}
                      <span
                        className={cn(
                          feature.included ? "text-zinc-700" : "text-zinc-400 line-through",
                          feature.highlight ? "font-semibold text-zinc-900" : ""
                        )}
                      >
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="mt-6 pt-4 border-t border-zinc-100 flex flex-col gap-2">
                <Button
                  onClick={() => onAssignPlan(plan)}
                  className={cn(
                    "w-full rounded-xl text-xs font-semibold h-9.5 transition-all cursor-pointer shadow-2xs",
                    isPopular
                      ? "bg-[#F59E0B] hover:bg-amber-500 text-white"
                      : "bg-zinc-900 hover:bg-zinc-800 text-white"
                  )}
                >
                  Assign to Student
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
