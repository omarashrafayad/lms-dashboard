"use client"

import * as React from "react"
import { Calendar, Clock, Loader2 } from "lucide-react"

export interface TimeSlotOption {
  time: string
  available: boolean
}

export interface ScheduleDateTimeStepProps {
  selectedDate: string
  onDateChange: (date: string) => void
  selectedTime: string
  onTimeChange: (time: string) => void
  computedSlots: TimeSlotOption[]
  todayFormatted?: string
  selectedTeacherName?: string
  isLoadingSlots?: boolean
}

export function ScheduleDateTimeStep({
  selectedDate,
  onDateChange,
  selectedTime,
  onTimeChange,
  computedSlots,
  selectedTeacherName,
  isLoadingSlots = false,
}: ScheduleDateTimeStepProps) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-base font-bold text-zinc-900 tracking-tight">
          Select Date & Time
        </h2>
        <p className="text-xs text-zinc-500">
          Choose a scheduled date and a confirmed time slot
          {selectedTeacherName ? ` with ${selectedTeacherName}` : ""}.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {/* Date Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
            SESSION DATE *
          </label>
          <div className="relative max-w-sm">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
            <input
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full h-11 pl-10 pr-4 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Time Slots Grid */}
        <div className="flex flex-col gap-2.5">
          <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
            AVAILABLE TIME SLOTS *
          </label>
          {isLoadingSlots ? (
            <div className="flex items-center justify-center p-8 bg-zinc-50 rounded-xl border border-zinc-100">
              <Loader2 className="size-5 animate-spin text-amber-500" />
              <span className="text-xs text-zinc-500 ml-2">Loading available slots...</span>
            </div>
          ) : computedSlots.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 bg-zinc-50/70 rounded-xl border border-dashed border-zinc-200 text-center">
              <Clock className="size-6 text-zinc-300 mb-2" />
              <span className="text-xs font-semibold text-zinc-700">No available slots for this date</span>
              <span className="text-[11px] text-zinc-400 mt-0.5">
                Please choose a different date to view available time slots.
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {computedSlots.map((slot) => {
                const isSelected = selectedTime === slot.time
                const isAvailable = slot.available

                return (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!isAvailable}
                    onClick={() => onTimeChange(slot.time)}
                    className={`h-11 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#F59E0B] bg-[#FFF9F2] text-[#D97706] shadow-2xs ring-2 ring-amber-500/20"
                        : isAvailable
                        ? "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
                        : "border-zinc-100 bg-zinc-50 text-zinc-300 cursor-not-allowed"
                    }`}
                  >
                    <Clock
                      className={`size-3.5 ${
                        isSelected
                          ? "text-[#D97706]"
                          : isAvailable
                          ? "text-zinc-400"
                          : "text-zinc-300"
                      }`}
                    />
                    <span>{slot.time}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
