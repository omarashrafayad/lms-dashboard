"use client"

import * as React from "react"
import {
  X,
  Send,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  ShieldCheck,
  Tag,
  Calendar,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  SupportTicket,
  TicketStatus,
  TicketMessage,
} from "../../types/support.types"
import { toast } from "sonner"

interface TicketDetailModalProps {
  ticket: SupportTicket | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange?: (ticketId: string, newStatus: TicketStatus) => void
  onAddMessage?: (ticketId: string, message: TicketMessage) => void
}

export function TicketDetailModal({
  ticket,
  open,
  onOpenChange,
  onStatusChange,
  onAddMessage,
}: TicketDetailModalProps) {
  const [replyText, setReplyText] = React.useState("")
  const [isSending, setIsSending] = React.useState(false)

  if (!ticket) return null

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim()) return

    setIsSending(true)
    setTimeout(() => {
      const newMessage: TicketMessage = {
        id: `m-${Date.now()}`,
        author: "Current Administrator",
        authorRole: "Admin",
        content: replyText.trim(),
        createdAt: "Just now",
        isStaff: true,
      }
      onAddMessage?.(ticket.id, newMessage)
      setReplyText("")
      setIsSending(false)
      toast.success("Reply posted to ticket thread")
    }, 400)
  }

  const handleQuickStatus = (status: TicketStatus) => {
    onStatusChange?.(ticket.id, status)
    toast.success(`Ticket status updated to ${status}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-[680px]">
        {/* Header */}
        <DialogHeader className="border-b border-zinc-100 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-bold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-lg border border-zinc-200">
                {ticket.id}
              </span>
              <span className="text-xs font-medium text-zinc-500 bg-zinc-50 px-2 py-0.5 rounded-md border border-zinc-100">
                {ticket.category}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Status Switcher Buttons */}
              {ticket.status !== "Resolved" ? (
                <button
                  type="button"
                  onClick={() => handleQuickStatus("Resolved")}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="size-3.5" />
                  <span>Mark Resolved</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleQuickStatus("Open")}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
                >
                  <span>Reopen Ticket</span>
                </button>
              )}
            </div>
          </div>

          <DialogTitle className="text-base font-bold text-zinc-900 mt-2">
            {ticket.subject}
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-400">
            Created on {ticket.createdAt} • Updated {ticket.updatedAt}
          </DialogDescription>
        </DialogHeader>

        {/* Content Body: Requester Meta + Issue Details */}
        <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-1">
          {/* Requester & Meta bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 px-4 rounded-xl bg-zinc-50 border border-zinc-200/70 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-full bg-zinc-200 text-zinc-700 font-bold flex items-center justify-center text-xs">
                {ticket.requester.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-zinc-900">
                  {ticket.requester.name}
                </span>
                <span className="text-[11px] text-zinc-400">
                  {ticket.requester.role} ({ticket.requester.email})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-zinc-500">
              <div>
                Priority:{" "}
                <strong className="text-zinc-800">{ticket.priority}</strong>
              </div>
              <div>•</div>
              <div>
                Assigned:{" "}
                <strong className="text-zinc-800">
                  {ticket.assignedTo?.name || "Unassigned"}
                </strong>
              </div>
            </div>
          </div>

          {/* Original Issue Description */}
          <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-amber-50/40 border border-amber-200/60 text-xs">
            <span className="font-semibold text-amber-900 uppercase text-[10px] tracking-wider">
              Issue Summary
            </span>
            <p className="text-zinc-700 leading-relaxed font-normal whitespace-pre-wrap">
              {ticket.description}
            </p>
          </div>

          {/* Thread messages */}
          <div className="flex flex-col gap-3 pt-2">
            <span className="text-xs font-bold text-zinc-900">
              Conversation Thread ({(ticket.messages || []).length})
            </span>

            {(ticket.messages || []).length > 0 ? (
              <div className="flex flex-col gap-3">
                {ticket.messages?.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "p-3.5 rounded-2xl border text-xs flex flex-col gap-1.5",
                      msg.isStaff
                        ? "bg-amber-50/50 border-amber-200/80 ml-4 sm:ml-8"
                        : "bg-white border-zinc-200/80 mr-4 sm:mr-8"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-900">
                          {msg.author}
                        </span>
                        <span
                          className={cn(
                            "px-2 py-0.2 rounded-full text-[10px] font-semibold border",
                            msg.isStaff
                              ? "bg-amber-100 text-amber-800 border-amber-200"
                              : "bg-zinc-100 text-zinc-600 border-zinc-200"
                          )}
                        >
                          {msg.authorRole}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-400">
                        {msg.createdAt}
                      </span>
                    </div>

                    <p className="text-zinc-700 leading-relaxed font-normal whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-zinc-200 text-center text-xs text-zinc-400">
                No replies posted yet. Send a response below.
              </div>
            )}
          </div>
        </div>

        {/* Reply Box Footer */}
        <form
          onSubmit={handleSendReply}
          className="pt-3 border-t border-zinc-100 flex flex-col gap-2.5"
        >
          <div className="relative">
            <textarea
              rows={2}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write an internal note or reply to requester..."
              className="w-full p-3 pr-12 rounded-xl border border-zinc-200/80 bg-zinc-50/50 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange resize-none"
            />
            <Button
              type="submit"
              disabled={isSending || !replyText.trim()}
              size="icon"
              className="absolute right-2 bottom-2.5 size-8 rounded-lg bg-brand-orange hover:bg-brand-orange/90 text-white cursor-pointer disabled:opacity-50"
            >
              <Send className="size-3.5" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
