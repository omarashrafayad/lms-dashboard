import clientAxios from "@/lib/axios/clientAxios"
import {
  CurriculumSubject,
  Chapter,
  LessonDetail,
  CreateSubjectPayload,
} from "../types/curriculum.types"
import {
  mockCurriculumSubjects,
  mockSubjectChapters,
  mockLessonDetail,
  mockNumbersLessonDetail,
} from "../data/mockCurriculum"

// In-memory store for active session mutations
let localSubjects = [...mockCurriculumSubjects]

export const getCurriculumSubjects = async (
  params: { search?: string; stage?: string; year?: string; system?: string; term?: string } = {}
): Promise<CurriculumSubject[]> => {
  try {
    const res = await clientAxios.get("/curriculum/subjects", { params })
    if (Array.isArray(res.data)) return res.data
    if (res.data?.data && Array.isArray(res.data.data)) return res.data.data
  } catch (err) {
    // Graceful fallback to mock data
  }
  return localSubjects
}

export const getCurriculumSubjectById = async (
  subjectId: string
): Promise<{ subject: CurriculumSubject; chapters: Chapter[] }> => {
  try {
    const res = await clientAxios.get(`/curriculum/subjects/${subjectId}`)
    if (res.data?.data) return res.data.data
    if (res.data) return res.data
  } catch (err) {
    // Graceful fallback to mock data
  }

  const subject =
    localSubjects.find((s) => s.id === subjectId) || localSubjects[0]
  const chapters = mockSubjectChapters[subjectId] || mockSubjectChapters["1"] || []

  return {
    subject,
    chapters,
  }
}

export const createCurriculumSubject = async (
  data: CreateSubjectPayload
): Promise<CurriculumSubject> => {
  try {
    const res = await clientAxios.post("/curriculum/subjects", data)
    if (res.data?.data) return res.data.data
  } catch (err) {
    // Fallback mutation
  }

  const avatarColorClass =
    data.name.toLowerCase().includes("math")
      ? "bg-sky-100 text-sky-700"
      : data.name.toLowerCase().includes("arab")
      ? "bg-purple-100 text-purple-700"
      : data.name.toLowerCase().includes("scien")
      ? "bg-lime-100 text-lime-800"
      : "bg-amber-100 text-amber-800"

  const newSubject: CurriculumSubject = {
    id: String(Date.now()),
    name: data.name,
    code: `SUB-${data.name.slice(0, 3).toUpperCase()}-${data.year.replace(/\s+/g, "")}`,
    avatarLetter: data.name.charAt(0).toUpperCase(),
    avatarColorClass,
    stage: data.stage,
    year: data.year,
    system: data.system,
    term: data.term,
    chaptersCount: 0,
    unitsCount: 0,
    lessonsCount: 0,
    status: data.status,
  }

  localSubjects = [newSubject, ...localSubjects]
  return newSubject
}

export const updateCurriculumSubject = async (
  id: string,
  data: Partial<CreateSubjectPayload>
): Promise<CurriculumSubject> => {
  try {
    const res = await clientAxios.put(`/curriculum/subjects/${id}`, data)
    if (res.data?.data) return res.data.data
  } catch (err) {
    // Fallback mutation
  }

  localSubjects = localSubjects.map((s) => {
    if (s.id === id) {
      return {
        ...s,
        ...data,
        avatarLetter: data.name ? data.name.charAt(0).toUpperCase() : s.avatarLetter,
      }
    }
    return s
  })

  return localSubjects.find((s) => s.id === id)!
}

export const deleteCurriculumSubject = async (id: string): Promise<boolean> => {
  try {
    await clientAxios.delete(`/curriculum/subjects/${id}`)
  } catch (err) {
    // Fallback mutation
  }
  localSubjects = localSubjects.filter((s) => s.id !== id)
  return true
}

export const getLessonDetail = async (
  subjectId: string,
  lessonId: string
): Promise<LessonDetail> => {
  try {
    const res = await clientAxios.get(
      `/curriculum/subjects/${subjectId}/lessons/${lessonId}`
    )
    if (res.data?.data) return res.data.data
    if (res.data) return res.data
  } catch (err) {
    // Graceful fallback to mock data
  }

  if (lessonId === "les-1" || lessonId.toLowerCase().includes("number")) {
    return mockNumbersLessonDetail
  }

  return mockLessonDetail
}
