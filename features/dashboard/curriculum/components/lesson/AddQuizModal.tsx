"use client"

import * as React from "react"
import { HelpCircle, Plus, Trash2, Loader2, CheckCircle2, FolderPlus, Layers } from "lucide-react"
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
import { useCreateQuiz } from "../../hooks/useCurriculum"
import { CreateQuizPayload } from "../../types/curriculum.types"
import { toast } from "sonner"

export interface AddQuizModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lessonId: string
  onSuccess?: () => void
}

interface QuestionDraft {
  id: string
  questionText: string
  options: string
  correctAnswer: string
}

interface QuestionGroupDraft {
  id: string
  title: string
  questions: QuestionDraft[]
}

const createInitialGroup = (): QuestionGroupDraft => ({
  id: `g-${Date.now()}`,
  title: "Group 1",
  questions: [
    {
      id: `q-${Date.now()}-1`,
      questionText: "",
      options: "Option A, Option B, Option C, Option D",
      correctAnswer: "Option A",
    },
  ],
})

export function AddQuizModal({
  open,
  onOpenChange,
  lessonId,
  onSuccess,
}: AddQuizModalProps) {
  const [title, setTitle] = React.useState("")
  const [passingScore, setPassingScore] = React.useState<number>(70)
  const [timeLimit, setTimeLimit] = React.useState<number>(15)
  const [isPublished, setIsPublished] = React.useState<boolean>(true)

  const [groups, setGroups] = React.useState<QuestionGroupDraft[]>([createInitialGroup()])

  const createQuizMutation = useCreateQuiz()

  // --- Group Handlers ---
  const handleAddGroup = () => {
    setGroups((prev) => [
      ...prev,
      {
        id: `g-${Date.now()}`,
        title: `Group ${prev.length + 1}`,
        questions: [
          {
            id: `q-${Date.now()}`,
            questionText: "",
            options: "Option A, Option B, Option C, Option D",
            correctAnswer: "Option A",
          },
        ],
      },
    ])
  }

  const handleRemoveGroup = (groupId: string) => {
    if (groups.length <= 1) {
      toast.error("The quiz must have at least one group")
      return
    }
    setGroups((prev) => prev.filter((g) => g.id !== groupId))
  }

  const handleGroupTitleChange = (groupId: string, newTitle: string) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, title: newTitle } : g))
    )
  }

  // --- Question Handlers within Groups ---
  const handleAddQuestion = (groupId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g
        return {
          ...g,
          questions: [
            ...g.questions,
            {
              id: `q-${Date.now()}`,
              questionText: "",
              options: "Option A, Option B, Option C, Option D",
              correctAnswer: "Option A",
            },
          ],
        }
      })
    )
  }

  const handleRemoveQuestion = (groupId: string, questionId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g
        if (g.questions.length <= 1) {
          toast.error("Each group must have at least one question")
          return g
        }
        return {
          ...g,
          questions: g.questions.filter((q) => q.id !== questionId),
        }
      })
    )
  }

  const handleQuestionChange = (
    groupId: string,
    questionId: string,
    field: keyof Omit<QuestionDraft, "id">,
    value: string
  ) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g
        return {
          ...g,
          questions: g.questions.map((q) =>
            q.id === questionId ? { ...q, [field]: value } : q
          ),
        }
      })
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error("Please enter a quiz title")
      return
    }

    const allQuestions = groups.flatMap((g) => g.questions)
    const invalidQ = allQuestions.find((q) => !q.questionText.trim())
    if (invalidQ) {
      toast.error("Please fill in question text for all questions")
      return
    }

    const payload: CreateQuizPayload = {
      request: {
        lessonId,
        title: title.trim(),
        passingScore: Number(passingScore) || 70,
        timeLimit: Number(timeLimit) || 15,
        isPublished,
      },
      questions: allQuestions.map((q, idx) => ({
        questionText: q.questionText.trim(),
        options: q.options.trim(),
        correctAnswer: q.correctAnswer.trim(),
        order: idx + 1,
      })),
    }

    try {
      await createQuizMutation.mutateAsync(payload)
      toast.success("Quiz created successfully!")
      setTitle("")
      setGroups([createInitialGroup()])
      onOpenChange(false)
      onSuccess?.()
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        err?.message ||
        "Failed to create quiz"
      toast.error(msg)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-[720px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Lesson Quiz</DialogTitle>
          <DialogDescription>
            Configure assessment settings and organize your questions into groups.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-2">
          {/* Quiz Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-800">
              Quiz Title <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chapter Review Quiz"
              className="h-10 px-3 rounded-xl border-zinc-200/80 bg-zinc-50/50 text-sm focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange"
              required
              autoFocus
            />
          </div>

          {/* Passing Score & Time Limit */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-800">
                Passing Score (%)
              </label>
              <Input
                type="number"
                min={1}
                max={100}
                value={passingScore}
                onChange={(e) => setPassingScore(Number(e.target.value))}
                className="h-10 px-3 rounded-xl border-zinc-200/80 bg-zinc-50/50 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-800">
                Time Limit (minutes)
              </label>
              <Input
                type="number"
                min={1}
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                className="h-10 px-3 rounded-xl border-zinc-200/80 bg-zinc-50/50 text-sm"
              />
            </div>
          </div>

          {/* Published status toggle */}
          <div className="rounded-xl border border-zinc-200/80 p-3.5 px-4 flex items-center justify-between bg-white shadow-2xs">
            <div className="flex flex-col pr-4">
              <span className="text-xs font-semibold text-zinc-900">
                Publish Immediately
              </span>
              <span className="text-[11px] text-zinc-400">
                Make this quiz visible and active for enrolled students
              </span>
            </div>
            <Switch
              checked={isPublished}
              onCheckedChange={setIsPublished}
            />
          </div>

          {/* Question Groups Section */}
          <div className="flex flex-col gap-4 pt-2 border-t border-zinc-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="size-4 text-brand-orange" />
                <span className="text-xs font-bold text-zinc-900">
                  Question Groups ({groups.length})
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddGroup}
                className="h-8 px-3 rounded-xl border-zinc-200/80 text-xs font-medium gap-1 cursor-pointer hover:bg-zinc-50"
              >
                <FolderPlus className="size-3.5" />
                <span>Add Group</span>
              </Button>
            </div>

            <div className="flex flex-col gap-6">
              {groups.map((group, groupIdx) => (
                <div
                  key={group.id}
                  className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-4 flex flex-col gap-4"
                >
                  {/* Group Header */}
                  <div className="flex items-center justify-between gap-3 pb-3 border-b border-zinc-200/70">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-xs font-bold text-zinc-500 whitespace-nowrap">
                        Group {groupIdx + 1}:
                      </span>
                      <Input
                        type="text"
                        value={group.title}
                        onChange={(e) => handleGroupTitleChange(group.id, e.target.value)}
                        placeholder="Group Title (e.g. Vocabulary, Grammar)"
                        className="h-8 px-2.5 rounded-lg border-zinc-200 bg-white text-xs max-w-xs font-medium"
                      />
                    </div>
                    {groups.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveGroup(group.id)}
                        className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg text-xs gap-1"
                      >
                        <Trash2 className="size-3.5" />
                        <span>Delete Group</span>
                      </Button>
                    )}
                  </div>

                  {/* Questions in this Group */}
                  <div className="flex flex-col gap-3">
                    {group.questions.map((q, qIdx) => (
                      <div
                        key={q.id}
                        className="p-3.5 rounded-xl border border-zinc-200/90 bg-white shadow-2xs flex flex-col gap-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-zinc-700">
                            Question {qIdx + 1}
                          </span>
                          {group.questions.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveQuestion(group.id, q.id)}
                              className="size-7 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          )}
                        </div>

                        {/* Question Text */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-medium text-zinc-600">
                            Question Text <span className="text-red-500">*</span>
                          </label>
                          <Input
                            type="text"
                            value={q.questionText}
                            onChange={(e) =>
                              handleQuestionChange(group.id, q.id, "questionText", e.target.value)
                            }
                            placeholder="e.g. Which of the following is equivalent to 1/2?"
                            className="h-9 px-3 rounded-lg border-zinc-200 bg-zinc-50/30 text-xs"
                            required
                          />
                        </div>

                        {/* Options */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-medium text-zinc-600">
                            Options (comma-separated)
                          </label>
                          <Input
                            type="text"
                            value={q.options}
                            onChange={(e) =>
                              handleQuestionChange(group.id, q.id, "options", e.target.value)
                            }
                            placeholder="Option A, Option B, Option C, Option D"
                            className="h-9 px-3 rounded-lg border-zinc-200 bg-zinc-50/30 text-xs"
                            required
                          />
                        </div>

                        {/* Correct Answer */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-medium text-zinc-600">
                            Correct Answer
                          </label>
                          <Input
                            type="text"
                            value={q.correctAnswer}
                            onChange={(e) =>
                              handleQuestionChange(group.id, q.id, "correctAnswer", e.target.value)
                            }
                            placeholder="e.g. Option A"
                            className="h-9 px-3 rounded-lg border-zinc-200 bg-zinc-50/30 text-xs"
                            required
                          />
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddQuestion(group.id)}
                      className="w-full h-8 mt-1 border-dashed border-zinc-300 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/60 rounded-xl text-xs gap-1"
                    >
                      <Plus className="size-3.5" />
                      <span>Add Question to {group.title || `Group ${groupIdx + 1}`}</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="mt-3 pt-2 border-t border-zinc-100">
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
              disabled={createQuizMutation.isPending}
              className="h-10 px-4 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-semibold shadow-2xs gap-1.5 cursor-pointer"
            >
              {createQuizMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Creating Quiz...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-4" />
                  <span>Create Quiz</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}