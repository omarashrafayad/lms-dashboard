"use client"

import * as React from "react"
import {
  Control,
  FieldPath,
  FieldValues,
  UseFormSetValue,
  useWatch,
} from "react-hook-form"
import { UniSelect } from "@/components/shared/UniSelect"
import {
  useAcademicStages,
  useEducationSystems,
  useGrades,
} from "../hooks/useReferenceData"

export interface StudentAcademicInfoStepProps<
  TFieldValues extends FieldValues = FieldValues
> {
  control: Control<TFieldValues>
  setValue: UseFormSetValue<TFieldValues>
  isEdit?: boolean
}

export function StudentAcademicInfoStep<
  TFieldValues extends FieldValues = FieldValues
>({
  control,
  setValue,
  isEdit = false,
}: StudentAcademicInfoStepProps<TFieldValues>) {
  const selectedStageId = useWatch({
    control,
    name: "academicStageId" as FieldPath<TFieldValues>,
  }) as string | undefined

  const { data: educationSystems = [], isLoading: isLoadingSystems } =
    useEducationSystems()
  const { data: academicStages = [], isLoading: isLoadingStages } =
    useAcademicStages()
  const { data: grades = [], isLoading: isLoadingGrades } =
    useGrades(selectedStageId)

  const systemOptions = React.useMemo(() => {
    return educationSystems.map((s) => ({
      label: s.name,
      value: s.id,
    }))
  }, [educationSystems])

  const stageOptions = React.useMemo(() => {
    return academicStages.map((st) => ({
      label: st.name,
      value: st.id,
    }))
  }, [academicStages])

  const gradeOptions = React.useMemo(() => {
    return grades.map((g) => ({
      label: g.name,
      value: g.id,
    }))
  }, [grades])

  const handleStageChange = (newStageId: string) => {
    if (newStageId !== selectedStageId) {
      ;(setValue as any)("gradeId", "", { shouldValidate: true })
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs space-y-4">
      <div>
        <h2 className="text-base font-bold text-zinc-900">
          Academic Information
        </h2>
        <p className="text-xs text-zinc-500 mt-1">
          Education details for the student&apos;s academic profile.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UniSelect
          control={control}
          name={"educationSystemId" as FieldPath<TFieldValues>}
          label="Education System"
          placeholder={
            isLoadingSystems ? "Loading systems..." : "Select education system"
          }
          required={!isEdit}
          options={systemOptions}
          isLoading={isLoadingSystems}
          labelClassName="text-xs font-medium text-zinc-700"
        />

        <UniSelect
          control={control}
          name={"academicStageId" as FieldPath<TFieldValues>}
          label="Academic Stage"
          placeholder={
            isLoadingStages ? "Loading stages..." : "Select academic stage"
          }
          required={!isEdit}
          options={stageOptions}
          isLoading={isLoadingStages}
          onChangeCallback={handleStageChange}
          labelClassName="text-xs font-medium text-zinc-700"
        />
      </div>

      <UniSelect
        control={control}
        name={"gradeId" as FieldPath<TFieldValues>}
        label="Grade"
        placeholder={
          !selectedStageId
            ? "Select academic stage first"
            : isLoadingGrades
            ? "Loading grades..."
            : "Select grade"
        }
        required={!isEdit}
        disabled={!selectedStageId || isLoadingGrades}
        options={gradeOptions}
        isLoading={isLoadingGrades}
        labelClassName="text-xs font-medium text-zinc-700"
      />
    </div>
  )
}
