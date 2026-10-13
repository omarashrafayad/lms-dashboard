"use client"

import * as React from "react"
import { X, Plus, Trash2 } from "lucide-react"
import { SubscriptionPlan, PlanTier, PlanFeature } from "../../types/subscriptions.types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface CreatePlanModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (planData: any) => void
  initialPlan?: SubscriptionPlan | null
}

export function CreatePlanModal({
  isOpen,
  onClose,
  onSave,
  initialPlan,
}: CreatePlanModalProps) {
  const [name, setName] = React.useState("")
  const [tagline, setTagline] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [tier, setTier] = React.useState<PlanTier>("Standard")
  const [badge, setBadge] = React.useState("")
  const [priceMonthly, setPriceMonthly] = React.useState<number>(750)
  const [priceAnnually, setPriceAnnually] = React.useState<number>(7200)
  const [targetGrade, setTargetGrade] = React.useState("All Grades")
  const [liveSessions, setLiveSessions] = React.useState<number>(8)
  const [features, setFeatures] = React.useState<PlanFeature[]>([
    { text: "All Enrolled Term Subjects Included", included: true, highlight: true },
    { text: "8 Group Live Sessions / mo", included: true },
    { text: "Unlimited Recorded Video Library & Notes", included: true },
    { text: "Unlimited Practice Exams & Question Bank", included: true },
    { text: "Bi-Weekly Parent Reports", included: true },
  ])
  const [newFeatureText, setNewFeatureText] = React.useState("")

  React.useEffect(() => {
    if (initialPlan) {
      setName(initialPlan.name)
      setTagline(initialPlan.tagline)
      setDescription(initialPlan.description)
      setTier(initialPlan.tier)
      setBadge(initialPlan.badge || "")
      setPriceMonthly(initialPlan.priceMonthly)
      setPriceAnnually(initialPlan.priceAnnually)
      setTargetGrade(initialPlan.targetGrade)
      setLiveSessions(initialPlan.limits.liveSessionsPerMonth)
      setFeatures(initialPlan.features)
    } else {
      setName("")
      setTagline("")
      setDescription("")
      setTier("Standard")
      setBadge("")
      setPriceMonthly(750)
      setPriceAnnually(7200)
      setTargetGrade("All Grades")
      setLiveSessions(8)
      setFeatures([
        { text: "All Enrolled Term Subjects Included", included: true, highlight: true },
        { text: "8 Group Live Sessions / mo", included: true },
        { text: "Unlimited Recorded Video Library & Notes", included: true },
      ])
    }
  }, [initialPlan, isOpen])

  if (!isOpen) return null

  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return
    setFeatures((prev) => [
      ...prev,
      { text: newFeatureText.trim(), included: true, highlight: false },
    ])
    setNewFeatureText("")
  }

  const handleRemoveFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index))
  }

  const handleToggleFeatureIncluded = (index: number) => {
    setFeatures((prev) =>
      prev.map((f, i) => (i === index ? { ...f, included: !f.included } : f))
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    onSave({
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      tagline,
      description,
      tier,
      badge: badge.trim() || undefined,
      priceMonthly: Number(priceMonthly),
      priceAnnually: Number(priceAnnually),
      currency: "EGP",
      billingCycle: "monthly",
      targetGrade,
      features,
      limits: {
        liveSessionsPerMonth: Number(liveSessions),
        recordedCoursesAccess: "Unlimited",
        practiceExamsAccess: "Unlimited",
        supportPriority: "Priority",
        parentReports: true,
      },
      isPopular: badge.toLowerCase().includes("popular") || tier === "Standard",
      isActive: true,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl border border-zinc-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
          <div>
            <h2 className="text-base font-bold text-zinc-900">
              {initialPlan ? "Edit Subscription Plan" : "Create New Subscription Plan"}
            </h2>
            <p className="text-xs text-zinc-500">
              Set pricing, target grades, limits, and learning perks for students.
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700">Plan Name *</label>
              <Input
                required
                placeholder="e.g. Standard Scholar Plan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl h-10 text-xs border-zinc-200"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700">Tier</label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as PlanTier)}
                className="rounded-xl h-10 px-3 text-xs border border-zinc-200 bg-white text-zinc-800"
              >
                <option value="Starter">Starter</option>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-700">Tagline / Short Pitch</label>
            <Input
              placeholder="e.g. All-around academic package for term mastery"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="rounded-xl h-10 text-xs border-zinc-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700">Monthly Price (EGP) *</label>
              <Input
                type="number"
                required
                min="0"
                value={priceMonthly}
                onChange={(e) => setPriceMonthly(Number(e.target.value))}
                className="rounded-xl h-10 text-xs border-zinc-200"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700">Annual Price (EGP) *</label>
              <Input
                type="number"
                required
                min="0"
                value={priceAnnually}
                onChange={(e) => setPriceAnnually(Number(e.target.value))}
                className="rounded-xl h-10 text-xs border-zinc-200"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700">Badge Label (Optional)</label>
              <Input
                placeholder="e.g. Most Popular"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="rounded-xl h-10 text-xs border-zinc-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700">Target Grade Level</label>
              <Input
                placeholder="e.g. Grades 7-12"
                value={targetGrade}
                onChange={(e) => setTargetGrade(e.target.value)}
                className="rounded-xl h-10 text-xs border-zinc-200"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700">Live Sessions / Month</label>
              <Input
                type="number"
                min="0"
                value={liveSessions}
                onChange={(e) => setLiveSessions(Number(e.target.value))}
                className="rounded-xl h-10 text-xs border-zinc-200"
              />
            </div>
          </div>

          {/* Features Builder */}
          <div className="flex flex-col gap-2 pt-2 border-t border-zinc-100">
            <label className="text-xs font-semibold text-zinc-700">Features Checklist</label>

            <div className="flex items-center gap-2">
              <Input
                placeholder="Add feature (e.g. 1-on-1 Office Hours)"
                value={newFeatureText}
                onChange={(e) => setNewFeatureText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddFeature()
                  }
                }}
                className="rounded-xl h-9 text-xs border-zinc-200"
              />
              <Button
                type="button"
                onClick={handleAddFeature}
                className="h-9 px-3 rounded-xl bg-zinc-900 text-white text-xs cursor-pointer"
              >
                <Plus className="size-3.5" />
                <span>Add</span>
              </Button>
            </div>

            <div className="flex flex-col gap-1.5 mt-2 max-h-40 overflow-y-auto">
              {features.map((feat, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded-xl bg-zinc-50 border border-zinc-100 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={feat.included}
                      onChange={() => handleToggleFeatureIncluded(i)}
                      className="rounded accent-[#F59E0B] size-3.5"
                    />
                    <span className={feat.included ? "text-zinc-800" : "text-zinc-400 line-through"}>
                      {feat.text}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(i)}
                    className="text-zinc-400 hover:text-rose-600 transition-colors p-1"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
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
              {initialPlan ? "Save Changes" : "Create Plan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
