"use client"

import * as React from "react"
import Link from "next/link"
import {
  Bell,
  Pin,
  Paperclip,
  Download,
  ArrowRight,
  User,
  Calendar,
} from "lucide-react"
import { Announcement } from "../types/studentPortal.types"
import { MOCK_ANNOUNCEMENTS } from "../data/mockStudentData"

interface StudentAnnouncementsProps {
  announcements?: Announcement[]
}

export function StudentAnnouncements({
  announcements = MOCK_ANNOUNCEMENTS,
}: StudentAnnouncementsProps) {
  const [expandedId, setExpandedId] = React.useState<string | null>(null)

  return (
    <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-5">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <Bell className="size-5 text-brand-orange" />
          <h2 className="text-base font-bold text-zinc-900">
            Announcements & School Notices
          </h2>
        </div>
        <Link
          href="/student/notifications"
          className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 transition-colors"
        >
          <span>View All Notices</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {announcements.map((ann) => {
          const isExpanded = expandedId === ann.id

          return (
            <div
              key={ann.id}
              className="p-4 rounded-xl bg-zinc-50/70 border border-zinc-200/70 hover:bg-zinc-50 transition-all flex flex-col gap-2.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {ann.isPinned && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                      <Pin className="size-2.5 fill-current" /> Pinned
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                    {ann.courseOrSubject}
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    {ann.date}
                  </span>
                </div>
              </div>

              <h3 className="text-xs font-bold text-zinc-900 leading-snug">
                {ann.title}
              </h3>

              <p className={`text-xs text-zinc-600 leading-relaxed ${isExpanded ? "" : "line-clamp-2"}`}>
                {ann.description}
              </p>

              {/* Publisher & Attachment Action */}
              <div className="flex items-center justify-between text-xs text-zinc-400 pt-1 border-t border-zinc-200/50">
                <span className="text-[11px]">
                  By: <strong className="text-zinc-700">{ann.publisher}</strong> ({ann.publisherRole})
                </span>

                <div className="flex items-center gap-2">
                  {ann.attachmentName && (
                    <button
                      type="button"
                      className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 hover:text-emerald-800 cursor-pointer"
                    >
                      <Paperclip className="size-3" />
                      <span>{ann.attachmentName}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : ann.id)}
                    className="text-[11px] font-semibold text-zinc-500 hover:text-zinc-800 cursor-pointer"
                  >
                    {isExpanded ? "Show Less" : "Read More"}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
