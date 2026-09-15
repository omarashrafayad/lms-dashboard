"use client"

import * as React from "react"
import { DaySchedule } from "../../types/teacherProfile.types"
import { cn } from "@/lib/utils"

interface TeacherAvailabilityCardProps {
  schedule: DaySchedule[]
  currentStatus?: string
}

export function TeacherAvailabilityCard({
  schedule,
  currentStatus = "Available",
}: TeacherAvailabilityCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-2xs flex flex-col gap-6">
      {/* Top Header: Title, Current Status & Legend */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
        <h2 className="text-sm font-bold text-zinc-900">Availability</h2>

        <div className="flex flex-wrap items-center gap-6 text-xs">
          {/* Current status display */}
          <div className="flex items-center gap-2 text-zinc-600 font-medium">
            <span>Current status:</span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
              <span className="size-2 rounded-full bg-emerald-500" />
              {currentStatus}
            </span>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-zinc-500 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-blue-500" />
              <span>Booked</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-amber-500" />
              <span>Busy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-zinc-400" />
              <span>Unavailable</span>
            </div>
          </div>
        </div>
      </div>

      {/* Days Rows */}
      <div className="flex flex-col divide-y divide-zinc-100">
        {schedule.map((item) => (
          <div
            key={item.day}
            className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8"
          >
            {/* Day name column */}
            <div className="w-28 text-xs font-semibold text-zinc-800 shrink-0">
              {item.day}
            </div>

            {/* Time slot chips */}
            <div className="flex flex-wrap items-center gap-2.5 flex-1">
              {item.isUnavailable || item.slots.length === 0 ? (
                <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-500 border border-zinc-200">
                  Unavailable
                </span>
              ) : (
                item.slots.map((slot) => {
                  const isBooked = slot.status === "Booked"
                  const isBusy = slot.status === "Busy"
                  const isUnavailable = slot.status === "Unavailable"

                  return (
                    <span
                      key={slot.id}
                      className={cn(
                        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                        isBooked
                          ? "bg-blue-50/80 border-blue-200 text-blue-700"
                          : isBusy
                          ? "bg-amber-50 border-amber-200 text-amber-700"
                          : isUnavailable
                          ? "bg-zinc-100 border-zinc-200 text-zinc-500"
                          : "bg-emerald-50/70 border-emerald-300 text-emerald-700"
                      )}
                    >
                      <span>
                        {slot.start} - {slot.end}
                      </span>
                      <span className="text-zinc-300">•</span>
                      <span className="font-semibold text-[11px]">
                        {slot.status || "Available"}
                      </span>
                    </span>
                  )
                })
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
