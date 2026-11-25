"use client"

import * as React from "react"
import {
  X,
  Play,
  Pause,
  Volume2,
  Maximize2,
  FileText,
  HelpCircle,
  Download,
  ChevronRight,
  CheckCircle2,
  Layers,
  Award,
  BookOpen,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import { useStudentLessonDetail } from "../hooks/useStudentPortal"

interface StudentLessonViewerModalProps {
  lessonId: string | null
  courseId: string | null
  isOpen: boolean
  onClose: () => void
  onSelectLesson?: (nextLessonId: string) => void
}

export function StudentLessonViewerModal({
  lessonId,
  courseId,
  isOpen,
  onClose,
  onSelectLesson,
}: StudentLessonViewerModalProps) {
  const [activeTab, setActiveTab] = React.useState<"video" | "materials" | "quiz">("video")
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [selectedVideoIndex, setSelectedVideoIndex] = React.useState(0)
  const [isCompleted, setIsCompleted] = React.useState(false)

  const { data, isLoading, isError } = useStudentLessonDetail(lessonId || "")

  const lesson = data?.lesson
  const course = data?.course
  const videos = data?.videos || []
  const materials = data?.materials || []
  const quiz = data?.quiz
  const quizGroups = data?.quizGroups || []
  const nextLesson = data?.nextLesson

  React.useEffect(() => {
    if (data?.status === "completed") {
      setIsCompleted(true)
    } else {
      setIsCompleted(false)
    }
  }, [data])

  if (!isOpen || !lessonId) return null

  const currentVideo = videos[selectedVideoIndex] || videos[0]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/80">
          <div className="flex items-center gap-3 min-w-0">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-zinc-950">
              Lesson {lesson?.lessonOrder || 1}
            </span>
            <div className="flex flex-col min-w-0">
              <h2 className="text-sm font-bold text-zinc-900 truncate">
                {lesson?.name || "Loading lesson..."}
              </h2>
              <span className="text-[11px] text-zinc-400 truncate">
                {course?.name} • Duration: {lesson?.durationMinutes || 45} mins
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCompleted(!isCompleted)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isCompleted
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  : "bg-zinc-200/80 text-zinc-700 hover:bg-zinc-300"
              }`}
            >
              <CheckCircle2 className="size-3.5" />
              <span>{isCompleted ? "Completed" : "Mark as Completed"}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="size-9 rounded-xl border border-zinc-200/80 bg-white flex items-center justify-center text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-1 border-b border-zinc-100 bg-white text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("video")}
            className={`flex items-center gap-1.5 px-4 py-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "video"
                ? "border-amber-400 text-zinc-900 font-bold"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <Play className="size-3.5" />
            <span>Video Lectures ({videos.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("materials")}
            className={`flex items-center gap-1.5 px-4 py-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "materials"
                ? "border-amber-400 text-zinc-900 font-bold"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <FileText className="size-3.5" />
            <span>Study Materials & PDFs ({materials.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("quiz")}
            className={`flex items-center gap-1.5 px-4 py-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "quiz"
                ? "border-amber-400 text-zinc-900 font-bold"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <HelpCircle className="size-3.5" />
            <span>Formative Quiz {quiz ? `(${quiz.questionsCount} Qs)` : ""}</span>
          </button>
        </div>

        {/* Content Viewer Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
          {isLoading ? (
            <div className="flex flex-col gap-4 animate-pulse">
              <div className="aspect-video w-full rounded-2xl bg-zinc-200" />
              <div className="h-6 w-1/3 bg-zinc-200 rounded" />
              <div className="h-4 w-2/3 bg-zinc-100 rounded" />
            </div>
          ) : (
            <>
              {/* TAB 1: VIDEOS */}
              {activeTab === "video" && (
                <div className="flex flex-col gap-4">
                  {videos.length > 0 ? (
                    <>
                      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-zinc-950 flex flex-col justify-between p-4 shadow-inner group">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="size-16 rounded-full bg-brand-orange hover:brightness-110 text-zinc-950 flex items-center justify-center shadow-xl transition-all transform hover:scale-110 cursor-pointer"
                          >
                            {isPlaying ? (
                              <Pause className="size-7 fill-current" />
                            ) : (
                              <Play className="size-7 fill-current ml-1" />
                            )}
                          </button>
                        </div>

                        {/* Top Info Overlay */}
                        <div className="relative z-10 flex items-center justify-between text-white text-xs opacity-90">
                          <span className="font-semibold bg-black/50 px-3 py-1 rounded-full backdrop-blur-xs">
                            {currentVideo?.title || lesson?.name}
                          </span>
                          <span className="text-[11px] text-zinc-300 bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-xs">
                            HD 1080p
                          </span>
                        </div>

                        {/* Bottom Controls Bar */}
                        <div className="relative z-10 flex flex-col gap-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 rounded-xl">
                          <div className="w-full h-1.5 rounded-full bg-white/20 overflow-hidden cursor-pointer">
                            <div className="h-full w-2/5 bg-amber-400 rounded-full" />
                          </div>

                          <div className="flex items-center justify-between text-white text-xs">
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="cursor-pointer hover:text-amber-400"
                              >
                                {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
                              </button>
                              <Volume2 className="size-4" />
                              <span className="text-[11px] text-zinc-300">
                                {Math.floor((currentVideo?.durationSeconds || 1800) / 60)} mins lecture
                              </span>
                            </div>

                            <Maximize2 className="size-4 cursor-pointer hover:text-amber-400" />
                          </div>
                        </div>
                      </div>

                      {/* Video playlist selection if multiple */}
                      {videos.length > 1 && (
                        <div className="flex items-center gap-2 overflow-x-auto pb-1">
                          {videos.map((vid, idx) => (
                            <button
                              key={vid.id}
                              type="button"
                              onClick={() => setSelectedVideoIndex(idx)}
                              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold shrink-0 border transition-all cursor-pointer ${
                                selectedVideoIndex === idx
                                  ? "bg-amber-100 text-amber-900 border-amber-300 shadow-2xs"
                                  : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                              }`}
                            >
                              <Play className="size-3" />
                              <span>Part {idx + 1}: {vid.title}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="p-12 text-center bg-zinc-50 rounded-2xl border border-dashed border-zinc-200 text-xs text-zinc-500">
                      No video lectures attached to this lesson yet.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: STUDY MATERIALS */}
              {activeTab === "materials" && (
                <div className="flex flex-col gap-3">
                  {materials.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {materials.map((mat) => (
                        <div
                          key={mat.id}
                          className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 hover:border-amber-400/80 transition-all flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="size-11 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                              <FileText className="size-5" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-bold text-zinc-900 truncate">
                                {mat.title}
                              </span>
                              <span className="text-[10px] text-zinc-400">
                                PDF Document • {(mat.fileSize / (1024 * 1024)).toFixed(1)} MB
                              </span>
                            </div>
                          </div>

                          <a
                            href={mat.fileUrl || mat.filePath || "#"}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-400 hover:brightness-105 text-zinc-950 font-bold text-xs shadow-2xs shrink-0 cursor-pointer"
                          >
                            <Download className="size-3.5" />
                            <span>Download</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center bg-zinc-50 rounded-2xl border border-dashed border-zinc-200 text-xs text-zinc-500">
                      No document materials currently attached to this lesson.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: FORMATIVE QUIZ */}
              {activeTab === "quiz" && (
                <div className="flex flex-col gap-4">
                  {quiz ? (
                    <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-200/80 flex flex-col gap-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col gap-1">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200/60 w-fit">
                            Lesson Knowledge Check
                          </span>
                          <h3 className="text-base font-bold text-zinc-900">
                            {quiz.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-xl text-xs font-bold bg-white border border-zinc-200 text-zinc-800">
                            Passing: {quiz.passingScore}%
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-white border border-zinc-200/60 text-xs">
                        <div>
                          <span className="text-zinc-400 block text-[11px]">Questions</span>
                          <span className="font-bold text-zinc-900">{quiz.questionsCount} items</span>
                        </div>
                        <div>
                          <span className="text-zinc-400 block text-[11px]">Time Limit</span>
                          <span className="font-bold text-zinc-900">{quiz.timeLimitMinutes} minutes</span>
                        </div>
                        <div>
                          <span className="text-zinc-400 block text-[11px]">Attempts</span>
                          <span className="font-bold text-zinc-900">{quiz.attempts} used</span>
                        </div>
                        <div>
                          <span className="text-zinc-400 block text-[11px]">Status</span>
                          <span
                            className={`font-bold ${
                              quiz.hasPassed ? "text-emerald-700" : "text-amber-800"
                            }`}
                          >
                            {quiz.hasPassed ? "Passed" : "Pending Attempt"}
                          </span>
                        </div>
                      </div>

                      {/* Quiz Groups if any */}
                      {quizGroups.length > 0 && (
                        <div className="flex flex-col gap-2 pt-2 border-t border-zinc-200/60">
                          <span className="text-xs font-bold text-zinc-700">Quiz Question Groups:</span>
                          <div className="flex flex-wrap gap-2">
                            {quizGroups.map((grp) => (
                              <div
                                key={grp.id}
                                className="px-3 py-1.5 rounded-xl bg-white border border-zinc-200 text-xs flex items-center gap-2"
                              >
                                <span className="font-semibold text-zinc-800">{grp.name}</span>
                                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">
                                  {grp.questionsCount} Qs
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-12 text-center bg-zinc-50 rounded-2xl border border-dashed border-zinc-200 text-xs text-zinc-500">
                      No quiz attached to this lesson.
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer with Next Lesson button */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100 bg-zinc-50/80">
          <p className="text-xs text-zinc-500 font-medium">
            {lesson?.description || "Curriculum topic lecture"}
          </p>

          {nextLesson && (
            <button
              type="button"
              onClick={() => onSelectLesson && onSelectLesson(nextLesson.id)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-orange hover:brightness-105 text-zinc-950 font-bold text-xs shadow-sm shadow-amber-400/20 transition-all cursor-pointer"
            >
              <span>Next: {nextLesson.name}</span>
              <ArrowRight className="size-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
