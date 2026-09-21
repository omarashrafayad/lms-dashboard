"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/layout/PageHeader"
import { Form } from "@/components/ui/form"
import {
  updateTeacherSchema,
  UpdateTeacherFormData,
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

interface TeacherEditPageProps {
  teacherId: string
}

export default function TeacherEditPage({ teacherId }: TeacherEditPageProps) {
  const router = useRouter()

  const { data: teacher, isLoading: isTeacherLoading } = useTeacher(teacherId)
  const updateTeacherMutation = useUpdateTeacher()

  const [isActive, setIsActive] = React.useState(true)
  const [selectedSubjectIds, setSelectedSubjectIds] = React.useState<string[]>([])
  const [selectedEducationStageIds, setSelectedEducationStageIds] = React.useState<string[]>([])
  const [selectedTeachingLevelIds, setSelectedTeachingLevelIds] = React.useState<string[]>([])

  const [degreeFile, setDegreeFile] = React.useState<File | null>(null)
  const [nationalIdFile, setNationalIdFile] = React.useState<File | null>(null)
  const [existingDegreeUrl, setExistingDegreeUrl] = React.useState<string | null>(null)
  const [existingNationalIdUrl, setExistingNationalIdUrl] = React.useState<string | null>(null)

  const [setAvailabilityNow, setSetAvailabilityNow] = React.useState<"Yes" | "Skip">("Yes")
  const [availability, setAvailability] = React.useState<DayAvailability[]>(
    WEEK_DAYS.map((d) => ({
      dayName: d.name,
      dayOfWeek: d.dayOfWeek,
      slots: [],
    }))
  )

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
    },
  })

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = form

  const watchedFullName = watch("fullName")

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

    setSelectedSubjectIds(subIds)
    setSelectedTeachingLevelIds(lvlIds)
    setSelectedEducationStageIds(stgIds)
    setIsActive(teacher.isActive)

    if (teacher.universityDegreeCertificateUrl) {
      setExistingDegreeUrl(teacher.universityDegreeCertificateUrl)
    }
    if (teacher.nationalIdDocumentUrl) {
      setExistingNationalIdUrl(teacher.nationalIdDocumentUrl)
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
    })

    // Populate availability slots
    if (teacher.availabilitySlots && Array.isArray(teacher.availabilitySlots)) {
      setAvailability((prev) =>
        prev.map((day) => {
          const slotsForDay = (teacher.availabilitySlots || []).filter(
            (slot) => slot.dayOfWeek === day.dayOfWeek
          )
          return {
            ...day,
            slots: slotsForDay.map((s, idx) => ({
              id: s.id || `slot-${day.dayOfWeek}-${idx}`,
              start: s.startTime ? s.startTime.slice(0, 5) : "09:00",
              end: s.endTime ? s.endTime.slice(0, 5) : "12:00",
            })),
          }
        })
      )
    }
  }, [teacher, reset])

  const toggleSubject = (id: string) => {
    setSelectedSubjectIds((prev) => {
      const next = prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
      setValue("subjectIds", next)
      return next
    })
  }

  const toggleEducationStage = (id: string) => {
    setSelectedEducationStageIds((prev) => {
      const next = prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
      setValue("educationStageIds", next)
      return next
    })
  }

  const toggleTeachingLevel = (id: string) => {
    setSelectedTeachingLevelIds((prev) => {
      const next = prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
      setValue("teachingLevelIds", next)
      return next
    })
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

  const onSubmit = async (data: UpdateTeacherFormData) => {
    try {
      let formattedDob = data.dateOfBirth
      if (formattedDob) {
        const parsed = new Date(formattedDob)
        if (!isNaN(parsed.getTime())) {
          formattedDob = parsed.toISOString()
        }
      }

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

      const formData = buildUpdateTeacherFormData(data, {
        isActive,
        selectedSubjectIds,
        selectedTeachingLevelIds,
        selectedEducationStageIds,
        degreeFile,
        nationalIdFile,
        availabilitySlotsJson: JSON.stringify(slotsPayload),
      })

      await updateTeacherMutation.mutateAsync({ teacherId, data: formData })
      toast.success("Teacher updated successfully!")
      router.push(`/teacher/teacher_list`)
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update teacher. Please check input data."
      toast.error(errorMsg)
    }
  }

  const isFormLoading = isSubmitting || updateTeacherMutation.isPending

  if (isTeacherLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-8">
        <Loader2 className="size-8 text-brand-orange animate-spin mb-3" />
        <span className="text-sm text-zinc-500 font-medium">
          Loading teacher details...
        </span>
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
                setIsActive(val)
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
              existingDegreeUrl={existingDegreeUrl}
              existingNationalIdUrl={existingNationalIdUrl}
              isEditMode={true}
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
              submitLabel="Save Changes"
              cancelHref={`/teacher/${teacherId}`}
            />
          </form>
        </Form>
      </main>
    </div>
  )
}
