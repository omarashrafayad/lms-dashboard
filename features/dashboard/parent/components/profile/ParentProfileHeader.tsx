"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronLeft, Pencil } from "lucide-react"
import { ParentProfile } from "../../types/parentProfile.types"

export interface ParentProfileHeaderProps {
  profile: ParentProfile
  onDeactivate?: () => void
  onEdit?: () => void
}

export function ParentProfileHeader({
  profile,
  onDeactivate,
  onEdit,
}: ParentProfileHeaderProps) {
  const isActive = profile.status === "Active"

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Back Link */}
      <div>
        <Link
          href="/parent/parent_list"
          className="inline-flex items-center gap-2 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors group cursor-pointer"
        >
          <ChevronLeft className="size-4 text-zinc-500 group-hover:text-zinc-800 transition-colors" />
          <span>Back to All Parents</span>
        </Link>
      </div>

      {/* Main Profile Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Avatar + Details */}
        <div className="flex items-center gap-4">
          <div className="relative size-14 rounded-full overflow-hidden shrink-0 border border-zinc-200 shadow-2xs bg-zinc-100 flex items-center justify-center">
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="size-full object-cover"
              />
            ) : (
              <span className={`font-bold text-base ${profile.avatarColorClass}`}>
                {profile.avatarInitials}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-zinc-900 tracking-tight leading-tight">
                {profile.name}
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  isActive
                    ? "text-emerald-700 bg-emerald-50 border-emerald-200/60"
                    : "text-zinc-500 bg-zinc-50 border-zinc-200"
                }`}
              >
                <span
                  className={`size-1.5 rounded-full ${
                    isActive ? "bg-emerald-500" : "bg-zinc-400"
                  }`}
                />
                {profile.status}
              </span>
            </div>

            <div className="text-xs text-zinc-400 font-normal mt-1">
              Parent ID · {profile.code}
            </div>
          </div>
        </div>

        {/* Right: Deactivate & Edit Parent Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onDeactivate}
            className="px-4 py-2 rounded-xl text-xs font-medium text-rose-600 bg-white border border-rose-200 hover:bg-rose-50/70 transition-all cursor-pointer shadow-2xs"
          >
            Deactivate
          </button>

          <Link
            href={`/parent/${profile.id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-zinc-800 bg-white border border-zinc-200/90 hover:bg-zinc-50 transition-all cursor-pointer shadow-2xs"
          >
            <Pencil className="size-3.5 text-zinc-500" />
            <span>Edit Parent</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
