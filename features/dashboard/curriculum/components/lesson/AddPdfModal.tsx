"use client"

import * as React from "react"
import { FileText } from "lucide-react"
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

export interface AddPdfModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSavePdf: (pdf: { title: string; size: string; offlineAvailable: boolean }) => void
}

export function AddPdfModal({
  open,
  onOpenChange,
  onSavePdf,
}: AddPdfModalProps) {
  const [title, setTitle] = React.useState("")
  const [fileName, setFileName] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFileName(file.name)
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ""))
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onSavePdf({
      title: title.endsWith(".pdf") ? title.trim() : `${title.trim()}.pdf`,
      size: "2.4 MB",
      offlineAvailable: true,
    })

    setTitle("")
    setFileName(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Add PDF</DialogTitle>
          <DialogDescription>
            Choose a PDF file to attach to this lesson.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* PDF Title * */}
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

          {/* Drag & Drop PDF box matching Screenshot 3 */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="application/pdf"
            className="hidden"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="rounded-2xl border border-dashed border-zinc-300 hover:border-brand-orange/60 bg-zinc-50/30 hover:bg-amber-50/20 p-8 flex flex-col items-center justify-center gap-2.5 cursor-pointer transition-colors text-center"
          >
            <FileText className="size-8 text-zinc-400 stroke-[1.5]" />
            <div className="text-xs text-zinc-500">
              {fileName || "Drag & drop a PDF here, or click to browse."}
            </div>
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
              className="h-10 px-4 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-semibold shadow-2xs cursor-pointer"
            >
              Add PDF
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
