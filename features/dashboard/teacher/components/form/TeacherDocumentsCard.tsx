"use client"

import * as React from "react"
import { UploadCloud, FileText } from "lucide-react"

export interface TeacherDocumentsCardProps {
  degreeFile: File | null
  onDegreeFileChange: (file: File | null) => void
  nationalIdFile: File | null
  onNationalIdFileChange: (file: File | null) => void
  existingDegreeUrl?: string | null
  existingNationalIdUrl?: string | null
  isEditMode?: boolean
}

export function TeacherDocumentsCard({
  degreeFile,
  onDegreeFileChange,
  nationalIdFile,
  onNationalIdFileChange,
  existingDegreeUrl,
  existingNationalIdUrl,
  isEditMode = false,
}: TeacherDocumentsCardProps) {
  const degreeInputRef = React.useRef<HTMLInputElement>(null)
  const nationalIdInputRef = React.useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-2xs">
      <h2 className="text-sm font-bold text-zinc-900 mb-1">
        Verification Documents
      </h2>
      <p className="text-xs text-zinc-500 mb-6">
        Upload the required documents to verify this teacher's identity and academic qualifications.
      </p>

      {/* University Degree Certificate */}
      <div className="mb-6">
        <label className="block text-xs font-medium text-zinc-700 mb-1">
          University Degree Certificate
        </label>
        <p className="text-[11px] text-zinc-400 mb-3">
          Upload a clear scan or image of the teacher's university degree certificate.
        </p>

        <input
          ref={degreeInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onDegreeFileChange(file)
          }}
        />

        {degreeFile ? (
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-zinc-800 flex items-center justify-center text-white shrink-0 shadow-2xs">
                <FileText className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-zinc-800 max-w-[280px] sm:max-w-md truncate">
                  {degreeFile.name} {isEditMode && "(New)"}
                </span>
                <span className="text-[10px] text-zinc-400">
                  {formatFileSize(degreeFile.size)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => degreeInputRef.current?.click()}
                className="text-xs font-medium text-zinc-600 hover:text-zinc-900 px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={() => onDegreeFileChange(null)}
                className="text-xs font-medium text-red-600 hover:text-red-700 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        ) : existingDegreeUrl ? (
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-zinc-800 flex items-center justify-center text-white shrink-0 shadow-2xs">
                <FileText className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-zinc-800">
                  Degree Certificate on record
                </span>
                <span className="text-[10px] text-zinc-400">
                  Uploaded file available
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => degreeInputRef.current?.click()}
              className="text-xs font-medium text-zinc-600 hover:text-zinc-900 px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 transition-colors cursor-pointer"
            >
              Upload New
            </button>
          </div>
        ) : (
          <div
            onClick={() => degreeInputRef.current?.click()}
            className="border-2 border-dashed border-zinc-200 hover:border-amber-400 rounded-2xl p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center bg-zinc-50/30"
          >
            <div className="size-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 mb-2">
              <UploadCloud className="size-5" />
            </div>
            <span className="text-xs font-semibold text-zinc-800 mb-0.5">
              Upload Degree Certificate
            </span>
            <span className="text-[11px] text-zinc-400 mb-1">
              Drag & drop or browse
            </span>
            <span className="text-[10px] text-zinc-400">
              JPG, JPEG, PNG, PDF - Max 5 MB
            </span>
          </div>
        )}
      </div>

      {/* National ID Document */}
      <div>
        <label className="block text-xs font-medium text-zinc-700 mb-1">
          National ID Document <span className="text-amber-500">*</span>
        </label>
        <p className="text-[11px] text-zinc-400 mb-3">
          Upload a clear scan or image of the teacher's national ID card.
        </p>

        <input
          ref={nationalIdInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onNationalIdFileChange(file)
          }}
        />

        {nationalIdFile ? (
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-zinc-800 flex items-center justify-center text-white shrink-0 shadow-2xs">
                <FileText className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-zinc-800 max-w-[280px] sm:max-w-md truncate">
                  {nationalIdFile.name} {isEditMode && "(New)"}
                </span>
                <span className="text-[10px] text-zinc-400">
                  {formatFileSize(nationalIdFile.size)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => nationalIdInputRef.current?.click()}
                className="text-xs font-medium text-zinc-600 hover:text-zinc-900 px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={() => onNationalIdFileChange(null)}
                className="text-xs font-medium text-red-600 hover:text-red-700 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        ) : existingNationalIdUrl ? (
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-zinc-800 flex items-center justify-center text-white shrink-0 shadow-2xs">
                <FileText className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-zinc-800">
                  National ID on record
                </span>
                <span className="text-[10px] text-zinc-400">
                  Uploaded file available
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => nationalIdInputRef.current?.click()}
              className="text-xs font-medium text-zinc-600 hover:text-zinc-900 px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 transition-colors cursor-pointer"
            >
              Upload New
            </button>
          </div>
        ) : (
          <div
            onClick={() => nationalIdInputRef.current?.click()}
            className="border-2 border-dashed border-zinc-200 hover:border-amber-400 rounded-2xl p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center bg-zinc-50/30"
          >
            <div className="size-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 mb-2">
              <UploadCloud className="size-5" />
            </div>
            <span className="text-xs font-semibold text-zinc-800 mb-0.5">
              Upload National ID
            </span>
            <span className="text-[11px] text-zinc-400 mb-1">
              Drag & drop or browse
            </span>
            <span className="text-[10px] text-zinc-400">
              JPG, JPEG, PNG, PDF - Max 5 MB
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
