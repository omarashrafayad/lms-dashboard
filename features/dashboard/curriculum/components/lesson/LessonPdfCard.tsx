"use client"

import * as React from "react"
import { FileText, Plus, Eye, Download, Trash2, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { LessonPdf } from "../../types/curriculum.types"
import { AddPdfModal } from "./AddPdfModal"
import { toast } from "sonner"

export interface LessonPdfCardProps {
  pdf: LessonPdf | null
  initialOfflineAvailability?: boolean
  onPdfChange?: (pdf: LessonPdf) => void
  onRemovePdf?: () => void
}

export function LessonPdfCard({
  pdf: initialPdf,
  initialOfflineAvailability = true,
  onPdfChange,
  onRemovePdf,
}: LessonPdfCardProps) {
  const [pdf, setPdf] = React.useState<LessonPdf | null>(initialPdf)
  const [offlineAvailability, setOfflineAvailability] = React.useState(
    initialOfflineAvailability
  )
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  React.useEffect(() => {
    setPdf(initialPdf)
  }, [initialPdf])

  const handleDownload = () => {
    toast.success("PDF download started.")
  }

  const handleSavePdf = (newPdf: LessonPdf) => {
    setPdf(newPdf)
    onPdfChange?.(newPdf)
    toast.success("PDF attached successfully.")
  }

  return (
    <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-zinc-100 text-zinc-600 flex items-center justify-center shrink-0">
            <FileText className="size-4" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-sm text-zinc-900">PDF</h3>
            <span className="text-xs text-zinc-400">
              Every lesson can have its own PDF resource.
            </span>
          </div>
        </div>

        <Button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="h-9 px-4 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-semibold shadow-2xs gap-1.5 cursor-pointer"
        >
          <Plus className="size-4 stroke-[2.5]" />
          <span>Add PDF</span>
        </Button>
      </div>

      {/* PDF Resource Row or Empty State matching Screenshot 2 */}
      {pdf ? (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 px-4 rounded-xl border border-zinc-200/80 bg-white shadow-2xs">
          {/* Left: Icon & Info */}
          <div className="flex items-center gap-3.5">
            <div className="size-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
              <FileText className="size-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-xs text-zinc-900">
                {pdf.title}
              </span>
              <span className="text-[11px] text-zinc-400">
                PDF • {pdf.size} •{" "}
                {pdf.offlineAvailable ? "Offline available" : "Online only"}
              </span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 px-3 rounded-xl border-zinc-200/80 bg-white text-zinc-700 text-xs font-medium hover:bg-zinc-50 shadow-2xs gap-1.5 cursor-pointer"
            >
              <Eye className="size-3.5 text-zinc-500" />
              <span>Preview</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="h-8 px-3 rounded-xl border-zinc-200/80 bg-white text-zinc-700 text-xs font-medium hover:bg-zinc-50 shadow-2xs gap-1.5 cursor-pointer"
            >
              <Download className="size-3.5 text-zinc-500" />
              <span>Download</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="h-8 px-3 rounded-xl border-zinc-200/80 bg-white text-zinc-700 text-xs font-medium hover:bg-zinc-50 shadow-2xs gap-1.5 cursor-pointer"
            >
              <RotateCcw className="size-3.5 text-zinc-500" />
              <span>Replace</span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                setPdf(null)
                onRemovePdf?.()
              }}
              className="size-8 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
              aria-label="Remove PDF"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/40 p-8 flex flex-col items-center justify-center gap-2 text-center">
          <span className="text-xs text-zinc-400">
            No PDF attached to this lesson yet.
          </span>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-semibold text-brand-orange hover:underline cursor-pointer"
          >
            Add a PDF
          </button>
        </div>
      )}

      {/* PDF Offline Availability Switch */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs font-semibold text-zinc-700">
          PDF Offline Availability
        </span>
        <Switch
          checked={offlineAvailability}
          onCheckedChange={setOfflineAvailability}
        />
      </div>

      {/* Add / Replace PDF Modal */}
      <AddPdfModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSavePdf={handleSavePdf}
      />
    </div>
  )
}
