"use client"

import * as React from "react"
import { toast } from "sonner"
import { PageHeader } from "@/components/layout/PageHeader"
import {
  useNotifications,
  useNotificationStats,
  useCreateNotification,
  useUpdateNotification,
  useDeleteNotification,
  usePublishNotification,
} from "../hooks/useNotifications"
import { NotificationsStats } from "../components/NotificationsStats"
import {
  NotificationsFilters,
  NotificationFilterState,
} from "../components/NotificationsFilters"
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
import { useDebounce } from "@/hooks/useDebounce"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export default function NotificationsMainPage() {
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)

  const [filters, setFilters] = React.useState<NotificationFilterState>({
    search: "",
    audience: "",
    status: "",
    category: "",
  })

  const debouncedSearch = useDebounce(filters.search, 400)

  // Modals state
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editingNotification, setEditingNotification] = React.useState<ApiNotification | null>(null)
  const [viewNotification, setViewNotification] = React.useState<ApiNotification | null>(null)

  // Action states
  const [togglingId, setTogglingId] = React.useState<string | null>(null)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)
  const [notificationToDelete, setNotificationToDelete] = React.useState<string | null>(null)

  // API Queries
  const {
    data: notificationsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useNotifications({
    page,
    pageSize,
    search: debouncedSearch.trim() || undefined,
    audience: filters.audience || undefined,
    status: filters.status || undefined,
  })

  const { data: statsData, isLoading: isStatsLoading } = useNotificationStats()

  // API Mutations
  const createMutation = useCreateNotification()
  const updateMutation = useUpdateNotification()
  const deleteMutation = useDeleteNotification()
  const publishMutation = usePublishNotification()

  // Reset page when filters change
  const handleFilterChange = (newFilters: Partial<NotificationFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
    setPage(1)
  }

  const handleResetFilters = () => {
    setFilters({
      search: "",
      audience: "",
      status: "",
      category: "",
    })
    setPage(1)
  }

  // Create or Update submit
  const handleSaveNotification = async (payload: CreateNotificationPayload) => {
    try {
      if (editingNotification) {
        await updateMutation.mutateAsync({
          id: editingNotification.id,
          data: payload,
        })
        toast.success("Notification updated successfully!")
      } else {
        await createMutation.mutateAsync(payload)
        toast.success("Notification broadcasted successfully!")
      }
      setIsModalOpen(false)
      setEditingNotification(null)
      refetch()
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
      throw err
    }
  }

  // Toggle publish
  const handleTogglePublish = async (notification: ApiNotification) => {
    try {
      setTogglingId(notification.id)
      if (!notification.isPublished) {
        await publishMutation.mutateAsync(notification.id)
        toast.success("Notification published successfully!")
      } else {
        await updateMutation.mutateAsync({
          id: notification.id,
          data: {
            publish: false,
          },
        })
        toast.success("Notification moved to draft state")
      }
      refetch()
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    } finally {
      setTogglingId(null)
    }
  }

  // Delete flow
  const handleConfirmDelete = async () => {
    if (!notificationToDelete) return
    try {
      setDeletingId(notificationToDelete)
      await deleteMutation.mutateAsync(notificationToDelete)
      toast.success("Notification deleted successfully!")
      setNotificationToDelete(null)
      refetch()
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    } finally {
      setDeletingId(null)
    }
  }

  const totalCount = notificationsData?.totalCount ?? 0
  const totalPages = notificationsData?.totalPages ?? 1
  const items = notificationsData?.items || []

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Notifications & Announcements"
        description="Broadcast and manage targeted alerts, announcements, reminders, and mobile push notifications."
      />

      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1400px] w-full mx-auto pb-16">
        {/* KPI Stats */}
        <NotificationsStats
          totalCount={statsData?.totalBroadcasts ?? totalCount}
          publishedCount={statsData?.publishedActive ?? 0}
          draftCount={statsData?.draftMessages ?? 0}
          onAddNotification={() => {
            setEditingNotification(null)
            setIsModalOpen(true)
          }}
        />

        {/* Filters */}
        <NotificationsFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* Main Content Area */}
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner title="Loading notifications..." />
          </div>
        ) : isError ? (
          <GlobalError />
        ) : (
          <NotificationsTable
            notifications={items}
            onView={(n) => setViewNotification(n)}
            onEdit={(n) => {
              setEditingNotification(n)
              setIsModalOpen(true)
            }}
            onTogglePublish={handleTogglePublish}
            onDelete={(id) => setNotificationToDelete(id)}
            isToggling={togglingId}
            isDeleting={deletingId}
            serverPagination={{
              currentPage: page,
              totalPages,
              totalItems: totalCount,
              onPageChange: (p) => setPage(p),
              pageSizeOptions: [10, 20, 50],
              onPageSizeChange: (ps) => {
                setPageSize(ps)
                setPage(1)
              },
            }}
          />
        )}

        {/* Create / Edit Modal */}
        <CreateNotificationModal
          open={isModalOpen}
          onOpenChange={(open) => {
            setIsModalOpen(open)
            if (!open) setEditingNotification(null)
          }}
          initialNotification={editingNotification}
          onSubmitNotification={handleSaveNotification}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />

        {/* View Modal */}
        <ViewNotificationModal
          open={Boolean(viewNotification)}
          onOpenChange={(open) => !open && setViewNotification(null)}
          notification={viewNotification}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={Boolean(notificationToDelete)}
          onOpenChange={(open) => !open && setNotificationToDelete(null)}
        >
          <DialogContent
            onClose={() => setNotificationToDelete(null)}
            className="max-w-[420px] p-6"
          >
            <DialogHeader className="gap-2">
              <div className="size-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-zinc-900">
                  Delete Notification
                </DialogTitle>
                <DialogDescription className="text-xs text-zinc-500 mt-1">
                  Are you sure you want to permanently delete this notification? This action cannot be undone.
                </DialogDescription>
              </div>
            </DialogHeader>

            <DialogFooter className="mt-4 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={Boolean(deletingId)}
                onClick={() => setNotificationToDelete(null)}
                className="h-10 px-4 rounded-xl text-xs font-semibold text-zinc-700 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={Boolean(deletingId)}
                onClick={handleConfirmDelete}
                className="h-10 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-2xs cursor-pointer flex items-center gap-1.5"
              >
                {deletingId ? "Deleting..." : "Delete Permanently"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
