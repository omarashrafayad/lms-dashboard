"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { X, Plus, Trash2, Layers, Loader2 } from "lucide-react"
import { SubscriptionPlan, CreatePlanPayload } from "../../types/subscriptions.types"
import { createPlanSchema, CreatePlanFormData } from "../../schema/subscription.schema"
import { Button } from "@/components/ui/button"
import { UniInput } from "@/components/shared/UniInput"
import { UniSelect } from "@/components/shared/UniSelect"
import { Form } from "@/components/ui/form"
import { toast } from "sonner"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"

interface CreatePlanModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (planData: CreatePlanPayload) => Promise<void> | void
  initialPlan?: SubscriptionPlan | null
}

const TIER_OPTIONS = [
  { label: "Starter", value: "Starter" },
  { label: "Standard", value: "Standard" },
  { label: "Premium", value: "Premium" },
  { label: "VIP", value: "VIP" },
]

export function CreatePlanModal({
  isOpen,
  onClose,
  onSave,
  initialPlan,
}: CreatePlanModalProps) {
  const [featuresList, setFeaturesList] = React.useState<string[]>([])
  const [newFeatureText, setNewFeatureText] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm({
    resolver: zodResolver(createPlanSchema),
    defaultValues: {
      name: "",
      tier: "Standard",
      tagline: "",
      targetGradeLevel: "All Grades",
      gradeScope: "All Stages",
      monthlyPrice: 750,
      annualPrice: 7200,
      badgeLabel: "",
      liveSessionsPerMonth: 8,
      examAccess: "Unlimited",
      supportLevel: "Priority",
      features: [] as string[],
    },
  })

  React.useEffect(() => {
    if (initialPlan) {
      form.reset({
        name: initialPlan.name || "",
        tier: initialPlan.tier || "Standard",
        tagline: initialPlan.tagline || "",
        targetGradeLevel: initialPlan.targetGradeLevel || initialPlan.targetGrade || "All Grades",
        gradeScope: initialPlan.gradeScope || "All Stages",
        monthlyPrice: initialPlan.monthlyPrice ?? initialPlan.priceMonthly ?? 750,
        annualPrice: initialPlan.annualPrice ?? initialPlan.priceAnnually ?? 7200,
        badgeLabel: initialPlan.badgeLabel || initialPlan.badge || "",
        liveSessionsPerMonth:
          initialPlan.liveSessionsPerMonth ??
          initialPlan.limits?.liveSessionsPerMonth ??
          8,
        examAccess: initialPlan.examAccess || "Unlimited",
        supportLevel: initialPlan.supportLevel || "Priority",
        features: initialPlan.features?.map((f) => f.label || f.text || "") || [],
      })
      const feats = initialPlan.features
        ?.map((f) => f.label || f.text || "")
        .filter(Boolean) as string[]
      setFeaturesList(feats && feats.length > 0 ? feats : [
        "All Enrolled Term Subjects Included",
        "8 Group Live Sessions / mo",
        "Unlimited Recorded Video Library & Notes",
      ])
    } else {
      form.reset({
        name: "",
        tier: "Standard",
        tagline: "",
        targetGradeLevel: "All Grades",
        gradeScope: "All Stages",
        monthlyPrice: 750,
        annualPrice: 7200,
        badgeLabel: "",
        liveSessionsPerMonth: 8,
        examAccess: "Unlimited",
        supportLevel: "Priority",
        features: [],
      })
      setFeaturesList([
        "All Enrolled Term Subjects Included",
        "8 Group Live Sessions / mo",
        "Unlimited Recorded Video Library & Notes",
      ])
    }
  }, [initialPlan, isOpen, form])

  if (!isOpen) return null

  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return
    setFeaturesList((prev) => [...prev, newFeatureText.trim()])
    setNewFeatureText("")
  }

  const handleRemoveFeature = (index: number) => {
    setFeaturesList((prev) => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: CreatePlanFormData) => {
    try {
      setIsSubmitting(true)
      await onSave({
        ...data,
        features: featuresList,
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
      <div className="bg-white w-full max-w-2xl rounded-2xl border border-zinc-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-amber-100 text-[#D97706] flex items-center justify-center">
              <Layers className="size-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900">
                {initialPlan ? "Edit Subscription Plan" : "Create New Subscription Plan"}
              </h2>
              <p className="text-xs text-zinc-500">
                Set pricing, target grades, limits, and learning perks for students.
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UniInput
                control={form.control as any}
                name="name"
                label="Plan Name"
                placeholder="e.g. Standard Scholar Plan"
                required
              />

              <UniSelect
                control={form.control as any}
                name="tier"
                label="Tier"
                options={TIER_OPTIONS}
                placeholder="Select tier"
                required
              />
            </div>

            <UniInput
              control={form.control as any}
              name="tagline"
              label="Tagline / Short Pitch"
              placeholder="e.g. All-around academic package for term mastery"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <UniInput
                control={form.control as any}
                name="monthlyPrice"
                label="Monthly Price (EGP)"
                type="number"
                placeholder="750"
                required
              />

              <UniInput
                control={form.control as any}
                name="annualPrice"
                label="Annual Price (EGP)"
                type="number"
                placeholder="7200"
                required
              />

              <UniInput
                control={form.control as any}
                name="badgeLabel"
                label="Badge Label (Optional)"
                placeholder="e.g. Most Popular"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UniInput
                control={form.control as any}
                name="targetGradeLevel"
                label="Target Grade Level"
                placeholder="e.g. Secondary 1 - 3"
              />

              <UniInput
                control={form.control as any}
                name="liveSessionsPerMonth"
                label="Live Sessions / Month"
                type="number"
                placeholder="8"
              />
            </div>
            {
              !initialPlan && (
            <div className="flex flex-col gap-2 pt-2 border-t border-zinc-100">
              <label className="text-xs font-semibold text-zinc-700">
                Plan Perks & Included Features
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. Direct Teacher Chat Access"
                  value={newFeatureText}
                  onChange={(e) => setNewFeatureText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddFeature()
                    }
                  }}
                  className="flex-1 h-9.5 px-3 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-amber-500"
                />
                <Button
                  type="button"
                  onClick={handleAddFeature}
                  variant="outline"
                  className="h-9.5 px-3 rounded-xl text-xs gap-1 cursor-pointer shrink-0"
                >
                  <Plus className="size-3.5" />
                  <span>Add</span>
                </Button>
              </div>

              <div className="flex flex-col gap-1.5 mt-2 max-h-44 overflow-y-auto">
                {featuresList.map((f, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs text-zinc-800"
                  >
                    <span>{f}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="size-6 text-zinc-400 hover:text-rose-600 flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
              )

            }

            {/* Included Features List Builder */}

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
                <span>{initialPlan ? "Save Changes" : "Create Plan"}</span>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
