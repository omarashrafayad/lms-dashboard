"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { PageHeader } from "@/components/layout/PageHeader"
import { Form } from "@/components/ui/form"
import {
  createTeacherSchema,
  CreateTeacherFormData,
  DayAvailability,
  SlotItem,
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
} from "../components/form"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"

const WEEK_DAYS: { name: string; dayOfWeek: number }[] = [
  { name: "Sunday", dayOfWeek: 0 },
  { name: "Monday", dayOfWeek: 1 },
  { name: "Tuesday", dayOfWeek: 2 },
  { name: "Wednesday", dayOfWeek: 3 },
  { name: "Thursday", dayOfWeek: 4 },
  { name: "Friday", dayOfWeek: 5 },
  { name: "Saturday", dayOfWeek: 6 },
]

type MultiSelectField = "subjectIds" | "educationStageIds" | "teachingLevelIds"

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/

interface TimeSlotPayload {
  dayOfWeek: number
  startTime: string
  endTime: string
}

function validateAndBuildAvailabilityPayload(
  availability: DayAvailability[]
): TimeSlotPayload[] | null {
  const slotsPayload: TimeSlotPayload[] = []

  const timeToMinutes = (t: string): number => {
    const [h, m] = t.split(":").map(Number)
    return h * 60 + m
  }

  for (const day of availability) {
    if (!day.slots || day.slots.length === 0) continue

    // Validate format and start < end for each slot
    for (const slot of day.slots) {
      if (!TIME_REGEX.test(slot.start)) {
        toast.error(
          `Invalid start time format in ${day.dayName}: "${slot.start}". Expected format is HH:mm (e.g. 09:00)`
        )
        return null
      }
      if (!TIME_REGEX.test(slot.end)) {
        toast.error(
          `Invalid end time format in ${day.dayName}: "${slot.end}". Expected format is HH:mm (e.g. 12:00)`
        )
        return null
      }

      const startMin = timeToMinutes(slot.start)
      const endMin = timeToMinutes(slot.end)

      if (startMin >= endMin) {
        toast.error(
          `Start time (${slot.start}) must be before end time (${slot.end}) in ${day.dayName}`
        )
        return null
      }
    }

    // Check for overlapping slots within the same day
    const sortedSlots = [...day.slots].sort(
      (a, b) => timeToMinutes(a.start) - timeToMinutes(b.start)
    )

    for (let i = 0; i < sortedSlots.length - 1; i++) {
      const current = sortedSlots[i]
      const next = sortedSlots[i + 1]

      const currentEnd = timeToMinutes(current.end)
      const nextStart = timeToMinutes(next.start)

      if (currentEnd > nextStart) {
        toast.error(
          `Overlapping time slots in ${day.dayName}: (${current.start} - ${current.end}) overlaps with (${next.start} - ${next.end})`
        )
        return null
      }
    }

    // Build payload for this day
    for (const slot of day.slots) {
      slotsPayload.push({
        dayOfWeek: day.dayOfWeek,
        startTime: `${slot.start}:00`,
        endTime: `${slot.end}:00`,
      })
    }
  }

  return slotsPayload
}

export default function TeacherAddPage() {
  const router = useRouter()
  const createTeacherMutation = useCreateTeacher()

  const [degreeFile, setDegreeFile] = React.useState<File | null>(null)
  const [nationalIdFile, setNationalIdFile] = React.useState<File | null>(null)

  const [availabilityMode, setAvailabilityMode] = React.useState<"Yes" | "Skip">("Yes")

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
      availability: WEEK_DAYS.map((d) => ({
        dayName: d.name,
        dayOfWeek: d.dayOfWeek,
        slots: [],
      })),
    },
  })

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = form

  const isActive = useWatch({ control, name: "isActive" }) ?? true
  const selectedSubjectIds = useWatch({ control, name: "subjectIds" }) ?? []
  const selectedEducationStageIds = useWatch({ control, name: "educationStageIds" }) ?? []
  const selectedTeachingLevelIds = useWatch({ control, name: "teachingLevelIds" }) ?? []
  const availability = useWatch({ control, name: "availability" }) ?? []

  const toggleId = (field: MultiSelectField, id: string) => {
    const current = getValues(field) ?? []

    const next = current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id]

    setValue(field, next, { shouldValidate: true, shouldDirty: true })
  }

  const toggleSubject = (id: string) => toggleId("subjectIds", id)
  const toggleEducationStage = (id: string) => toggleId("educationStageIds", id)
  const toggleTeachingLevel = (id: string) => toggleId("teachingLevelIds", id)

  const addTimeSlot = (dayOfWeek: number) => {
    const current = getValues("availability") ?? []
    const next = current.map((d) => {
      if (d.dayOfWeek === dayOfWeek) {
        const newSlot: SlotItem = {
          id: crypto.randomUUID(),
          start: "09:00",
          end: "12:00",
        }
        return { ...d, slots: [...d.slots, newSlot] }
      }
      return d
    })
    setValue("availability", next, { shouldDirty: true })
  }

  const removeTimeSlot = (dayOfWeek: number, slotId: string) => {
    const current = getValues("availability") ?? []
    const next = current.map((d) => {
      if (d.dayOfWeek === dayOfWeek) {
        return { ...d, slots: d.slots.filter((s) => s.id !== slotId) }
      }
      return d
    })
    setValue("availability", next, { shouldDirty: true })
  }

  const updateTimeSlot = (
    dayOfWeek: number,
    slotId: string,
    field: "start" | "end",
    val: string
  ) => {
    const current = getValues("availability") ?? []
    const next = current.map((d) => {
      if (d.dayOfWeek === dayOfWeek) {
        return {
          ...d,
          slots: d.slots.map((s) => (s.id === slotId ? { ...s, [field]: val } : s)),
        }
      }
      return d
    })
    setValue("availability", next, { shouldDirty: true })
  }

  const onSubmit = async (data: CreateTeacherFormData) => {
    try {
      let slotsPayload: TimeSlotPayload[] = []
      if (availabilityMode === "Yes") {
        const validated = validateAndBuildAvailabilityPayload(availability)
        if (validated === null) {
          return
        }
        slotsPayload = validated
      }

      const formData = buildCreateTeacherFormData(data, {
        degreeFile,
        nationalIdFile,
        availabilitySlotsJson: JSON.stringify(slotsPayload),
      })

      await createTeacherMutation.mutateAsync(formData)
      toast.success("Teacher account created successfully!")
      router.push("/teacher/teacher_list")
    } catch (error: unknown) {
      toast.error(getErrorMessage(error))
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
            <TeacherBasicInfoCard
              control={control}
              isActive={isActive}
              onIsActiveChange={(val) => {
                setValue("isActive", val, { shouldDirty: true, shouldValidate: true })
              }}
            />

            <TeacherProfessionalInfoCard control={control} />

            <TeacherTeachingSetupCard
              selectedSubjectIds={selectedSubjectIds}
              onToggleSubject={toggleSubject}
              selectedEducationStageIds={selectedEducationStageIds}
              onToggleEducationStage={toggleEducationStage}
              selectedTeachingLevelIds={selectedTeachingLevelIds}
              onToggleTeachingLevel={toggleTeachingLevel}
            />

            <TeacherDocumentsCard
              degreeFile={degreeFile}
              onDegreeFileChange={setDegreeFile}
              nationalIdFile={nationalIdFile}
              onNationalIdFileChange={setNationalIdFile}
            />

            <TeacherAvailabilityFormCard
              availabilityMode={availabilityMode}
              onAvailabilityModeChange={setAvailabilityMode}
              availability={availability}
              onAddSlot={addTimeSlot}
              onRemoveSlot={removeTimeSlot}
              onUpdateSlot={updateTimeSlot}
            />

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
