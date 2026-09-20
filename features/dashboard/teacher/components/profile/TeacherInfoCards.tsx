"use client"

import * as React from "react"
import { TeacherProfile } from "../../types/teacherProfile.types"

interface TeacherInfoCardsProps {
  profile: TeacherProfile
}

export function TeacherInfoCards({ profile }: TeacherInfoCardsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Personal Information */}
      <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-2xs">
        <h2 className="text-sm font-bold text-zinc-900 mb-5">
          Personal Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
          <div>
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              FULL NAME
            </div>
            <div className="text-sm font-medium text-zinc-800">
              {profile.personalInfo.fullName}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              DATE OF BIRTH
            </div>
            <div className="text-sm font-medium text-zinc-800">
              {profile.personalInfo.dateOfBirth}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              GENDER
            </div>
            <div className="text-sm font-medium text-zinc-800">
              {profile.personalInfo.gender}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              EMAIL
            </div>
            <div className="text-sm font-medium text-zinc-800 break-all">
              {profile.personalInfo.email}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              PHONE
            </div>
            <div className="text-sm font-medium text-zinc-800">
              {profile.personalInfo.phone}
            </div>
          </div>
        </div>
      </div>

      {/* Professional Information */}
      <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-2xs">
        <h2 className="text-sm font-bold text-zinc-900 mb-5">
          Professional Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
          <div>
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              SUBJECTS
            </div>
            <div className="text-sm font-medium text-zinc-800">
              {profile.professionalInfo.subjects.join(", ")}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              QUALIFICATIONS
            </div>
            <div className="text-sm font-medium text-zinc-800">
              {profile.professionalInfo.qualifications}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              YEARS OF EXPERIENCE
            </div>
            <div className="text-sm font-medium text-zinc-800">
              {profile.professionalInfo.yearsOfExperience}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              TEACHING LEVELS
            </div>
            <div className="text-sm font-medium text-zinc-800">
              {profile.professionalInfo.teachingLevels.join(", ")}
            </div>
          </div>

          <div className="sm:col-span-2">
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              BIO
            </div>
            <div className="text-sm font-normal text-zinc-600 leading-relaxed">
              {profile.professionalInfo.bio}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
