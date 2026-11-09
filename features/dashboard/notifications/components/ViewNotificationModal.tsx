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
import {
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  Users,
  AlertCircle,
  ExternalLink,
} from "lucide-react"
import { ApiNotification } from "../types/notifications.types"

export interface ViewNotificationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  notification: ApiNotification | null
}

export function ViewNotificationModal({
  open,
  onOpenChange,
  notification,
}: ViewNotificationModalProps) {
  if (!notification) return null

  const formattedDate = notification.createdAt
    ? new Date(notification.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—"

  const getRecipientSummary = () => {
    switch (notification.targetRole) {
      case "students": {
        const details = [
          notification.targetStageName,
          notification.targetGradeName,
          notification.targetSystemName,
        ]
          .filter(Boolean)
          .join(" • ")
        return `Students ${details ? `(${details})` : "(All Students)"}`
      }
      case "teachers":
        return "Teachers & Instructors Only"
      case "parents": {
        const details = [
          notification.targetStageName,
          notification.targetGradeName,
        ]
          .filter(Boolean)
          .join(" • ")
        return `Parents & Guardians ${details ? `(${details})` : "(All Parents)"}`
      }
      case "course":
        return notification.targetCourseName
          ? `Enrolled Students in Course: ${notification.targetCourseName}`
          : "Specific Course Students"
      case "plan":
        return notification.targetPlanName
          ? `Members of Plan: ${notification.targetPlanName}`
          : "Specific Subscription Plan"
      default:
        return "All Users (General Broadcast)"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onClose={() => onOpenChange(false)}
        className="max-w-[580px] p-6 max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader className="gap-1">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="size-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Bell className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-zinc-900">
                {notification.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Notification Details & Target Audience
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          {/* Target Audience Highlight Box */}
          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/60 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
              <Users className="size-4 text-amber-700" />
              <span>Target Recipients</span>
            </div>
            <p className="text-xs font-semibold text-amber-950 pl-6">
              {getRecipientSummary()}
            </p>
          </div>

          {/* Status & Priority Row */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-200/60">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-zinc-400 font-medium">Status</span>
              <div>
                {notification.isPublished ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    <CheckCircle2 className="size-3 text-emerald-600" />
                    Published
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-600 border border-zinc-200">
                    <Clock className="size-3 text-zinc-400" />
                    Draft
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-zinc-400 font-medium">Priority</span>
              <div>
                {notification.priority === "urgent" ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/70">
                    <AlertCircle className="size-3 text-rose-600" />
                    Urgent
                  </span>
                ) : notification.priority === "important" ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/70">
                    Important
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-600 border border-zinc-200">
                    Normal
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-zinc-700">Summary</span>
            <p className="text-xs text-zinc-600 bg-zinc-50/70 p-3 rounded-xl border border-zinc-200/50 leading-relaxed">
              {notification.summary}
            </p>
          </div>

          {/* Full Content */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-zinc-700">Full Message Content</span>
            <div className="text-xs text-zinc-800 bg-white p-4 rounded-xl border border-zinc-200/80 leading-relaxed whitespace-pre-line">
              {notification.content}
            </div>
          </div>

          {/* Action Link & Date */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500 pt-2 border-t border-zinc-100">
            <div className="flex items-center gap-1.5">
              <Calendar className="size-3.5 text-zinc-400" />
              <span>Broadcasted: {formattedDate}</span>
            </div>

            {notification.actionUrl && (
              <a
                href={notification.actionUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-orange hover:underline"
              >
                <span>Open Target Link</span>
                <ExternalLink className="size-3" />
              </a>
            )}
          </div>
        </div>

        <DialogFooter className="mt-4 pt-3 border-t border-zinc-100">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-10 px-5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold shadow-2xs cursor-pointer ml-auto"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
