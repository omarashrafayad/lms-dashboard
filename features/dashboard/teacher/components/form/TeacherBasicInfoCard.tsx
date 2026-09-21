"use client"

import * as React from "react"
import { Control, FieldPath, FieldValues } from "react-hook-form"
import { UniInput } from "@/components/shared/UniInput"
import { UniSelect } from "@/components/shared/UniSelect"
import { useGenders } from "@/features/dashboard/reference-data/hooks/useReferenceData"
import { cn } from "@/lib/utils"

export interface TeacherBasicInfoCardProps<TFieldValues extends FieldValues = any> {
  control: Control<TFieldValues>
  isEditMode?: boolean
  isActive: boolean
  onIsActiveChange: (val: boolean) => void
}

export function TeacherBasicInfoCard<TFieldValues extends FieldValues = any>({
  control,
  isEditMode = false,
  isActive,
  onIsActiveChange,
}: TeacherBasicInfoCardProps<TFieldValues>) {
  const { data: genders = [], isLoading: isLoadingGenders } = useGenders()

  const genderOptions = React.useMemo(() => {
    return genders.map((g) => ({
      label: g.name,
      value: g.id,
    }))
  }, [genders])

  return (
    <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-2xs">
      <h2 className="text-sm font-bold text-zinc-900 mb-5">
        Basic Information
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <UniInput
          control={control}
          name={"fullName" as FieldPath<TFieldValues>}
          label="Full Name"
          placeholder="Enter full name"
          required
          inputClassName="h-10 text-xs rounded-xl"
          labelClassName="text-xs font-medium text-zinc-700"
        />

        <UniInput
          control={control}
          name={"nationalId" as FieldPath<TFieldValues>}
          label="National ID"
          placeholder="Enter national ID"
          required
          inputClassName="h-10 text-xs rounded-xl"
          labelClassName="text-xs font-medium text-zinc-700"
        />

        <UniInput
          control={control}
          name={"dateOfBirth" as FieldPath<TFieldValues>}
          label="Date of Birth"
          type="date"
          required
          inputClassName="h-10 text-xs rounded-xl"
          labelClassName="text-xs font-medium text-zinc-700"
        />

        <UniSelect
          control={control}
          name={"genderId" as FieldPath<TFieldValues>}
          label="Gender"
          placeholder={isLoadingGenders ? "Loading genders..." : "Select gender"}
          required
          options={genderOptions}
          isLoading={isLoadingGenders}
          labelClassName="text-xs font-medium text-zinc-700"
        />

        <UniInput
          control={control}
          name={"phoneNumber" as FieldPath<TFieldValues>}
          label="Phone Number"
          placeholder="e.g. +20 100 447 2201"
          required
          inputClassName="h-10 text-xs rounded-xl"
          labelClassName="text-xs font-medium text-zinc-700"
        />

        <UniInput
          control={control}
          name={"email" as FieldPath<TFieldValues>}
          label="Email Address"
          type="email"
          placeholder="teacher@example.com"
          required={!isEditMode}
          disabled={isEditMode}
          inputClassName={cn(
            "h-10 text-xs rounded-xl",
            isEditMode && "bg-zinc-50 cursor-not-allowed text-zinc-500"
          )}
          labelClassName="text-xs font-medium text-zinc-700"
        />

        {!isEditMode && (
          <>
            <UniInput
              control={control}
              name={"password" as FieldPath<TFieldValues>}
              label="Password"
              type="password"
              placeholder="••••••••"
              required
              inputClassName="h-10 text-xs rounded-xl"
              labelClassName="text-xs font-medium text-zinc-700"
            />

            <UniInput
              control={control}
              name={"confirmPassword" as FieldPath<TFieldValues>}
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              required
              inputClassName="h-10 text-xs rounded-xl"
              labelClassName="text-xs font-medium text-zinc-700"
            />
          </>
        )}
      </div>

      {/* Account Status / IsActive toggle */}
      <div className="mt-5">
        <label className="block text-xs font-medium text-zinc-700 mb-2">
          Account Status
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <button
            type="button"
            onClick={() => onIsActiveChange(true)}
            className={cn(
              "flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer",
              isActive
                ? "border-amber-400 bg-[#FFFBEB] ring-1 ring-amber-400/60"
                : "border-zinc-200 bg-white hover:border-zinc-300"
            )}
          >
            <div
              className={cn(
                "size-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                isActive ? "border-amber-500 bg-white" : "border-zinc-300 bg-white"
              )}
            >
              {isActive && <div className="size-2 rounded-full bg-amber-500" />}
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-900 leading-tight">
                Active
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5">
                Teacher account is enabled and can accept bookings
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onIsActiveChange(false)}
            className={cn(
              "flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer",
              !isActive
                ? "border-amber-400 bg-[#FFFBEB] ring-1 ring-amber-400/60"
                : "border-zinc-200 bg-white hover:border-zinc-300"
            )}
          >
            <div
              className={cn(
                "size-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                !isActive ? "border-amber-500 bg-white" : "border-zinc-300 bg-white"
              )}
            >
              {!isActive && <div className="size-2 rounded-full bg-amber-500" />}
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-900 leading-tight">
                Inactive
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5">
                Teacher account is paused
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
