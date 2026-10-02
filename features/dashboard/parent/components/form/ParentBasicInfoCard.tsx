"use client"

import * as React from "react"
import { Control } from "react-hook-form"
import { UniInput } from "@/components/shared/UniInput"
import { CreateParentFormData } from "../../schema/parent.schema"

export interface ParentBasicInfoCardProps {
  control: Control<CreateParentFormData>
}

export function ParentBasicInfoCard({ control }: ParentBasicInfoCardProps) {
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
          name="firstName"
          label="First Name"
          placeholder="e.g. Hana"
          required
          inputClassName="h-10 text-xs rounded-xl"
          labelClassName="text-xs font-medium text-zinc-700"
        />

        <UniInput
          control={control}
          name="lastName"
          label="Last Name"
          placeholder="e.g. Mostafa"
          required
          inputClassName="h-10 text-xs rounded-xl"
          labelClassName="text-xs font-medium text-zinc-700"
        />

        <UniInput
          control={control}
          name="email"
          label="Email"
          type="email"
          placeholder="name@example.com"
          required
          inputClassName="h-10 text-xs rounded-xl"
          labelClassName="text-xs font-medium text-zinc-700"
        />

        <UniInput
          control={control}
          name="phoneNumber"
          label="Phone Number"
          type="tel"
          placeholder="+20 100 000 0000"
          required
          inputClassName="h-10 text-xs rounded-xl"
          labelClassName="text-xs font-medium text-zinc-700"
        />

        <div className="sm:col-span-2">
          <UniInput
            control={control}
            name="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            required
            helperText="Minimum 6 characters."
            inputClassName="h-10 text-xs rounded-xl"
            labelClassName="text-xs font-medium text-zinc-700"
          />
        </div>
      </div>

      <span className="text-[11px] text-zinc-400 font-normal">
        Email and phone number are required for parent account notification and access.
      </span>
    </div>
  )
}
