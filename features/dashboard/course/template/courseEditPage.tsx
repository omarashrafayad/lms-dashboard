"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { ChevronLeft, Loader2, Save } from "lucide-react"

import { PageHeader } from "@/components/layout/PageHeader"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import GlobalError from "@/components/shared/globalerror"
import { UniInput } from "@/components/shared/UniInput"
import { UniSelect } from "@/components/shared/UniSelect"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"
import {
  updateCourseSchema,
  UpdateCourseFormData,
} from "../schema/course.schema"
import { useCourse, useUpdateCourse } from "../hooks/useCourses"

const CATEGORY_OPTIONS = [
  { label: "Computer Science", value: "Computer Science" },
  { label: "Mathematics", value: "Mathematics" },
  { label: "Sciences", value: "Sciences" },
  { label: "Languages", value: "Languages" },
  { label: "Business & Management", value: "Business & Management" },
  { label: "Design & Arts", value: "Design & Arts" },
  { label: "Other", value: "Other" },
]

const DIFFICULTY_OPTIONS = [
  { label: "Beginner", value: "Beginner" },
  { label: "Intermediate", value: "Intermediate" },
  { label: "Advanced", value: "Advanced" },
]

const LANGUAGE_OPTIONS = [
  { label: "English", value: "English" },
  { label: "Arabic", value: "Arabic" },
  { label: "French", value: "French" },
  { label: "German", value: "German" },
  { label: "Spanish", value: "Spanish" },
]

const STATUS_OPTIONS = [
  { label: "Draft", value: "Draft" },
  { label: "Published", value: "Published" },
  { label: "Archived", value: "Archived" },
]

export interface CourseEditPageProps {
  courseId: string
}

export default function CourseEditPage({ courseId }: CourseEditPageProps) {
  const router = useRouter()
  const { data: course, isLoading, isError } = useCourse(courseId)
  const updateCourseMutation = useUpdateCourse()

  const form = useForm<UpdateCourseFormData>({
    resolver: zodResolver(updateCourseSchema) as any,
    mode: "onTouched",
    defaultValues: {
      name: "",
      category: "Computer Science",
      difficultyLevel: "Beginner",
      leadInstructor: "",
      instructionLanguage: "English",
      targetAudience: "",
      prerequisites: "",
      estimatedDurationHours: 10,
      coverImageUrl: "",
      order: 1,
      status: "Draft",
      description: "",
    },
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form

  // Pre-fill form when course data loads
  React.useEffect(() => {
    if (course) {
      reset({
        name: course.name || course.title || "",
        category: course.category || "Computer Science",
        difficultyLevel: course.difficultyLevel || course.level || "Beginner",
        leadInstructor: course.leadInstructor || course.instructor || "",
        instructionLanguage: course.instructionLanguage || "English",
        targetAudience: course.targetAudience || "",
        prerequisites: course.prerequisites || "",
        estimatedDurationHours:
          course.estimatedDurationHours !== undefined
            ? course.estimatedDurationHours
            : 10,
        coverImageUrl: course.coverImageUrl || "",
        order: course.order !== undefined ? course.order : 1,
        status: course.status || "Draft",
        description: course.description || "",
      })
    }
  }, [course, reset])

  const onSubmit = async (data: UpdateCourseFormData) => {
    try {
      const payload = {
        name: data.name?.trim() || course?.name || course?.title || "",
        description: data.description?.trim() || course?.description || "",
        category: data.category || course?.category || "Computer Science",
        difficultyLevel:
          data.difficultyLevel || course?.difficultyLevel || course?.level || "Beginner",
        leadInstructor:
          data.leadInstructor?.trim() || course?.leadInstructor || course?.instructor || "",
        instructionLanguage:
          data.instructionLanguage || course?.instructionLanguage || "English",
        targetAudience:
          data.targetAudience?.trim() || course?.targetAudience || "",
        prerequisites:
          data.prerequisites?.trim() || course?.prerequisites || "",
        estimatedDurationHours:
          data.estimatedDurationHours !== undefined
            ? Number(data.estimatedDurationHours)
            : course?.estimatedDurationHours || 0,
        coverImageUrl: data.coverImageUrl?.trim() ?? course?.coverImageUrl ?? "",
        order: data.order !== undefined ? Number(data.order) : course?.order || 0,
        status: data.status || course?.status || "Draft",
      }

      await updateCourseMutation.mutateAsync({
        courseId,
        data: payload,
      })

      toast.success("Course updated successfully")
      router.push(`/courses`)
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    }
  }

  const isFormLoading = isSubmitting || updateCourseMutation.isPending

  if (isLoading) {
    return (
      <div className="flex min-h-full items-center justify-center p-12">
        <LoadingSpinner title="Loading course details..." />
      </div>
    )
  }

  if (isError || !course) {
    return (
      <div className="flex min-h-full items-center justify-center p-12">
        <GlobalError />
      </div>
    )
  }

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title="Edit Course"
        description="Update academic course information, instructor, and configuration."
      />

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[840px] flex-col gap-6">
          {/* Top navigation back link */}
          <div className="flex items-center justify-between">
            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
            >
              <ChevronLeft className="size-4" />
              <span>Back to Courses</span>
            </Link>

            <span className="text-xs text-zinc-400 font-medium">
              ID: <strong className="text-zinc-700">{courseId.slice(0, 8)}</strong>
            </span>
          </div>

          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 md:p-8 shadow-2xs space-y-5">
                <div>
                  <h2 className="text-base font-bold text-zinc-900">
                    Course Information
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Modify course attributes, status, and instructional settings.
                  </p>
                </div>

                {/* Course Name */}
                <UniInput
                  control={control}
                  name="name"
                  label="Course Name"
                  placeholder="e.g. Modern Web Development Fundamentals"
                  inputClassName="h-10 text-xs rounded-xl"
                  labelClassName="text-xs font-medium text-zinc-700"
                />

                {/* Category & Difficulty Level */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <UniSelect
                    control={control}
                    name="category"
                    label="Category / Track"
                    placeholder="Select category"
                    options={CATEGORY_OPTIONS}
                    labelClassName="text-xs font-medium text-zinc-700"
                  />

                  <UniSelect
                    control={control}
                    name="difficultyLevel"
                    label="Difficulty Level"
                    placeholder="Select level"
                    options={DIFFICULTY_OPTIONS}
                    labelClassName="text-xs font-medium text-zinc-700"
                  />
                </div>

                {/* Lead Instructor & Instruction Language */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <UniInput
                    control={control}
                    name="leadInstructor"
                    label="Lead Instructor"
                    placeholder="e.g. Dr. Sarah Jenkins"
                    inputClassName="h-10 text-xs rounded-xl"
                    labelClassName="text-xs font-medium text-zinc-700"
                  />

                  <UniSelect
                    control={control}
                    name="instructionLanguage"
                    label="Instruction Language"
                    placeholder="Select language"
                    options={LANGUAGE_OPTIONS}
                    labelClassName="text-xs font-medium text-zinc-700"
                  />
                </div>

                {/* Duration & Order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <UniInput
                    control={control}
                    name="estimatedDurationHours"
                    label="Estimated Duration (Hours)"
                    type="number"
                    min={0}
                    placeholder="e.g. 12"
                    inputClassName="h-10 text-xs rounded-xl"
                    labelClassName="text-xs font-medium text-zinc-700"
                  />

                  <UniInput
                    control={control}
                    name="order"
                    label="Sort Order"
                    type="number"
                    min={0}
                    placeholder="e.g. 1"
                    inputClassName="h-10 text-xs rounded-xl"
                    labelClassName="text-xs font-medium text-zinc-700"
                  />
                </div>

                {/* Target Audience & Prerequisites */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <UniInput
                    control={control}
                    name="targetAudience"
                    label="Target Audience"
                    placeholder="e.g. High schoolers, beginner programmers"
                    inputClassName="h-10 text-xs rounded-xl"
                    labelClassName="text-xs font-medium text-zinc-700"
                  />

                  <UniInput
                    control={control}
                    name="prerequisites"
                    label="Prerequisites"
                    placeholder="e.g. Basic math, HTML fundamentals"
                    inputClassName="h-10 text-xs rounded-xl"
                    labelClassName="text-xs font-medium text-zinc-700"
                  />
                </div>

                {/* Status & Cover Image URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <UniSelect
                    control={control}
                    name="status"
                    label="Course Status"
                    placeholder="Select status"
                    options={STATUS_OPTIONS}
                    labelClassName="text-xs font-medium text-zinc-700"
                  />

                  <UniInput
                    control={control}
                    name="coverImageUrl"
                    label="Cover Image URL"
                    placeholder="https://example.com/course-cover.jpg"
                    inputClassName="h-10 text-xs rounded-xl"
                    labelClassName="text-xs font-medium text-zinc-700"
                  />
                </div>

                {/* Description */}
                <FormField
                  control={control}
                  name="description"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-zinc-700">
                        Course Description
                      </FormLabel>
                      <FormControl>
                        <textarea
                          rows={4}
                          placeholder="Describe what students will learn..."
                          className={`w-full p-3.5 text-xs rounded-xl bg-white border text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none shadow-none ${
                            fieldState.error
                              ? "border-destructive"
                              : "border-zinc-200"
                          }`}
                          dir="auto"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => router.push("/courses")}
                  disabled={isFormLoading}
                  className="h-10 px-5 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer active:scale-[0.98] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isFormLoading}
                  className="h-10 px-6 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-50"
                >
                  {isFormLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="size-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  )
}
