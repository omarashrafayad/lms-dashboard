"use client"

import * as React from "react"
import { Control, FieldPath, FieldValues } from "react-hook-form"
import { UniInput } from "@/components/shared/UniInput"

export interface ParentBasicInfoCardProps<
  TFieldValues extends FieldValues = FieldValues
> {
  control: Control<TFieldValues>
  isEditMode?: boolean
}

export function ParentBasicInfoCard<
  TFieldValues extends FieldValues = FieldValues
>({ control, isEditMode = false }: ParentBasicInfoCardProps<TFieldValues>) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <div className="size-6 rounded-full bg-[#FEF3C7] text-[#D97706] text-xs font-bold flex items-center justify-center shrink-0">
          1
        </div>
        <h2 className="text-sm font-bold text-zinc-900">Basic Information</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <UniInput
          control={control}
          name={"firstName" as FieldPath<TFieldValues>}
          label="First Name"
          placeholder="e.g. Hana"
          required
          inputClassName="h-10 text-xs rounded-xl"
          labelClassName="text-xs font-medium text-zinc-700"
        />

        <UniInput
          control={control}
          name={"lastName" as FieldPath<TFieldValues>}
          label="Last Name"
          placeholder="e.g. Mostafa"
          required
          inputClassName="h-10 text-xs rounded-xl"
          labelClassName="text-xs font-medium text-zinc-700"
        />

        <UniInput
          control={control}
          name={"email" as FieldPath<TFieldValues>}
          label="Email"
          type="email"
          placeholder="name@example.com"
          required
          inputClassName="h-10 text-xs rounded-xl"
          labelClassName="text-xs font-medium text-zinc-700"
        />

        <UniInput
          control={control}
          name={"phoneNumber" as FieldPath<TFieldValues>}
          label="Phone Number"
          type="tel"
          placeholder="+20 100 000 0000"
          required
          inputClassName="h-10 text-xs rounded-xl"
          labelClassName="text-xs font-medium text-zinc-700"
        />

        {!isEditMode && (
          <div className="sm:col-span-2">
            <UniInput
              control={control}
              name={"password" as FieldPath<TFieldValues>}
              label="Password"
              type="password"
              placeholder="password"
              required
              inputClassName="h-10 text-xs rounded-xl"
              labelClassName="text-xs font-medium text-zinc-700"
            />
          </div>
        )}
      </div>
    </div>
  )
}
