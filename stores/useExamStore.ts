import { create } from "zustand"
import { persist } from "zustand/middleware"
import { ExamItem } from "@/features/dashboard/exam/types/exam.types"
import { initialExamsMockData } from "@/features/dashboard/exam/data/examMockData"

interface ExamStoreState {
  exams: ExamItem[]
  getExamByIdOrSlug: (idOrSlug: string) => ExamItem | undefined
  addExam: (exam: Partial<ExamItem>) => ExamItem
  updateExam: (id: string, updates: Partial<ExamItem>) => void
  duplicateExam: (id: string) => ExamItem | null
  archiveExam: (id: string) => void
  deleteExam: (id: string) => void
  resetToDefault: () => void
}

export const useExamStore = create<ExamStoreState>()(
  persist(
    (set, get) => ({
      exams: initialExamsMockData,

      getExamByIdOrSlug: (idOrSlug: string) => {
        const decoded = decodeURIComponent(idOrSlug).toLowerCase()
        return get().exams.find(
          (e) => e.id.toLowerCase() === decoded || e.slug.toLowerCase() === decoded
        )
      },

      addExam: (examData) => {
        const newId = (get().exams.length + 1).toString()
        const slug = (examData.title || `exam-${newId}`)
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")

        const newExam: ExamItem = {
          ...examData,
          id: newId,
          slug,
          title: examData.title || `Exam ${newId}`,
          type: examData.type || "Monthly",
          level: examData.level || "Beginner",
          subject: examData.subject || "Mathematics",
          educationStage: examData.educationStage || "Primary",
          academicYear: examData.academicYear || "2026 / 2027",
          term: examData.term || "Term 1",
          month: examData.month || "October",
          questionsCount: examData.questionsCount || 20,
          totalPoints: examData.totalPoints || 40,
          duration: examData.duration || "30 min",
          durationMinutes: examData.durationMinutes || 30,
          attemptsAllowed: examData.attemptsAllowed || 1,
          passingScore: examData.passingScore || "60%",
          passingScorePercent: examData.passingScorePercent || 60,
          status: examData.status || "Draft",
          studentsCount: 0,
          passRate: "0%",
          passRatePercent: 0,
          failRatePercent: 0,
          averageScore: "0%",
          avgCompletionTime: "—",
          lastUpdated: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }),
          linkedTo: examData.linkedTo || {
            type: "Subject",
            subject: examData.subject || "Mathematics",
            stage: examData.educationStage || "Primary",
            term: examData.term || "Term 1",
          },
          students: [],
          activityHistory: [
            {
              id: `act-${Date.now()}`,
              action: "Exam created",
              admin: "Dina Farouk",
              dateTime: `${new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })} · ${new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}`,
              previousValue: "—",
              newValue: examData.status || "Draft",
            },
          ],
          questions: examData.questions || [],
        }

        set((state) => ({
          exams: [newExam, ...state.exams],
        }))

        return newExam
      },

      updateExam: (id, updates) => {
        set((state) => ({
          exams: state.exams.map((exam) => {
            if (exam.id === id || exam.slug === id) {
              const updatedActivity = [...exam.activityHistory]
              if (updates.status && updates.status !== exam.status) {
                updatedActivity.unshift({
                  id: `act-${Date.now()}`,
                  action: "Status changed",
                  admin: "Dina Farouk",
                  dateTime: `${new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })} · ${new Date().toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}`,
                  previousValue: exam.status,
                  newValue: updates.status,
                })
              }
              return {
                ...exam,
                ...updates,
                activityHistory: updatedActivity,
                lastUpdated: new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                }),
              }
            }
            return exam
          }),
        }))
      },

      duplicateExam: (id) => {
        const exam = get().exams.find((e) => e.id === id || e.slug === id)
        if (!exam) return null

        const copyId = `${Date.now()}`
        const copyTitle = `${exam.title} (Copy)`
        const copySlug = `${exam.slug}-copy-${Date.now().toString().slice(-4)}`

        const duplicated: ExamItem = {
          ...exam,
          id: copyId,
          slug: copySlug,
          title: copyTitle,
          status: "Draft",
          studentsCount: 0,
          passRate: "0%",
          passRatePercent: 0,
          failRatePercent: 0,
          averageScore: "0%",
          avgCompletionTime: "—",
          lastUpdated: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }),
          students: [],
          activityHistory: [
            {
              id: `act-${Date.now()}`,
              action: "Exam duplicated",
              admin: "Dina Farouk",
              dateTime: `${new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })} · ${new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}`,
              previousValue: exam.title,
              newValue: copyTitle,
            },
          ],
        }

        set((state) => ({
          exams: [duplicated, ...state.exams],
        }))

        return duplicated
      },

      archiveExam: (id) => {
        set((state) => ({
          exams: state.exams.map((exam) => {
            if (exam.id === id || exam.slug === id) {
              return {
                ...exam,
                status: "Archived",
                lastUpdated: new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                }),
              }
            }
            return exam
          }),
        }))
      },

      deleteExam: (id) => {
        set((state) => ({
          exams: state.exams.filter((e) => e.id !== id && e.slug !== id),
        }))
      },

      resetToDefault: () => {
        set({ exams: initialExamsMockData })
      },
    }),
    {
      name: "lms-exams-store-v1",
    }
  )
)
