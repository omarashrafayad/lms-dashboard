"use client"

import * as React from "react"
import { ParentPersonalInfo } from "../../types/parentProfile.types"
import { User, Phone, MapPin, Shield, Globe } from "lucide-react"

export interface ParentPersonalInfoTabProps {
  personalInfo: ParentPersonalInfo
}

export function ParentPersonalInfoTab({
  personalInfo,
}: ParentPersonalInfoTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {/* Card 1: Personal & Identification Information */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col gap-5">
        <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-100">
          <div className="size-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <User className="size-4" />
          </div>
          <h3 className="text-sm font-bold text-zinc-900">
            Personal & Identification
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-zinc-400 block mb-1">Full Legal Name</span>
            <span className="font-semibold text-zinc-800">{personalInfo.fullName}</span>
          </div>

          <div>
            <span className="text-zinc-400 block mb-1">National ID / Passport</span>
            <span className="font-semibold text-zinc-800">{personalInfo.nationalId}</span>
          </div>

          <div>
            <span className="text-zinc-400 block mb-1">Primary Email</span>
            <span className="font-semibold text-zinc-800">{personalInfo.email}</span>
          </div>

          <div>
            <span className="text-zinc-400 block mb-1">Primary Phone</span>
            <span className="font-semibold text-zinc-800">{personalInfo.phone}</span>
          </div>

          <div>
            <span className="text-zinc-400 block mb-1">Secondary / WhatsApp Phone</span>
            <span className="font-semibold text-zinc-800">{personalInfo.secondaryPhone || "—"}</span>
          </div>

          <div>
            <span className="text-zinc-400 block mb-1">Relationship to Students</span>
            <span className="font-semibold text-zinc-800">{personalInfo.relationshipToStudents}</span>
          </div>
        </div>
      </div>

      {/* Card 2: Address & Emergency Details */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col gap-5">
        <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-100">
          <div className="size-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <MapPin className="size-4" />
          </div>
          <h3 className="text-sm font-bold text-zinc-900">
            Address & Emergency Contact
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="sm:col-span-2">
            <span className="text-zinc-400 block mb-1">Residential Address</span>
            <span className="font-semibold text-zinc-800">{personalInfo.address}</span>
          </div>

          <div>
            <span className="text-zinc-400 block mb-1">City</span>
            <span className="font-semibold text-zinc-800">{personalInfo.city}</span>
          </div>

          <div>
            <span className="text-zinc-400 block mb-1">Country</span>
            <span className="font-semibold text-zinc-800">{personalInfo.country}</span>
          </div>

          <div>
            <span className="text-zinc-400 block mb-1">Preferred Language</span>
            <span className="font-semibold text-zinc-800">{personalInfo.preferredLanguage}</span>
          </div>

          <div>
            <span className="text-zinc-400 block mb-1">Emergency Contact</span>
            <span className="font-semibold text-zinc-800">{personalInfo.emergencyContactName}</span>
          </div>

          <div>
            <span className="text-zinc-400 block mb-1">Emergency Contact Phone</span>
            <span className="font-semibold text-zinc-800">{personalInfo.emergencyContactPhone}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
