"use client"

import * as React from "react"
import { Sliders, Clock, Users, UserCheck, AlertTriangle } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { SystemSettings } from "../../types/settings.types"

interface SystemSettingsTabProps {
  settings: SystemSettings
  onChange: (updated: Partial<SystemSettings>) => void
}

export function SystemSettingsTab({
  settings,
  onChange,
}: SystemSettingsTabProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Student Enrollment Rules */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs">
        <div className="flex items-start gap-4 pb-5 border-b border-zinc-100">
          <div className="size-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 text-brand-orange">
            <UserCheck className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-900 tracking-tight">
              Registration & Enrollment Controls
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Determine how new learners and parents can enter the academy system.
            </p>
          </div>
        </div>

        <div className="flex flex-col divide-y divide-zinc-100">
          <div className="flex items-center justify-between py-4">
            <div className="flex flex-col gap-0.5 pr-4">
              <span className="text-xs font-semibold text-zinc-900">
                Allow Open Student Self-Registration
              </span>
              <span className="text-[11px] text-zinc-400">
                When enabled, visitors can create student accounts freely from the portal without waiting for administrative invitation.
              </span>
            </div>
            <Switch
              checked={settings.studentSelfRegistration}
              onCheckedChange={(checked) =>
                onChange({ studentSelfRegistration: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="flex flex-col gap-0.5 pr-4">
              <span className="text-xs font-semibold text-zinc-900">
                Automatic Booking Confirmation
              </span>
              <span className="text-[11px] text-zinc-400">
                Automatically confirm private and group bookings when the designated educator slot is unreserved.
              </span>
            </div>
            <Switch
              checked={settings.autoApproveBookings}
              onCheckedChange={(checked) =>
                onChange({ autoApproveBookings: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="flex flex-col gap-0.5 pr-4">
              <span className="text-xs font-semibold text-zinc-900">
                Allow Teachers Custom Timetable Slots
              </span>
              <span className="text-[11px] text-zinc-400">
                Empower instructors to publish custom office hours outside predefined institutional blocks.
              </span>
            </div>
            <Switch
              checked={settings.allowTeacherCustomSlots}
              onCheckedChange={(checked) =>
                onChange({ allowTeacherCustomSlots: checked })
              }
            />
          </div>
        </div>
      </div>

      {/* Classroom & Capacity Defaults */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs">
        <div className="flex items-start gap-4 pb-5 border-b border-zinc-100">
          <div className="size-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0 text-purple-600">
            <Clock className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-900 tracking-tight">
              Classroom & Session Standards
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Set standard durations and classroom capacity caps for live sessions and curriculum lessons.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-5">
          {/* Default duration */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
              <Clock className="size-3.5 text-zinc-400" />
              <span>Default Live Session Duration</span>
            </label>
            <select
              value={settings.defaultSessionDurationMinutes}
              onChange={(e) =>
                onChange({
                  defaultSessionDurationMinutes: Number(e.target.value),
                })
              }
              className="h-10 px-3.5 rounded-xl border border-zinc-200/90 bg-white text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 cursor-pointer shadow-2xs"
            >
              <option value={30}>30 Minutes</option>
              <option value={45}>45 Minutes</option>
              <option value={60}>60 Minutes (Standard)</option>
              <option value={90}>90 Minutes (Lecture)</option>
              <option value={120}>120 Minutes (Workshop / Lab)</option>
            </select>
            <span className="text-[11px] text-zinc-400">
              Default length pre-selected when educators schedule live classes.
            </span>
          </div>

          {/* Max Capacity */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
              <Users className="size-3.5 text-zinc-400" />
              <span>Max Students Per Group Session</span>
            </label>
            <Input
              type="number"
              min={1}
              max={200}
              value={settings.maxStudentsPerGroupSession}
              onChange={(e) =>
                onChange({
                  maxStudentsPerGroupSession: Math.max(1, Number(e.target.value)),
                })
              }
              className="h-10 px-3.5 rounded-xl border border-zinc-200/90 bg-white text-xs focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange"
            />
            <span className="text-[11px] text-zinc-400">
              Prevents classroom overcrowding during live video streams.
            </span>
          </div>
        </div>
      </div>

      {/* Maintenance Mode Emergency Card */}
      <div className="bg-white rounded-2xl border border-red-200/70 p-6 shadow-2xs bg-gradient-to-r from-red-50/20 to-white">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="size-10 rounded-xl bg-red-100/70 border border-red-200 flex items-center justify-center shrink-0 text-red-600">
              <AlertTriangle className="size-5" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-zinc-900 tracking-tight">
                  Platform Maintenance Mode
                </h3>
                {settings.maintenanceMode && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white animate-pulse">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 max-w-xl">
                When enabled, students and instructors will see an informative maintenance splash screen. Only authenticated administrators can access backend tools.
              </p>
            </div>
          </div>
          <Switch
            checked={settings.maintenanceMode}
            onCheckedChange={(checked) => onChange({ maintenanceMode: checked })}
          />
        </div>
      </div>
    </div>
  )
}
