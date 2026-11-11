"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  Layers,
  GraduationCap,
  Video,
  FileText,
  HelpCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

export type ContentCurriculumTabKey =
  | "chapters"
  | "units"
  | "lessons"
  | "videos"
  | "pdfs"
  | "quizzes"

interface TabItem {
  key: ContentCurriculumTabKey
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  count?: number
}

const TABS: TabItem[] = [
  {
    key: "chapters",
    label: "Chapters",
    href: "/curriculum/chapters",
    icon: BookOpen,
  },
  {
    key: "units",
    label: "Units",
    href: "/curriculum/units",
    icon: Layers,
  },
  {
    key: "lessons",
    label: "Lessons",
    href: "/curriculum/lessons",
    icon: GraduationCap,
  },
  {
    key: "videos",
    label: "Videos",
    href: "/content/videos",
    icon: Video,
  },
  {
    key: "pdfs",
    label: "PDFs & Books",
    href: "/content/pdfs",
    icon: FileText,
  },
  {
    key: "quizzes",
    label: "Quizzes",
    href: "/content/quizzes",
    icon: HelpCircle,
  },
]

export interface ContentCurriculumTabsProps {
  activeTab: ContentCurriculumTabKey
  totalCount?: number
}

export function ContentCurriculumTabs({
  activeTab,
  totalCount,
}: ContentCurriculumTabsProps) {
  const pathname = usePathname()

  return (
    <div className="w-full border-b border-zinc-200 bg-white px-2 rounded-t-2xl">
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive =
            tab.key === activeTab ||
            pathname === tab.href ||
            pathname.startsWith(tab.href)

          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer border-b-2",
                isActive
                  ? "border-brand-orange text-brand-orange bg-brand-orange/5"
                  : "border-transparent text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
              )}
            >
              <Icon
                className={cn(
                  "size-4 transition-colors",
                  isActive ? "text-brand-orange" : "text-zinc-400"
                )}
              />
              <span>{tab.label}</span>
              {isActive && typeof totalCount === "number" && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-brand-orange/10 text-brand-orange">
                  {totalCount}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

