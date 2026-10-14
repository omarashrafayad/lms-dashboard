"use client"

import * as React from "react"
import { FileText, Plus, Eye, Download, Trash2, RotateCcw, Pencil, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { LessonPdf, ContentPdfResponse } from "../../types/curriculum.types"
import { AddPdfModal } from "./AddPdfModal"
import { EditPdfModal } from "./EditPdfModal"
import { useLessonPdfs, useDeletePdf, useUpdatePdf } from "../../hooks/useCurriculum"
import { toast } from "sonner"

export interface LessonPdfCardProps {
  lessonId?: string
  pdf?: LessonPdf | null
  initialOfflineAvailability?: boolean
  onPdfChange?: (pdf: LessonPdf) => void
  onRemovePdf?: () => void
}

export function LessonPdfCard({
  lessonId,
  pdf: initialPdf,
  initialOfflineAvailability = true,
  onPdfChange,
  onRemovePdf,
}: LessonPdfCardProps) {
  const { data: serverPdfs = [], isLoading } = useLessonPdfs(lessonId)
  const deletePdfMutation = useDeletePdf()
  const updatePdfMutation = useUpdatePdf()

  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)
  const [pdfToEdit, setPdfToEdit] = React.useState<any | null>(null)

  // Primary PDFs from server or fallback to prop
  const rawPdfs: any[] =
    serverPdfs && serverPdfs.length > 0
      ? serverPdfs
      : initialPdf
      ? [initialPdf]
      : []

  const currentPdf = rawPdfs.length > 0 ? rawPdfs[0] : null

  const [offlineAvailability, setOfflineAvailability] = React.useState(
    currentPdf?.isOfflineAvailable ?? currentPdf?.offlineAvailable ?? initialOfflineAvailability
  )

  React.useEffect(() => {
    if (currentPdf) {
      setOfflineAvailability(
        currentPdf.isOfflineAvailable ?? currentPdf.offlineAvailable ?? true
      )
    }
  }, [currentPdf])

  const handleDownload = (pdfItem: any) => {
    const url = pdfItem?.filePath || pdfItem?.pdfUrl
    if (url) {
      window.open(url, "_blank")
    } else {
      toast.success("PDF download started.")
    }
  }

  const handleToggleOffline = async (checked: boolean) => {
    setOfflineAvailability(checked)
    if (currentPdf?.id && lessonId) {
      try {
        await updatePdfMutation.mutateAsync({
          pdfId: currentPdf.id,
          lessonId,
          data: {
            title: currentPdf.title,
            isOfflineAvailable: checked,
          },
        })
        toast.success("Offline availability updated!")
      } catch (err: any) {
        toast.error("Failed to update offline availability")
      }
    }
  }

  const handleRemove = async (pdfId: string) => {
    if (lessonId && pdfId) {
      try {
        await deletePdfMutation.mutateAsync({ pdfId, lessonId })
        toast.success("PDF deleted successfully")
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to delete PDF")
      }
    }
    onRemovePdf?.()
  }

  const formatSize = (pdfItem: any) => {
    if (!pdfItem) return ""
    if (typeof pdfItem.fileSize === "number") {
      const mb = pdfItem.fileSize / (1024 * 1024)
      return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(pdfItem.fileSize / 1024)} KB`
    }
    return pdfItem.size || "PDF Document"
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

        {lessonId && (
          <Button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="h-9 px-4 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-semibold shadow-2xs gap-1.5 cursor-pointer"
          >
            <Plus className="size-4 stroke-[2.5]" />
            <span>Add PDF</span>
          </Button>
        )}
      </div>

      {/* PDF Resource List or Empty State */}
      {isLoading ? (
        <div className="p-8 flex items-center justify-center">
          <Loader2 className="size-5 text-brand-orange animate-spin" />
        </div>
      ) : rawPdfs.length > 0 ? (
        <div className="flex flex-col gap-3">
          {rawPdfs.map((pdfItem) => {
            const isOffline =
              pdfItem.isOfflineAvailable ?? pdfItem.offlineAvailable ?? true
            const sizeStr = formatSize(pdfItem)

            return (
              <div
                key={pdfItem.id}
                className="flex flex-wrap items-center justify-between gap-3 p-3.5 px-4 rounded-xl border border-zinc-200/80 bg-white shadow-2xs"
              >
                {/* Left: Icon & Info */}
                <div className="flex items-center gap-3.5">
                  <div className="size-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                    <FileText className="size-5" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-xs text-zinc-900">
                      {pdfItem.title}
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      PDF • {sizeStr} •{" "}
                      {isOffline ? "Offline available" : "Online only"}
                    </span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                  {(pdfItem.filePath || pdfItem.pdfUrl) && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(pdfItem.filePath || pdfItem.pdfUrl, "_blank")
                      }
                      className="h-8 px-3 rounded-xl border-zinc-200/80 bg-white text-zinc-700 text-xs font-medium hover:bg-zinc-50 shadow-2xs gap-1.5 cursor-pointer"
                    >
                      <Eye className="size-3.5 text-zinc-500" />
                      <span>Preview</span>
                    </Button>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(pdfItem)}
                    className="h-8 px-3 rounded-xl border-zinc-200/80 bg-white text-zinc-700 text-xs font-medium hover:bg-zinc-50 shadow-2xs gap-1.5 cursor-pointer"
                  >
                    <Download className="size-3.5 text-zinc-500" />
                    <span>Download</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setPdfToEdit(pdfItem)}
                    className="h-8 px-3 rounded-xl border-zinc-200/80 bg-white text-zinc-700 text-xs font-medium hover:bg-zinc-50 shadow-2xs gap-1.5 cursor-pointer"
                  >
                    <Pencil className="size-3.5 text-zinc-500" />
                    <span>Edit</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddModalOpen(true)}
                    className="h-8 px-3 rounded-xl border-zinc-200/80 bg-white text-zinc-700 text-xs font-medium hover:bg-zinc-50 shadow-2xs gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="size-3.5 text-zinc-500" />
                    <span>Replace</span>
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={deletePdfMutation.isPending}
                    onClick={() => handleRemove(pdfItem.id)}
                    className="size-8 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                    aria-label="Remove PDF"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/40 p-8 flex flex-col items-center justify-center gap-2 text-center">
          <span className="text-xs text-zinc-400">
            No PDF attached to this lesson yet.
          </span>
          {lessonId && (
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="text-xs font-semibold text-brand-orange hover:underline cursor-pointer"
            >
              Add a PDF
            </button>
          )}
        </div>
      )}

      {/* PDF Offline Availability Switch */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs font-semibold text-zinc-700">
          PDF Offline Availability
        </span>
        <Switch
          checked={offlineAvailability}
          disabled={!currentPdf || updatePdfMutation.isPending}
          onCheckedChange={handleToggleOffline}
        />
      </div>

      {/* Add / Replace PDF Modal */}
      {lessonId && (
        <AddPdfModal
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          lessonId={lessonId}
          onSavePdf={(newPdf) => onPdfChange?.(newPdf as any)}
        />
      )}

      {/* Edit PDF Modal */}
      {lessonId && pdfToEdit && (
        <EditPdfModal
          open={!!pdfToEdit}
          onOpenChange={(open) => !open && setPdfToEdit(null)}
          pdf={pdfToEdit}
          lessonId={lessonId}
        />
      )}
    </div>
  )
}
