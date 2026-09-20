"use client"

import * as React from "react"
import { Control, UseFormSetValue, useWatch } from "react-hook-form"
import { UniSelect } from "@/components/shared/UniSelect"
import { CreateStudentFormData } from "../schema/student.schema"
import {
  useAcademicStages,
  useEducationSystems,
  useGrades,
} from "../hooks/useReferenceData"

export interface StudentAcademicInfoStepProps {
  control: Control<CreateStudentFormData>
  setValue: UseFormSetValue<CreateStudentFormData>
}

export function StudentAcademicInfoStep({
  control,
  setValue,
}: StudentAcademicInfoStepProps) {
  const selectedStageId = useWatch({
    control,
    name: "academicStageId",
  })

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
      setValue("gradeId", "", { shouldValidate: true })
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
          name="educationSystemId"
          label="Education System"
          placeholder={
            isLoadingSystems ? "Loading systems..." : "Select education system"
          }
          required
          options={systemOptions}
          isLoading={isLoadingSystems}
          labelClassName="text-xs font-medium text-zinc-700"
        />

        <UniSelect
          control={control}
          name="academicStageId"
          label="Academic Stage"
          placeholder={
            isLoadingStages ? "Loading stages..." : "Select academic stage"
          }
          required
          options={stageOptions}
          isLoading={isLoadingStages}
          onChangeCallback={handleStageChange}
          labelClassName="text-xs font-medium text-zinc-700"
        />
      </div>

      <UniSelect
        control={control}
        name="gradeId"
        label="Grade"
        placeholder={
          !selectedStageId
            ? "Select academic stage first"
            : isLoadingGrades
            ? "Loading grades..."
            : "Select grade"
        }
        required
        disabled={!selectedStageId || isLoadingGrades}
        options={gradeOptions}
        isLoading={isLoadingGrades}
        labelClassName="text-xs font-medium text-zinc-700"
      />
    </div>
  )
}
