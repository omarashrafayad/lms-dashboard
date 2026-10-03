"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/layout/PageHeader"
import { Form } from "@/components/ui/form"
import {
  updateTeacherSchema,
  UpdateTeacherFormData,
  DayAvailability,
  SlotItem,
} from "../schema/teacher.schema"
import { useTeacher, useUpdateTeacher } from "../hooks/useTeachers"
import { buildUpdateTeacherFormData } from "../utils/teacherFormData"
import {
  TeacherBasicInfoCard,
  TeacherProfessionalInfoCard,
  TeacherTeachingSetupCard,
  TeacherDocumentsCard,
  TeacherAvailabilityFormCard,
  TeacherFormActions,
} from "../components/form"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"
import LoadingSpinner from "@/components/shared/LoadingSpinner"

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

interface TeacherEditPageProps {
  teacherId: string
}

export default function TeacherEditPage({ teacherId }: TeacherEditPageProps) {
  const router = useRouter()

  const { data: teacher, isLoading: isTeacherLoading } = useTeacher(teacherId)
  const updateTeacherMutation = useUpdateTeacher()

  const [degreeFile, setDegreeFile] = React.useState<File | null>(null)
  const [nationalIdFile, setNationalIdFile] = React.useState<File | null>(null)
  const existingDegreeUrl = teacher?.universityDegreeCertificateUrl ?? null
  const existingNationalIdUrl = teacher?.nationalIdDocumentUrl ?? null

  const [availabilityMode, setAvailabilityMode] = React.useState<"Yes" | "Skip">("Yes")

  const form = useForm<UpdateTeacherFormData>({
    resolver: zodResolver(updateTeacherSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
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
    reset,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = form

  const watchedFullName = useWatch({ control, name: "fullName" })
  const isActive = useWatch({ control, name: "isActive" }) ?? true
  const selectedSubjectIds = useWatch({ control, name: "subjectIds" }) ?? []
  const selectedEducationStageIds = useWatch({ control, name: "educationStageIds" }) ?? []
  const selectedTeachingLevelIds = useWatch({ control, name: "teachingLevelIds" }) ?? []
  const availability = useWatch({ control, name: "availability" }) ?? []

  // Populate form with loaded teacher details
  React.useEffect(() => {
    if (!teacher) return

    let dob = ""
    if (teacher.dateOfBirth) {
      try {
        const d = new Date(teacher.dateOfBirth)
        if (!isNaN(d.getTime())) {
          dob = d.toISOString().slice(0, 10)
        } else {
          dob = teacher.dateOfBirth.slice(0, 10)
        }
      } catch {
        dob = ""
      }
    }

    const subIds = teacher.specializations
      ? Array.from(
          new Set(
            teacher.specializations
              .map((s) => s.subjectId)
              .filter(Boolean) as string[]
          )
        )
      : []

    const lvlIds = teacher.specializations
      ? Array.from(
          new Set(
            teacher.specializations
              .map((s) => s.teachingLevelId)
              .filter(Boolean) as string[]
          )
        )
      : []

    const stgIds = teacher.specializations
      ? Array.from(
          new Set(
            teacher.specializations
              .map((s) => s.academicStageId)
              .filter(Boolean) as string[]
          )
        )
      : []

    // Populate availability slots into form state
    let populatedAvailability: DayAvailability[] = WEEK_DAYS.map((d) => ({
      dayName: d.name,
      dayOfWeek: d.dayOfWeek,
      slots: [],
    }))

    if (
      teacher.availabilitySlots &&
      Array.isArray(teacher.availabilitySlots) &&
      teacher.availabilitySlots.length > 0
    ) {
      populatedAvailability = WEEK_DAYS.map((day) => {
        const slotsForDay = (teacher.availabilitySlots || []).filter(
          (slot) => slot.dayOfWeek === day.dayOfWeek
        )
        return {
          dayName: day.name,
          dayOfWeek: day.dayOfWeek,
          slots: slotsForDay.map((s) => ({
            id: s.id || crypto.randomUUID(),
            start: s.startTime ? s.startTime.slice(0, 5) : "09:00",
            end: s.endTime ? s.endTime.slice(0, 5) : "12:00",
          })),
        }
      })
    }

    reset({
      fullName: teacher.fullName || "",
      phoneNumber: teacher.phoneNumber || "",
      nationalId: teacher.nationalId || "",
      dateOfBirth: dob,
      genderId: "", // will match gender once loaded or user picks
      qualifications: teacher.qualifications || "",
      yearsOfExperience: teacher.yearsOfExperience ?? 0,
      bio: teacher.bio || "",
      history: teacher.history || "",
      isActive: teacher.isActive,
      isAvailable: teacher.isAvailable ?? true,
      subjectIds: subIds,
      teachingLevelIds: lvlIds,
      educationStageIds: stgIds,
      availability: populatedAvailability,
    })
  }, [teacher, reset])

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

  const onSubmit = async (data: UpdateTeacherFormData) => {
    try {
      let slotsPayload: TimeSlotPayload[] = []
      if (availabilityMode === "Yes") {
        const validated = validateAndBuildAvailabilityPayload(availability)
        if (validated === null) {
          return
        }
        slotsPayload = validated
      }

      const formData = buildUpdateTeacherFormData(data, {
        degreeFile,
        nationalIdFile,
        availabilitySlotsJson: JSON.stringify(slotsPayload),
      })

      await updateTeacherMutation.mutateAsync({ teacherId, data: formData })
      toast.success("Teacher updated successfully!")
      router.push(`/teacher/teacher_list`)
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    }
  }

  const isFormLoading = isSubmitting || updateTeacherMutation.isPending

  if (isTeacherLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-8">
        <LoadingSpinner title="Loading teacher details..." />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <PageHeader
        title={`Edit Teacher: ${watchedFullName || teacher?.fullName || "Teacher"}`}
        description="Update teacher details, teaching setup, documents, and weekly schedule."
      />

      <main className="flex-1 p-6 md:p-8 max-w-[1100px] w-full mx-auto flex flex-col gap-6">
        <div className="flex items-center">
          <Link
            href={`/teacher/${teacherId}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            <ChevronLeft className="size-4" />
            <span>Back to Teacher Profile</span>
          </Link>
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            {/* Card 1: Basic Information */}
            <TeacherBasicInfoCard
              control={control}
              isEditMode={true}
              isActive={isActive}
              onIsActiveChange={(val) => {
                setValue("isActive", val, { shouldDirty: true, shouldValidate: true })
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
              existingDegreeUrl={existingDegreeUrl}
              existingNationalIdUrl={existingNationalIdUrl}
              isEditMode={true}
            />

            {/* Card 5: Availability Setup */}
            <TeacherAvailabilityFormCard
              availabilityMode={availabilityMode}
              onAvailabilityModeChange={setAvailabilityMode}
              availability={availability}
              onAddSlot={addTimeSlot}
              onRemoveSlot={removeTimeSlot}
              onUpdateSlot={updateTimeSlot}
            />

            {/* Form Actions */}
            <TeacherFormActions
              isSubmitting={isFormLoading}
              submitLabel="Save Changes"
              cancelHref={`/teacher/${teacherId}`}
            />
          </form>
        </Form>
      </main>
    </div>
  )
}
