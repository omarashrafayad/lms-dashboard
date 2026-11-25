"use client"

import * as React from "react"
import {
  X,
  UploadCloud,
  FileText,
  Paperclip,
  CheckCircle2,
  Trash2,
  AlertCircle,
  Send,
} from "lucide-react"
import { Assignment } from "../types/studentPortal.types"

interface StudentAssignmentSubmitModalProps {
  assignment: Assignment | null
  isOpen: boolean
  onClose: () => void
  onSubmitSuccess?: () => void
}

export function StudentAssignmentSubmitModal({
  assignment,
  isOpen,
  onClose,
  onSubmitSuccess,
}: StudentAssignmentSubmitModalProps) {
  const [solutionText, setSolutionText] = React.useState("")
  const [uploadedFiles, setUploadedFiles] = React.useState<{ name: string; size: string }[]>([
    { name: "Ahmed_Mansour_Assignment_Solutions.pdf", size: "2.8 MB" },
  ])
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  if (!isOpen || !assignment) return null

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setUploadedFiles((prev) => [
        ...prev,
        { name: file.name, size: `${(file.size / (1024 * 1024)).toFixed(1)} MB` },
      ])
    }
  }

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, idx) => idx !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      if (onSubmitSuccess) onSubmitSuccess()
      onClose()
      alert("Assignment submitted successfully to your teacher for review!")
    }, 800)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
              {assignment.subject}
            </span>
            <h3 className="font-bold text-sm text-zinc-900">
              Submit Assignment Solutions
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-500 hover:bg-zinc-100 cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex flex-col gap-5 text-xs text-zinc-700">
          <div>
            <h2 className="text-base font-bold text-zinc-900 mb-1">
              {assignment.title}
            </h2>
            <span className="text-zinc-500">
              {assignment.course} • Total Marks: <strong>{assignment.totalMarks}</strong> • Due: {assignment.dueDate}
            </span>
          </div>

          {/* Instructions Box */}
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col gap-1.5">
            <span className="font-bold text-[11px] text-zinc-900 uppercase tracking-wider">
              Assignment Instructions:
            </span>
            <p className="text-zinc-600 leading-relaxed">
              {assignment.instructions}
            </p>
          </div>

          {/* Written Answer Field */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-zinc-800">
              Written Solution / Explanatory Notes:
            </label>
            <textarea
              rows={5}
              value={solutionText}
              onChange={(e) => setSolutionText(e.target.value)}
              placeholder="Provide your written answers, formula explanations, or working notes..."
              className="w-full p-4 rounded-2xl border border-zinc-200 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          {/* File Upload Dropzone */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-zinc-800">
              Upload Solution Files (PDF, Word, or Handwritten Scans):
            </label>
            <label className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-zinc-300 hover:border-emerald-500 hover:bg-emerald-50/20 transition-all cursor-pointer">
              <UploadCloud className="size-8 text-zinc-400 mb-2" />
              <span className="font-bold text-zinc-700">Click to upload files</span>
              <span className="text-[11px] text-zinc-400 mt-0.5">Supports PDF, DOCX, PNG, JPG (Max 25MB)</span>
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="font-bold text-[11px] text-zinc-700">
                Attached Files ({uploadedFiles.length}):
              </span>
              <div className="flex flex-col gap-1.5">
                {uploadedFiles.map((f, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-200"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="size-4 text-emerald-600" />
                      <span className="font-medium text-zinc-800">{f.name}</span>
                      <span className="text-[10px] text-zinc-400">({f.size})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(idx)}
                      className="text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 font-semibold text-zinc-700 hover:bg-zinc-50 cursor-pointer"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => alert("Assignment draft saved locally!")}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 bg-white font-semibold text-zinc-700 hover:bg-zinc-50 cursor-pointer"
              >
                Save Draft
              </button>
              <button
                type="submit"
                disabled={isSubmitted}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white font-bold shadow-sm shadow-brand-orange/20 cursor-pointer disabled:opacity-50"
              >
                <Send className="size-3.5" />
                <span>{isSubmitted ? "Submitting..." : "Submit to Teacher"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
