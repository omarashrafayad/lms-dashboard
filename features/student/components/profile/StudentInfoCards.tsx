"use client"

import * as React from "react"
import { StudentProfile } from "../../types/studentProfile.types"

interface StudentInfoCardsProps {
  profile: StudentProfile
}

export function StudentInfoCards({ profile }: StudentInfoCardsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Personal Information */}
      <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-2xs">
        <h2 className="text-sm font-bold text-zinc-900 mb-5">
          Personal Information
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-2 gap-y-4 gap-x-6">
          <div>
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              FULL NAME
            </div>
            <div className="text-sm font-medium text-zinc-800">
              {profile.fullName}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              DATE OF BIRTH
            </div>
            <div className="text-sm font-medium text-zinc-800">
              {profile.dateOfBirth}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              GENDER
            </div>
            <div className="text-sm font-medium text-zinc-800">
              {profile.gender}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              EMAIL
            </div>
            <div className="text-sm font-medium text-zinc-800 break-all">
              {profile.email}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              PHONE
            </div>
            <div className="text-sm font-medium text-zinc-800">
              {profile.phone}
            </div>
          </div>
        </div>
      </div>

      {/* Academic Information */}
      <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-2xs">
        <h2 className="text-sm font-bold text-zinc-900 mb-5">
          Academic Information
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-2 gap-y-4 gap-x-6">
          <div>
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              EDUCATION SYSTEM
            </div>
            <div className="text-sm font-medium text-zinc-800">
              {profile.educationSystem}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              EDUCATION STAGE
            </div>
            <div className="text-sm font-medium text-zinc-800">
              {profile.educationStage}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              GRADE
            </div>
            <div className="text-sm font-medium text-zinc-800">
              {profile.grade}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              SCHOOL
            </div>
            <div className="text-sm font-medium text-zinc-800">
              {profile.school}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              STUDENT ID
            </div>
            <div className="text-sm font-medium text-zinc-800">
              {profile.studentId}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
