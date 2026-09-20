"use client"

import * as React from "react"
import { Control } from "react-hook-form"
import { UniInput } from "@/components/shared/UniInput"
import { UniSelect } from "@/components/shared/UniSelect"
import { CreateStudentFormData } from "../schema/student.schema"
import { useGenders } from "../hooks/useReferenceData"

export interface StudentBasicInfoStepProps {
  control: Control<CreateStudentFormData>
}

export function StudentBasicInfoStep({ control }: StudentBasicInfoStepProps) {
  const { data: genders = [], isLoading: isLoadingGenders } = useGenders()

  const genderOptions = React.useMemo(() => {
    return genders.map((g) => ({
      label: g.name,
      value: g.id,
    }))
  }, [genders])

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs space-y-4">
      <div>
        <h2 className="text-base font-bold text-zinc-900">Basic Information</h2>
        <p className="text-xs text-zinc-500 mt-1">
          Personal details used to identify the student.
        </p>
      </div>

      <UniInput
        control={control}
        name="fullName"
        label="Full Name"
        placeholder="e.g. Ahmed Ali"
        required
        inputClassName="h-10 text-xs rounded-xl"
        labelClassName="text-xs font-medium text-zinc-700"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UniInput
          control={control}
          name="dateOfBirth"
          label="Date of Birth"
          type="date"
          required
          inputClassName="h-10 text-xs rounded-xl"
          labelClassName="text-xs font-medium text-zinc-700"
        />

        <UniSelect
          control={control}
          name="genderId"
          label="Gender"
          placeholder={isLoadingGenders ? "Loading genders..." : "Select gender"}
          required
          options={genderOptions}
          isLoading={isLoadingGenders}
          labelClassName="text-xs font-medium text-zinc-700"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UniInput
          control={control}
          name="phoneNumber"
          label="Phone Number"
          placeholder="+20 100 000 0000"
          required
          inputClassName="h-10 text-xs rounded-xl"
          labelClassName="text-xs font-medium text-zinc-700"
        />

        <UniInput
          control={control}
          name="email"
          label="Email Address"
          type="email"
          placeholder="student@example.com"
          required
          inputClassName="h-10 text-xs rounded-xl"
          labelClassName="text-xs font-medium text-zinc-700"
        />
      </div>

      <UniInput
        control={control}
        name="password"
        label="Password"
        type="password"
        placeholder="Enter password"
        required
        inputClassName="h-10 text-xs rounded-xl"
        labelClassName="text-xs font-medium text-zinc-700"
      />
    </div>
  )
}
