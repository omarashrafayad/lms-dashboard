"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"
import { useQuizById, useUpdateQuiz } from "../../hooks/useCurriculum"
import { toast } from "sonner"

export interface EditQuizModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  quizId?: string
  lessonId?: string
  onSuccess?: () => void
}

export function EditQuizModal({
  open,
  onOpenChange,
  quizId,
  lessonId,
  onSuccess,
}: EditQuizModalProps) {
  const { data: quizDetail, isLoading: isLoadingDetail } = useQuizById(
    open && quizId ? quizId : undefined
  )
  const updateQuizMutation = useUpdateQuiz()

  const [title, setTitle] = React.useState("")
  const [passingScore, setPassingScore] = React.useState<number>(70)
  const [timeLimit, setTimeLimit] = React.useState<number>(15)
  const [isPublished, setIsPublished] = React.useState<boolean>(true)

  React.useEffect(() => {
    if (quizDetail) {
      setTitle(quizDetail.title || "")
      setPassingScore(quizDetail.passingScore ?? 70)
      setTimeLimit(quizDetail.timeLimit ?? 15)
      setIsPublished(quizDetail.isPublished ?? true)
    }
  }, [quizDetail])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!quizId) return
    if (!title.trim()) {
      toast.error("Please enter a quiz title")
      return
    }

    try {
      await updateQuizMutation.mutateAsync({
        quizId,
        lessonId,
        data: {
          request: {
            lessonId,
            title: title.trim(),
            passingScore: Number(passingScore) || 70,
            timeLimit: Number(timeLimit) || 15,
            isPublished,
          },
        },
      })
      toast.success("Quiz updated successfully!")
      onOpenChange(false)
      onSuccess?.()
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        err?.message ||
        "Failed to update quiz"
      toast.error(msg)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Edit Quiz</DialogTitle>
          <DialogDescription>
            Update the title, passing score, and time limit for this assessment quiz.
          </DialogDescription>
        </DialogHeader>

        {isLoadingDetail ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2">
            <Loader2 className="size-6 text-brand-orange animate-spin" />
            <span className="text-xs text-zinc-500">Loading quiz details...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-700">
                Quiz Title <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Chapter 1 Assessment"
                className="h-10 px-3 rounded-xl border-zinc-200/80 bg-zinc-50/50 text-sm focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-700">
                  Passing Score (%)
                </label>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={passingScore}
                  onChange={(e) => setPassingScore(Number(e.target.value))}
                  className="h-10 px-3 rounded-xl border-zinc-200/80 bg-zinc-50/50 text-sm focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-700">
                  Time Limit (mins)
                </label>
                <Input
                  type="number"
                  min={1}
                  max={300}
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                  className="h-10 px-3 rounded-xl border-zinc-200/80 bg-zinc-50/50 text-sm focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/40">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-zinc-800">
                  Published Status
                </span>
                <span className="text-[11px] text-zinc-400">
                  Active quizzes are accessible to students.
                </span>
              </div>
              <Switch
                checked={isPublished}
                onCheckedChange={setIsPublished}
              />
            </div>

            <DialogFooter className="mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-10 px-4 rounded-xl border-zinc-200/80 text-zinc-700 text-xs font-medium hover:bg-zinc-50 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateQuizMutation.isPending}
                className="h-10 px-4 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-semibold shadow-2xs cursor-pointer gap-1.5"
              >
                {updateQuizMutation.isPending && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                <span>Save Changes</span>
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
