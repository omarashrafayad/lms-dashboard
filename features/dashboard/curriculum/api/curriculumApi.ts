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
    const data = Array.isArray(res.data)
      ? res.data
      : res.data?.data && Array.isArray(res.data.data)
      ? res.data.data
      : null

    if (data && data.length > 0) {
      return data.map((item: any) => ({
        ...item,
        educationStageName: item.educationStageName || item.stage || "",
        gradeName: item.gradeName || item.year || "",
        educationSystemName: item.educationSystemName || item.system || "",
        avatarLetter: item.avatarLetter || item.name?.charAt(0)?.toUpperCase() || "S",
        avatarColorClass:
          item.avatarColorClass ||
          (item.name?.toLowerCase().includes("math")
            ? "bg-sky-100 text-sky-700"
            : item.name?.toLowerCase().includes("arab")
            ? "bg-purple-100 text-purple-700"
            : item.name?.toLowerCase().includes("scie")
            ? "bg-lime-100 text-lime-800"
            : item.name?.toLowerCase().includes("eng")
            ? "bg-amber-100 text-amber-800"
            : "bg-orange-100 text-orange-800"),
        chaptersCount: item.chaptersCount ?? 0,
        unitsCount: item.unitsCount ?? 0,
        lessonsCount: item.lessonsCount ?? 0,
        status: item.status || "Active",
      }))
    }
    if (data && data.length === 0) {
      return []
    }
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
  const payload = {
    name: data.name,
    educationStageId: data.educationStageId,
    gradeId: data.gradeId,
    educationSystemId: data.educationSystemId,
    term: data.term,
  }
  const res = await clientAxios.post("/curriculum/subjects", payload)
  return res.data?.data || res.data
}

export const updateCurriculumSubject = async (
  id: string,
  data: Partial<CreateSubjectPayload>
): Promise<CurriculumSubject> => {
  const payload: Record<string, any> = {}
  if (data.name !== undefined) payload.name = data.name
  if (data.educationStageId !== undefined) payload.educationStageId = data.educationStageId
  if (data.gradeId !== undefined) payload.gradeId = data.gradeId
  if (data.educationSystemId !== undefined) payload.educationSystemId = data.educationSystemId
  if (data.term !== undefined) payload.term = data.term
  if (data.status !== undefined) payload.status = data.status === "Active" ? "Inactive" : "Active"

  const res = await clientAxios.put(`/curriculum/subjects/${id}`, payload)
  return res.data?.data || res.data
}

export const deleteCurriculumSubject = async (id: string): Promise<boolean> => {
  await clientAxios.delete(`/curriculum/subjects/${id}`)
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
