"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Grade } from "../types/referenceData.types"
import { useAcademicStages } from "../hooks/useReferenceData"
import { Loader2 } from "lucide-react"

export interface GradeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  gradeToEdit?: Grade | null
  onSubmit: (data: {
    name: string
    academicStageId: string
    isActive: boolean
  }) => Promise<void> | void
  isSubmitting?: boolean
  defaultAcademicStageId?: string
}

export function GradeModal({
  open,
  onOpenChange,
  gradeToEdit,
  onSubmit,
  isSubmitting = false,
  defaultAcademicStageId = "",
}: GradeModalProps) {
  const isEdit = !!gradeToEdit
  const [name, setName] = React.useState("")
  const [academicStageId, setAcademicStageId] = React.useState("")
  const [isActive, setIsActive] = React.useState(true)
  const [errors, setErrors] = React.useState<{ name?: string; stage?: string }>({})

  const { data: stages = [], isLoading: stagesLoading } = useAcademicStages()

  React.useEffect(() => {
    if (open) {
      if (gradeToEdit) {
        setName(gradeToEdit.name || "")
        setAcademicStageId(gradeToEdit.academicStageId || "")
        setIsActive(gradeToEdit.isActive ?? true)
      } else {
        setName("")
        setAcademicStageId(defaultAcademicStageId || (stages[0]?.id ?? ""))
        setIsActive(true)
      }
      setErrors({})
    }
  }, [open, gradeToEdit, defaultAcademicStageId, stages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors: { name?: string; stage?: string } = {}

    if (!name.trim()) {
      nextErrors.name = "Grade name is required"
    }

    if (!academicStageId.trim()) {
      nextErrors.stage = "Academic Stage is required"
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setErrors({})
    await onSubmit({
      name: name.trim(),
      academicStageId,
      isActive,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-[460px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Grade" : "Add New Grade"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update grade information and linked academic stage."
              : "Create a new grade level and associate it with an academic stage."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-1">
          {/* Grade Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-700">
              Grade Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
              }}
              placeholder="e.g. Grade 1, Grade 10, Year 1..."
              className="h-10 px-3 rounded-xl border-zinc-200/80 bg-zinc-50/50 text-sm focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange transition-all"
            />
            {errors.name && (
              <span className="text-xs text-red-500 font-medium">{errors.name}</span>
            )}
          </div>

          {/* Academic Stage Select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-700">
              Academic Stage <span className="text-red-500">*</span>
            </label>
            <Select
              value={academicStageId}
              onValueChange={(val) => {
                setAcademicStageId(val || "")
                if (errors.stage) setErrors((prev) => ({ ...prev, stage: undefined }))
              }}
              disabled={stagesLoading}
            >
              <SelectTrigger className="!w-full h-10 px-3 rounded-xl border-zinc-200/80 bg-zinc-50/50 text-sm font-medium text-zinc-800 shadow-2xs hover:bg-zinc-100/50">
                <SelectValue
                  placeholder={
                    stagesLoading ? "Loading stages..." : "Select academic stage"
                  }
                >
                  {(val: string | null) => {
                    if (!val) {
                      return stagesLoading ? "Loading stages..." : "Select academic stage"
                    }
                    const stage = stages.find((s) => s.id === val)
                    return stage ? stage.name : val
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="z-[80] rounded-xl max-h-60 overflow-y-auto">
                {stages.map((stage) => (
                  <SelectItem key={stage.id} value={stage.id}>
                    {stage.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.stage && (
              <span className="text-xs text-red-500 font-medium">{errors.stage}</span>
            )}
          </div>

          {/* Active Status Switch */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/60 mt-1">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-zinc-800">
                Active Status
              </span>
              <span className="text-[11px] text-zinc-500">
                {isActive
                  ? "Grade is active and selectable by students"
                  : "Grade is hidden and inactive"}
              </span>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>

          {/* Footer Actions */}
          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="rounded-xl border-zinc-200 text-zinc-600 hover:bg-zinc-50 text-xs font-medium cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-white text-xs font-semibold px-4 cursor-pointer shadow-2xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  <span>Saving...</span>
                </>
              ) : isEdit ? (
                "Save Changes"
              ) : (
                "Add Grade"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
