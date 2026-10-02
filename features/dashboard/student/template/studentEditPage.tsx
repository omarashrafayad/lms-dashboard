"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { PageHeader } from "@/components/layout/PageHeader"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import { Form } from "@/components/ui/form"

import {
  updateStudentSchema,
  UpdateStudentFormData,
} from "../schema/student.schema"

import { useStudent, useUpdateStudent } from "../hooks/useStudents"

import {
  useGenders,
  useEducationSystems,
  useAcademicStages,
  useGrades,
} from "../hooks/useReferenceData"

import { StudentAddStepper } from "../components/StudentAddStepper"
import { StudentBasicInfoStep } from "../components/StudentBasicInfoStep"
import { StudentAcademicInfoStep } from "../components/StudentAcademicInfoStep"
import { StudentAddActions } from "../components/StudentAddActions"

import { getErrorMessage } from "@/components/shared/globalErrorMessage"

export interface StudentEditPageProps {
  studentId: string
}

export default function StudentEditPage({
  studentId,
}: StudentEditPageProps) {
  const router = useRouter()

  const [currentStep, setCurrentStep] = React.useState(1)
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([1, 2])

  const { data: student, isLoading: isStudentLoading } =
    useStudent(studentId)

  const updateStudentMutation = useUpdateStudent()

  const { data: genders = [], isLoading: isLoadingGenders } = useGenders()
  const {
    data: educationSystems = [],
    isLoading: isLoadingEducationSystems,
  } = useEducationSystems()
  const {
    data: academicStages = [],
    isLoading: isLoadingAcademicStages,
  } = useAcademicStages()

  const form = useForm<UpdateStudentFormData>({
    resolver: zodResolver(updateStudentSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      dateOfBirth: "",
      genderId: "",
      phoneNumber: "",
      email: "",
      educationSystemId: "",
      academicStageId: "",
      gradeId: "",
      password: "",
    },
  })

  const {
    control,
    handleSubmit,
    trigger,
    setValue,
    reset,
    watch,
    formState: { isSubmitting },
  } = form

  const selectedStageId = watch("academicStageId")

  const { data: grades = [], isLoading: isLoadingGrades } =
    useGrades(selectedStageId)

  React.useEffect(() => {
    if (!student) return

    if (
      isLoadingGenders ||
      isLoadingEducationSystems ||
      isLoadingAcademicStages
    ) {
      return
    }

    const genderId =
      genders.find(
        (gender) =>
          gender.name.toLowerCase() === student.gender?.toLowerCase()
      )?.id ?? ""

    const educationSystemId =
      educationSystems.find(
        (system) =>
          system.name.toLowerCase() ===
          student.educationSystem?.toLowerCase()
      )?.id ?? ""

    const academicStageId =
      academicStages.find(
        (stage) =>
          stage.name.toLowerCase() ===
          student.educationStage?.toLowerCase()
      )?.id ?? ""

    reset({
      fullName: student.fullName ?? "",
      email: student.email ?? "",
      phoneNumber: student.phoneNumber ?? "",

      dateOfBirth: student.dateOfBirth
        ? student.dateOfBirth.split("T")[0]
        : "",

      genderId,
      educationSystemId,
      academicStageId,

      gradeId: "",

      password: "",
    })
  }, [
    student,
    genders,
    educationSystems,
    academicStages,
    isLoadingGenders,
    isLoadingEducationSystems,
    isLoadingAcademicStages,
    reset,
  ])

  React.useEffect(() => {
    if (!student || !grades.length || !student.grade) return

    const gradeId =
      grades.find(
        (grade) =>
          grade.name.toLowerCase() === student.grade?.toLowerCase()
      )?.id ?? ""

    if (gradeId) {
      setValue("gradeId", gradeId, {
        shouldValidate: false,
      })
    }
  }, [student, grades, setValue])

  const handleNext = async () => {
    if (currentStep !== 1) return

    const isValid = await trigger([
      "fullName",
      "dateOfBirth",
      "genderId",
      "phoneNumber",
      "email",
      "password",
    ])

    if (!isValid) return

    setCompletedSteps((prev) =>
      prev.includes(1) ? prev : [...prev, 1]
    )

    setCurrentStep(2)
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleCancel = () => {
    router.push(`/student/${studentId}`)
  }

  const onSubmit = async (data: UpdateStudentFormData) => {
    try {
      const payload: Partial<UpdateStudentFormData> = {}

      if (data.fullName) payload.fullName = data.fullName
      if (data.email) payload.email = data.email
      if (data.phoneNumber) payload.phoneNumber = data.phoneNumber
      if (data.password) payload.password = data.password

      if (data.dateOfBirth) {
        const date = new Date(data.dateOfBirth)

        if (!isNaN(date.getTime())) {
          payload.dateOfBirth = date.toISOString()
        }
      }

      if (data.genderId) payload.genderId = data.genderId
      if (data.educationSystemId) {
        payload.educationSystemId = data.educationSystemId
      }
      if (data.academicStageId) {
        payload.academicStageId = data.academicStageId
      }
      if (data.gradeId) {
        payload.gradeId = data.gradeId
      }

      await updateStudentMutation.mutateAsync({
        studentId,
        data: payload,
      })

      toast.success("Student updated successfully")

      router.push("/student/student_list")
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    }
  }

  const isFormLoading =
    isSubmitting || updateStudentMutation.isPending

  if (isStudentLoading) {
    return (
      <div className="flex min-h-full items-center justify-center p-12">
        <LoadingSpinner title="Loading student details..." />
      </div>
    )
  }

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title="Edit Student"
        description="Update student account and academic details."
      />

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[820px] flex-col gap-5">

          <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-2xs">
            <StudentAddStepper
              currentStep={currentStep}
              completedSteps={completedSteps}
              onStepClick={setCurrentStep}
            />
          </div>

          <Form {...form}>
            <form
              onSubmit={(event) => {
                if (currentStep !== 2) {
                  event.preventDefault()
                  event.stopPropagation()
                  return
                }

                handleSubmit(onSubmit)(event)
              }}
              className="space-y-5"
            >
              {currentStep === 1 && (
                <StudentBasicInfoStep
                  control={control}
                  isEdit
                />
              )}

              {currentStep === 2 && (
                <StudentAcademicInfoStep
                  control={control}
                  setValue={setValue}
                  isEdit
                />
              )}

              <StudentAddActions
                currentStep={currentStep}
                isSubmitting={isFormLoading}
                submitLabel="Save Changes"
                onCancel={handleCancel}
                onBack={handleBack}
                onNext={handleNext}
              />
            </form>
          </Form>
        </div>
      </main>
    </div>
  )
}