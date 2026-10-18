"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ChevronLeft,
  Search,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Calendar,
  Clock,
  BookOpen,
  User,
  GraduationCap,
} from "lucide-react"
import { toast } from "sonner"
import { Form } from "@/components/ui/form"
import { UniInput } from "@/components/shared/UniInput"
import { UniSelect } from "@/components/shared/UniSelect"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import GlobalError from "@/components/shared/globalerror"
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

export default function SessionSchedulePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState(1)
  const scheduleMutation = useScheduleSession()

  // Queries for real entities
  const {
    data: students = [],
    isLoading: isLoadingStudents,
    isError: isStudentsError,
  } = useStudents()
  const {
    data: teachers = [],
    isLoading: isLoadingTeachers,
    isError: isTeachersError,
  } = useTeachers()
  const { data: subjects = [], isLoading: isLoadingSubjects } =
    useTeacherSubjects()
  const { data: courses = [], isLoading: isLoadingCourses } = useCourses()

  // Search filters for steps
  const [studentSearch, setStudentSearch] = React.useState("")
  const [teacherSearch, setTeacherSearch] = React.useState("")

  // Always today's date formatted
  const todayFormatted = React.useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
  }, [])

  const form = useForm<ScheduleSessionFormData>({
    resolver: zodResolver(scheduleSessionSchema),
    mode: "all",
    defaultValues: {
      studentId: "",
      studentName: "",
      educationStage: "",
      academicStage: "",
      teacherId: "",
      teacherName: "",
      date: todayFormatted,
      startTime: "",
      targetType: "subject",
      subjectId: "",
      subjectName: "",
      courseId: "",
      courseName: "",
      durationMinutes: "60",
      sessionType: "Private 1:1",
      notes: "",
    },
  })

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { isSubmitting },
  } = form

  const selectedStudentId = watch("studentId")
  const selectedTeacherId = watch("teacherId")
  const selectedDate = watch("date")
  const selectedStartTime = watch("startTime")
  const selectedTargetType = watch("targetType")
  const selectedSubjectId = watch("subjectId")
  const selectedCourseId = watch("courseId")
  const selectedDurationMinutes = watch("durationMinutes")
  const selectedSessionType = watch("sessionType")
  const selectedNotes = watch("notes")

  // Selected entities for display
  const selectedStudent = React.useMemo(
    () => students.find((s) => s.id === selectedStudentId),
    [students, selectedStudentId]
  )
  const selectedTeacher = React.useMemo(
    () => teachers.find((t) => t.id === selectedTeacherId),
    [teachers, selectedTeacherId]
  )

  // Query teacher slots dynamically based on selected teacher
  const { data: teacherSlots = [], isLoading: isLoadingSlots } = useTeacherSlots(
    selectedTeacherId,
    { enabled: Boolean(selectedTeacherId) }
  )

  // Filtered lists for selection
  const filteredStudents = React.useMemo(() => {
    if (!students || !Array.isArray(students)) return []
    if (!studentSearch.trim()) return students
    const q = studentSearch.toLowerCase()
    return students.filter(
      (s) =>
        s.fullName?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.grade?.toLowerCase().includes(q) ||
        s.educationStage?.toLowerCase().includes(q)
    )
  }, [students, studentSearch])

  const filteredTeachers = React.useMemo(() => {
    if (!teachers || !Array.isArray(teachers)) return []
    if (!teacherSearch.trim()) return teachers
    const q = teacherSearch.toLowerCase()
    return teachers.filter(
      (t) =>
        t.fullName?.toLowerCase().includes(q) ||
        t.email?.toLowerCase().includes(q)
    )
  }, [teachers, teacherSearch])

  // Computed slots for step 3
  const computedSlots = React.useMemo(() => {
    if (teacherSlots && teacherSlots.length > 0) {
      return teacherSlots.map((slot) => {
        const timeVal = slot.time || slot.startTime || slot.formattedTime || ""
        const isFuture = isTimeInFuture(timeVal, selectedDate)
        const isAvailable =
          isFuture &&
          slot.status !== "Booked" &&
          slot.status !== "Unavailable" &&
          slot.isAvailable !== false

        let statusText = slot.status || "Available"
        if (!isFuture) {
          statusText = "Past"
        } else if (!isAvailable) {
          statusText = "Unavailable"
        }

        return {
          time: timeVal,
          isAvailable,
          status: statusText,
        }
      })
    }

    // Default slots fallback with future validation
    return STANDARD_TIME_SLOTS.map((time) => {
      const isFuture = isTimeInFuture(time, selectedDate)
      return {
        time,
        isAvailable: isFuture,
        status: isFuture ? "Available" : "Past",
      }
    })
  }, [teacherSlots, selectedDate])

  // Step 4 options
  const targetTypeOptions = [
    { label: "Subject", value: "subject" },
    { label: "Course", value: "course" },
  ]

  const subjectOptions = React.useMemo(() => {
    return subjects.map((sub) => ({
      label: sub.name,
      value: sub.id,
    }))
  }, [subjects])

  const courseOptions = React.useMemo(() => {
    return courses.map((c) => ({
      label: c.title || c.name || "Course",
      value: c.id,
    }))
  }, [courses])

  const durationOptions = [
    { label: "30 min", value: "30" },
    { label: "45 min", value: "45" },
    { label: "60 min", value: "60" },
    { label: "90 min", value: "90" },
  ]

  const sessionTypeOptions = [
    { label: "Private 1:1", value: "Private 1:1" },
    { label: "Group", value: "Group" },
  ]

  // Handle Stepper Next
  const handleNext = async () => {
    if (currentStep === 1) {
      const isValid = await trigger(["studentId"])
      if (!selectedStudentId || !isValid) {
        toast.error("Please select a student")
        return
      }
      setCurrentStep(2)
      return
    }

    if (currentStep === 2) {
      const isValid = await trigger(["teacherId"])
      if (!selectedTeacherId || !isValid) {
        toast.error("Please select a teacher")
        return
      }
      setCurrentStep(3)
      return
    }

    if (currentStep === 3) {
      const isValid = await trigger(["date", "startTime"])
      if (!selectedStartTime) {
        toast.error("Please select a time slot")
        return
      }
      if (!isTimeInFuture(selectedStartTime, selectedDate)) {
        toast.error("Start time must be in the future")
        return
      }
      if (!isValid) return
      setCurrentStep(4)
      return
    }

    if (currentStep === 4) {
      const fieldsToValidate: any = [
        "targetType",
        "durationMinutes",
        "sessionType",
      ]
      if (selectedTargetType === "subject") {
        fieldsToValidate.push("subjectId")
      } else {
        fieldsToValidate.push("courseId")
      }
      const isValid = await trigger(fieldsToValidate)
      if (!isValid) return
      setCurrentStep(5)
      return
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1))
  }

  // Submit Handler
  const onSubmit = async (data: ScheduleSessionFormData) => {
    try {
      // Always today's ISO date as per requirement hint
      const todayIso = new Date().toISOString()

      const payload: ScheduleSessionPayload = {
        studentId: data.studentId,
        studentName: selectedStudent?.fullName || data.studentName || "",
        teacherId: data.teacherId,
        teacherName: selectedTeacher?.fullName || data.teacherName || "",
        date: todayIso,
        startTime: data.startTime,
        durationMinutes: Number(data.durationMinutes),
        sessionType: data.sessionType,
        availableTimeSlot: data.startTime,
        timeSlot: data.startTime,
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

      if (selectedStudent?.educationStage) {
        payload.educationStage = selectedStudent.educationStage
      }
      if (selectedStudent?.grade) {
        payload.academicStage = selectedStudent.grade
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
        {/* Top Back Link */}
        <div>
          <Link
            href="/sessions"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <ChevronLeft className="size-4 text-zinc-500" />
            <span>Back to All Sessions</span>
          </Link>
        </div>

        {/* Page Title */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Schedule Session
          </h1>
          <p className="text-xs text-zinc-500">
            Set up a live 1:1 or group session with a teacher and student.
          </p>
        </div>

        {/* 5-Step Stepper */}
        <ScheduleSessionStepper
          currentStep={currentStep}
          onStepClick={(step) => {
            if (step < currentStep) setCurrentStep(step)
          }}
        />

        <Form {...form}>
          <form
            onSubmit={(e) => {
              if (currentStep !== 5) {
                e.preventDefault()
                e.stopPropagation()
                return
              }
              handleSubmit(onSubmit as any)(e)
            }}
            className="space-y-6"
          >
            {/* =================================================================== */}
            {/* STEP 1: Select Student */}
            {/* =================================================================== */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 flex flex-col gap-6 animate-in fade-in duration-200">
                <div className="flex flex-col gap-0.5">
                  <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
                    Select Student
                  </h2>
                  <p className="text-xs text-zinc-500 font-normal">
                    Choose the student who will attend this session.
                  </p>
                </div>

                {/* Search students */}
                <div className="relative w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Search students by name, email, or grade..."
                    className="w-full h-10 pl-9 pr-3.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 bg-white placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
                  />
                </div>

                {isLoadingStudents ? (
                  <LoadingSpinner title="loading students" />
                ) : isStudentsError ? (
                  <GlobalError />
                ) : filteredStudents.length === 0 ? (
                  <div className="p-8 text-center text-xs text-zinc-400">
                    No students found.
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5 max-h-[420px] overflow-y-auto pr-1">
                    {filteredStudents.map((student) => {
                      const isSelected = selectedStudentId === student.id

                      return (
                        <div
                          key={student.id}
                          onClick={() => {
                            setValue("studentId", student.id, {
                              shouldValidate: true,
                            })
                            setValue("studentName", student.fullName)
                            setValue(
                              "educationStage",
                              student.educationStage || ""
                            )
                            setValue("academicStage", student.grade || "")
                          }}
                          className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? "border-[#F59E0B] bg-[#FFF9F2]/70 shadow-2xs"
                              : "border-zinc-200/80 hover:border-zinc-300 bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="size-9 rounded-full bg-zinc-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                              {student.fullName
                                ? student.fullName.charAt(0).toUpperCase()
                                : "S"}
                            </div>

                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-zinc-900">
                                {student.fullName}
                              </span>
                              <span className="text-[11px] text-zinc-400 font-normal">
                                {student.grade ||
                                  student.educationStage ||
                                  student.email}
                              </span>
                            </div>
                          </div>

                          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-[#E0F2FE] text-[#0284C7] border border-sky-200/60">
                            {student.educationStage || "Student"}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* =================================================================== */}
            {/* STEP 2: Select Teacher */}
            {/* =================================================================== */}
            {currentStep === 2 && (
              <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 flex flex-col gap-6 animate-in fade-in duration-200">
                <div className="flex flex-col gap-0.5">
                  <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
                    Select Teacher
                  </h2>
                  <p className="text-xs text-zinc-400 font-normal">
                    Choose a teacher to lead this learning session.
                  </p>
                </div>

                <div className="relative w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                  <input
                    type="text"
                    value={teacherSearch}
                    onChange={(e) => setTeacherSearch(e.target.value)}
                    placeholder="Search teachers by name or email..."
                    className="w-full h-10 pl-9 pr-3.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 bg-white placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
                  />
                </div>

                {isLoadingTeachers ? (
                  <LoadingSpinner title="loading teachers" />
                ) : isTeachersError ? (
                  <GlobalError />
                ) : filteredTeachers.length === 0 ? (
                  <div className="p-8 text-center text-xs text-zinc-400">
                    No teachers found.
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5 max-h-[420px] overflow-y-auto pr-1">
                    {filteredTeachers.map((teacher) => {
                      const isSelected = selectedTeacherId === teacher.id
                      const teacherSubject =
                        teacher.specializations?.[0]?.subjectName ||
                        teacher.educationStage ||
                        "Instructor"

                      return (
                        <div
                          key={teacher.id}
                          onClick={() => {
                            setValue("teacherId", teacher.id, {
                              shouldValidate: true,
                            })
                            setValue("teacherName", teacher.fullName)
                            // Reset slot when teacher changes
                            setValue("startTime", "")
                          }}
                          className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? "border-[#F59E0B] bg-[#FFF9F2]/70 shadow-2xs"
                              : "border-zinc-200/80 hover:border-zinc-300 bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="size-9 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                              {teacher.fullName
                                ? teacher.fullName.charAt(0).toUpperCase()
                                : "T"}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-zinc-900">
                                {teacher.fullName}
                              </span>
                              <span className="text-[11px] text-zinc-400 font-normal">
                                {teacherSubject}
                              </span>
                            </div>
                          </div>

                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                              teacher.isAvailable !== false
                                ? "bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]"
                                : "bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]"
                            }`}
                          >
                            <span
                              className={`size-1.5 rounded-full ${
                                teacher.isAvailable !== false
                                  ? "bg-[#16A34A]"
                                  : "bg-[#D97706]"
                              }`}
                            />
                            {teacher.isAvailable !== false
                              ? "Available"
                              : "Busy"}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* =================================================================== */}
            {/* STEP 3: Select Date & Time */}
            {/* =================================================================== */}
            {currentStep === 3 && (
              <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 flex flex-col gap-6 animate-in fade-in duration-200">
                <div className="flex flex-col gap-0.5">
                  <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
                    Select Date & Time
                  </h2>
                  <p className="text-xs text-zinc-500">
                    Sessions are scheduled for today. Select an available upcoming time slot.
                  </p>
                </div>

                {/* DATE · today's date */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase flex items-center gap-1.5">
                    <span>DATE</span>
                    <span className="text-zinc-400 font-normal normal-case">
                      · today&apos;s date (automated)
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={selectedDate}
                      className="w-full h-10 px-3.5 pl-9 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-900 bg-zinc-50 cursor-not-allowed shadow-2xs"
                    />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                  </div>
                </div>

                {/* AVAILABLE SLOTS */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                      AVAILABLE SLOTS —{" "}
                      {selectedTeacher?.fullName?.toUpperCase() || "TEACHER"}
                    </label>
                    <span className="text-[11px] text-amber-600 font-medium flex items-center gap-1">
                      <Clock className="size-3" />
                      <span>Start time must be in future</span>
                    </span>
                  </div>

                  {isLoadingSlots ? (
                    <LoadingSpinner title="loading teacher slots" />
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {computedSlots.map((slot) => {
                        const isSelected = selectedStartTime === slot.time

                        return (
                          <button
                            key={slot.time}
                            type="button"
                            disabled={!slot.isAvailable}
                            onClick={() => {
                              if (slot.isAvailable) {
                                setValue("startTime", slot.time, {
                                  shouldValidate: true,
                                })
                              }
                            }}
                            className={`h-16 rounded-xl flex flex-col items-center justify-center transition-all border ${
                              !slot.isAvailable
                                ? "border-zinc-200/80 bg-zinc-50/70 text-zinc-400 cursor-not-allowed opacity-60"
                                : isSelected
                                ? "border-[#F59E0B] bg-[#FFF9F2] shadow-2xs cursor-pointer ring-2 ring-[#F59E0B]"
                                : "border-zinc-200 bg-white hover:border-zinc-300 cursor-pointer"
                            }`}
                          >
                            <span
                              className={`text-xs font-bold ${
                                !slot.isAvailable
                                  ? "text-zinc-400"
                                  : isSelected
                                  ? "text-zinc-900"
                                  : "text-zinc-800"
                              }`}
                            >
                              {slot.time}
                            </span>
                            <span
                              className={`text-[11px] font-normal mt-0.5 ${
                                !slot.isAvailable
                                  ? "text-zinc-400"
                                  : isSelected
                                  ? "text-[#D97706] font-semibold"
                                  : "text-zinc-500"
                              }`}
                            >
                              {slot.status}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* =================================================================== */}
            {/* STEP 4: Session Details */}
            {/* =================================================================== */}
            {currentStep === 4 && (
              <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 flex flex-col gap-6 animate-in fade-in duration-200">
                <div className="flex flex-col gap-0.5">
                  <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
                    Session Details
                  </h2>
                  <p className="text-xs text-zinc-500">
                    Configure the curriculum target, duration, session type, and optional notes.
                  </p>
                </div>

                {/* Target Type Dropdown (Course or Subject) */}
                <div className="space-y-4 p-4 rounded-xl border border-zinc-100 bg-zinc-50/50">
                  <UniSelect
                    control={control as any}
                    name="targetType"
                    label="Choose Type (Course or Subject)"
                    options={targetTypeOptions}
                    required
                    labelClassName="text-xs font-bold text-zinc-700 uppercase tracking-wider"
                    onChangeCallback={(val) => {
                      if (val === "subject") {
                        setValue("courseId", "")
                        setValue("courseName", "")
                      } else {
                        setValue("subjectId", "")
                        setValue("subjectName", "")
                      }
                    }}
                  />

                  {/* Dependent Dropdown */}
                  {selectedTargetType === "subject" ? (
                    <UniSelect
                      control={control as any}
                      name="subjectId"
                      label="Select Subject"
                      placeholder={
                        isLoadingSubjects
                          ? "Loading subjects..."
                          : "Choose a subject"
                      }
                      options={subjectOptions}
                      isLoading={isLoadingSubjects}
                      required
                      labelClassName="text-xs font-bold text-zinc-700 uppercase tracking-wider"
                      onChangeCallback={(val) => {
                        const found = subjects.find((s) => s.id === val)
                        if (found) setValue("subjectName", found.name)
                      }}
                    />
                  ) : (
                    <UniSelect
                      control={control as any}
                      name="courseId"
                      label="Select Course"
                      placeholder={
                        isLoadingCourses
                          ? "Loading courses..."
                          : "Choose a course"
                      }
                      options={courseOptions}
                      isLoading={isLoadingCourses}
                      required
                      labelClassName="text-xs font-bold text-zinc-700 uppercase tracking-wider"
                      onChangeCallback={(val) => {
                        const found = courses.find((c) => c.id === val)
                        if (found)
                          setValue(
                            "courseName",
                            found.title || found.name || ""
                          )
                      }}
                    />
                  )}
                </div>

                {/* Readonly Date & Time Review */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                      DATE
                    </label>
                    <div className="h-10 px-3.5 rounded-xl border border-zinc-200 bg-zinc-50 text-xs text-zinc-800 flex items-center font-medium">
                      {selectedDate}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                      START TIME
                    </label>
                    <div className="h-10 px-3.5 rounded-xl border border-zinc-200 bg-zinc-50 text-xs text-zinc-800 flex items-center font-medium">
                      {selectedStartTime}
                    </div>
                  </div>
                </div>

                {/* Duration & Session Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <UniSelect
                    control={control as any}
                    name="durationMinutes"
                    label="Duration"
                    options={durationOptions}
                    required
                    labelClassName="text-[11px] font-bold tracking-wider text-zinc-500 uppercase"
                  />

                  <UniSelect
                    control={control as any}
                    name="sessionType"
                    label="Session Type"
                    options={sessionTypeOptions}
                    required
                    labelClassName="text-[11px] font-bold tracking-wider text-zinc-500 uppercase"
                  />
                </div>

                {/* Notes */}
                <UniInput
                  control={control as any}
                  name="notes"
                  label="Notes"
                  placeholder="Add any additional notes for this session..."
                  labelClassName="text-[11px] font-bold tracking-wider text-zinc-500 uppercase"
                  inputClassName="h-10 text-xs rounded-xl"
                  helperText="Optional notes visible to student and teacher."
                />
              </div>
            )}

            {/* =================================================================== */}
            {/* STEP 5: Review */}
            {/* =================================================================== */}
            {currentStep === 5 && (
              <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 flex flex-col gap-6 animate-in fade-in duration-200">
                <div className="flex flex-col gap-0.5">
                  <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
                    Review Session Details
                  </h2>
                  <p className="text-xs text-zinc-500">
                    Verify all parameters before confirming the schedule request.
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-200/80 p-6 sm:p-8 bg-white shadow-2xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                    {/* Left Column */}
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                          <User className="size-3.5 text-zinc-400" />
                          <span>STUDENT</span>
                        </span>
                        <span className="text-sm font-bold text-zinc-900">
                          {selectedStudent?.fullName || "—"}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                          <BookOpen className="size-3.5 text-zinc-400" />
                          <span>
                            {selectedTargetType === "subject"
                              ? "SUBJECT"
                              : "COURSE"}
                          </span>
                        </span>
                        <span className="text-sm font-bold text-zinc-900">
                          {selectedTargetType === "subject"
                            ? subjects.find((s) => s.id === selectedSubjectId)
                                ?.name || "—"
                            : courses.find((c) => c.id === selectedCourseId)
                                ?.title ||
                              courses.find((c) => c.id === selectedCourseId)
                                ?.name ||
                              "—"}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Clock className="size-3.5 text-zinc-400" />
                          <span>TIME</span>
                        </span>
                        <span className="text-sm font-bold text-zinc-900">
                          {selectedStartTime}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                          SESSION TYPE
                        </span>
                        <span className="text-sm font-bold text-zinc-900">
                          {selectedSessionType}
                        </span>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                          <GraduationCap className="size-3.5 text-zinc-400" />
                          <span>TEACHER</span>
                        </span>
                        <span className="text-sm font-bold text-zinc-900">
                          {selectedTeacher?.fullName || "—"}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Calendar className="size-3.5 text-zinc-400" />
                          <span>DATE</span>
                        </span>
                        <span className="text-sm font-bold text-zinc-900">
                          {selectedDate}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                          DURATION
                        </span>
                        <span className="text-sm font-bold text-zinc-900">
                          {selectedDurationMinutes} min
                        </span>
                      </div>

                      {selectedNotes && (
                        <div className="flex flex-col gap-1">
                          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                            NOTES
                          </span>
                          <span className="text-xs text-zinc-700">
                            {selectedNotes}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Footer Navigation */}
            <div className="flex items-center justify-between pt-2">
              <Link
                href="/sessions"
                className="h-10 px-5 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs flex items-center justify-center cursor-pointer"
              >
                Cancel
              </Link>

              <div className="flex items-center gap-2.5">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="h-10 px-5 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer active:scale-[0.98] flex items-center gap-1.5"
                  >
                    <ArrowLeft className="size-3.5" />
                    <span>Back</span>
                  </button>
                )}

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="h-10 px-6 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
                  >
                    <span>Continue</span>
                    <ArrowRight className="size-3.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isFormLoading}
                    className="h-10 px-7 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-50"
                  >
                    {isFormLoading && (
                      <Loader2 className="size-4 animate-spin" />
                    )}
                    <span>Create Session</span>
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
