"use client"

import * as React from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import {
  useAcademicStages,
  useEducationSystems,
  useGrades,
} from "@/features/dashboard/reference-data/hooks/useReferenceData"
import {
  CurriculumSubject,
  CreateSubjectPayload,
} from "../types/curriculum.types"
import {
  subjectSchema,
  SubjectFormData,
} from "../schema/curriculum.schema"
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

  // React Hook Form with Zod validation
  const form = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: "",
      educationStageId: "",
      gradeId: "",
      educationSystemId: "",
      term: "Term 1",
      status: "Active",
    },
    mode: "onTouched",
  })

  // Watch selected stage ID to dynamically load and filter grades
  const selectedStageId = useWatch({
    control: form.control,
    name: "educationStageId",
  })

  const watchedName = useWatch({
    control: form.control,
    name: "name",
  })

  const { data: grades = [], isLoading: gradesLoading } = useGrades(
    selectedStageId || undefined
  )

  const stageOptions = React.useMemo(() => {
    return stages.map((st) => ({
      label: st.name,
      value: st.id,
    }))
  }, [stages])

  const systemOptions = React.useMemo(() => {
    return systems.map((sys) => ({
      label: sys.name,
      value: sys.id,
    }))
  }, [systems])

  const gradeOptions = React.useMemo(() => {
    return grades.map((gr) => ({
      label: gr.name,
      value: gr.id,
    }))
  }, [grades])

  // Reset or initialize state whenever modal opens or subjectToEdit changes
  React.useEffect(() => {
    if (open) {
      if (subjectToEdit) {
        // Match stage
        const matchedStage = stages.find(
          (s) =>
            s.id === subjectToEdit.educationStageId ||
            s.name.toLowerCase() ===
              (subjectToEdit.educationStageName || subjectToEdit.stage || "").toLowerCase()
        )
        const stageIdVal = matchedStage?.id || subjectToEdit.educationStageId || ""

        // Match system
        const matchedSystem = systems.find(
          (sys) =>
            sys.id === subjectToEdit.educationSystemId ||
            sys.name.toLowerCase() ===
              (subjectToEdit.educationSystemName || subjectToEdit.system || "").toLowerCase()
        )
        const systemIdVal = matchedSystem?.id || subjectToEdit.educationSystemId || ""

        form.reset({
          name: subjectToEdit.name || "",
          educationStageId: stageIdVal,
          gradeId: subjectToEdit.gradeId || "",
          educationSystemId: systemIdVal,
          term: subjectToEdit.term || "Term 1",
          status: subjectToEdit.status || "Active",
        })
      } else {
        form.reset({
          name: "",
          educationStageId: stages[0]?.id || "",
          gradeId: "",
          educationSystemId: systems[0]?.id || "",
          term: "Term 1",
          status: "Active",
        })
      }
    }
  }, [open, subjectToEdit, stages, systems, form])

  // If in edit mode and grades load, match grade by name if gradeId was missing
  React.useEffect(() => {
    if (open && subjectToEdit && !form.getValues("gradeId") && grades.length > 0) {
      const targetGradeName = (
        subjectToEdit.gradeName ||
        subjectToEdit.year ||
        ""
      ).toLowerCase()
      const matchedGrade = grades.find(
        (g) => g.name.toLowerCase() === targetGradeName
      )
      if (matchedGrade) {
        form.setValue("gradeId", matchedGrade.id, { shouldValidate: true })
      }
    }
  }, [open, subjectToEdit, grades, form])

  const handleFormSubmit = async (values: SubjectFormData) => {
    await onSubmit({
      name: values.name.trim(),
      educationStageId: values.educationStageId,
      gradeId: values.gradeId,
      educationSystemId: values.educationSystemId,
      term: values.term,
      status: values.status,
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

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="flex flex-col gap-4 mt-2"
          >
            {/* Subject Name Input with UniInput */}
            <div className="flex flex-col gap-1.5">
              <UniInput
                control={form.control}
                name="name"
                label="Subject Name"
                placeholder="e.g. Mathematics, Science, Arabic..."
                required
                inputClassName="h-10 text-xs rounded-xl"
                labelClassName="text-xs font-semibold text-zinc-700"
              />

              {/* Quick Suggestion Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {COMMON_SUBJECT_SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => {
                      form.setValue("name", suggestion, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }}
                    className={cn(
                      "text-[11px] px-2.5 py-0.5 rounded-md border transition-all cursor-pointer",
                      watchedName === suggestion
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
              <UniSelect
                control={form.control}
                name="educationStageId"
                label="Education Stage"
                placeholder={stagesLoading ? "Loading stages..." : "Select stage"}
                options={stageOptions}
                isLoading={stagesLoading}
                required
                labelClassName="text-xs font-semibold text-zinc-700"
                onChangeCallback={() => {
                  form.setValue("gradeId", "", {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }}
              />

              <UniSelect
                control={form.control}
                name="gradeId"
                label="Academic Year / Grade"
                placeholder={
                  !selectedStageId
                    ? "Select stage first"
                    : gradesLoading
                    ? "Loading grades..."
                    : gradeOptions.length === 0
                    ? "No grades found"
                    : "Select grade"
                }
                options={gradeOptions}
                disabled={!selectedStageId || gradesLoading}
                isLoading={gradesLoading}
                required
                labelClassName="text-xs font-semibold text-zinc-700"
              />
            </div>

            {/* Education System & Term */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UniSelect
                control={form.control}
                name="educationSystemId"
                label="Education System"
                placeholder={systemsLoading ? "Loading systems..." : "Select system"}
                options={systemOptions}
                isLoading={systemsLoading}
                required
                labelClassName="text-xs font-semibold text-zinc-700"
              />

              <UniSelect
                control={form.control}
                name="term"
                label="Term"
                placeholder="Select term"
                options={[
                  { label: "Term 1", value: "Term 1" },
                  { label: "Term 2", value: "Term 2" },
                  { label: "Term 3", value: "Term 3" },
                  { label: "Full Year", value: "Full Year" },
                ]}
                required
                labelClassName="text-xs font-semibold text-zinc-700"
              />
            </div>

            {/* Status */}
            <UniSelect
              control={form.control}
              name="status"
              label="Status"
              placeholder="Select status"
              options={[
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
              ]}
              required
              labelClassName="text-xs font-semibold text-zinc-700"
            />

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
        </Form>
      </DialogContent>
    </Dialog>
  )
}

