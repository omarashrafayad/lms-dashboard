"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, ChevronRight, ChevronLeft, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { PageHeader } from "@/components/layout/PageHeader"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createStudentSchema, CreateStudentFormData } from "../schema/student.schema"
import { useCreateStudent } from "../hooks/useStudents"
import { Form } from "@/components/ui/form"
import { UniInput } from "@/components/shared/UniInput"
import { toast } from "sonner"

const STEPS = [
  { number: 1, label: "Basic", sublabel: "Information" },
  { number: 2, label: "Academic", sublabel: "Information" },
  { number: 3, label: "Review & Create", sublabel: "" },
] as const

/* ──────────────────────────────────────────────────────────
   Stepper Component
   ────────────────────────────────────────────────────────── */
function Stepper({
  currentStep,
  completedSteps,
}: {
  currentStep: number
  completedSteps: number[]
}) {
  return (
    <div className="w-full flex items-center justify-center px-6 py-5">
      <div className="flex items-center gap-0 w-full max-w-[620px]">
        {STEPS.map((step, idx) => {
          const isCompleted = completedSteps.includes(step.number)
          const isCurrent = currentStep === step.number
          const isLast = idx === STEPS.length - 1

          return (
            <React.Fragment key={step.number}>
              {/* Step Circle + Label */}
              <div className="flex items-center gap-2.5 shrink-0">
                <div
                  className={cn(
                    "size-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all",
                    isCompleted
                      ? "bg-brand-orange text-white"
                      : isCurrent
                      ? "bg-brand-orange text-white"
                      : "bg-zinc-100 text-zinc-400 border border-zinc-200/80"
                  )}
                >
                  {isCompleted ? (
                    <Check className="size-4 stroke-[2.5]" />
                  ) : (
                    step.number
                  )}
                </div>

                <div className="flex flex-col leading-none">
                  <span
                    className={cn(
                      "text-[10px] font-medium uppercase tracking-wider",
                      isCurrent || isCompleted
                        ? "text-zinc-500"
                        : "text-zinc-400"
                    )}
                  >
                    STEP {step.number}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-semibold mt-0.5",
                      isCurrent || isCompleted
                        ? "text-zinc-900"
                        : "text-zinc-400"
                    )}
                  >
                    {step.label}
                    {step.sublabel && (
                      <>
                        <br />
                        {step.sublabel}
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div className="flex-1 mx-3">
                  <div
                    className={cn(
                      "h-px w-full",
                      isCompleted ? "bg-brand-orange" : "bg-zinc-200"
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────
   Success Screen
   ────────────────────────────────────────────────────────── */
function SuccessScreen() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-10 max-w-md w-full text-center flex flex-col items-center gap-5">
        <div className="size-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
          <Check className="size-7 text-emerald-500 stroke-[2.5]" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-zinc-900">
            Student created successfully
          </h2>
          <p className="text-xs text-zinc-500 mt-1.5">
            The student account has been created successfully.
          </p>
        </div>

        <div className="flex flex-col gap-2.5 w-full mt-2">
          <Link
            href="/student/student_list"
            className="w-full inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-brand-orange hover:bg-amber-500 text-sm font-semibold text-white transition-all shadow-xs cursor-pointer active:scale-[0.98]"
          >
            Back to All Students
          </Link>
        </div>
      </div>
    </div>
  )
}


export default function StudentAddPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState(1)
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([])
  const [showSuccess, setShowSuccess] = React.useState(false)

  const createStudentMutation = useCreateStudent()

  const form = useForm<CreateStudentFormData>({
    resolver: zodResolver(createStudentSchema),
    mode: "onTouched",
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

  const { control, handleSubmit, trigger, getValues, formState: { isSubmitting } } = form

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
    } else if (currentStep === 2) {
      const isValid = await trigger([
        "educationSystemId",
        "academicStageId",
        "gradeId",
      ])
      if (isValid) {
        setCompletedSteps((prev) => (prev.includes(2) ? prev : [...prev, 2]))
        setCurrentStep(3)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleEditStep = (step: number) => {
    setCurrentStep(step)
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
      setShowSuccess(true)
      toast.success("Student created successfully")
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create student. Please check input data."
      toast.error(errorMsg)
    }
  }

  if (showSuccess) {
    return (
      <div className="flex flex-col min-h-full">
        <PageHeader
          title="Add Student"
          description="Create a new student account on the platform."
        />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-[820px] mx-auto">
            <SuccessScreen />
          </div>
        </main>
      </div>
    )
  }

  const formValues = getValues()

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
            <Stepper
              currentStep={currentStep}
              completedSteps={completedSteps}
            />
          </div>

          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
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

                    <UniInput
                      control={control}
                      name="genderId"
                      label="Gender ID"
                      placeholder="Enter gender ID"
                      required
                      inputClassName="h-10 text-xs rounded-xl"
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
              )}

              {/* Step 2: Academic Information */}
              {currentStep === 2 && (
                <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs space-y-4">
                  <div>
                    <h2 className="text-base font-bold text-zinc-900">Academic Information</h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      Education details for the student&apos;s academic profile.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <UniInput
                      control={control}
                      name="educationSystemId"
                      label="Education System ID"
                      placeholder="Enter education system ID"
                      required
                      inputClassName="h-10 text-xs rounded-xl"
                      labelClassName="text-xs font-medium text-zinc-700"
                    />

                    <UniInput
                      control={control}
                      name="academicStageId"
                      label="Academic Stage ID"
                      placeholder="Enter academic stage ID"
                      required
                      inputClassName="h-10 text-xs rounded-xl"
                      labelClassName="text-xs font-medium text-zinc-700"
                    />
                  </div>

                  <UniInput
                    control={control}
                    name="gradeId"
                    label="Grade ID"
                    placeholder="Enter grade ID"
                    required
                    inputClassName="h-10 text-xs rounded-xl"
                    labelClassName="text-xs font-medium text-zinc-700"
                  />
                </div>
              )}

              {/* Step 3: Review & Create */}
              {currentStep === 3 && (
                <div className="flex flex-col gap-5">
                  <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs">
                    <h2 className="text-base font-bold text-zinc-900">
                      Review Student Information
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1 mb-6">
                      Confirm all details before creating the student account.
                    </p>

                    {/* Basic Info Card */}
                    <div className="rounded-xl border border-zinc-200/80 p-5 mb-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-zinc-900">
                          Basic Information
                        </h3>
                        <button
                          type="button"
                          onClick={() => handleEditStep(1)}
                          className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                        <div>
                          <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                            FULL NAME
                          </div>
                          <div className="text-sm font-medium text-zinc-800">
                            {formValues.fullName || "—"}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                            DATE OF BIRTH
                          </div>
                          <div className="text-sm font-medium text-zinc-800">
                            {formValues.dateOfBirth || "—"}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                            GENDER ID
                          </div>
                          <div className="text-sm font-medium text-zinc-800">
                            {formValues.genderId || "—"}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                            EMAIL / PHONE
                          </div>
                          <div className="text-sm font-medium text-zinc-800">
                            {[formValues.email, formValues.phoneNumber]
                              .filter(Boolean)
                              .join(" · ") || "—"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Academic Info Card */}
                    <div className="rounded-xl border border-zinc-200/80 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-zinc-900">
                          Academic Information
                        </h3>
                        <button
                          type="button"
                          onClick={() => handleEditStep(2)}
                          className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                        <div>
                          <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                            EDUCATION SYSTEM ID
                          </div>
                          <div className="text-sm font-medium text-zinc-800">
                            {formValues.educationSystemId || "—"}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                            ACADEMIC STAGE ID
                          </div>
                          <div className="text-sm font-medium text-zinc-800">
                            {formValues.academicStageId || "—"}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                            GRADE ID
                          </div>
                          <div className="text-sm font-medium text-zinc-800">
                            {formValues.gradeId || "—"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Action Buttons */}
              <div className="flex items-center justify-between pt-1 pb-10">
                {currentStep === 1 ? (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-5 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-700 transition-colors shadow-2xs cursor-pointer active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-700 transition-colors shadow-2xs cursor-pointer active:scale-[0.98]"
                  >
                    <ChevronLeft className="size-3.5" />
                    <span>Back</span>
                  </button>
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-1.5 px-6 py-2 rounded-xl bg-brand-orange hover:bg-amber-500 text-xs font-semibold text-white transition-all shadow-xs cursor-pointer active:scale-[0.98]"
                  >
                    <span>Save & Continue</span>
                    <ChevronRight className="size-3.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || createStudentMutation.isPending}
                    className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-brand-orange hover:bg-amber-500 text-xs font-semibold text-white transition-all shadow-xs cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {(isSubmitting || createStudentMutation.isPending) && (
                      <Loader2 className="size-3.5 animate-spin" />
                    )}
                    <span>Create Student</span>
                  </button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  )
}
