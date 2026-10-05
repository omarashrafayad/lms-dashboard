import * as React from "react"
import { cn } from "@/lib/utils"
import { ExamLevel, ExamStatus, ExamType } from "../../types/exam.types"

export function ExamTypeBadge({
  type,
  className,
}: {
  type: ExamType
  className?: string
}) {
  const styles: Record<ExamType, string> = {
    Monthly: "bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]",
    Subject: "bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]",
    Course: "bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border shadow-2xs",
        styles[type] || "bg-zinc-100 text-zinc-700 border-zinc-200",
        className
      )}
    >
      {type}
    </span>
  )
}

export function ExamLevelBadge({
  level,
  className,
}: {
  level: ExamLevel
  className?: string
}) {
  const styles: Record<ExamLevel, string> = {
    Beginner: "bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]",
    Intermediate: "bg-[#EDE9FE] text-[#6D28D9] border-[#DDD6FE]",
    Advanced: "bg-[#FEF9C3] text-[#854D0E] border-[#FEF08A]",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border shadow-2xs",
        styles[level] || "bg-zinc-100 text-zinc-700 border-zinc-200",
        className
      )}
    >
      {level}
    </span>
  )
}

export function ExamStatusBadge({
  status,
  className,
}: {
  status: ExamStatus
  className?: string
}) {
  if (status === "Published") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0] shadow-2xs",
          className
        )}
      >
        <span className="size-1.5 rounded-full bg-[#16A34A]" />
        Published
      </span>
    )
  }

  if (status === "Draft") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] shadow-2xs",
          className
        )}
      >
        <span className="size-1.5 rounded-full bg-[#D97706]" />
        Draft
      </span>
    )
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-600 border border-zinc-200 shadow-2xs",
        className
      )}
    >
      <span className="size-1.5 rounded-full bg-zinc-400" />
      Archived
    </span>
  )
}

export function ExamResultBadge({
  result,
  className,
}: {
  result: "Passed" | "Failed" | "Not Attempted"
  className?: string
}) {
  if (result === "Passed") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0] shadow-2xs",
          className
        )}
      >
        <span className="size-1.5 rounded-full bg-[#16A34A]" />
        Passed
      </span>
    )
  }

  if (result === "Failed") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#FEE2E2] text-[#B91C1C] border border-[#FECACA] shadow-2xs",
          className
        )}
      >
        <span className="size-1.5 rounded-full bg-[#DC2626]" />
        Failed
      </span>
    )
  }

  return (
    <span className={cn("text-xs font-medium text-zinc-500", className)}>
      Not Attempted
    </span>
  )
}
