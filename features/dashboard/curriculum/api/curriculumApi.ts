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

export const getCurriculumSubjects = async (
  params: { search?: string; stage?: string; year?: string; system?: string; term?: string } = {}
): Promise<CurriculumSubject[]> => {
  const res = await clientAxios.get("/curriculum/subjects", { params })
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

import {
  mockLessonDetail,
  mockNumbersLessonDetail,
} from "../data/mockCurriculum"

export const getLessonDetail = async (
  subjectId: string,
  lessonId: string
): Promise<LessonDetail> => {
  try {
    const res = await clientAxios.get(`/curriculum/lessons/${lessonId}`)
    const raw = res.data?.data || res.data

    if (raw && (raw.id || raw.name || raw.title)) {
      let videos = raw.videos || []
      let pdf = raw.pdf || null
      let quiz = raw.quiz || null

      try {
        const [videosRes, pdfsRes, quizzesRes] = await Promise.allSettled([
          clientAxios.get(`/content/videos/lesson/${lessonId}`),
          clientAxios.get(`/content/pdfs/lesson/${lessonId}`),
          clientAxios.get(`/content/quizzes/lesson/${lessonId}`),
        ])

        if (videosRes.status === "fulfilled") {
          const vList = Array.isArray(videosRes.value.data)
            ? videosRes.value.data
            : Array.isArray(videosRes.value.data?.data)
            ? videosRes.value.data.data
            : []
          if (vList.length > 0) {
            videos = vList.map((v: any, idx: number) => ({
              id: v.id || `v-${idx + 1}`,
              order: v.order ?? idx + 1,
              title: v.title || `Video ${idx + 1}`,
              duration: v.duration
                ? `${Math.floor(v.duration / 60)}:${String(v.duration % 60).padStart(2, "0")}`
                : "00:00",
              access: v.isFree ? "Free" : "Premium",
              offlineAvailable: !!v.isOfflineAvailable,
            }))
          }
        }

        if (pdfsRes.status === "fulfilled") {
          const pList = Array.isArray(pdfsRes.value.data)
            ? pdfsRes.value.data
            : Array.isArray(pdfsRes.value.data?.data)
            ? pdfsRes.value.data.data
            : []
          if (pList[0]) {
            const p = pList[0]
            pdf = {
              id: p.id,
              title: p.title || "Lesson Resource.pdf",
              size: formatBytes(p.fileSize),
              offlineAvailable: !!p.isOfflineAvailable,
              pdfUrl: p.filePath || p.url || p.fileUrl || "",
            }
          }
        }

        if (quizzesRes.status === "fulfilled") {
          const qList = Array.isArray(quizzesRes.value.data)
            ? quizzesRes.value.data
            : Array.isArray(quizzesRes.value.data?.data)
            ? quizzesRes.value.data.data
            : []
          if (qList[0]) {
            const q = qList[0]
            quiz = {
              id: q.id,
              title: q.title || "Lesson Quiz",
              status: q.isPublished ? "Published" : "Draft",
              questionsCount: q.questionsCount ?? q.questions?.length ?? 0,
              passingScore: `${q.passingScore}%`,
              timeLimit: `${q.timeLimit} min`,
            }
          }
        }
      } catch {
        // Ignore sub-resource errors
      }

      return {
        id: raw.id || lessonId,
        subjectId: raw.subjectId || subjectId,
        chapterId: raw.chapterId || "",
        unitId: raw.unitId || "",
        name: raw.name || raw.title || "Lesson",
        title: raw.title || raw.name || "Lesson",
        description: raw.description || "",
        order: raw.lessonOrder ?? raw.order ?? 1,
        lessonOrder: raw.lessonOrder ?? raw.order ?? 1,
        duration: raw.duration ? `${raw.duration} min` : "30 min",
        access: raw.access || raw.accessType || "Premium",
        accessType: raw.accessType || raw.access || "Premium",
        status:
          raw.status === "true" ||
          raw.status === "Active" ||
          raw.status === "Published"
            ? "Published"
            : raw.status || "Draft",
        stage: raw.stage || raw.educationStageName || "",
        year: raw.year || raw.gradeName || "",
        system: raw.system || raw.educationSystemName || "",
        term: raw.term || "",
        subjectName: raw.subjectName || "Curriculum",
        chapterTitle: raw.chapterTitle || "Chapter",
        unitTitle: raw.unitTitle || "Unit",
        overview: {
          description: raw.description || "",
          order: raw.lessonOrder ?? raw.order ?? 1,
          duration: raw.duration ? `${raw.duration} min` : "30 min",
          access: raw.accessType || raw.access || "Premium",
        },
        videos: videos,
        pdf: pdf,
        pdfOfflineAvailability: pdf?.offlineAvailable ?? false,
        quiz: quiz,
        settings: raw.settings || {
          freePlanFirstVideoOnly: raw.accessType === "Free",
          premiumContent: raw.accessType === "Premium",
          videoOfflineDownload: true,
          pdfOfflineDownload: true,
        },
      }
    }
  } catch (err) {
    // Graceful fallback to mock data if API 404s
  }

  if (lessonId === "les-1" || lessonId.toLowerCase().includes("number")) {
    return mockNumbersLessonDetail
  }

  return mockLessonDetail
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

// ======================== Helper ========================
export function formatBytes(bytes?: number, decimals = 1): string {
  if (!bytes || bytes === 0) return "0 MB"
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
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
  if (Array.isArray(res.data)) {
    return res.data
  }
  if (res.data && Array.isArray(res.data.data)) {
    return res.data.data
  }
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
  if (Array.isArray(res.data)) {
    return res.data
  }
  if (res.data && Array.isArray(res.data.data)) {
    return res.data.data
  }
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
  if (Array.isArray(res.data)) {
    return res.data
  }
  if (res.data && Array.isArray(res.data.data)) {
    return res.data.data
  }
  return []
}

export const deleteQuiz = async (quizId: string): Promise<void> => {
  await clientAxios.delete(`/content/quizzes/${quizId}`)
}


