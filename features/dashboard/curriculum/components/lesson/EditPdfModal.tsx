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
import { Loader2 } from "lucide-react"
import { ContentPdfResponse } from "../../types/curriculum.types"
import { usePdfById, useUpdatePdf } from "../../hooks/useCurriculum"
import { toast } from "sonner"

export interface EditPdfModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pdfId?: string
  pdf?: ContentPdfResponse | null
  lessonId?: string
  onSuccess?: () => void
}

export function EditPdfModal({
  open,
  onOpenChange,
  pdfId,
  pdf,
  lessonId,
  onSuccess,
}: EditPdfModalProps) {
  const activePdfId = pdfId || pdf?.id
  const { data: serverPdf, isLoading: isLoadingPdf } = usePdfById(
    open && activePdfId ? activePdfId : undefined
  )
  const updatePdfMutation = useUpdatePdf()

  const [title, setTitle] = React.useState("")
  const [isOfflineAvailable, setIsOfflineAvailable] = React.useState(true)

  React.useEffect(() => {
    const current = serverPdf || pdf
    if (current) {
      setTitle(current.title || "")
      setIsOfflineAvailable(current.isOfflineAvailable ?? true)
    }
  }, [serverPdf, pdf, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !activePdfId) return

    try {
      if (lessonId) {
        await updatePdfMutation.mutateAsync({
          pdfId: activePdfId,
          lessonId,
          data: {
            title: title.trim(),
            isOfflineAvailable,
          },
        })
        toast.success("PDF updated successfully!")
      }
      onOpenChange(false)
      onSuccess?.()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update PDF")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Edit PDF Resource</DialogTitle>
          <DialogDescription>
            Update the title and offline availability for this PDF document.
          </DialogDescription>
        </DialogHeader>

        {isLoadingPdf ? (
          <div className="py-10 flex flex-col items-center justify-center gap-2">
            <Loader2 className="size-6 text-brand-orange animate-spin" />
            <span className="text-xs text-zinc-500">Loading PDF details...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-700">
                PDF Title <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter PDF title"
                className="h-10 px-3 rounded-xl border-zinc-200/80 bg-zinc-50/50 text-sm focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange"
                required
                autoFocus
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/40">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-zinc-800">
                  Offline Download
                </span>
                <span className="text-[11px] text-zinc-400">
                  Allow students to download this PDF for offline reading.
                </span>
              </div>
              <Switch
                checked={isOfflineAvailable}
                onCheckedChange={setIsOfflineAvailable}
              />
            </div>

            <DialogFooter className="mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-10 px-4 rounded-xl border-zinc-200/80 text-zinc-700 text-xs font-medium hover:bg-zinc-50 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updatePdfMutation.isPending}
                className="h-10 px-4 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-semibold shadow-2xs cursor-pointer gap-1.5"
              >
                {updatePdfMutation.isPending && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                <span>Save Changes</span>
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
