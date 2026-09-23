"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { PageHeader } from "@/components/layout/PageHeader"
import { Form } from "@/components/ui/form"
import {
  createTeacherSchema,
  CreateTeacherFormData,
} from "../schema/teacher.schema"
import { useCreateTeacher } from "../hooks/useTeachers"
import { buildCreateTeacherFormData } from "../utils/teacherFormData"
import {
  TeacherBasicInfoCard,
  TeacherProfessionalInfoCard,
  TeacherTeachingSetupCard,
  TeacherDocumentsCard,
  TeacherAvailabilityFormCard,
  TeacherFormActions,
  DayAvailability,
  SlotItem,
} from "../components/form"

const WEEK_DAYS: { name: string; dayOfWeek: number }[] = [
  { name: "Sunday", dayOfWeek: 0 },
  { name: "Monday", dayOfWeek: 1 },
  { name: "Tuesday", dayOfWeek: 2 },
  { name: "Wednesday", dayOfWeek: 3 },
  { name: "Thursday", dayOfWeek: 4 },
  { name: "Friday", dayOfWeek: 5 },
  { name: "Saturday", dayOfWeek: 6 },
]

export default function TeacherAddPage() {
  const router = useRouter()
  const createTeacherMutation = useCreateTeacher()

  const [degreeFile, setDegreeFile] = React.useState<File | null>(null)
  const [nationalIdFile, setNationalIdFile] = React.useState<File | null>(null)

  const [setAvailabilityNow, setSetAvailabilityNow] = React.useState<"Yes" | "Skip">("Yes")
  const [availability, setAvailability] = React.useState<DayAvailability[]>(
    WEEK_DAYS.map((d) => ({
      dayName: d.name,
      dayOfWeek: d.dayOfWeek,
      slots: [],
    }))
  )

  const form = useForm<CreateTeacherFormData>({
    resolver: zodResolver(createTeacherSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      nationalId: "",
      dateOfBirth: "",
      genderId: "",
      qualifications: "",
      yearsOfExperience: 0,
      bio: "",
      history: "",
      isActive: true,
      isAvailable: true,
      subjectIds: [],
      teachingLevelIds: [],
      educationStageIds: [],
    },
  })

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = form

  const isActive = watch("isActive")
  const selectedSubjectIds = watch("subjectIds")
  const selectedEducationStageIds = watch("educationStageIds")
  const selectedTeachingLevelIds = watch("teachingLevelIds")

  const toggleSubject = (id: string) => {
    const next = selectedSubjectIds.includes(id)
      ? selectedSubjectIds.filter((s) => s !== id)
      : [...selectedSubjectIds, id]
    setValue("subjectIds", next)
  }

  const toggleEducationStage = (id: string) => {
    const next = selectedEducationStageIds.includes(id)
      ? selectedEducationStageIds.filter((s) => s !== id)
      : [...selectedEducationStageIds, id]
    setValue("educationStageIds", next)
  }

  const toggleTeachingLevel = (id: string) => {
    const next = selectedTeachingLevelIds.includes(id)
      ? selectedTeachingLevelIds.filter((l) => l !== id)
      : [...selectedTeachingLevelIds, id]
    setValue("teachingLevelIds", next)
  }

  const addTimeSlot = (dayOfWeek: number) => {
    setAvailability((prev) =>
      prev.map((d) => {
        if (d.dayOfWeek === dayOfWeek) {
          const newSlot: SlotItem = {
            id: `slot-${dayOfWeek}-${Date.now()}`,
            start: "09:00",
            end: "12:00",
          }
          return { ...d, slots: [...d.slots, newSlot] }
        }
        return d
      })
    )
  }

  const removeTimeSlot = (dayOfWeek: number, slotId: string) => {
    setAvailability((prev) =>
      prev.map((d) => {
        if (d.dayOfWeek === dayOfWeek) {
          return { ...d, slots: d.slots.filter((s) => s.id !== slotId) }
        }
        return d
      })
    )
  }

  const updateTimeSlot = (
    dayOfWeek: number,
    slotId: string,
    field: "start" | "end",
    val: string
  ) => {
    setAvailability((prev) =>
      prev.map((d) => {
        if (d.dayOfWeek === dayOfWeek) {
          return {
            ...d,
            slots: d.slots.map((s) => (s.id === slotId ? { ...s, [field]: val } : s)),
          }
        }
        return d
      })
    )
  }

  const formatTimeForApi = (t: string): string => {
    if (!t) return "00:00:00"
    if (t.length === 5) return `${t}:00`
    return t
  }

  const onSubmit = async (data: CreateTeacherFormData) => {
    if (selectedSubjectIds.length === 0) {
      toast.error("Please select at least one subject")
      return
    }

    try {
      let formattedDob = data.dateOfBirth
      if (formattedDob) {
        const parsed = new Date(formattedDob)
        if (!isNaN(parsed.getTime())) {
          formattedDob = parsed.toISOString()
        }
      }

      // Build availability slots
      const slotsPayload: { dayOfWeek: number; startTime: string; endTime: string }[] = []
      if (setAvailabilityNow === "Yes") {
        availability.forEach((day) => {
          day.slots.forEach((slot) => {
            if (slot.start && slot.end) {
              slotsPayload.push({
                dayOfWeek: day.dayOfWeek,
                startTime: formatTimeForApi(slot.start),
                endTime: formatTimeForApi(slot.end),
              })
            }
          })
        })
      }

      const formData = buildCreateTeacherFormData(data, {
        isActive,
        selectedSubjectIds,
        selectedTeachingLevelIds,
        selectedEducationStageIds,
        degreeFile,
        nationalIdFile,
        availabilitySlotsJson: JSON.stringify(slotsPayload),
      })

      await createTeacherMutation.mutateAsync(formData)
      toast.success("Teacher account created successfully!")
      router.push("/teacher/teacher_list")
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create teacher. Please check input data."
      toast.error(errorMsg)
    }
  }

  const isFormLoading = isSubmitting || createTeacherMutation.isPending

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <PageHeader
        title="Add Teacher"
        description="Create a new teacher account and configure their teaching information."
      />

      <main className="flex-1 p-6 md:p-8 max-w-[1100px] w-full mx-auto flex flex-col gap-6">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            {/* Card 1: Basic Information */}
            <TeacherBasicInfoCard
              control={control}
              isActive={isActive}
              onIsActiveChange={(val) => {
                setValue("isActive", val)
              }}
            />

            {/* Card 2: Professional Information */}
            <TeacherProfessionalInfoCard control={control} />

            {/* Card 3: Teaching Setup */}
            <TeacherTeachingSetupCard
              selectedSubjectIds={selectedSubjectIds}
              onToggleSubject={toggleSubject}
              selectedEducationStageIds={selectedEducationStageIds}
              onToggleEducationStage={toggleEducationStage}
              selectedTeachingLevelIds={selectedTeachingLevelIds}
              onToggleTeachingLevel={toggleTeachingLevel}
            />

            {/* Card 4: Verification Documents */}
            <TeacherDocumentsCard
              degreeFile={degreeFile}
              onDegreeFileChange={setDegreeFile}
              nationalIdFile={nationalIdFile}
              onNationalIdFileChange={setNationalIdFile}
            />

            {/* Card 5: Availability Setup */}
            <TeacherAvailabilityFormCard
              setAvailabilityNow={setAvailabilityNow}
              onSetAvailabilityNowChange={setSetAvailabilityNow}
              availability={availability}
              onAddSlot={addTimeSlot}
              onRemoveSlot={removeTimeSlot}
              onUpdateSlot={updateTimeSlot}
            />

            {/* Form Actions */}
            <TeacherFormActions
              isSubmitting={isFormLoading}
              submitLabel="Create Teacher"
              cancelHref="/teacher/teacher_list"
            />
          </form>
        </Form>
      </main>
    </div>
  )
}
