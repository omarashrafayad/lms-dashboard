"use client"

import * as React from "react"
import { Building2, Globe, CalendarDays, Mail, Phone, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { GeneralSettings } from "../../types/settings.types"

interface GeneralSettingsTabProps {
  settings: GeneralSettings
  onChange: (updated: Partial<GeneralSettings>) => void
}

export function GeneralSettingsTab({
  settings,
  onChange,
}: GeneralSettingsTabProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Academy & Brand Identity Card */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs">
        <div className="flex items-start gap-4 pb-5 border-b border-zinc-100">
          <div className="size-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 text-brand-orange">
            <Building2 className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-900 tracking-tight">
              Academy & Institutional Identity
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Set the public name, branding details, and administrative contact channels displayed to students and teachers.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-5">
          {/* Academy Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-700">
              Institution / Platform Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={settings.academyName}
              onChange={(e) => onChange({ academyName: e.target.value })}
              placeholder="e.g. Innovation LMS Academy"
              className="h-10 px-3.5 rounded-xl border border-zinc-200/90 bg-white text-xs focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange"
            />
            <span className="text-[11px] text-zinc-400">
              Shown in student portals, emails, and platform headers.
            </span>
          </div>

          {/* Tagline */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-700">
              Tagline / Subheading
            </label>
            <Input
              type="text"
              value={settings.tagline}
              onChange={(e) => onChange({ tagline: e.target.value })}
              placeholder="e.g. Empowering excellence in modern digital education"
              className="h-10 px-3.5 rounded-xl border border-zinc-200/90 bg-white text-xs focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange"
            />
            <span className="text-[11px] text-zinc-400">
              Short slogan displayed under the institutional title.
            </span>
          </div>

          {/* Support Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
              <Mail className="size-3.5 text-zinc-400" />
              <span>Official Support Email</span> <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              value={settings.supportEmail}
              onChange={(e) => onChange({ supportEmail: e.target.value })}
              placeholder="support@innovation-lms.com"
              className="h-10 px-3.5 rounded-xl border border-zinc-200/90 bg-white text-xs focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange"
            />
            <span className="text-[11px] text-zinc-400">
              Inquiries and system replies will be routed from this address.
            </span>
          </div>

          {/* Support Phone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
              <Phone className="size-3.5 text-zinc-400" />
              <span>Contact Hotline / Phone</span>
            </label>
            <Input
              type="text"
              value={settings.phoneNumber}
              onChange={(e) => onChange({ phoneNumber: e.target.value })}
              placeholder="+20 100 123 4567"
              className="h-10 px-3.5 rounded-xl border border-zinc-200/90 bg-white text-xs focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange"
            />
            <span className="text-[11px] text-zinc-400">
              Emergency support number for parents and educators.
            </span>
          </div>

          {/* Campus Address (Full span) */}
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
              <MapPin className="size-3.5 text-zinc-400" />
              <span>Headquarters / Campus Address</span>
            </label>
            <Input
              type="text"
              value={settings.address}
              onChange={(e) => onChange({ address: e.target.value })}
              placeholder="e.g. New Cairo, Fifth Settlement, Cairo, Egypt"
              className="h-10 px-3.5 rounded-xl border border-zinc-200/90 bg-white text-xs focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange"
            />
          </div>
        </div>
      </div>

      {/* Regional & Localization */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs">
        <div className="flex items-start gap-4 pb-5 border-b border-zinc-100">
          <div className="size-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-blue-600">
            <Globe className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-900 tracking-tight">
              Localization & Region
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Configure system time calculations, display currency, and default language interface.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-5">
          {/* Default Language */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-700">
              Default System Language
            </label>
            <select
              value={settings.defaultLanguage}
              onChange={(e) => onChange({ defaultLanguage: e.target.value as "en" | "ar" })}
              className="h-10 px-3.5 rounded-xl border border-zinc-200/90 bg-white text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 cursor-pointer shadow-2xs"
            >
              <option value="en">English (US)</option>
              <option value="ar">العربية (Arabic)</option>
            </select>
            <span className="text-[11px] text-zinc-400">
              Primary language for administrative UI.
            </span>
          </div>

          {/* Timezone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-700">
              System Timezone
            </label>
            <select
              value={settings.timezone}
              onChange={(e) => onChange({ timezone: e.target.value })}
              className="h-10 px-3.5 rounded-xl border border-zinc-200/90 bg-white text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 cursor-pointer shadow-2xs"
            >
              <option value="Africa/Cairo (GMT+2)">Cairo (GMT+2)</option>
              <option value="Asia/Riyadh (GMT+3)">Riyadh (GMT+3)</option>
              <option value="Asia/Dubai (GMT+4)">Dubai (GMT+4)</option>
              <option value="Europe/London (GMT+1)">London (GMT+1)</option>
              <option value="America/New_York (EST)">New York (EST)</option>
              <option value="UTC">UTC (Universal Time)</option>
            </select>
            <span className="text-[11px] text-zinc-400">
              Schedules, lessons, and exam times align to this.
            </span>
          </div>

          {/* Currency */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-700">
              Billing & Transaction Currency
            </label>
            <select
              value={settings.currency}
              onChange={(e) => onChange({ currency: e.target.value })}
              className="h-10 px-3.5 rounded-xl border border-zinc-200/90 bg-white text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 cursor-pointer shadow-2xs"
            >
              <option value="USD ($)">USD ($) - US Dollar</option>
              <option value="EGP (E£)">EGP (E£) - Egyptian Pound</option>
              <option value="SAR (﷼)">SAR (﷼) - Saudi Riyal</option>
              <option value="AED (د.إ)">AED (د.إ) - UAE Dirham</option>
              <option value="EUR (€)">EUR (€) - Euro</option>
            </select>
            <span className="text-[11px] text-zinc-400">
              Applied across course fees and subscription plans.
            </span>
          </div>
        </div>
      </div>

      {/* Academic Term Configuration */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs">
        <div className="flex items-start gap-4 pb-5 border-b border-zinc-100">
          <div className="size-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0 text-purple-600">
            <CalendarDays className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-900 tracking-tight">
              Academic Calendar Period
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Designate the active schooling year and academic semester for reports and student grade records.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-5">
          {/* Academic Year */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-700">
              Active Academic Year
            </label>
            <select
              value={settings.academicYear}
              onChange={(e) => onChange({ academicYear: e.target.value })}
              className="h-10 px-3.5 rounded-xl border border-zinc-200/90 bg-white text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 cursor-pointer shadow-2xs"
            >
              <option value="2025 - 2026">2025 - 2026 (Current)</option>
              <option value="2024 - 2025">2024 - 2025 (Archived)</option>
              <option value="2026 - 2027">2026 - 2027 (Upcoming)</option>
            </select>
          </div>

          {/* Current Semester */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-700">
              Current Semester / Term
            </label>
            <select
              value={settings.currentSemester}
              onChange={(e) => onChange({ currentSemester: e.target.value })}
              className="h-10 px-3.5 rounded-xl border border-zinc-200/90 bg-white text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 cursor-pointer shadow-2xs"
            >
              <option value="Fall Semester">Fall Semester (Term 1)</option>
              <option value="Spring Semester">Spring Semester (Term 2)</option>
              <option value="Summer Term">Summer Accelerated Term</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
