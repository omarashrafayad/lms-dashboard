"use client"

import * as React from "react"
import {
  Bell,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Radio,
  Send,
  MessageSquare,
  Users,
} from "lucide-react"
import { toast } from "sonner"
import {
  useNotifications,
  useCreateNotification,
  useUpdateNotification,
  useDeleteNotification,
} from "../hooks/useNotifications"
import { NotificationsTable } from "../components/NotificationsTable"
import { CreateNotificationModal } from "../components/CreateNotificationModal"
import { ViewNotificationModal } from "../components/ViewNotificationModal"
import {
  ApiNotification,
  CreateNotificationPayload,
} from "../types/notifications.types"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import GlobalError from "@/components/shared/globalerror"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"

export default function NotificationsMainPage() {
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<"all" | "published" | "draft">("all")
  const [roleFilter, setRoleFilter] = React.useState<string>("all")
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [viewNotification, setViewNotification] = React.useState<ApiNotification | null>(null)
  const [togglingId, setTogglingId] = React.useState<string | null>(null)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  const { data: notificationsData, isLoading, isError, refetch } = useNotifications({
    published: statusFilter === "published" ? true : statusFilter === "draft" ? false : undefined,
  })

  const createMutation = useCreateNotification()
  const updateMutation = useUpdateNotification()
  const deleteMutation = useDeleteNotification()

  const allItems = notificationsData?.items || []

  // Client-side search and audience filter
  const filteredNotifications = React.useMemo(() => {
    let list = allItems

    if (roleFilter !== "all") {
      list = list.filter((n) => n.targetRole === roleFilter)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.summary.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q)
      )
    }

    return list
  }, [allItems, search, roleFilter])

  // Metric stats
  const totalCount = allItems.length
  const publishedCount = allItems.filter((n) => n.isPublished).length
  const draftCount = allItems.filter((n) => !n.isPublished).length

  const handleCreateSubmit = async (payload: CreateNotificationPayload) => {
    try {
      await createMutation.mutateAsync(payload)
      toast.success("Notification broadcasted successfully!")
      setIsCreateOpen(false)
      refetch()
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleTogglePublish = async (notification: ApiNotification) => {
    try {
      setTogglingId(notification.id)
      await updateMutation.mutateAsync({
        id: notification.id,
        data: {
          isPublished: !notification.isPublished,
        },
      })
      toast.success(
        notification.isPublished
          ? "Notification moved to drafts"
          : "Notification published successfully!"
      )
      refetch()
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    } finally {
      setTogglingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) return
    try {
      setDeletingId(id)
      await deleteMutation.mutateAsync(id)
      toast.success("Notification deleted successfully")
      refetch()
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1300px] w-full mx-auto pb-20 animate-in fade-in duration-200">
        {/* Top Header Card */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-xl bg-amber-50 text-brand-orange flex items-center justify-center shrink-0 border border-amber-200/60 shadow-2xs">
                <Bell className="size-4.5" />
              </div>
              <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
                Notifications & Announcements
              </h1>
            </div>
            <p className="text-xs text-zinc-500 font-normal">
              Broadcast targeted alerts, academic updates, and announcements to specific student grades, teachers, and parents.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="h-9 px-4 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <Plus className="size-3.5 stroke-[2.5]" />
            <span>New Notification</span>
          </button>
        </div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-5 flex items-center gap-4">
            <div className="size-11 rounded-xl bg-[#FFF9F2] text-brand-orange flex items-center justify-center shrink-0">
              <MessageSquare className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-zinc-900 tracking-tight leading-tight">
                {totalCount}
              </span>
              <span className="text-xs font-medium text-zinc-400">
                Total Broadcasts
              </span>
            </div>
          </div>

          {/* Card 2: Published */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-5 flex items-center gap-4">
            <div className="size-11 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center shrink-0">
              <CheckCircle2 className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-zinc-900 tracking-tight leading-tight">
                {publishedCount}
              </span>
              <span className="text-xs font-medium text-zinc-400">
                Published & Active
              </span>
            </div>
          </div>

          {/* Card 3: Drafts */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-5 flex items-center gap-4">
            <div className="size-11 rounded-xl bg-zinc-100 text-zinc-700 flex items-center justify-center shrink-0">
              <Clock className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-zinc-900 tracking-tight leading-tight">
                {draftCount}
              </span>
              <span className="text-xs font-medium text-zinc-400">
                Draft Messages
              </span>
            </div>
          </div>

          {/* Card 4: Channel */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-5 flex items-center gap-4">
            <div className="size-11 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shrink-0">
              <Radio className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-zinc-900 tracking-tight leading-tight">
                Multi-Channel
              </span>
              <span className="text-xs font-medium text-zinc-400">
                In-App & Push
              </span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-zinc-200/80 shadow-2xs">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="size-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notifications by title or keywords..."
              className="w-full h-9 pl-9 pr-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/60 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
            />
          </div>

          {/* Filters row: Role + Status */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Target Audience Dropdown Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-9 px-3 rounded-xl border border-zinc-200/80 bg-white text-xs font-semibold text-zinc-700 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 cursor-pointer"
            >
              <option value="all">All Audiences (كل المستلمين)</option>
              <option value="students">Students (الطلاب)</option>
              <option value="teachers">Teachers (المعلمين)</option>
              <option value="parents">Parents (أولياء الأمور)</option>
              <option value="course">Course Students (طلاب كورس)</option>
              <option value="plan">Plan Members (مشتركي باقة)</option>
            </select>

            {/* Status Segmented Buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-zinc-100/80 rounded-xl">
              {(
                [
                  { label: "All", value: "all" },
                  { label: "Published", value: "published" },
                  { label: "Drafts", value: "draft" },
                ] as const
              ).map((tab) => {
                const isActive = statusFilter === tab.value
                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setStatusFilter(tab.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-white text-zinc-900 shadow-2xs"
                        : "text-zinc-500 hover:text-zinc-800"
                    }`}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Table Content or State */}
        {isLoading ? (
          <div className="p-16 flex items-center justify-center min-h-[300px]">
            <LoadingSpinner title="Loading notifications..." />
          </div>
        ) : isError ? (
          <div className="p-16 flex items-center justify-center min-h-[300px]">
            <GlobalError />
          </div>
        ) : (
          <NotificationsTable
            notifications={filteredNotifications}
            onView={(n) => setViewNotification(n)}
            onTogglePublish={handleTogglePublish}
            onDelete={handleDelete}
            isToggling={togglingId}
            isDeleting={deletingId}
          />
        )}

        {/* Create Modal */}
        <CreateNotificationModal
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onSubmitNotification={handleCreateSubmit}
          isSubmitting={createMutation.isPending}
        />

        {/* View Modal */}
        <ViewNotificationModal
          open={!!viewNotification}
          onOpenChange={(open) => {
            if (!open) setViewNotification(null)
          }}
          notification={viewNotification}
        />
      </main>
    </div>
  )
}
