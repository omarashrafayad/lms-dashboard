"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import { PageHeader } from "@/components/layout/PageHeader"
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
  createCourseSchema,
  CreateCourseFormData,
} from "../schema/course.schema"
import { useCreateCourse } from "../hooks/useCourses"

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

export default function CourseAddPage() {
  const router = useRouter()
  const createCourseMutation = useCreateCourse()

  const form = useForm<CreateCourseFormData>({
    resolver: zodResolver(createCourseSchema) as any,
    mode: "all",
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
      description: "",
    },
  })

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form

  const onSubmit = async (data: CreateCourseFormData) => {
    try {
      const payload = {
        name: data.name.trim(),
        description: data.description.trim(),
        category: data.category,
        difficultyLevel: data.difficultyLevel,
        leadInstructor: data.leadInstructor.trim(),
        instructionLanguage: data.instructionLanguage,
        targetAudience: data.targetAudience.trim(),
        prerequisites: data.prerequisites.trim(),
        estimatedDurationHours: Number(data.estimatedDurationHours) || 0,
        coverImageUrl: data.coverImageUrl?.trim() || "",
        order: Number(data.order) || 0,
      }

      await createCourseMutation.mutateAsync(payload)
      toast.success("Course created successfully")
      router.push("/courses")
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    }
  }

  const isFormLoading = isSubmitting || createCourseMutation.isPending

  const handleCancel = () => {
    router.push("/courses")
  }

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Add Course"
        description="Create a new academic course with learning curriculum and details."
      />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-[840px] mx-auto flex flex-col gap-6">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Main Course Information Card */}
              <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 md:p-8 shadow-2xs space-y-5">
                <div>
                  <h2 className="text-base font-bold text-zinc-900">
                    Course Information
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Enter the core details and structure for this academic course.
                  </p>
                </div>

                {/* Course Name */}
                <UniInput
                  control={control}
                  name="name"
                  label="Course Name"
                  placeholder="e.g. Modern Web Development Fundamentals"
                  required
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
                    required
                    options={CATEGORY_OPTIONS}
                    labelClassName="text-xs font-medium text-zinc-700"
                  />

                  <UniSelect
                    control={control}
                    name="difficultyLevel"
                    label="Difficulty Level"
                    placeholder="Select level"
                    required
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
                    required
                    inputClassName="h-10 text-xs rounded-xl"
                    labelClassName="text-xs font-medium text-zinc-700"
                  />

                  <UniSelect
                    control={control}
                    name="instructionLanguage"
                    label="Instruction Language"
                    placeholder="Select language"
                    required
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
                    required
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
                    required
                    inputClassName="h-10 text-xs rounded-xl"
                    labelClassName="text-xs font-medium text-zinc-700"
                  />

                  <UniInput
                    control={control}
                    name="prerequisites"
                    label="Prerequisites"
                    placeholder="e.g. Basic math, HTML fundamentals"
                    required
                    inputClassName="h-10 text-xs rounded-xl"
                    labelClassName="text-xs font-medium text-zinc-700"
                  />
                </div>

                {/* Cover Image URL */}
                <UniInput
                  control={control}
                  name="coverImageUrl"
                  label="Cover Image URL"
                  placeholder="https://example.com/course-cover.jpg"
                  inputClassName="h-10 text-xs rounded-xl"
                  labelClassName="text-xs font-medium text-zinc-700"
                  helperText="Optional cover image link for student portal display."
                />

                {/* Description */}
                <FormField
                  control={control}
                  name="description"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-zinc-700">
                        Course Description <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <textarea
                          rows={4}
                          placeholder="Describe what students will learn, syllabus outcomes, and skills gained..."
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

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancel}
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
                      <span>Creating Course...</span>
                    </>
                  ) : (
                    <span>Create Course</span>
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
