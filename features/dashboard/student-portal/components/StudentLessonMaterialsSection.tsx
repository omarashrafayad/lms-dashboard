"use client"

import * as React from "react"
import { FileText, Download, ExternalLink, BookOpen } from "lucide-react"
import { StudentLessonMaterial } from "../types/studentApi.types"

interface StudentLessonMaterialsSectionProps {
  materials: StudentLessonMaterial[]
  title?: string
}

function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return "PDF Resource"
  const mb = bytes / (1024 * 1024)
  if (mb >= 1) return `${mb.toFixed(1)} MB`
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

export function StudentLessonMaterialsSection({
  materials,
  title = "Study Materials & Attachments",
}: StudentLessonMaterialsSectionProps) {
  return (
    <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-amber-50 text-brand-orange border border-amber-200/60">
            <FileText className="size-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-zinc-900">{title}</h3>
            <p className="text-[11px] text-zinc-500">
              Downloadable handouts, summaries, and reference sheets
            </p>
          </div>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-zinc-100 text-zinc-700">
          {materials.length} {materials.length === 1 ? "File" : "Files"}
        </span>
      </div>

      {materials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {materials.map((mat) => {
            const href = mat.fileUrl || mat.filePath || "#"
            return (
              <div
                key={mat.id}
                className="p-4 rounded-2xl bg-zinc-50/80 border border-zinc-200/80 hover:border-brand-orange/70 transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {mat.bookImageUrl ? (
                    <img
                      src={mat.bookImageUrl}
                      alt={mat.title}
                      className="size-12 rounded-xl object-cover border border-zinc-200 shrink-0"
                    />
                  ) : (
                    <div className="size-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                      <BookOpen className="size-5" />
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-zinc-900 truncate">
                      {mat.title}
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      {formatBytes(mat.fileSize)}
                      {mat.isOfflineAvailable ? " • Offline Ready" : ""}
                    </span>
                  </div>
                </div>

                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  download={mat.title}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-orange hover:brightness-105 text-white font-bold text-xs shadow-2xs shrink-0 transition-all cursor-pointer"
                >
                  <Download className="size-3.5" />
                  <span>Open</span>
                  <ExternalLink className="size-3 opacity-80" />
                </a>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-zinc-50 border border-dashed border-zinc-200 text-center text-xs text-zinc-500">
          No downloadable materials are attached to this lesson.
        </div>
      )}
    </div>
  )
}
