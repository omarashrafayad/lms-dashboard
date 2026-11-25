"use client"

import * as React from "react"
import Link from "next/link"
import {
  Sparkles,
  ArrowRight,
  Search,
  PlayCircle,
  GraduationCap,
  Calendar,
  Award,
  IdCard,
} from "lucide-react"
import { MOCK_STUDENT_PROFILE } from "../data/mockStudentData"

interface StudentWelcomeBannerProps {
  onSearchChange?: (term: string) => void
  onContinueLearning?: () => void
}

export function StudentWelcomeBanner({
  onSearchChange,
  onContinueLearning,
}: StudentWelcomeBannerProps) {
  const profile = MOCK_STUDENT_PROFILE
  const [searchTerm, setSearchTerm] = React.useState("")

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 18) return "Good Afternoon"
    return "Good Evening"
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    if (onSearchChange) onSearchChange(e.target.value)
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#09090B] via-[#18181B] to-[#241908] text-white p-6 md:p-8 border border-amber-500/20 shadow-xl shadow-black/20">
      {/* Decorative Brand Orange Glow Orbs */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-brand-orange/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-20 w-72 h-72 rounded-full bg-[#FFB543]/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Greeting & Student Profile Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="relative size-20 rounded-2xl overflow-hidden border-2 border-brand-orange/60 shadow-lg shadow-brand-orange/15 shrink-0 bg-zinc-900">
            <img
              src={profile.avatar}
              alt={profile.fullName}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-1 right-1 size-3 rounded-full bg-brand-orange ring-2 ring-zinc-950" />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-orange/20 text-[#FFB543] border border-brand-orange/30 flex items-center gap-1">
                <Sparkles className="size-3 text-[#FFB543]" />
                {profile.grade} • {profile.semester}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/10 text-zinc-200 border border-white/10">
                ID: {profile.studentId}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-400/20 text-amber-200 border border-amber-300/30">
                ★ {profile.subscriptionPlan}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {getGreeting()}, {profile.fullName.split(" ")[0]}!
            </h1>
            <p className="text-sm text-zinc-300 max-w-xl font-normal leading-relaxed">
              &quot;Welcome back, {profile.fullName.split(" ")[0]}! Ready to continue your learning journey?&quot;
            </p>
          </div>
        </div>

        {/* Right: Quick Action & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          {/* Quick Search */}
          <div className="relative min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search courses or lessons..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-brand-orange/50 focus:bg-white/15 transition-all"
            />
          </div>

          {/* Continue Learning Prominent Button */}
          <Link
            href="/student/courses"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-zinc-950 font-bold text-xs shadow-lg shadow-brand-orange/25 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <PlayCircle className="size-4 fill-zinc-950 text-brand-orange" />
            <span>Continue Learning</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
