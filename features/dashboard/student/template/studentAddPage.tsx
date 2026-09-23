"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/layout/PageHeader"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createStudentSchema, CreateStudentFormData } from "../schema/student.schema"
import { useCreateStudent } from "../hooks/useStudents"
import { Form } from "@/components/ui/form"
import { toast } from "sonner"
import { StudentAddStepper } from "../components/StudentAddStepper"
import { StudentBasicInfoStep } from "../components/StudentBasicInfoStep"
import { StudentAcademicInfoStep } from "../components/StudentAcademicInfoStep"
import { StudentAddActions } from "../components/StudentAddActions"

export default function StudentAddPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState(1)
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([])

  const createStudentMutation = useCreateStudent()

  const form = useForm<CreateStudentFormData>({
    resolver: zodResolver(createStudentSchema),
    mode: "all",
    defaultValues: {
      fullName: "",
      dateOfBirth: "",
      genderId: "",
      phoneNumber: "",
      email: "",
      password: "",
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
    formState: { isSubmitting },
  } = form

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
    router.push("/student/student_list")
  }

  const onSubmit = async (data: CreateStudentFormData) => {
    try {
      let formattedDob = data.dateOfBirth
      if (formattedDob && !formattedDob.includes("T")) {
        const parsed = new Date(formattedDob)
        if (!isNaN(parsed.getTime())) {
          formattedDob = parsed.toISOString()
        }
      }

      const payload = {
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        academicStageId: data.academicStageId,
        gradeId: data.gradeId,
        dateOfBirth: formattedDob,
        educationSystemId: data.educationSystemId,
        genderId: data.genderId,
      }

      await createStudentMutation.mutateAsync(payload)
      toast.success("Student created successfully")
      router.push("/student/student_list")
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create student. Please check input data."
      toast.error(errorMsg)
    }
  }

  const isFormLoading = isSubmitting || createStudentMutation.isPending

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Add Student"
        description="Create a new student account on the platform."
      />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-[820px] mx-auto flex flex-col gap-5">
          {/* Stepper */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
            <StudentAddStepper
              currentStep={currentStep}
              completedSteps={completedSteps}
            />
          </div>

          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {currentStep === 1 && <StudentBasicInfoStep control={control} />}
              {currentStep === 2 && (
                <StudentAcademicInfoStep control={control} setValue={setValue} />
              )}

              <StudentAddActions
                currentStep={currentStep}
                isSubmitting={isFormLoading}
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
