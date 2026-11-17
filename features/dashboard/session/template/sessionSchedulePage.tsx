"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft, ArrowRight, ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Form } from "@/components/ui/form"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"
import { ScheduleSessionStepper } from "../components/schedule/ScheduleSessionStepper"
import {
  scheduleSessionSchema,
  ScheduleSessionFormData,
  isTimeInFuture,
} from "../schema/session.schema"
import { useScheduleSession, useTeacherSlots } from "../hooks/useSessions"
import { useStudents } from "@/features/dashboard/student/hooks/useStudents"
import {
  useTeachers,
  useTeacherSubjects,
} from "@/features/dashboard/teacher/hooks/useTeachers"
import { useCourses } from "@/features/dashboard/course/hooks/useCourses"
import { ScheduleSessionPayload } from "../types/session.types"
import { useDebounce } from "@/hooks/useDebounce"

import { ScheduleStudentStep } from "../components/schedule/ScheduleStudentStep"
import { ScheduleTeacherStep } from "../components/schedule/ScheduleTeacherStep"
import { ScheduleDateTimeStep } from "../components/schedule/ScheduleDateTimeStep"
import { ScheduleDetailsStep } from "../components/schedule/ScheduleDetailsStep"

const STANDARD_TIME_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
]

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

export default function SessionSchedulePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState(1)
  const scheduleMutation = useScheduleSession()

  // Search filters
  const [studentSearch, setStudentSearch] = React.useState("")
  const [teacherSearch, setTeacherSearch] = React.useState("")
  const debouncedStudentSearch = useDebounce(studentSearch, 400)
  const debouncedTeacherSearch = useDebounce(teacherSearch, 400)

  // Stored selected entities
  const [selectedStudentObj, setSelectedStudentObj] = React.useState<any>(null)
  const [selectedTeacherObj, setSelectedTeacherObj] = React.useState<any>(null)

  // Queries for real entities via backend search (page 1, pageSize 10)
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

  const form = useForm<ScheduleSessionFormData>({
    resolver: zodResolver(scheduleSessionSchema) as any,
    mode: "all",
    defaultValues: {
      studentId: "",
      studentName: "",
      educationStage: "",
      academicStage: "",
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
      notes: "",
    },
  })

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { isSubmitting },
  } = form

  const selectedStudentId = watch("studentId")
  const selectedTeacherId = watch("teacherId")
  const selectedDate = watch("date")
  const selectedStartTime = watch("startTime")
  const selectedTargetType = watch("targetType")

  // Teacher slots query
  const { data: teacherSlots } = useTeacherSlots(
    selectedTeacherId || "",
    { enabled: Boolean(selectedTeacherId) }
  )

  // Computed slots for step 3
  const computedSlots = React.useMemo(() => {
    if (teacherSlots && teacherSlots.length > 0) {
      return teacherSlots.map((slot) => {
        const time = slot.startTime || slot.time || "10:00 AM"
        return {
          time,
          available: slot.isAvailable !== false && isTimeInFuture(time, selectedDate),
        }
      })
    }

    return STANDARD_TIME_SLOTS.map((time) => ({
      time,
      available: isTimeInFuture(time, selectedDate),
    }))
  }, [teacherSlots, selectedDate])

  const subjectOptions = React.useMemo(() => {
    return subjects.map((s) => ({ label: s.name, value: s.id }))
  }, [subjects])

  const courseOptions = React.useMemo(() => {
    return courses.map((c) => ({
      label: c.title || c.name || "Course",
      value: c.id,
    }))
  }, [courses])

  // Stepper Next validation
  const handleNext = async () => {
    if (currentStep === 1) {
      const isValid = await trigger(["studentId"])
      if (!selectedStudentId || !isValid) {
        toast.error("Please select a student from the list.")
        return
      }
      setCurrentStep(2)
      return
    }

    if (currentStep === 2) {
      const isValid = await trigger(["teacherId"])
      if (!selectedTeacherId || !isValid) {
        toast.error("Please select a teacher from the list.")
        return
      }
      setCurrentStep(3)
      return
    }

    if (currentStep === 3) {
      const isValid = await trigger(["date", "startTime"])
      if (!selectedStartTime) {
        toast.error("Please select a time slot.")
        return
      }
      if (!isValid) return
      setCurrentStep(4)
      return
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1))
  }

  const onSubmit = async (data: ScheduleSessionFormData) => {
    try {
      const todayIso = new Date().toISOString()

      const payload: ScheduleSessionPayload = {
        studentId: data.studentId,
        studentName: selectedStudentObj?.fullName || data.studentName || "",
        teacherId: data.teacherId,
        teacherName: selectedTeacherObj?.fullName || data.teacherName || "",
        date: todayIso,
        startTime: data.startTime,
        durationMinutes: Number(data.durationMinutes),
        sessionType: data.sessionType,
        availableTimeSlot: data.startTime,
        timeSlot: data.startTime,
        maxStudents: data.maxStudents,
        notes: data.notes || "",
      }

      if (data.targetType === "subject") {
        payload.subjectId = data.subjectId
        const foundSub = subjects.find((s) => s.id === data.subjectId)
        payload.subjectName = foundSub?.name || data.subjectName || ""
      } else {
        payload.courseId = data.courseId
        const foundCourse = courses.find((c) => c.id === data.courseId)
        payload.courseName =
          foundCourse?.title || foundCourse?.name || data.courseName || ""
      }

      if (selectedStudentObj?.educationStage) {
        payload.educationStage = selectedStudentObj.educationStage
      }
      if (selectedStudentObj?.grade) {
        payload.academicStage = selectedStudentObj.grade
      }

      await scheduleMutation.mutateAsync(payload)
      toast.success("Session scheduled successfully!")
      router.push("/sessions")
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    }
  }

  const isFormLoading = isSubmitting || scheduleMutation.isPending

  return (
    <div className="flex flex-col min-h-full">
      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1300px] w-full mx-auto pb-24 animate-in fade-in duration-200">
        <div>
          <Link
            href="/sessions"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <ChevronLeft className="size-4 text-zinc-500" />
            <span>Back to All Sessions</span>
          </Link>
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Schedule New Session
          </h1>
          <p className="text-xs text-zinc-500">
            Follow the 4 steps to configure participants, timing, and curriculum details.
          </p>
        </div>

        {/* 4-Step Stepper (Review step removed) */}
        <ScheduleSessionStepper
          currentStep={currentStep}
          onStepClick={(step) => {
            if (step < currentStep) setCurrentStep(step)
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
                  setValue("educationStage", student.academicStage || student.educationStage || "")
                  setValue("academicStage", student.grade || "")
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
                onDateChange={(date) => setValue("date", date, { shouldValidate: true })}
                selectedTime={selectedStartTime}
                onTimeChange={(time) => setValue("startTime", time, { shouldValidate: true })}
                computedSlots={computedSlots}
                todayFormatted={todayFormatted}
                selectedTeacherName={selectedTeacherObj?.fullName}
              />
            )}

            {/* Step 4: Session Details */}
            {currentStep === 4 && (
              <ScheduleDetailsStep
                control={control as any}
                selectedDate={selectedDate}
                selectedTime={selectedStartTime}
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
                href="/sessions"
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
                    {isFormLoading && <Loader2 className="size-3.5 animate-spin" />}
                    <span>Schedule Session</span>
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
