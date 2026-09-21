"use client"

import * as React from "react"
import { X, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SlotItem {
  id: string
  start: string
  end: string
}

export interface DayAvailability {
  dayName: string
  dayOfWeek: number
  slots: SlotItem[]
}

export interface TeacherAvailabilityFormCardProps {
  setAvailabilityNow: "Yes" | "Skip"
  onSetAvailabilityNowChange: (val: "Yes" | "Skip") => void
  availability: DayAvailability[]
  onAddSlot: (dayOfWeek: number) => void
  onRemoveSlot: (dayOfWeek: number, slotId: string) => void
  onUpdateSlot: (
    dayOfWeek: number,
    slotId: string,
    field: "start" | "end",
    val: string
  ) => void
}

export function TeacherAvailabilityFormCard({
  setAvailabilityNow,
  onSetAvailabilityNowChange,
  availability,
  onAddSlot,
  onRemoveSlot,
  onUpdateSlot,
}: TeacherAvailabilityFormCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-2xs">
      <h2 className="text-sm font-bold text-zinc-900 mb-4">
        Availability Setup
      </h2>

      <div className="mb-6">
        <label className="block text-xs font-medium text-zinc-700 mb-2">
          Set availability schedule?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <button
            type="button"
            onClick={() => onSetAvailabilityNowChange("Yes")}
            className={cn(
              "flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer",
              setAvailabilityNow === "Yes"
                ? "border-amber-400 bg-[#FFFBEB] ring-1 ring-amber-400/60"
                : "border-zinc-200 bg-white hover:border-zinc-300"
            )}
          >
            <div
              className={cn(
                "size-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                setAvailabilityNow === "Yes"
                  ? "border-amber-500 bg-white"
                  : "border-zinc-300 bg-white"
              )}
            >
              {setAvailabilityNow === "Yes" && (
                <div className="size-2 rounded-full bg-amber-500" />
              )}
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-900 leading-tight">
                Yes
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5">
                Configure weekly time slots
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onSetAvailabilityNowChange("Skip")}
            className={cn(
              "flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer",
              setAvailabilityNow === "Skip"
                ? "border-amber-400 bg-[#FFFBEB] ring-1 ring-amber-400/60"
                : "border-zinc-200 bg-white hover:border-zinc-300"
            )}
          >
            <div
              className={cn(
                "size-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                setAvailabilityNow === "Skip"
                  ? "border-amber-500 bg-white"
                  : "border-zinc-300 bg-white"
              )}
            >
              {setAvailabilityNow === "Skip" && (
                <div className="size-2 rounded-full bg-amber-500" />
              )}
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-900 leading-tight">
                Skip for now
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5">
                Set it up later
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Days Schedule List */}
      {setAvailabilityNow === "Yes" && (
        <div className="flex flex-col divide-y divide-zinc-100">
          {availability.map((dayItem) => (
            <div
              key={dayItem.dayName}
              className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="w-28 text-xs font-semibold text-zinc-800 shrink-0">
                {dayItem.dayName}
              </div>

              <div className="flex-1 flex flex-wrap items-center gap-3">
                {dayItem.slots.length === 0 ? (
                  <span className="text-xs text-zinc-400 italic">
                    No time slots
                  </span>
                ) : (
                  dayItem.slots.map((slot) => (
                    <div
                      key={slot.id}
                      className="inline-flex items-center gap-2 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-xl text-xs"
                    >
                      <input
                        type="time"
                        value={slot.start}
                        onChange={(e) =>
                          onUpdateSlot(
                            dayItem.dayOfWeek,
                            slot.id,
                            "start",
                            e.target.value
                          )
                        }
                        className="text-xs font-medium text-zinc-800 bg-transparent focus:outline-none"
                      />
                      <span className="text-zinc-400">-</span>
                      <input
                        type="time"
                        value={slot.end}
                        onChange={(e) =>
                          onUpdateSlot(
                            dayItem.dayOfWeek,
                            slot.id,
                            "end",
                            e.target.value
                          )
                        }
                        className="text-xs font-medium text-zinc-800 bg-transparent focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => onRemoveSlot(dayItem.dayOfWeek, slot.id)}
                        className="text-zinc-400 hover:text-red-500 transition-colors p-0.5 ml-0.5 cursor-pointer"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="shrink-0">
                <button
                  type="button"
                  onClick={() => onAddSlot(dayItem.dayOfWeek)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  <span>Add time slot</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
