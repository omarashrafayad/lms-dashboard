"use client"

import * as React from "react"
import { Control, FieldPath, FieldValues, useWatch } from "react-hook-form"
import { Plus, Check, Loader2 } from "lucide-react"
import { LinkedChildItem } from "./ParentLinkChildrenCard"

export interface ParentReviewSummaryCardProps<
  TFieldValues extends FieldValues = FieldValues
> {
  control: Control<TFieldValues>
  linkedChildren: LinkedChildItem[]
  isSubmitting: boolean
  onCancel: () => void
  submitLabel?: string
  isEditMode?: boolean
}

export function ParentReviewSummaryCard<
  TFieldValues extends FieldValues = FieldValues
>({
  control,
  linkedChildren,
  isSubmitting,
  onCancel,
  submitLabel = "Create Parent",
  isEditMode = false,
}: ParentReviewSummaryCardProps<TFieldValues>) {
  const firstName =
    (useWatch({
      control,
      name: "firstName" as FieldPath<TFieldValues>,
    }) as string | undefined) ?? ""
  const lastName =
    (useWatch({
      control,
      name: "lastName" as FieldPath<TFieldValues>,
    }) as string | undefined) ?? ""
  const email =
    (useWatch({
      control,
      name: "email" as FieldPath<TFieldValues>,
    }) as string | undefined) ?? ""
  const phoneNumber =
    (useWatch({
      control,
      name: "phoneNumber" as FieldPath<TFieldValues>,
    }) as string | undefined) ?? ""
  const isActive =
    (useWatch({
      control,
      name: "isActive" as FieldPath<TFieldValues>,
    }) as boolean | undefined) ?? true

  const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(" ")

  return (
    <div className="sticky top-24 flex flex-col gap-4">
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col gap-6">
        {/* Review Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-900">Review</h3>
          <span className="text-xs text-zinc-400 font-normal">Live summary</span>
        </div>

        {/* Parent Information Summary */}
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
            PARENT INFORMATION
          </span>

          <div className="flex flex-col divide-y divide-zinc-100 text-xs">
            <div className="flex items-center justify-between py-2.5">
              <span className="text-zinc-400 font-normal">Full Name</span>
              <span className="font-semibold text-zinc-900">
                {fullName || "—"}
              </span>
            </div>

            <div className="flex items-center justify-between py-2.5">
              <span className="text-zinc-400 font-normal">Email</span>
              <span className="font-semibold text-zinc-900 break-all">
                {email || "—"}
              </span>
            </div>

            <div className="flex items-center justify-between py-2.5">
              <span className="text-zinc-400 font-normal">Phone</span>
              <span className="font-semibold text-zinc-900">
                {phoneNumber || "—"}
              </span>
            </div>

            <div className="flex items-center justify-between py-2.5">
              <span className="text-zinc-400 font-normal">Account Status</span>
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${
                  isActive
                    ? "text-emerald-700 bg-emerald-50 border-emerald-200/60"
                    : "text-zinc-500 bg-zinc-50 border-zinc-200"
                }`}
              >
                <span
                  className={`size-1.5 rounded-full ${
                    isActive ? "bg-emerald-500" : "bg-zinc-400"
                  }`}
                />
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        {/* Linked Children Summary */}
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
            LINKED CHILDREN ({linkedChildren.length})
          </span>

          {linkedChildren.length === 0 ? (
            <span className="text-xs text-zinc-400 font-normal">
              No children selected.
            </span>
          ) : (
            <div className="flex flex-col gap-2.5">
              {linkedChildren.map((child) => (
                <div key={child.id} className="flex items-center gap-2.5 text-xs">
                  <div className="size-7 rounded-full bg-amber-100 text-amber-800 font-semibold text-[10px] flex items-center justify-center shrink-0">
                    {child.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-zinc-900 leading-tight truncate">
                      {child.name}
                    </span>
                    <span className="text-[11px] text-zinc-400 truncate">
                      {[child.grade, child.stage]
                        .filter((v) => v && v !== "—")
                        .join(" · ") || child.grade}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="flex flex-col gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-white font-medium text-xs flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : isEditMode ? (
              <Check className="size-4 stroke-[2.5]" />
            ) : (
              <Plus className="size-4 stroke-[2.5]" />
            )}
            <span>
              {isSubmitting
                ? isEditMode
                  ? "Saving..."
                  : "Creating..."
                : submitLabel}
            </span>
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full h-10 rounded-xl bg-white border border-zinc-200/90 hover:bg-zinc-50 text-zinc-700 font-medium text-xs flex items-center justify-center transition-all cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
