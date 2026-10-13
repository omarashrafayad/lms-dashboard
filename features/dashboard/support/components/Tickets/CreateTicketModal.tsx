"use client"

import * as React from "react"
import { Plus, UploadCloud, Loader2, AlertCircle } from "lucide-react"
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
import { cn } from "@/lib/utils"
import {
  SupportTicket,
  TicketCategory,
  TicketPriority,
} from "../../types/support.types"
import { toast } from "sonner"

interface CreateTicketModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmitTicket: (ticket: Omit<SupportTicket, "id" | "createdAt" | "updatedAt" | "messagesCount">) => void
}

export function CreateTicketModal({
  open,
  onOpenChange,
  onSubmitTicket,
}: CreateTicketModalProps) {
  const [subject, setSubject] = React.useState("")
  const [category, setCategory] = React.useState<TicketCategory>("Technical & Platform")
  const [priority, setPriority] = React.useState<TicketPriority>("Medium")
  const [description, setDescription] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim()) {
      toast.error("Please provide a ticket subject")
      return
    }
    if (!description.trim()) {
      toast.error("Please describe your issue or inquiry")
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      onSubmitTicket({
        subject: subject.trim(),
        description: description.trim(),
        category,
        priority,
        status: "Open",
        requester: {
          name: "Current Administrator",
          email: "admin@lms-platform.com",
          role: "Administrator",
        },
      })
      setIsSubmitting(false)
      toast.success("Support ticket created successfully!")
      setSubject("")
      setDescription("")
      setPriority("Medium")
      onOpenChange(false)
    }, 600)
  }

  const categories: TicketCategory[] = [
    "Curriculum & Video",
    "Billing & Subscriptions",
    "Technical & Platform",
    "Student Accounts",
    "Exams & Grading",
    "General Inquiry",
  ]

  const priorities: TicketPriority[] = ["Low", "Medium", "High", "Urgent"]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Create Support Ticket</DialogTitle>
          <DialogDescription>
            Submit an inquiry or report an issue. Our dedicated team typically responds within 20 minutes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4.5">
          {/* Subject */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-800">
              Subject <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              required
              placeholder="e.g. Video playback buffering in Secondary Grade 2"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="h-10 px-3 rounded-xl border-zinc-200/80 bg-zinc-50/50 text-xs focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange"
            />
          </div>

          {/* Category & Priority Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-800">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TicketCategory)}
                className="h-10 px-3 rounded-xl border border-zinc-200/80 bg-zinc-50/50 text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-800">
                Priority Level
              </label>
              <div className="grid grid-cols-4 gap-1 h-10 p-1 bg-zinc-100/80 rounded-xl border border-zinc-200/70">
                {priorities.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={cn(
                      "rounded-lg text-[11px] font-semibold transition-all cursor-pointer",
                      priority === p
                        ? p === "Urgent"
                          ? "bg-red-600 text-white shadow-xs"
                          : p === "High"
                          ? "bg-orange-500 text-white shadow-xs"
                          : p === "Medium"
                          ? "bg-brand-orange text-white shadow-xs"
                          : "bg-zinc-800 text-white shadow-xs"
                        : "text-zinc-600 hover:text-zinc-900"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-800">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Provide context, affected lesson IDs, user accounts, or error codes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/50 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all resize-none"
            />
          </div>

          {/* Optional Attachments Dropzone */}
          <div className="rounded-xl border border-dashed border-zinc-300 hover:border-brand-orange/60 bg-zinc-50/40 p-4 flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer transition-colors">
            <UploadCloud className="size-5 text-zinc-400" />
            <span className="text-xs text-zinc-600 font-medium">
              Attach screenshots or log files (optional)
            </span>
            <span className="text-[10px] text-zinc-400">
              PNG, JPG, PDF, TXT (up to 25 MB)
            </span>
          </div>

          {/* Footer Actions */}
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
              disabled={isSubmitting}
              className="h-10 px-4 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-semibold shadow-2xs gap-1.5 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Plus className="size-3.5 stroke-[2.5]" />
                  <span>Submit Ticket</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
