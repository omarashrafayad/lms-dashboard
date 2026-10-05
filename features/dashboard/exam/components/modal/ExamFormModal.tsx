"use client"

import * as React from "react"
import { X, Check } from "lucide-react"
import { ExamItem, ExamLevel, ExamStatus, ExamType } from "../../types/exam.types"

interface ExamFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (examData: Partial<ExamItem>) => void
  initialData?: ExamItem | null
}

export function ExamFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: ExamFormModalProps) {
  const [formData, setFormData] = React.useState({
    title: "",
    type: "Monthly" as ExamType,
    level: "Beginner" as ExamLevel,
    subject: "Mathematics",
    educationStage: "Primary",
    academicYear: "2026 / 2027",
    term: "Term 1",
    month: "October",
    questionsCount: 20,
    totalPoints: 40,
    durationMinutes: 30,
    attemptsAllowed: 1,
    passingScorePercent: 60,
    status: "Published" as ExamStatus,
  })

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        type: initialData.type,
        level: initialData.level,
        subject: initialData.subject,
        educationStage: initialData.educationStage,
        academicYear: initialData.academicYear,
        term: initialData.term,
        month: initialData.month || "October",
        questionsCount: initialData.questionsCount,
        totalPoints: initialData.totalPoints,
        durationMinutes: initialData.durationMinutes || 30,
        attemptsAllowed: initialData.attemptsAllowed || 1,
        passingScorePercent: initialData.passingScorePercent || 60,
        status: initialData.status,
      })
    } else {
      setFormData({
        title: "",
        type: "Monthly",
        level: "Beginner",
        subject: "Mathematics",
        educationStage: "Primary",
        academicYear: "2026 / 2027",
        term: "Term 1",
        month: "October",
        questionsCount: 20,
        totalPoints: 40,
        durationMinutes: 30,
        attemptsAllowed: 1,
        passingScorePercent: 60,
        status: "Published",
      })
    }
  }, [initialData, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      duration: `${formData.durationMinutes} min`,
      passingScore: `${formData.passingScorePercent}%`,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-xs animate-in fade-in-50">
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200/80">
          <h2 className="text-base font-bold text-zinc-900">
            {initialData ? "Edit Exam" : "Add New Exam"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {/* Exam Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-700">
              Exam Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g. Math — October Monthly Exam"
              className="h-10 px-3 text-xs bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Row 1: Type & Level */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                Exam Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as ExamType })
                }
                className="h-10 px-3 text-xs bg-white border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="Monthly">Monthly Exam</option>
                <option value="Subject">Subject Exam</option>
                <option value="Course">Course Exam</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                Level
              </label>
              <select
                value={formData.level}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    level: e.target.value as ExamLevel,
                  })
                }
                className="h-10 px-3 text-xs bg-white border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Row 2: Subject & Stage */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                Subject
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                placeholder="e.g. Mathematics"
                className="h-10 px-3 text-xs bg-white border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                Education Stage
              </label>
              <select
                value={formData.educationStage}
                onChange={(e) =>
                  setFormData({ ...formData, educationStage: e.target.value })
                }
                className="h-10 px-3 text-xs bg-white border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="Primary">Primary</option>
                <option value="Preparatory">Preparatory</option>
                <option value="Secondary">Secondary</option>
              </select>
            </div>
          </div>

          {/* Row 3: Academic Year & Term & Month */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                Academic Year
              </label>
              <input
                type="text"
                value={formData.academicYear}
                onChange={(e) =>
                  setFormData({ ...formData, academicYear: e.target.value })
                }
                className="h-10 px-3 text-xs bg-white border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                Term
              </label>
              <select
                value={formData.term}
                onChange={(e) =>
                  setFormData({ ...formData, term: e.target.value })
                }
                className="h-10 px-3 text-xs bg-white border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="Term 1">Term 1</option>
                <option value="Term 2">Term 2</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                Month
              </label>
              <input
                type="text"
                value={formData.month}
                onChange={(e) =>
                  setFormData({ ...formData, month: e.target.value })
                }
                placeholder="e.g. October"
                className="h-10 px-3 text-xs bg-white border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Row 4: Questions, Points, Duration */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                Questions
              </label>
              <input
                type="number"
                min={1}
                value={formData.questionsCount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    questionsCount: parseInt(e.target.value) || 0,
                  })
                }
                className="h-10 px-3 text-xs bg-white border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                Total Points
              </label>
              <input
                type="number"
                min={1}
                value={formData.totalPoints}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalPoints: parseInt(e.target.value) || 0,
                  })
                }
                className="h-10 px-3 text-xs bg-white border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                Duration (min)
              </label>
              <input
                type="number"
                min={1}
                value={formData.durationMinutes}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    durationMinutes: parseInt(e.target.value) || 0,
                  })
                }
                className="h-10 px-3 text-xs bg-white border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Row 5: Passing Score, Attempts, Status */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                Passing Score (%)
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={formData.passingScorePercent}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    passingScorePercent: parseInt(e.target.value) || 0,
                  })
                }
                className="h-10 px-3 text-xs bg-white border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                Attempts Allowed
              </label>
              <input
                type="number"
                min={1}
                value={formData.attemptsAllowed}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    attemptsAllowed: parseInt(e.target.value) || 1,
                  })
                }
                className="h-10 px-3 text-xs bg-white border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as ExamStatus,
                  })
                }
                className="h-10 px-3 text-xs bg-white border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-zinc-200">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 px-5 rounded-xl bg-[#F59E0B] hover:bg-amber-600 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
            >
              <Check className="size-4" />
              <span>{initialData ? "Save Changes" : "Create Exam"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
