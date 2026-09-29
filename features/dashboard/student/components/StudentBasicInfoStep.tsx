"use client"

import * as React from "react"
import { Control, FieldPath, FieldValues } from "react-hook-form"
import { UniInput } from "@/components/shared/UniInput"
import { UniSelect } from "@/components/shared/UniSelect"
import { useGenders } from "../hooks/useReferenceData"

export interface StudentBasicInfoStepProps<
  TFieldValues extends FieldValues = FieldValues
> {
  control: Control<TFieldValues>
  isEdit?: boolean
}

export function StudentBasicInfoStep<
  TFieldValues extends FieldValues = FieldValues
>({
  control,
  isEdit = false,
}: StudentBasicInfoStepProps<TFieldValues>) {
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
        name={"fullName" as FieldPath<TFieldValues>}
        label="Full Name"
        placeholder="e.g. Ahmed Ali"
        required={!isEdit}
        inputClassName="h-10 text-xs rounded-xl"
        labelClassName="text-xs font-medium text-zinc-700"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UniInput
          control={control}
          name={"dateOfBirth" as FieldPath<TFieldValues>}
          label="Date of Birth"
          type="date"
          required={!isEdit}
          inputClassName="h-10 text-xs rounded-xl"
          labelClassName="text-xs font-medium text-zinc-700"
        />

        <UniSelect
          control={control}
          name={"genderId" as FieldPath<TFieldValues>}
          label="Gender"
          placeholder={isLoadingGenders ? "Loading genders..." : "Select gender"}
          required={!isEdit}
          options={genderOptions}
          isLoading={isLoadingGenders}
          labelClassName="text-xs font-medium text-zinc-700"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UniInput
          control={control}
          name={"phoneNumber" as FieldPath<TFieldValues>}
          label="Phone Number"
          placeholder="+20 100 000 0000"
          required={!isEdit}
          inputClassName="h-10 text-xs rounded-xl"
          labelClassName="text-xs font-medium text-zinc-700"
        />

        <UniInput
          control={control}
          name={"email" as FieldPath<TFieldValues>}
          label="Email Address"
          type="email"
          placeholder="student@example.com"
          required={!isEdit}
          inputClassName="h-10 text-xs rounded-xl"
          labelClassName="text-xs font-medium text-zinc-700"
        />
        {
          !isEdit && (
            <UniInput
              control={control}
              name={"password" as FieldPath<TFieldValues>}
              label="Password"
              placeholder="password"
              required={!isEdit}
              inputClassName="h-10 text-xs rounded-xl"
              labelClassName="text-xs font-medium text-zinc-700"
            />
          )
        }
      </div>
    </div>
  )
}
