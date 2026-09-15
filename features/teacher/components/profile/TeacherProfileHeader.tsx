"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { TeacherProfile } from "../../types/teacherProfile.types"
import { cn } from "@/lib/utils"

interface TeacherProfileHeaderProps {
  profile: TeacherProfile
}

export function TeacherProfileHeader({ profile }: TeacherProfileHeaderProps) {
  const isActive = profile.status === "Active"
  const isAvailable = profile.availabilityStatus === "Available"

  return (
    <div className="flex flex-col gap-5">
      {/* Back link */}
      <div>
        <Link
          href="/teacher/teacher_list"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors group cursor-pointer"
        >
          <ChevronLeft className="size-4 text-zinc-400 group-hover:text-zinc-700 transition-colors" />
          <span>Back to All Teachers</span>
        </Link>
      </div>

      {/* Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Avatar + Details */}
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "size-14 rounded-full font-bold text-base flex items-center justify-center shrink-0 select-none shadow-2xs",
              profile.avatarColorClass || "bg-sky-100 text-sky-700"
            )}
          >
            {profile.avatarInitials}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-zinc-900 leading-tight">
                {profile.name}
              </h1>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
                  isActive
                    ? "text-emerald-700 bg-emerald-50 border-emerald-200/70"
                    : "text-zinc-600 bg-zinc-50 border-zinc-200"
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    isActive ? "bg-emerald-500" : "bg-zinc-400"
                  )}
                />
                {profile.status}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-500 font-normal mt-1">
              <span className="font-medium text-zinc-600">{profile.code}</span>
              <span className="text-zinc-300">•</span>
              <span className="inline-flex items-center gap-1.5 text-zinc-600 font-medium">
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    isAvailable ? "bg-emerald-500" : "bg-amber-500"
                  )}
                />
                {profile.availabilityStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Edit Teacher Button */}
        <div>
          <Link
            href={`/teacher/${profile.id}/edit`}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-xs font-medium text-white bg-brand-orange hover:bg-amber-500 transition-all shadow-2xs cursor-pointer active:scale-[0.98]"
          >
            Edit Teacher
          </Link>
        </div>
      </div>
    </div>
  )
}
