import clientAxios from "@/lib/axios/clientAxios"
import {
  CurriculumSubject,
  Chapter,
  Unit,
  LessonSummary,
  LessonDetail,
  CreateSubjectPayload,
  CreateChapterPayload,
  CreateUnitPayload,
  CreateLessonPayload,
  CreatePdfPayload,
  ContentPdfResponse,
  CreateVideoPayload,
  ContentVideoResponse,
  CreateQuizPayload,
  ContentQuizResponse,
} from "../types/curriculum.types"

// ======================== Subjects API ========================
export const getCurriculumSubjects = async (
  params: { search?: string; stage?: string; year?: string; system?: string; term?: string } = {}
): Promise<CurriculumSubject[]> => {
  const res = await clientAxios.get("/curriculum/subjects", {
    params: Object.keys(params).length > 0 ? params : undefined,
  })
  if (Array.isArray(res.data)) {
    return res.data
  }
  if (res.data && Array.isArray(res.data.data)) {
    return res.data.data
  }
  return []
}

export const getCurriculumSubjectById = async (
  subjectId: string
): Promise<{ subject: CurriculumSubject; chapters: Chapter[] }> => {
  const res = await clientAxios.get(`/curriculum/subjects/${subjectId}`)
  const data = res.data?.data || res.data
  return {
    subject: data?.subject || data,
    chapters: data?.chapters || [],
  }
}

export const getCurriculumSubjectStructure = async (
  subjectId: string
): Promise<{ subject: CurriculumSubject; chapters: Chapter[] }> => {
  const res = await clientAxios.get(`/curriculum/subjects/${subjectId}`)
  const data = res.data?.data || res.data
  return {
    subject: data?.subject || data,
    chapters: data?.chapters || [],
  }
}

export const createCurriculumSubject = async (
  data: CreateSubjectPayload
): Promise<CurriculumSubject> => {
  const res = await clientAxios.post("/curriculum/subjects", data)
  return res.data?.data || res.data
}

export const updateCurriculumSubject = async (
  id: string,
  data: Partial<CreateSubjectPayload>
): Promise<CurriculumSubject> => {
  const res = await clientAxios.put(`/curriculum/subjects/${id}`, data)
  return res.data?.data || res.data
}

export const deleteCurriculumSubject = async (id: string): Promise<void> => {
  await clientAxios.delete(`/curriculum/subjects/${id}`)
}

// ======================== Chapters API ========================
export const getChapters = async (subjectId: string): Promise<Chapter[]> => {
  const res = await clientAxios.get("/curriculum/chapters", {
    params: { subjectId },
  })
  if (Array.isArray(res.data)) {
    return res.data
  }
  if (res.data && Array.isArray(res.data.data)) {
    return res.data.data
  }
  return []
}

export const createChapter = async (
  data: CreateChapterPayload
): Promise<Chapter> => {
  const res = await clientAxios.post("/curriculum/chapters", data)
  return res.data?.data || res.data
}

// ======================== Units API ========================
export const getUnits = async (chapterId: string): Promise<Unit[]> => {
  const res = await clientAxios.get("/curriculum/units", {
    params: { chapterId },
  })
  if (Array.isArray(res.data)) {
    return res.data
  }
  if (res.data && Array.isArray(res.data.data)) {
    return res.data.data
  }
  return []
}

export const createUnit = async (
  data: CreateUnitPayload
): Promise<Unit> => {
  const res = await clientAxios.post("/curriculum/units", data)
  return res.data?.data || res.data
}

// ======================== Lessons API ========================
export const getLessons = async (unitId: string): Promise<LessonSummary[]> => {
  const res = await clientAxios.get("/curriculum/lessons", {
    params: { unitId },
  })
  if (Array.isArray(res.data)) {
    return res.data
  }
  if (res.data && Array.isArray(res.data.data)) {
    return res.data.data
  }
  return []
}

export const createLesson = async (
  data: CreateLessonPayload
): Promise<LessonSummary> => {
  const res = await clientAxios.post("/curriculum/lessons", data)
  return res.data?.data || res.data
}

export const getLessonDetail = async (
  subjectId: string,
  lessonId: string
): Promise<LessonDetail> => {
  const res = await clientAxios.get(`/curriculum/lessons/${lessonId}`)
  return res.data?.data || res.data
}

// ======================== Content: PDF API ========================
export const uploadPdf = async (
  payload: CreatePdfPayload
): Promise<ContentPdfResponse> => {
  const formData = new FormData()
  formData.append("LessonId", payload.lessonId)
  formData.append("Title", payload.title)
  formData.append("FileSize", payload.fileSize.toString())
  formData.append("IsOfflineAvailable", payload.isOfflineAvailable.toString())
  formData.append("file", payload.file)

  const res = await clientAxios.post("/content/pdfs", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return res.data?.data || res.data
}

export const getPdfs = async (
  lessonId: string
): Promise<ContentPdfResponse[]> => {
  const res = await clientAxios.get(`/content/pdfs/lesson/${lessonId}`)
  if (Array.isArray(res.data)) return res.data
  if (res.data && Array.isArray(res.data.data)) return res.data.data
  return []
}

export const deletePdf = async (pdfId: string): Promise<void> => {
  await clientAxios.delete(`/content/pdfs/${pdfId}`)
}

// ======================== Content: Video API ========================
export const uploadVideo = async (
  payload: CreateVideoPayload
): Promise<ContentVideoResponse> => {
  const formData = new FormData()
  formData.append("LessonId", payload.lessonId)
  formData.append("Title", payload.title)
  formData.append("FileSize", payload.fileSize.toString())
  formData.append("Duration", payload.duration.toString())
  formData.append("Order", payload.order.toString())
  formData.append("IsFree", payload.isFree.toString())
  formData.append("IsPremium", payload.isPremium.toString())
  formData.append("IsOfflineAvailable", payload.isOfflineAvailable.toString())
  formData.append("file", payload.file)

  const res = await clientAxios.post("/content/videos", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return res.data?.data || res.data
}

export const getVideos = async (
  lessonId: string
): Promise<ContentVideoResponse[]> => {
  const res = await clientAxios.get(`/content/videos/lesson/${lessonId}`)
  if (Array.isArray(res.data)) return res.data
  if (res.data && Array.isArray(res.data.data)) return res.data.data
  return []
}

export const deleteVideo = async (videoId: string): Promise<void> => {
  await clientAxios.delete(`/content/videos/${videoId}`)
}

// ======================== Content: Quiz API ========================
export const createQuiz = async (
  payload: CreateQuizPayload
): Promise<ContentQuizResponse> => {
  const res = await clientAxios.post("/content/quizzes", payload)
  return res.data?.data || res.data
}

export const getQuizzes = async (
  lessonId: string
): Promise<ContentQuizResponse[]> => {
  const res = await clientAxios.get(`/content/quizzes/lesson/${lessonId}`)
  if (Array.isArray(res.data)) return res.data
  if (res.data && Array.isArray(res.data.data)) return res.data.data
  return []
}

export const deleteQuiz = async (quizId: string): Promise<void> => {
  await clientAxios.delete(`/content/quizzes/${quizId}`)
}
