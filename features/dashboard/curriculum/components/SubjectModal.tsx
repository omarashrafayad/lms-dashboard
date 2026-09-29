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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  useAcademicStages,
  useEducationSystems,
  useGrades,
} from "@/features/dashboard/reference-data/hooks/useReferenceData"
import {
  CurriculumSubject,
  CreateSubjectPayload,
} from "../types/curriculum.types"
import { Loader2, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SubjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subjectToEdit?: CurriculumSubject | null
  onSubmit: (payload: CreateSubjectPayload) => Promise<void> | void
  isSubmitting?: boolean
}

const COMMON_SUBJECT_SUGGESTIONS = [
  "Mathematics",
  "Science",
  "English",
  "Arabic",
  "Physics",
  "Chemistry",
  "Biology",
  "Social Studies",
]

export function SubjectModal({
  open,
  onOpenChange,
  subjectToEdit,
  onSubmit,
  isSubmitting = false,
}: SubjectModalProps) {
  const isEdit = !!subjectToEdit

  // Reference data hooks
  const { data: stages = [], isLoading: stagesLoading } = useAcademicStages()
  const { data: systems = [], isLoading: systemsLoading } = useEducationSystems()

  // Form State
  const [name, setName] = React.useState<string>("")
  const [educationStageId, setEducationStageId] = React.useState<string>("")
  const [gradeId, setGradeId] = React.useState<string>("")
  const [educationSystemId, setEducationSystemId] = React.useState<string>("")
  const [term, setTerm] = React.useState<string>("Term 1")
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [status, setStatus] = React.useState<string>("")

  // Grades dynamically filtered by chosen education stage
  const { data: grades = [], isLoading: gradesLoading } = useGrades(
    educationStageId || undefined
  )

  // Reset or initialize state whenever modal opens or subjectToEdit changes
  React.useEffect(() => {
    if (open) {
      if (subjectToEdit) {
        setName(subjectToEdit.name || "")

        // Match stage
        const matchedStage = stages.find(
          (s) =>
            s.id === subjectToEdit.educationStageId ||
            s.name.toLowerCase() ===
              (subjectToEdit.educationStageName || subjectToEdit.stage || "").toLowerCase()
        )
        const stageIdVal = matchedStage?.id || subjectToEdit.educationStageId || ""
        setEducationStageId(stageIdVal)

        // Match system
        const matchedSystem = systems.find(
          (sys) =>
            sys.id === subjectToEdit.educationSystemId ||
            sys.name.toLowerCase() ===
              (subjectToEdit.educationSystemName || subjectToEdit.system || "").toLowerCase()
        )
        setEducationSystemId(
          matchedSystem?.id || subjectToEdit.educationSystemId || ""
        )

        // Grade ID
        setGradeId(subjectToEdit.gradeId || "")
        setTerm(subjectToEdit.term || "Term 1")

      } else {
        setName("")
        const defaultStageId = stages[0]?.id || ""
        setEducationStageId(defaultStageId)
        setGradeId("")
        const defaultSystemId = systems[0]?.id || ""
        setEducationSystemId(defaultSystemId)
        setTerm("Term 1")
        setStatus("")
      }
      setErrors({})
    }
  }, [open, subjectToEdit, stages, systems])

  // If in edit mode and grades load, match grade by name if gradeId was missing
  React.useEffect(() => {
    if (open && subjectToEdit && !gradeId && grades.length > 0) {
      const targetGradeName = (
        subjectToEdit.gradeName ||
        subjectToEdit.year ||
        ""
      ).toLowerCase()
      const matchedGrade = grades.find(
        (g) => g.name.toLowerCase() === targetGradeName
      )
      if (matchedGrade) {
        setGradeId(matchedGrade.id)
      }
    }
  }, [open, subjectToEdit, grades, gradeId])

  const handleStageChange = (newStageId: string) => {
    setEducationStageId(newStageId)
    setGradeId("") // Reset grade when stage changes
    if (errors.educationStageId || errors.gradeId) {
      setErrors((prev) => ({
        ...prev,
        educationStageId: "",
        gradeId: "",
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors: Record<string, string> = {}

    if (!name.trim()) {
      nextErrors.name = "Subject name is required"
    }
    if (!educationStageId) {
      nextErrors.educationStageId = "Please select an education stage"
    }
    if (!gradeId) {
      nextErrors.gradeId = "Please select an academic year / grade"
    }
    if (!educationSystemId) {
      nextErrors.educationSystemId = "Please select an education system"
    }
    if (!term) {
      nextErrors.term = "Please select a term"
    }
    if (!status) {
      nextErrors.status = "Please select a status"
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setErrors({})
    await onSubmit({
      name: name.trim(),
      educationStageId,
      gradeId,
      educationSystemId,
      term,
      status
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-[500px] p-6">
        <DialogHeader className="gap-1">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="size-9 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center shrink-0">
              <BookOpen className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-zinc-900">
                {isEdit ? "Edit Subject" : "Add Subject"}
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                {isEdit
                  ? "Update subject details and academic reference data classifications."
                  : "Create a new subject and configure its reference data structure."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          {/* Subject Name Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-700 flex items-center justify-between">
              <span>
                Subject Name <span className="text-red-500">*</span>
              </span>
              {errors.name && (
                <span className="text-[11px] font-normal text-red-500">
                  {errors.name}
                </span>
              )}
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) {
                  setErrors((prev) => ({ ...prev, name: "" }))
                }
              }}
              placeholder="e.g. Mathematics, Science, Arabic..."
              className={cn(
                "h-10 px-3 rounded-xl border-zinc-200/80 bg-white text-sm text-zinc-900 shadow-2xs focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange transition-all",
                errors.name && "border-red-400 focus-visible:ring-red-200"
              )}
            />

            {/* Quick Suggestion Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {COMMON_SUBJECT_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    setName(suggestion)
                    if (errors.name) {
                      setErrors((prev) => ({ ...prev, name: "" }))
                    }
                  }}
                  className={cn(
                    "text-[11px] px-2.5 py-0.5 rounded-md border transition-all cursor-pointer",
                    name === suggestion
                      ? "border-brand-orange bg-brand-orange/10 text-brand-orange font-semibold"
                      : "border-zinc-200/80 bg-zinc-50/60 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  )}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Education Stage & Academic Year (Grade) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Education Stage */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                Education Stage <span className="text-red-500">*</span>
              </label>
              <Select
                value={educationStageId}
                onValueChange={(val) => val && handleStageChange(val)}
                disabled={stagesLoading}
              >
                <SelectTrigger
                  className={cn(
                    "!w-full h-10 px-3 rounded-xl border-zinc-200/80 bg-white text-sm font-medium text-zinc-800 shadow-2xs hover:bg-zinc-50 transition-all",
                    errors.educationStageId && "border-red-400 ring-1 ring-red-300"
                  )}
                >
                  <SelectValue
                    placeholder={
                      stagesLoading ? "Loading stages..." : "Select stage"
                    }
                  >
                    {(val: string | null) => {
                      if (!val) {
                        return stagesLoading ? "Loading stages..." : "Select stage"
                      }
                      const st = stages.find((s) => s.id === val)
                      return st ? st.name : val
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {stages.map((st) => (
                    <SelectItem key={st.id} value={st.id}>
                      {st.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.educationStageId && (
                <span className="text-[11px] text-red-500">
                  {errors.educationStageId}
                </span>
              )}
            </div>

            {/* Academic Year / Grade */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                Academic Year / Grade <span className="text-red-500">*</span>
              </label>
              <Select
                value={gradeId}
                onValueChange={(val) => {
                  if (val) {
                    setGradeId(val)
                    if (errors.gradeId) {
                      setErrors((prev) => ({ ...prev, gradeId: "" }))
                    }
                  }
                }}
                disabled={!educationStageId || gradesLoading}
              >
                <SelectTrigger
                  className={cn(
                    "!w-full h-10 px-3 rounded-xl border-zinc-200/80 bg-white text-sm font-medium text-zinc-800 shadow-2xs hover:bg-zinc-50 transition-all",
                    errors.gradeId && "border-red-400 ring-1 ring-red-300"
                  )}
                >
                  <SelectValue
                    placeholder={
                      !educationStageId
                        ? "Select stage first"
                        : gradesLoading
                        ? "Loading grades..."
                        : grades.length === 0
                        ? "No grades found"
                        : "Select grade"
                    }
                  >
                    {(val: string | null) => {
                      if (!val) {
                        return !educationStageId
                          ? "Select stage first"
                          : gradesLoading
                          ? "Loading grades..."
                          : grades.length === 0
                          ? "No grades found"
                          : "Select grade"
                      }
                      const gr = grades.find((g) => g.id === val)
                      return gr ? gr.name : val
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {grades.map((gr) => (
                    <SelectItem key={gr.id} value={gr.id}>
                      {gr.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.gradeId && (
                <span className="text-[11px] text-red-500">{errors.gradeId}</span>
              )}
            </div>
          </div>

          {/* Education System & Term */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Education System */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                Education System <span className="text-red-500">*</span>
              </label>
              <Select
                value={educationSystemId}
                onValueChange={(val) => {
                  if (val) {
                    setEducationSystemId(val)
                    if (errors.educationSystemId) {
                      setErrors((prev) => ({ ...prev, educationSystemId: "" }))
                    }
                  }
                }}
                disabled={systemsLoading}
              >
                <SelectTrigger
                  className={cn(
                    "!w-full h-10 px-3 rounded-xl border-zinc-200/80 bg-white text-sm font-medium text-zinc-800 shadow-2xs hover:bg-zinc-50 transition-all",
                    errors.educationSystemId && "border-red-400 ring-1 ring-red-300"
                  )}
                >
                  <SelectValue
                    placeholder={
                      systemsLoading ? "Loading systems..." : "Select system"
                    }
                  >
                    {(val: string | null) => {
                      if (!val) {
                        return systemsLoading
                          ? "Loading systems..."
                          : "Select system"
                      }
                      const sys = systems.find((s) => s.id === val)
                      return sys ? sys.name : val
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {systems.map((sys) => (
                    <SelectItem key={sys.id} value={sys.id}>
                      {sys.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.educationSystemId && (
                <span className="text-[11px] text-red-500">
                  {errors.educationSystemId}
                </span>
              )}
            </div>

            {/* Term */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                Term <span className="text-red-500">*</span>
              </label>
              <Select
                value={term}
                onValueChange={(val) => {
                  if (val) {
                    setTerm(val)
                    if (errors.term) {
                      setErrors((prev) => ({ ...prev, term: "" }))
                    }
                  }
                }}
              >
                <SelectTrigger
                  className={cn(
                    "!w-full h-10 px-3 rounded-xl border-zinc-200/80 bg-white text-sm font-medium text-zinc-800 shadow-2xs hover:bg-zinc-50 transition-all",
                    errors.term && "border-red-400 ring-1 ring-red-300"
                  )}
                >
                  <SelectValue placeholder="Select term">
                    {(val: string | null) => val || "Select term"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Term 1">Term 1</SelectItem>
                  <SelectItem value="Term 2">Term 2</SelectItem>
                  <SelectItem value="Term 3">Term 3</SelectItem>
                  <SelectItem value="Full Year">Full Year</SelectItem>
                </SelectContent>
              </Select>
              {errors.term && (
                <span className="text-[11px] text-red-500">{errors.term}</span>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                Status <span className="text-red-500">*</span>
              </label>
              <Select
                value={status}
                onValueChange={(val) => {
                  if (val) {
                    setStatus(val)
                    if (errors.status) {
                      setErrors((prev) => ({ ...prev, status: "" }))
                    }
                  }
                }}
              >
                <SelectTrigger
                  className={cn(
                    "!w-full h-10 px-3 rounded-xl border-zinc-200/80 bg-white text-sm font-medium text-zinc-800 shadow-2xs hover:bg-zinc-50 transition-all",
                    errors.status && "border-red-400 ring-1 ring-red-300"
                  )}
                >
                  <SelectValue placeholder="Select status">
                    {(val: string | null) => val || "Select status"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <span className="text-[11px] text-red-500">{errors.status}</span>
              )}
            </div>

          {/* Footer actions */}
          <DialogFooter className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
              className="h-10 px-5 rounded-xl border-zinc-200/80 text-zinc-700 text-xs font-medium hover:bg-zinc-50 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 px-5 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-semibold shadow-2xs cursor-pointer flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
              <span>
                {isSubmitting
                  ? isEdit
                    ? "Saving Changes..."
                    : "Creating Subject..."
                  : isEdit
                  ? "Save Changes"
                  : "Create Subject"}
              </span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
