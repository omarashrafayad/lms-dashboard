"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { UserCheck, X, Loader2, Search } from "lucide-react"
import { useBookSession } from "../../hooks/useSessions"
import { useStudents } from "@/features/dashboard/student/hooks/useStudents"
import { useDebounce } from "@/hooks/useDebounce"
import { toast } from "sonner"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"
import LoadingSpinner from "@/components/shared/LoadingSpinner"

const bookSessionSchema = z.object({
  studentId: z.string().min(1, "Please select a student"),
  studentName: z.string().min(1, "Student name is required"),
  educationSystem: z.string().optional(),
})

type BookSessionFormValues = z.infer<typeof bookSessionSchema>

interface BookSessionModalProps {
  isOpen: boolean
  onClose: () => void
  sessionId: string
  sessionTitle?: string
}

export function BookSessionModal({
  isOpen,
  onClose,
  sessionId,
  sessionTitle,
}: BookSessionModalProps) {
  const [search, setSearch] = React.useState("")
  const debouncedSearch = useDebounce(search, 400)
  const bookMutation = useBookSession()

  const { data: studentsData, isLoading: isLoadingStudents } = useStudents({
    search: debouncedSearch ? debouncedSearch.trim() : undefined,
    page: 1,
    pageSize: 10,
  })
  const students = Array.isArray(studentsData) ? studentsData : studentsData?.items || []

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookSessionFormValues>({
    resolver: zodResolver(bookSessionSchema),
    defaultValues: {
      studentId: "",
      studentName: "",
      educationSystem: "",
    },
  })

  const selectedStudentId = watch("studentId")

  if (!isOpen) return null

  const onSubmit = async (values: BookSessionFormValues) => {
    try {
      await bookMutation.mutateAsync({
        sessionId,
        payload: {
          studentId: values.studentId,
          studentName: values.studentName,
          educationSystem: values.educationSystem || undefined,
        },
      })
      toast.success(`Student ${values.studentName} booked successfully.`)
      reset()
      onClose()
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-xl max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center">
              <UserCheck className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900">
                Book Student for Session
              </h3>
              <p className="text-xs text-zinc-500">
                {sessionTitle || `Session: ${sessionId.slice(0, 8)}`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Student Search & Selection */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 flex flex-col gap-4 text-xs">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-zinc-700">
              Search & Select Student <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type student name or email..."
                className="w-full h-10 pl-9 pr-3.5 rounded-xl border border-zinc-200 text-xs bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-2xs"
              />
            </div>
          </div>

          {/* Student list */}
          <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto border border-zinc-100 rounded-xl p-1 bg-zinc-50/50">
            {isLoadingStudents ? (
              <div className="py-4">
                <LoadingSpinner title="Searching students..." />
              </div>
            ) : students.length === 0 ? (
              <div className="py-4 text-center text-zinc-400 text-xs">
                No students found.
              </div>
            ) : (
              students.map((s) => {
                const isSelected = selectedStudentId === s.id
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setValue("studentId", s.id, { shouldValidate: true })
                      setValue("studentName", s.fullName || "Student")
                      setValue("educationSystem", s.educationSystem || "")
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-lg text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-amber-50 border border-amber-300 text-amber-900 font-bold"
                        : "hover:bg-white text-zinc-700"
                    }`}
                  >
                    <div>
                      <span className="block font-semibold">{s.fullName}</span>
                      <span className="text-[10px] text-zinc-400">
                        {s.grade || s.educationStage || "Student"}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        Selected
                      </span>
                    )}
                  </button>
                )
              })
            )}
          </div>
          {errors.studentId && (
            <span className="text-[11px] text-rose-500">{errors.studentId.message}</span>
          )}

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting || bookMutation.isPending}
              className="h-9 px-4 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || bookMutation.isPending || !selectedStudentId}
              className="h-9 px-5 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting || bookMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <UserCheck className="size-4" />
              )}
              <span>Confirm Booking</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

