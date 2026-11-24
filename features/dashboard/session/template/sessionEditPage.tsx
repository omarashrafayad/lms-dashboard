"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft, ArrowRight, ArrowLeft, Loader2, Save } from "lucide-react"
import { toast } from "sonner"
import { Form } from "@/components/ui/form"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import GlobalError from "@/components/shared/globalerror"

import { ScheduleSessionStepper } from "../components/schedule/ScheduleSessionStepper"
import {
  updateSessionSchema,
  UpdateSessionFormData,
} from "../schema/session.schema"
import {
  useSessionDetail,
  useUpdateSession,
  useTeacherSlots,
} from "../hooks/useSessions"
import { useStudents } from "@/features/dashboard/student/hooks/useStudents"
import {
  useTeachers,
  useTeacherSubjects,
} from "@/features/dashboard/teacher/hooks/useTeachers"
import { useCourses } from "@/features/dashboard/course/hooks/useCourses"
import { UpdateSessionPayload } from "../types/session.types"
import { useDebounce } from "@/hooks/useDebounce"

import { ScheduleStudentStep } from "../components/schedule/ScheduleStudentStep"
import { ScheduleTeacherStep } from "../components/schedule/ScheduleTeacherStep"
import { ScheduleDateTimeStep } from "../components/schedule/ScheduleDateTimeStep"
import { ScheduleDetailsStep } from "../components/schedule/ScheduleDetailsStep"

export interface SessionEditPageProps {
  sessionId: string
}

const DURATION_OPTIONS = [
  { label: "30 min", value: "30" },
  { label: "45 min", value: "45" },
  { label: "60 min", value: "60" },
  { label: "90 min", value: "90" },
]

const SESSION_TYPE_OPTIONS = [
  { label: "Private 1:1", value: "Private 1:1" },
  { label: "Group", value: "Group" },
]

export default function SessionEditPage({ sessionId }: SessionEditPageProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState(1)

  const { data: session, isLoading: isSessionLoading, isError: isSessionError } =
    useSessionDetail(sessionId)
  const updateMutation = useUpdateSession(sessionId)

  // Search filters
  const [studentSearch, setStudentSearch] = React.useState("")
  const [teacherSearch, setTeacherSearch] = React.useState("")
  const debouncedStudentSearch = useDebounce(studentSearch, 400)
  const debouncedTeacherSearch = useDebounce(teacherSearch, 400)

  // Selected entities
  const [selectedStudentObj, setSelectedStudentObj] = React.useState<any>(null)
  const [selectedTeacherObj, setSelectedTeacherObj] = React.useState<any>(null)

  // Queries for real entities via backend search
  const {
    data: studentsData,
    isLoading: isLoadingStudents,
    isError: isStudentsError,
  } = useStudents({
    page: 1,
    pageSize: 10,
    search: debouncedStudentSearch ? debouncedStudentSearch.trim() : undefined,
  })
  const students = Array.isArray(studentsData) ? studentsData : studentsData?.items || []

  const {
    data: teachersData,
    isLoading: isLoadingTeachers,
    isError: isTeachersError,
  } = useTeachers({
    page: 1,
    pageSize: 10,
    search: debouncedTeacherSearch ? debouncedTeacherSearch.trim() : undefined,
  })
  const teachers = Array.isArray(teachersData) ? teachersData : teachersData?.items || []

  const { data: subjects = [] } = useTeacherSubjects()
  const { data: coursesData } = useCourses({ pageSize: 100 })
  const courses = Array.isArray(coursesData) ? coursesData : coursesData?.items || []

  const todayFormatted = React.useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
  }, [])

  const form = useForm<UpdateSessionFormData>({
    resolver: zodResolver(updateSessionSchema) as any,
    mode: "all",
    defaultValues: {
      title: "",
      description: "",
      studentId: "",
      studentName: "",
      teacherId: "",
      teacherName: "",
      date: new Date().toISOString().split("T")[0],
      startTime: "",
      targetType: "subject",
      subjectId: "",
      subjectName: "",
      courseId: "",
      courseName: "",
      durationMinutes: "60",
      sessionType: "Private 1:1",
      maxStudents: 1,
      meetingUrl: "",
      isLive: false,
      notes: "",
      status: "Upcoming",
    },
  })

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    trigger,
    formState: { isSubmitting },
  } = form

  const selectedStudentId = watch("studentId")
  const selectedTeacherId = watch("teacherId")
  const selectedDate = watch("date") || new Date().toISOString().split("T")[0]
  const selectedStartTime = watch("startTime") || ""
  const selectedTargetType = watch("targetType") || "subject"

  // Prefill form from existing session
  React.useEffect(() => {
    if (session) {
      const isCourse = Boolean(session.courseId || session.courseName)
      const rawDate = session.date || session.formattedDate || session.scheduledStart
      let dateValue = new Date().toISOString().split("T")[0]
      if (rawDate) {
        try {
          const d = new Date(rawDate)
          if (!isNaN(d.getTime())) {
            dateValue = d.toISOString().split("T")[0]
          }
        } catch {
          // fallback
        }
      }

      reset({
        title: session.title || "",
        description: session.description || "",
        studentId: session.studentId || session.student?.id || "",
        studentName: session.studentName || session.student?.name || "",
        teacherId: session.teacherId || session.teacher?.id || "",
        teacherName: session.teacherName || session.teacher?.name || "",
        date: dateValue,
        startTime: session.startTime || session.time || "10:00 AM",
        durationMinutes: String(session.durationMinutes || "60"),
        sessionType: session.sessionType || "Private 1:1",
        targetType: isCourse ? "course" : "subject",
        subjectId: session.subjectId || "",
        subjectName: session.subjectName || session.subject || "",
        courseId: session.courseId || "",
        courseName: session.courseName || "",
        maxStudents: session.maxStudents || 1,
        meetingUrl: session.meetingUrl || "",
        isLive: Boolean(session.isLive),
        notes: session.notes || "",
        status: session.status || session.sessionStatus || "Upcoming",
      })

      if (session.student || session.studentName || session.studentId) {
        setSelectedStudentObj({
          id: session.studentId || session.student?.id,
          fullName: session.studentName || session.student?.name,
          academicStage: session.student?.academicStage || session.educationStage,
          grade: session.student?.academicYear || session.academicStage,
        })
      }

      if (session.teacher || session.teacherName || session.teacherId) {
        setSelectedTeacherObj({
          id: session.teacherId || session.teacher?.id,
          fullName: session.teacherName || session.teacher?.name,
          subject: session.teacherSubject || session.teacher?.subject || session.subject,
          isAvailable: session.isTeacherAvailable ?? session.teacher?.isAvailable ?? true,
        })
      }
    }
  }, [session, reset])

  // Teacher slots query based on selected teacher and selected date
  const {
    data: teacherSlots,
    isLoading: isLoadingSlots,
  } = useTeacherSlots(
    selectedTeacherId || "",
    selectedDate,
    { enabled: Boolean(selectedTeacherId) }
  )

  // Helper to format slot time from raw backend string
  const formatSlotTime = React.useCallback((rawTime: string): string => {
    if (!rawTime) return ""
    if (/^\d{1,2}:\d{2}\s*(AM|PM)$/i.test(rawTime.trim())) {
      return rawTime.trim().toUpperCase()
    }
    if (rawTime.includes("T")) {
      const d = new Date(rawTime)
      if (!isNaN(d.getTime())) {
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    }
    const parts = rawTime.split(":")
    if (parts.length >= 2) {
      const h = parseInt(parts[0], 10)
      const m = parseInt(parts[1], 10)
      if (!isNaN(h) && !isNaN(m)) {
        const period = h >= 12 ? "PM" : "AM"
        const hour12 = h % 12 === 0 ? 12 : h % 12
        const padHour = String(hour12).padStart(2, "0")
        const padMin = String(m).padStart(2, "0")
        return `${padHour}:${padMin} ${period}`
      }
    }
    return rawTime
  }, [])

  // Computed slots for step 3 strictly from backend response
  const computedSlots = React.useMemo(() => {
    if (!teacherSlots || teacherSlots.length === 0) {
      return []
    }

    return teacherSlots.map((slot: any) => {
      const raw = slot.startTime || slot.time || slot.formattedTime || ""
      const time = formatSlotTime(raw) || raw

      let available = true
      if (typeof slot.isAvailable === "boolean") {
        available = slot.isAvailable
      } else if (typeof slot.available === "boolean") {
        available = slot.available
      } else if (slot.isBooked === true || slot.isUnavailable === true) {
        available = false
      } else if (typeof slot.status === "string") {
        const s = slot.status.toLowerCase()
        if (s === "booked" || s === "unavailable" || s === "busy" || s === "cancelled") {
          available = false
        } else if (s === "available" || s === "free" || s === "open") {
          available = true
        }
      }

      return {
        time,
        available,
      }
    })
  }, [teacherSlots, formatSlotTime])

  const subjectOptions = React.useMemo(() => {
    return subjects.map((s) => ({ label: s.name, value: s.id }))
  }, [subjects])

  const courseOptions = React.useMemo(() => {
    return courses.map((c) => ({
      label: c.title || c.name || "Course",
      value: c.id,
    }))
  }, [courses])

  // Navigation handlers
  const handleNext = async () => {
    if (currentStep === 1) {
      if (!selectedStudentId) {
        toast.error("Please select a student from the list.")
        return
      }
      setCurrentStep(2)
      return
    }

    if (currentStep === 2) {
      if (!selectedTeacherId) {
        toast.error("Please select a teacher from the list.")
        return
      }
      setCurrentStep(3)
      return
    }

    if (currentStep === 3) {
      if (!selectedDate) {
        toast.error("Please select a date.")
        return
      }
      if (!selectedStartTime) {
        toast.error("Please select a time slot.")
        return
      }
      setCurrentStep(4)
      return
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1))
  }

  const onSubmit = async (data: UpdateSessionFormData) => {
    try {
      const parsedDate = data.date ? new Date(data.date).toISOString() : new Date().toISOString()

      const payload: UpdateSessionPayload = {
        title:
          data.title ||
          session?.title ||
          `Session: ${selectedTeacherObj?.fullName || data.teacherName || "Teacher"} with ${selectedStudentObj?.fullName || data.studentName || "Student"}`,
        description: data.description || "",
        teacherId: data.teacherId || selectedTeacherObj?.id,
        teacherName: selectedTeacherObj?.fullName || data.teacherName,
        studentId: data.studentId || selectedStudentObj?.id,
        studentName: selectedStudentObj?.fullName || data.studentName,
        date: parsedDate,
        startTime: data.startTime,
        durationMinutes: Number(data.durationMinutes) || 60,
        sessionType: data.sessionType || "Private 1:1",
        availableTimeSlot: data.startTime,
        timeSlot: data.startTime,
        maxStudents: Number(data.maxStudents) || 1,
        meetingUrl: data.meetingUrl || "",
        isLive: Boolean(data.isLive),
        notes: data.notes || "",
        status: data.status || "Upcoming",
      }

      if (data.targetType === "subject") {
        payload.subjectId = data.subjectId
        const foundSub = subjects.find((s) => s.id === data.subjectId)
        payload.subjectName = foundSub?.name || data.subjectName || ""
        payload.courseId = undefined
        payload.courseName = undefined
      } else {
        payload.courseId = data.courseId
        const foundCourse = courses.find((c) => c.id === data.courseId)
        payload.courseName =
          foundCourse?.title || foundCourse?.name || data.courseName || ""
        payload.subjectId = undefined
        payload.subjectName = undefined
      }

      if (selectedStudentObj?.educationStage) {
        payload.educationStage = selectedStudentObj.educationStage
      }
      if (selectedStudentObj?.grade) {
        payload.academicStage = selectedStudentObj.grade
      }

      await updateMutation.mutateAsync({ sessionId, data: payload })
      toast.success("Session updated successfully!")
      router.push(`/sessions/${sessionId}`)
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    }
  }

  if (isSessionLoading) {
    return (
      <div className="flex-1 p-8">
        <LoadingSpinner title="Loading session data..." />
      </div>
    )
  }

  if (isSessionError || !session) {
    return (
      <div className="flex-1 p-8">
        <GlobalError />
      </div>
    )
  }

  const isFormLoading = isSubmitting || updateMutation.isPending

  return (
    <div className="flex flex-col min-h-full">
      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1300px] w-full mx-auto pb-24 animate-in fade-in duration-200">
        <div>
          <Link
            href={`/sessions/${sessionId}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <ChevronLeft className="size-4 text-zinc-500" />
            <span>Back to Session Details</span>
          </Link>
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Edit Session #{session.sessionNumber || sessionId.slice(0, 8)}
          </h1>
          <p className="text-xs text-zinc-500">
            Update participant assignments, scheduled timing, or session details.
          </p>
        </div>

        {/* Stepper identical to Add */}
        <ScheduleSessionStepper
          currentStep={currentStep}
          onStepClick={(step) => {
            setCurrentStep(step)
          }}
        />

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            {/* Step 1: Select Student */}
            {currentStep === 1 && (
              <ScheduleStudentStep
                selectedStudent={selectedStudentObj}
                onSelectStudent={(student) => {
                  setSelectedStudentObj(student)
                  setValue("studentId", student.id, { shouldValidate: true })
                  setValue("studentName", student.fullName || student.name || "")
                }}
                onClearStudent={() => {
                  setSelectedStudentObj(null)
                  setValue("studentId", "", { shouldValidate: true })
                  setValue("studentName", "")
                }}
                students={students}
                isLoadingStudents={isLoadingStudents}
                isErrorStudents={isStudentsError}
                search={studentSearch}
                onSearchChange={setStudentSearch}
              />
            )}

            {/* Step 2: Select Teacher */}
            {currentStep === 2 && (
              <ScheduleTeacherStep
                selectedTeacher={selectedTeacherObj}
                onSelectTeacher={(teacher) => {
                  setSelectedTeacherObj(teacher)
                  setValue("teacherId", teacher.id, { shouldValidate: true })
                  setValue("teacherName", teacher.fullName || teacher.name || "")
                }}
                onClearTeacher={() => {
                  setSelectedTeacherObj(null)
                  setValue("teacherId", "", { shouldValidate: true })
                  setValue("teacherName", "")
                }}
                teachers={teachers}
                isLoadingTeachers={isLoadingTeachers}
                isErrorTeachers={isTeachersError}
                search={teacherSearch}
                onSearchChange={setTeacherSearch}
              />
            )}

            {/* Step 3: Select Date & Time */}
            {currentStep === 3 && (
              <ScheduleDateTimeStep
                selectedDate={selectedDate}
                onDateChange={(date) => {
                  setValue("date", date, { shouldValidate: true })
                  setValue("startTime", "", { shouldValidate: true })
                }}
                selectedTime={selectedStartTime}
                onTimeChange={(time) => setValue("startTime", time, { shouldValidate: true })}
                computedSlots={computedSlots}
                todayFormatted={todayFormatted}
                selectedTeacherName={selectedTeacherObj?.fullName}
                isLoadingSlots={isLoadingSlots}
              />
            )}

            {/* Step 4: Session Details */}
            {currentStep === 4 && (
              <ScheduleDetailsStep
                control={control as any}
                selectedDate={selectedDate || "Today"}
                selectedTime={selectedStartTime || "10:00 AM"}
                targetType={selectedTargetType}
                onTargetTypeChange={(type) => setValue("targetType", type, { shouldValidate: true })}
                subjectOptions={subjectOptions}
                courseOptions={courseOptions}
                sessionTypeOptions={SESSION_TYPE_OPTIONS}
                durationOptions={DURATION_OPTIONS}
              />
            )}

            {/* Stepper Footer Navigation */}
            <div className="flex items-center justify-between pt-2">
              <Link
                href={`/sessions/${sessionId}`}
                className="h-9 px-4 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors flex items-center justify-center cursor-pointer"
              >
                Cancel
              </Link>

              <div className="flex items-center gap-3">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="h-9 px-4 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="size-3.5" />
                    <span>Back</span>
                  </button>
                )}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="h-9 px-5 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
                  >
                    <span>Continue</span>
                    <ArrowRight className="size-3.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isFormLoading}
                    className="h-9 px-6 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-50"
                  >
                    {isFormLoading ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Save className="size-3.5" />
                    )}
                    <span>Save Changes</span>
                  </button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </main>
    </div>
  )
}
