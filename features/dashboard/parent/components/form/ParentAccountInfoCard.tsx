"use client"

import * as React from "react"
import { Control, FieldPath, FieldValues, PathValue, UseFormSetValue, useWatch } from "react-hook-form"
import { Check } from "lucide-react"

export interface ParentAccountInfoCardProps<
  TFieldValues extends FieldValues = FieldValues
> {
  control: Control<TFieldValues>
  setValue: UseFormSetValue<TFieldValues>
}

export function ParentAccountInfoCard<
  TFieldValues extends FieldValues = FieldValues
>({ control, setValue }: ParentAccountInfoCardProps<TFieldValues>) {
  const isActive =
    (useWatch({
      control,
      name: "isActive" as FieldPath<TFieldValues>,
    }) as boolean | undefined) ?? true

  const sendWelcomeEmail =
    (useWatch({
      control,
      name: "sendWelcomeEmail" as FieldPath<TFieldValues>,
    }) as boolean | undefined) ?? false

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <div className="size-6 rounded-full bg-[#FEF3C7] text-[#D97706] text-xs font-bold flex items-center justify-center shrink-0">
          2
        </div>
        <h2 className="text-sm font-bold text-zinc-900">Account Information</h2>
      </div>

      {/* Status Segmented Buttons */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-zinc-700">
          Account Status
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              setValue(
                "isActive" as FieldPath<TFieldValues>,
                true as PathValue<TFieldValues, FieldPath<TFieldValues>>,
                { shouldDirty: true, shouldValidate: true }
              )
            }
            className={`flex-1 sm:flex-none sm:w-36 h-10 rounded-xl text-xs font-semibold cursor-pointer transition-all border ${
              isActive
                ? "bg-[#FEF3C7] text-zinc-900 border-[#FDE68A] shadow-2xs"
                : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
            }`}
          >
            Active
          </button>

          <button
            type="button"
            onClick={() =>
              setValue(
                "isActive" as FieldPath<TFieldValues>,
                false as PathValue<TFieldValues, FieldPath<TFieldValues>>,
                { shouldDirty: true, shouldValidate: true }
              )
            }
            className={`flex-1 sm:flex-none sm:w-36 h-10 rounded-xl text-xs font-semibold cursor-pointer transition-all border ${
              !isActive
                ? "bg-[#FEF3C7] text-zinc-900 border-[#FDE68A] shadow-2xs"
                : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
            }`}
          >
            Inactive
          </button>
        </div>
      </div>

      {/* Send Welcome Email Checkbox */}
      <label className="flex items-center gap-2.5 cursor-pointer select-none pt-1">
        <input
          type="checkbox"
          checked={sendWelcomeEmail}
          onChange={(e) =>
            setValue(
              "sendWelcomeEmail" as FieldPath<TFieldValues>,
              e.target.checked as PathValue<TFieldValues, FieldPath<TFieldValues>>,
              { shouldDirty: true }
            )
          }
          className="sr-only"
        />
      </label>
    </div>
  )
}
