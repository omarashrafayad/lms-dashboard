"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft, Loader2, Save } from "lucide-react"
import { toast } from "sonner"
import { Form } from "@/components/ui/form"
import { UniInput } from "@/components/shared/UniInput"
import { UniSelect } from "@/components/shared/UniSelect"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import GlobalError from "@/components/shared/globalerror"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"
import {
  updateSessionSchema,
  UpdateSessionFormData,
} from "../schema/session.schema"
import { useSessionDetail, useUpdateSession } from "../hooks/useSessions"
import {
  useTeachers,
  useTeacherSubjects,
} from "@/features/dashboard/teacher/hooks/useTeachers"
import { useCourses } from "@/features/dashboard/course/hooks/useCourses"
import { UpdateSessionPayload } from "../types/session.types"

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

const TARGET_TYPE_OPTIONS = [
  { label: "Subject", value: "subject" },
  { label: "Course", value: "course" },
]

export default function SessionEditPage({ sessionId }: SessionEditPageProps) {
  const router = useRouter()
  const { data: session, isLoading, isError } = useSessionDetail(sessionId)
  const updateMutation = useUpdateSession(sessionId)

  const { data: teachers = [], isLoading: isLoadingTeachers } = useTeachers()
  const { data: subjects = [], isLoading: isLoadingSubjects } =
    useTeacherSubjects()
  const { data: courses = [], isLoading: isLoadingCourses } = useCourses()

  const form = useForm<UpdateSessionFormData>({
    resolver: zodResolver(updateSessionSchema),
    mode: "all",
    defaultValues: {
      teacherId: "",
      teacherName: "",
      date: "",
      startTime: "",
      durationMinutes: "60",
      sessionType: "Private 1:1",
      targetType: "subject",
      subjectId: "",
      subjectName: "",
      courseId: "",
      courseName: "",
      notes: "",
      status: "Upcoming",
    },
  })

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isSubmitting },
  } = form

  const selectedTargetType = watch("targetType")

  React.useEffect(() => {
    if (session) {
      const isCourse = Boolean(session.courseId || session.courseName)
      reset({
        teacherId: session.teacherId || session.teacher?.id || "",
        teacherName: session.teacherName || session.teacher?.name || "",
        date: session.date || session.formattedDate || "",
        startTime: session.startTime || session.time || "",
        durationMinutes: String(session.durationMinutes || "60"),
        sessionType: session.sessionType || "Private 1:1",
        targetType: isCourse ? "course" : "subject",
        subjectId: session.subjectId || "",
        subjectName: session.subjectName || session.subject || "",
        courseId: session.courseId || "",
        courseName: session.courseName || "",
        notes: session.notes || "",
        status: session.status || session.sessionStatus || "Upcoming",
      })
    }
  }, [session, reset])

  const teacherOptions = React.useMemo(() => {
    return teachers.map((t) => ({
      label: t.fullName || t.email,
      value: t.id,
    }))
  }, [teachers])

  const subjectOptions = React.useMemo(() => {
    return subjects.map((s) => ({
      label: s.name,
      value: s.id,
    }))
  }, [subjects])

  const courseOptions = React.useMemo(() => {
    return courses.map((c) => ({
      label: c.title || c.name || "Course",
      value: c.id,
    }))
  }, [courses])

  const onSubmit = async (data: UpdateSessionFormData) => {
    try {
      const payload: UpdateSessionPayload = {
        teacherId: data.teacherId,
        teacherName:
          teachers.find((t) => t.id === data.teacherId)?.fullName ||
          data.teacherName,
        date: data.date,
        startTime: data.startTime,
        durationMinutes: Number(data.durationMinutes),
        sessionType: data.sessionType,
        notes: data.notes || "",
        status: data.status,
      }

      if (data.targetType === "subject") {
        payload.subjectId = data.subjectId
        payload.subjectName =
          subjects.find((s) => s.id === data.subjectId)?.name || data.subjectName
      } else {
        payload.courseId = data.courseId
        const foundCourse = courses.find((c) => c.id === data.courseId)
        payload.courseName =
          foundCourse?.title || foundCourse?.name || data.courseName
      }

      await updateMutation.mutateAsync({
        sessionId,
        data: payload,
      })

      toast.success("Session updated successfully!")
      router.push(`/sessions/${sessionId}`)
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 p-8">
        <LoadingSpinner title="loading session details" />
      </div>
    )
  }

  if (isError || !session) {
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
            href="/sessions"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <ChevronLeft className="size-4 text-zinc-500" />
            <span>Back to All Sessions</span>
          </Link>
        </div>

        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Edit Session
          </h1>
          <p className="text-xs text-zinc-500 font-normal">
            Session {session.sessionNumber || session.sessionId || `#${sessionId}`}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
            <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-8 flex flex-col gap-6">
              {/* Teacher Select */}
              <UniSelect
                control={control as any}
                name="teacherId"
                label="Teacher"
                placeholder={isLoadingTeachers ? "Loading..." : "Select teacher"}
                options={teacherOptions}
                isLoading={isLoadingTeachers}
                required
                labelClassName="text-[11px] font-bold tracking-wider text-zinc-500 uppercase"
                onChangeCallback={(val) => {
                  const found = teachers.find((t) => t.id === val)
                  if (found) setValue("teacherName", found.fullName)
                }}
              />

              {/* Target Type & Dependent Selector */}
              <div className="space-y-4 p-4 rounded-xl border border-zinc-100 bg-zinc-50/50">
                <UniSelect
                  control={control as any}
                  name="targetType"
                  label="Curriculum Target (Course or Subject)"
                  options={TARGET_TYPE_OPTIONS}
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
                      isLoadingCourses ? "Loading courses..." : "Choose a course"
                    }
                    options={courseOptions}
                    isLoading={isLoadingCourses}
                    required
                    labelClassName="text-xs font-bold text-zinc-700 uppercase tracking-wider"
                    onChangeCallback={(val) => {
                      const found = courses.find((c) => c.id === val)
                      if (found)
                        setValue("courseName", found.title || found.name || "")
                    }}
                  />
                )}
              </div>

              {/* Date & Start Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <UniInput
                  control={control as any}
                  name="date"
                  label="Date"
                  placeholder="e.g. Sep 23, 2026"
                  labelClassName="text-[11px] font-bold tracking-wider text-zinc-500 uppercase"
                  inputClassName="h-10 text-xs rounded-xl"
                />

                <UniInput
                  control={control as any}
                  name="startTime"
                  label="Start Time"
                  placeholder="e.g. 11:00 AM"
                  labelClassName="text-[11px] font-bold tracking-wider text-zinc-500 uppercase"
                  inputClassName="h-10 text-xs rounded-xl"
                />
              </div>

              {/* Duration & Session Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <UniSelect
                  control={control as any}
                  name="durationMinutes"
                  label="Duration"
                  options={DURATION_OPTIONS}
                  required
                  labelClassName="text-[11px] font-bold tracking-wider text-zinc-500 uppercase"
                />

                <UniSelect
                  control={control as any}
                  name="sessionType"
                  label="Session Type"
                  options={SESSION_TYPE_OPTIONS}
                  required
                  labelClassName="text-[11px] font-bold tracking-wider text-zinc-500 uppercase"
                />
              </div>

              {/* Notes */}
              <UniInput
                control={control as any}
                name="notes"
                label="Notes"
                placeholder="Add any notes for this session."
                labelClassName="text-[11px] font-bold tracking-wider text-zinc-500 uppercase"
                inputClassName="h-10 text-xs rounded-xl"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <Link
                href={`/sessions/${sessionId}`}
                className="h-10 px-5 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs flex items-center justify-center cursor-pointer"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={isFormLoading}
                className="h-10 px-6 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-50"
              >
                {isFormLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Save className="size-3.5" />
                )}
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </Form>
      </main>
    </div>
  )
}
