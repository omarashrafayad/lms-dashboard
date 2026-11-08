"use client"

import * as React from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { UniInput } from "@/components/shared/UniInput"
import { UniSelect } from "@/components/shared/UniSelect"
import {
  Bell,
  Users,
  GraduationCap,
  Layers,
  BookOpen,
  CreditCard,
  Send,
  Loader2,
  Radio,
  Smartphone,
  Mail,
  MessageSquare,
  AlertTriangle,
  Flame,
  Info,
} from "lucide-react"
import {
  CreateNotificationPayload,
  NotificationRole,
  NotificationCategory,
  NotificationPriority,
} from "../types/notifications.types"
import {
  useAcademicStages,
  useGrades,
  useEducationSystems,
} from "@/features/dashboard/reference-data/hooks/useReferenceData"
import { useCourses } from "@/features/dashboard/course/hooks/useCourses"
import { useSubscriptionPlans } from "@/features/dashboard/subscriptions/hooks/useSubscriptions"

const notificationSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  summary: z.string().min(5, "Summary must be at least 5 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  targetRole: z.enum(["all", "students", "teachers", "parents", "course", "plan"]),
  targetStage: z.string().optional(),
  targetGrade: z.string().optional(),
  targetSystem: z.string().optional(),
  targetCourseId: z.string().optional(),
  targetPlanId: z.string().optional(),
  category: z.enum([
    "general",
    "academic_exam",
    "schedule_session",
    "billing_subscription",
    "course_update",
    "urgent",
  ]),
  priority: z.enum(["normal", "important", "urgent"]),
  imageUrl: z.string().optional(),
  actionUrl: z.string().optional(),
  status: z.enum(["published", "draft"]),
})

export interface CreateNotificationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmitNotification: (payload: CreateNotificationPayload) => Promise<void>
  isSubmitting?: boolean
}

export function CreateNotificationModal({
  open,
  onOpenChange,
  onSubmitNotification,
  isSubmitting = false,
}: CreateNotificationModalProps) {
  // Reference data hooks for targeted recipients
  const { data: stages = [] } = useAcademicStages()
  const { data: grades = [] } = useGrades()
  const { data: systems = [] } = useEducationSystems()
  const { data: coursesData } = useCourses({ pageSize: 100 })
  const courses = Array.isArray(coursesData) ? coursesData : coursesData?.items || []
  const { data: plans = [] } = useSubscriptionPlans()

  // Selected delivery channels
  const [channels, setChannels] = React.useState<string[]>([
    "in_app",
    "push",
  ])

  const form = useForm({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: "",
      summary: "",
      content: "",
      targetRole: "all",
      targetStage: "all",
      targetGrade: "all",
      targetSystem: "all",
      targetCourseId: "",
      targetPlanId: "",
      category: "general",
      priority: "normal",
      imageUrl: "",
      actionUrl: "",
      status: "published",
    },
  })

  const targetRole = useWatch({
    control: form.control,
    name: "targetRole",
  })

  React.useEffect(() => {
    if (open) {
      form.reset({
        title: "",
        summary: "",
        content: "",
        targetRole: "all",
        targetStage: "all",
        targetGrade: "all",
        targetSystem: "all",
        targetCourseId: "",
        targetPlanId: "",
        category: "general",
        priority: "normal",
        imageUrl: "",
        actionUrl: "",
        status: "published",
      })
      setChannels(["in_app", "push"])
    }
  }, [open, form])

  const toggleChannel = (channelKey: string) => {
    setChannels((prev) =>
      prev.includes(channelKey)
        ? prev.filter((k) => k !== channelKey)
        : [...prev, channelKey]
    )
  }

  const onSubmit = async (values: any) => {
    // Resolve names for labels
    const stageObj = stages.find((s) => s.id === values.targetStage)
    const gradeObj = grades.find((g) => g.id === values.targetGrade)
    const systemObj = systems.find((sys) => sys.id === values.targetSystem)
    const courseObj = courses.find((c) => c.id === values.targetCourseId)
    const planObj = plans.find((p) => p.id === values.targetPlanId)

    await onSubmitNotification({
      title: values.title.trim(),
      summary: values.summary.trim(),
      content: values.content.trim(),
      imageUrl: values.imageUrl?.trim() || null,
      isPublished: values.status === "published",
      targetRole: values.targetRole as NotificationRole,
      targetStage: values.targetStage !== "all" ? values.targetStage : null,
      targetStageName: stageObj ? stageObj.name : null,
      targetGrade: values.targetGrade !== "all" ? values.targetGrade : null,
      targetGradeName: gradeObj ? gradeObj.name : null,
      targetSystem: values.targetSystem !== "all" ? values.targetSystem : null,
      targetSystemName: systemObj ? systemObj.name : null,
      targetCourseId: values.targetCourseId || null,
      targetCourseName: courseObj ? courseObj.name : null,
      targetPlanId: values.targetPlanId || null,
      targetPlanName: planObj ? planObj.name : null,
      category: values.category as NotificationCategory,
      priority: values.priority as NotificationPriority,
      actionUrl: values.actionUrl?.trim() || null,
      channels: channels.length > 0 ? channels : ["in_app"],
    })
  }

  // Options lists
  const targetRoleOptions = [
    { label: "🌐 All Users (Students, Teachers, Parents)", value: "all" },
    { label: "🎓 Students Only", value: "students" },
    { label: "👨‍🏫 Teachers & Instructors Only", value: "teachers" },
    { label: "👨‍👩‍👧 Parents & Guardians Only", value: "parents" },
    { label: "📚 Specific Course Enrollees", value: "course" },
    { label: "💳 Specific Subscription Plan Members", value: "plan" },
  ]

  const stageOptions = [
    { label: "All Academic Stages", value: "all" },
    ...stages.map((s) => ({ label: s.name, value: s.id })),
  ]

  const gradeOptions = [
    { label: "All Grades / Years", value: "all" },
    ...grades.map((g) => ({ label: g.name, value: g.id })),
  ]

  const systemOptions = [
    { label: "All Education Systems", value: "all" },
    ...systems.map((sys) => ({ label: sys.name, value: sys.id })),
  ]

  const courseOptions = [
    { label: "Select a Course...", value: "" },
    ...courses.map((c) => ({ label: c.name || "Untitled Course", value: c.id })),
  ]

  const planOptions = [
    { label: "Select a Subscription Plan...", value: "" },
    ...plans.map((p) => ({ label: `${p.name} (${p.monthlyPrice ?? 0} EGP)`, value: p.id })),
  ]

  const categoryOptions = [
    { label: "📢 General Announcement", value: "general" },
    { label: "📝 Exams & Quizzes Alert", value: "academic_exam" },
    { label: "🗓️ Live Sessions & Timetable", value: "schedule_session" },
    { label: "💳 Subscriptions & Billing", value: "billing_subscription" },
    { label: "📚 New Lessons & Courses", value: "course_update" },
    { label: "🚨 Urgent Alert / Maintenance", value: "urgent" },
  ]

  const priorityOptions = [
    { label: "🟢 Normal Priority", value: "normal" },
    { label: "🟡 Important Priority", value: "important" },
    { label: "🔴 Urgent Priority", value: "urgent" },
  ]

  const statusOptions = [
    { label: "🚀 Broadcast Immediately", value: "published" },
    { label: "💾 Save as Draft", value: "draft" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onClose={() => onOpenChange(false)}
        className="max-w-[620px] p-6 max-h-[92vh] overflow-y-auto"
      >
        <DialogHeader className="gap-1">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="size-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Bell className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-zinc-900">
                New Targeted Notification & Announcement
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Configure recipients, classification, and message content for broadcast.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit as any)}
            className="flex flex-col gap-5 mt-2"
          >
            {/* SECTION 1: RECIPIENTS / TARGET AUDIENCE (التركيز على هبعت الإشعار لمين) */}
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <Users className="size-4 text-amber-700" />
                  <span>1. Target Audience & Recipients </span>
                </div>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-200/60 text-amber-900">
                  Essential
                </span>
              </div>

              {/* Main Role / Recipient Select */}
              <UniSelect
                control={form.control as any}
                name="targetRole"
                label="Target User Group"
                options={targetRoleOptions}
                required
              />

              {/* Conditional Filters: Students or Parents */}
              {(targetRole === "students") && (
                <div className="pt-2 border-t border-amber-200/50 flex flex-col gap-3 animate-in fade-in duration-150">
                  <span className="text-[11px] font-bold text-amber-950 flex items-center gap-1.5">
                    <GraduationCap className="size-3.5 text-amber-700" />
                    <span>Academic Audience Criteria</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <UniSelect
                      control={form.control as any}
                      name="targetStage"
                      label="Stage "
                      options={stageOptions}
                    />

                    <UniSelect
                      control={form.control as any}
                      name="targetGrade"
                      label="Grade"
                      options={gradeOptions}
                    />

                    <UniSelect
                      control={form.control as any}
                      name="targetSystem"
                      label="System"
                      options={systemOptions}
                    />
                  </div>
                </div>
              )}

              {/* Conditional Filter: Specific Course */}
              {targetRole === "course" && (
                <div className="pt-2 border-t border-amber-200/50 animate-in fade-in duration-150">
                  <UniSelect
                    control={form.control as any}
                    name="targetCourseId"
                    label="Choose Course"
                    options={courseOptions}
                    required
                  />
                </div>
              )}

              {/* Conditional Filter: Specific Plan */}
              {targetRole === "plan" && (
                <div className="pt-2 border-t border-amber-200/50 animate-in fade-in duration-150">
                  <UniSelect
                    control={form.control as any}
                    name="targetPlanId"
                    label="Choose Subscription Plan"
                    options={planOptions}
                    required
                  />
                </div>
              )}
            </div>

            {/* SECTION 2: CLASSIFICATION & PRIORITY */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <UniSelect
                control={form.control as any}
                name="category"
                label="Category / Topic"
                options={categoryOptions}
                required
              />

              <UniSelect
                control={form.control as any}
                name="priority"
                label="Priority Level"
                options={priorityOptions}
                required
              />
            </div>

            {/* SECTION 3: CONTENT & DETAILS */}
            <div className="flex flex-col gap-3.5">
              <UniInput
                control={form.control as any}
                name="title"
                label="Notification Title"
                placeholder="e.g. موعد المراجعة النهائية لمادة الفيزياء"
                required
              />

              <UniInput
                control={form.control as any}
                name="summary"
                label="Short Summary"
                placeholder="Brief summary for notification popups and preview cards..."
                required
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  Full Message Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  {...form.register("content")}
                  placeholder="Detailed announcement text, instructions, and guidance for recipients..."
                  className="w-full p-3 rounded-xl border border-zinc-200/80 bg-white text-xs text-zinc-900 placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange resize-none transition-all"
                />
                {form.formState.errors.content && (
                  <span className="text-[11px] text-red-500">
                    {String(form.formState.errors.content.message)}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <UniInput
                  control={form.control as any}
                  name="actionUrl"
                  label="Target Action URL / Route (Optional)"
                  placeholder="e.g. /exams or /courses/..."
                />

                <UniInput
                  control={form.control as any}
                  name="imageUrl"
                  label="Banner Image URL (Optional)"
                  placeholder="https://example.com/banner.png"
                />
              </div>
            </div>

            {/* SECTION 4: DELIVERY CHANNELS (قنوات الإرسال) */}
            <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
              <span className="text-xs font-bold text-zinc-700">
                Delivery Channels 
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: "in_app", label: "In-App Notification", icon: Bell },
                  { id: "push", label: "Mobile Push", icon: Smartphone },
                  { id: "sms", label: "SMS Text", icon: MessageSquare },
                  { id: "email", label: "Email Broadcast", icon: Mail },
                ].map((item) => {
                  const Icon = item.icon
                  const active = channels.includes(item.id)
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleChannel(item.id)}
                      className={`h-8 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                        active
                          ? "bg-brand-orange text-white"
                          : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100"
                      }`}
                    >
                      <Icon className="size-3.5" />
                      <span>{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* SECTION 5: PUBLISH STATUS */}
            <UniSelect
              control={form.control as any}
              name="status"
              label="Publication State"
              options={statusOptions}
              required
            />

            <DialogFooter className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => onOpenChange(false)}
                className="h-10 px-4 rounded-xl border-zinc-200/80 text-zinc-700 text-xs font-medium hover:bg-zinc-50 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-10 px-5 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-semibold shadow-2xs cursor-pointer flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
                <span>
                  {isSubmitting ? "Broadcasting..." : "Broadcast Notification"}
                </span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
