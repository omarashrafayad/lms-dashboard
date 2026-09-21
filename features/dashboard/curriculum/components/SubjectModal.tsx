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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  CurriculumSubject,
  CreateSubjectPayload,
  SubjectStatus,
} from "../types/curriculum.types"

export interface SubjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subjectToEdit?: CurriculumSubject | null
  onSubmit: (payload: CreateSubjectPayload) => void
  isSubmitting?: boolean
}

export function SubjectModal({
  open,
  onOpenChange,
  subjectToEdit,
  onSubmit,
  isSubmitting = false,
}: SubjectModalProps) {
  const isEdit = !!subjectToEdit

  const [name, setName] = React.useState<string>("Mathematics")
  const [stage, setStage] = React.useState<string>("Primary")
  const [year, setYear] = React.useState<string>("Grade 4")
  const [system, setSystem] = React.useState<string>("National")
  const [term, setTerm] = React.useState<string>("Term 1")
  const [status, setStatus] = React.useState<SubjectStatus>("Active")

  React.useEffect(() => {
    if (subjectToEdit) {
      setName(subjectToEdit.name)
      setStage(subjectToEdit.stage)
      setYear(subjectToEdit.year)
      setSystem(subjectToEdit.system)
      setTerm(subjectToEdit.term)
      setStatus(subjectToEdit.status)
    } else {
      setName("Mathematics")
      setStage("Primary")
      setYear("Grade 4")
      setSystem("National")
      setTerm("Term 1")
      setStatus("Active")
    }
  }, [subjectToEdit, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      name,
      stage,
      year,
      system,
      term,
      status,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Subject" : "Add Subject"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the subject details and academic placement."
              : "Create a new subject and place it in the academic structure."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Subject Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-700">Subject Name</label>
            <Select value={name} onValueChange={(val) => val && setName(val)}>
              <SelectTrigger className="h-10 px-3 rounded-xl border-zinc-200/80 bg-white text-sm font-medium text-zinc-800 shadow-2xs hover:bg-zinc-50">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Arabic">Arabic</SelectItem>
                <SelectItem value="Science">Science</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Social Studies">Social Studies</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Chemistry">Chemistry</SelectItem>
                <SelectItem value="Biology">Biology</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Education Stage & Academic Year */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-700">
                Education Stage
              </label>
              <Select value={stage} onValueChange={(val) => val && setStage(val)}>
                <SelectTrigger className="h-10 px-3 rounded-xl border-zinc-200/80 bg-white text-sm font-medium text-zinc-800 shadow-2xs hover:bg-zinc-50">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Primary">Primary</SelectItem>
                  <SelectItem value="Preparatory">Preparatory</SelectItem>
                  <SelectItem value="Secondary">Secondary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-700">
                Academic Year
              </label>
              <Select value={year} onValueChange={(val) => val && setYear(val)}>
                <SelectTrigger className="h-10 px-3 rounded-xl border-zinc-200/80 bg-white text-sm font-medium text-zinc-800 shadow-2xs hover:bg-zinc-50">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Grade 4">Grade 4</SelectItem>
                  <SelectItem value="Grade 5">Grade 5</SelectItem>
                  <SelectItem value="Grade 6">Grade 6</SelectItem>
                  <SelectItem value="Grade 7">Grade 7</SelectItem>
                  <SelectItem value="Grade 8">Grade 8</SelectItem>
                  <SelectItem value="Grade 9">Grade 9</SelectItem>
                  <SelectItem value="Grade 10">Grade 10</SelectItem>
                  <SelectItem value="Grade 11">Grade 11</SelectItem>
                  <SelectItem value="Grade 12">Grade 12</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Education System & Term */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-700">
                Education System
              </label>
              <Select value={system} onValueChange={(val) => val && setSystem(val)}>
                <SelectTrigger className="h-10 px-3 rounded-xl border-zinc-200/80 bg-white text-sm font-medium text-zinc-800 shadow-2xs hover:bg-zinc-50">
                  <SelectValue placeholder="Select system" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="National">National</SelectItem>
                  <SelectItem value="American">American</SelectItem>
                  <SelectItem value="IGCSE">IGCSE</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-700">Term</label>
              <Select value={term} onValueChange={(val) => val && setTerm(val)}>
                <SelectTrigger className="h-10 px-3 rounded-xl border-zinc-200/80 bg-white text-sm font-medium text-zinc-800 shadow-2xs hover:bg-zinc-50">
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Term 1">Term 1</SelectItem>
                  <SelectItem value="Term 2">Term 2</SelectItem>
                  <SelectItem value="Term 3">Term 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-700">Status</label>
            <Select
              value={status}
              onValueChange={(val) => val && setStatus(val as SubjectStatus)}
            >
              <SelectTrigger className="h-10 px-3 rounded-xl border-zinc-200/80 bg-white text-sm font-medium text-zinc-800 shadow-2xs hover:bg-zinc-50">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Footer actions */}
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-10 px-5 rounded-xl border-zinc-200/80 text-zinc-700 text-xs font-medium hover:bg-zinc-50 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 px-5 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-semibold shadow-2xs cursor-pointer"
            >
              {isEdit ? "Save Changes" : "Create Subject"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
