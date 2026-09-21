import clientAxios from "@/lib/axios/clientAxios"
import { LessonListItem, LessonDetailFull } from "../types/lesson.types"
import { mockLessonList, mockReadingComprehensionLesson } from "../data/mockLessons"

let localLessons = [...mockLessonList]

export const getLessonList = async (
  params: Record<string, string | undefined> = {}
): Promise<LessonListItem[]> => {
  try {
    const res = await clientAxios.get("/academic/lessons", { params })
    if (Array.isArray(res.data)) return res.data
    if (res.data?.data && Array.isArray(res.data.data)) return res.data.data
  } catch (err) {
    // Graceful fallback
  }
  return localLessons
}

export const getLessonDetailById = async (
  lessonId: string
): Promise<LessonDetailFull> => {
  try {
    const res = await clientAxios.get(`/academic/lessons/${lessonId}`)
    if (res.data?.data) return res.data.data
    if (res.data) return res.data
  } catch (err) {
    // Graceful fallback
  }

  if (lessonId === "les-reading-comp" || lessonId.includes("reading")) {
    return mockReadingComprehensionLesson
  }

  // Generic fallback based on reading comprehension template
  return {
    ...mockReadingComprehensionLesson,
    id: lessonId,
    title: "Reading Comprehension — Short Stories",
  }
}

export const deleteLessonById = async (lessonId: string): Promise<boolean> => {
  try {
    await clientAxios.delete(`/academic/lessons/${lessonId}`)
  } catch (err) {
    // Fallback
  }
  localLessons = localLessons.filter((l) => l.id !== lessonId)
  return true
}
