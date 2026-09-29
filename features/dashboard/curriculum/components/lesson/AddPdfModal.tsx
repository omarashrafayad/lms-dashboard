"use client"

import * as React from "react"
import { FileText, Loader2, Upload } from "lucide-react"
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
import { useUploadPdf } from "../../hooks/useCurriculum"
import { toast } from "sonner"

export interface AddPdfModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lessonId?: string
  onSavePdf?: (pdf: { title: string; size: string; offlineAvailable: boolean }) => void
}

export function AddPdfModal({
  open,
  onOpenChange,
  lessonId,
  onSavePdf,
}: AddPdfModalProps) {
  const [title, setTitle] = React.useState("")
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [isOfflineAvailable, setIsOfflineAvailable] = React.useState(true)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const uploadPdfMutation = useUploadPdf()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ""))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error("Please provide a title for the PDF")
      return
    }
    if (!selectedFile) {
      toast.error("Please select a PDF file")
      return
    }

    try {
      if (lessonId) {
        await uploadPdfMutation.mutateAsync({
          lessonId,
          title: title.trim(),
          fileSize: selectedFile.size,
          isOfflineAvailable,
          file: selectedFile,
        })
        toast.success("PDF uploaded successfully!")
      }

      onSavePdf?.({
        title: title.trim(),
        size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
        offlineAvailable: isOfflineAvailable,
      })

      setTitle("")
      setSelectedFile(null)
      onOpenChange(false)
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        err?.message ||
        "Failed to upload PDF"
      toast.error(msg)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-[460px]">
        <DialogHeader>
          <DialogTitle>Add PDF Document</DialogTitle>
          <DialogDescription>
            Choose a PDF file to attach to this lesson.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* PDF Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-800">
              PDF Title <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Introduction to Fractions"
              className="h-10 px-3 rounded-xl border-zinc-200/80 bg-zinc-50/50 text-sm focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange"
              required
              autoFocus
            />
          </div>

          {/* Drag & Drop PDF box */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-800">
              PDF File <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="application/pdf"
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="rounded-2xl border border-dashed border-zinc-300 hover:border-brand-orange/60 bg-zinc-50/30 hover:bg-amber-50/20 p-7 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center"
            >
              <div className="size-10 rounded-full bg-amber-50 text-brand-orange flex items-center justify-center shadow-2xs">
                <FileText className="size-5" />
              </div>
              <div className="text-xs font-medium text-zinc-700">
                {selectedFile ? selectedFile.name : "Drag & drop a PDF here, or click to browse."}
              </div>
              <span className="text-[11px] text-zinc-400">
                {selectedFile
                  ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
                  : "PDF up to 50MB"}
              </span>
            </div>
          </div>

          {/* Offline Availability Toggle */}
          <div className="flex items-center justify-between p-3 px-4 rounded-xl border border-zinc-200/80 bg-white">
            <div className="flex flex-col pr-4">
              <span className="text-xs font-semibold text-zinc-900">
                Offline Available
              </span>
              <span className="text-[11px] text-zinc-400">
                Allow students to view and download this PDF offline
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
              disabled={uploadPdfMutation.isPending}
              className="h-10 px-4 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-semibold shadow-2xs gap-1.5 cursor-pointer"
            >
              {uploadPdfMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="size-4" />
                  <span>Add PDF</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
