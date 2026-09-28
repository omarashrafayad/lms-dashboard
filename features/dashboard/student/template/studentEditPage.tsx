"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/layout/PageHeader"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { Form } from "@/components/ui/form"
import { toast } from "sonner"
import { StudentAddStepper } from "../components/StudentAddStepper"
import { StudentBasicInfoStep } from "../components/StudentBasicInfoStep"
import { StudentAcademicInfoStep } from "../components/StudentAcademicInfoStep"
import { StudentAddActions } from "../components/StudentAddActions"
import { Loader2 } from "lucide-react"

export interface StudentEditPageProps {
  studentId: string
}

export default function StudentEditPage({ studentId }: StudentEditPageProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState(1)
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([1, 2])

  const { data: apiStudent, isLoading: isStudentLoading } = useStudent(studentId)
  const updateStudentMutation = useUpdateStudent()

  const { data: genders = [] } = useGenders()
  const { data: educationSystems = [] } = useEducationSystems()
  const { data: academicStages = [] } = useAcademicStages()

  const form = useForm<UpdateStudentFormData>({
    resolver: zodResolver(updateStudentSchema),
    mode: "all",
    defaultValues: {
      fullName: "",
      dateOfBirth: "",
      genderId: "",
      phoneNumber: "",
      email: "",
      educationSystemId: "",
      academicStageId: "",
      gradeId: "",
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
  const { data: grades = [] } =  useGrades(selectedStageId)

  // Pre-fill form when apiStudent data loads
  React.useEffect(() => {
    if (apiStudent) {
      const matchedGenderId =
        (apiStudent as any).genderId ||
        genders.find(
          (g) => g.name?.toLowerCase() === apiStudent.gender?.toLowerCase()
        )?.id ||
        ""

      const matchedSystemId =
        (apiStudent as any).educationSystemId ||
        educationSystems.find(
          (s) =>
            s.name?.toLowerCase() === apiStudent.educationSystem?.toLowerCase()
        )?.id ||
        ""

      const matchedStageId =
        (apiStudent as any).academicStageId ||
        academicStages.find(
          (st) =>
            st.name?.toLowerCase() === apiStudent.educationStage?.toLowerCase()
        )?.id ||
        ""

      let formattedDob = ""
      if (apiStudent.dateOfBirth) {
        if (apiStudent.dateOfBirth.includes("T")) {
          formattedDob = apiStudent.dateOfBirth.split("T")[0]
        } else if (/^\d{4}-\d{2}-\d{2}$/.test(apiStudent.dateOfBirth)) {
          formattedDob = apiStudent.dateOfBirth
        } else {
          const parsed = new Date(apiStudent.dateOfBirth)
          if (!isNaN(parsed.getTime())) {
            formattedDob = parsed.toISOString().split("T")[0]
          }
        }
      }

      reset({
        fullName: apiStudent.fullName || "",
        email: apiStudent.email || "",
        phoneNumber: apiStudent.phoneNumber || "",
        dateOfBirth: formattedDob,
        genderId: matchedGenderId,
        educationSystemId: matchedSystemId,
        academicStageId: matchedStageId,
        gradeId: (apiStudent as any).gradeId || "",
        password: "",
      })
    }
  }, [apiStudent, genders, educationSystems, academicStages, reset])

  // Resolve gradeId once grades load for the selected stage
  React.useEffect(() => {
    if (apiStudent && grades.length > 0) {
      const currentGrade = form.getValues("gradeId")
      if (!currentGrade) {
        const matchedGrade = grades.find(
          (g) => g.name?.toLowerCase() === apiStudent.grade?.toLowerCase()
        )
        if (matchedGrade) {
          setValue("gradeId", matchedGrade.id)
        }
      }
    }
  }, [apiStudent, grades, form, setValue])

  const handleNext = async () => {
    if (currentStep === 1) {
      const isValid = await trigger([
        "fullName",
        "dateOfBirth",
        "genderId",
        "phoneNumber",
        "email",
        "password",
      ])
      if (isValid) {
        setCompletedSteps((prev) => (prev.includes(1) ? prev : [...prev, 1]))
        setCurrentStep(2)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleCancel = () => {
    router.push(`/student/${studentId}`)
  }

  const onSubmit = async (data: UpdateStudentFormData) => {
    try {
      let formattedDob = data.dateOfBirth
      if (formattedDob && !formattedDob.includes("T")) {
        const parsed = new Date(formattedDob)
        if (!isNaN(parsed.getTime())) {
          formattedDob = parsed.toISOString()
        }
      }

      const payload: Record<string, any> = {}
      if (data.fullName) payload.fullName = data.fullName
      if (data.email) payload.email = data.email
      if (data.phoneNumber) payload.phoneNumber = data.phoneNumber
      if (data.password) payload.password = data.password
      if (formattedDob) payload.dateOfBirth = formattedDob
      if (data.genderId) payload.genderId = data.genderId
      if (data.educationSystemId) payload.educationSystemId = data.educationSystemId
      if (data.academicStageId) payload.academicStageId = data.academicStageId
      if (data.gradeId) payload.gradeId = data.gradeId

      await updateStudentMutation.mutateAsync({
        studentId,
        data: payload,
      })
      toast.success("Student updated successfully")
      router.push(`/student/student_list`)
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update student. Please check input data."
      toast.error(errorMsg)
    }
  }

  const isFormLoading = isSubmitting || updateStudentMutation.isPending

  if (isStudentLoading) {
    return (
      <div className="flex flex-col min-h-full items-center justify-center p-12">
        <Loader2 className="size-8 animate-spin text-brand-orange mb-3" />
        <p className="text-xs text-zinc-500 font-medium">Loading student details...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Edit Student"
        description="Update student account and academic details."
      />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-[820px] mx-auto flex flex-col gap-5">
          {/* Stepper */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
            <StudentAddStepper
              currentStep={currentStep}
              completedSteps={completedSteps}
              onStepClick={(step) => setCurrentStep(step)}
            />
          </div>

          <Form {...form}>
            <form
              onSubmit={(e) => {
                if (currentStep !== 2) {
                  e.preventDefault()
                  e.stopPropagation()
                  return
                }
                handleSubmit(onSubmit)(e)
              }}
              className="space-y-5"
            >
              {currentStep === 1 && (
                <StudentBasicInfoStep control={control} isEdit />
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
