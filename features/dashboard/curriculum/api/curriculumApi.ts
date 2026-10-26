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
  UpdatePdfPayload,
  ContentPdfResponse,
  CreateVideoPayload,
  UpdateVideoPayload,
  ContentVideoResponse,
  CreateQuizPayload,
  UpdateQuizPayload,
  ContentQuizResponse,
  CurriculumSubjectQueryParams,
} from "../types/curriculum.types"
import { PaginatedResponse, normalizePaginatedResponse } from "@/types/pagination"

// ======================== Subjects API ========================
export const getCurriculumSubjects = async (
  params: CurriculumSubjectQueryParams = {}
): Promise<PaginatedResponse<CurriculumSubject>> => {
  const queryParams: Record<string, any> = {}
  if (params.page !== undefined) queryParams.page = params.page
  if (params.pageSize !== undefined) queryParams.pageSize = params.pageSize
  if (params.search && params.search.trim()) queryParams.search = params.search.trim()
  if (params.stage && params.stage !== "all") queryParams.stage = params.stage
  if (params.year && params.year !== "all") queryParams.year = params.year
  if (params.system && params.system !== "all") queryParams.system = params.system
  if (params.term && params.term !== "all") queryParams.term = params.term
  if (params.subject && params.subject !== "all") queryParams.subject = params.subject

  const res = await clientAxios.get("/curriculum/subjects", {
    params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
  })

  return normalizePaginatedResponse<CurriculumSubject>(res.data, params.page, params.pageSize)
}

export const getCurriculumSubjectStructure = async (
  subjectId: string
): Promise<{ subject: CurriculumSubject; chapters: Chapter[] }> => {
  const res = await clientAxios.get(`/curriculum/subjects/${subjectId}/structure`)
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

export const getPdfById = async (
  pdfId: string
): Promise<ContentPdfResponse> => {
  const res = await clientAxios.get(`/content/pdfs/${pdfId}`)
  return res.data?.data || res.data
}

export const updatePdf = async (
  pdfId: string,
  payload: UpdatePdfPayload
): Promise<ContentPdfResponse> => {
  if (payload.file) {
    const formData = new FormData()
    if (payload.lessonId) formData.append("LessonId", payload.lessonId)
    if (payload.title) formData.append("Title", payload.title)
    if (payload.fileSize) formData.append("FileSize", payload.fileSize.toString())
    if (payload.isOfflineAvailable !== undefined) {
      formData.append("IsOfflineAvailable", payload.isOfflineAvailable.toString())
    }
    formData.append("file", payload.file)
    const res = await clientAxios.put(`/content/pdfs/${pdfId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return res.data?.data || res.data
  }
  const res = await clientAxios.put(`/content/pdfs/${pdfId}`, payload)
  return res.data?.data || res.data
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

  let lastTime = Date.now()
  let lastLoaded = 0

  const res = await clientAxios.post("/content/videos", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    signal: payload.signal,
    onUploadProgress: (progressEvent) => {
      if (!payload.onProgress) return

      const total =
        progressEvent.total || payload.fileSize || payload.file.size || 1
      const loaded = progressEvent.loaded || 0
      const percentage = Math.min(100, Math.round((loaded * 100) / total))

      const now = Date.now()
      const timeDiff = (now - lastTime) / 1000
      let speed = progressEvent.rate
      if (!speed && timeDiff > 0.25) {
        speed = Math.round((loaded - lastLoaded) / timeDiff)
        lastTime = now
        lastLoaded = loaded
      }

      const remainingBytes = Math.max(0, total - loaded)
      const estimated =
        progressEvent.estimated ??
        (speed && speed > 0 ? Math.round(remainingBytes / speed) : undefined)

      const status = percentage >= 100 ? "processing" : "uploading"

      payload.onProgress({
        percentage,
        loaded,
        total,
        rate: speed,
        estimated,
        status,
      })
    },
  })

  // Once backend responds with 200 OK, update to success
  if (payload.onProgress) {
    const total = payload.fileSize || payload.file.size
    payload.onProgress({
      percentage: 100,
      loaded: total,
      total,
      status: "success",
    })
  }

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

export const getVideoById = async (
  videoId: string
): Promise<ContentVideoResponse> => {
  const res = await clientAxios.get(`/content/videos/${videoId}`)
  return res.data?.data || res.data
}

export const updateVideo = async (
  videoId: string,
  payload: UpdateVideoPayload
): Promise<ContentVideoResponse> => {
  const res = await clientAxios.put(`/content/videos/${videoId}`, payload)
  return res.data?.data || res.data
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

export const getQuizById = async (
  quizId: string
): Promise<ContentQuizResponse> => {
  const res = await clientAxios.get(`/content/quizzes/${quizId}`)
  return res.data?.data || res.data
}

export const updateQuiz = async (
  quizId: string,
  payload: UpdateQuizPayload
): Promise<ContentQuizResponse> => {
  const res = await clientAxios.put(`/content/quizzes/${quizId}`, payload)
  return res.data?.data || res.data
}

export const deleteQuiz = async (quizId: string): Promise<void> => {
  await clientAxios.delete(`/content/quizzes/${quizId}`)
}
