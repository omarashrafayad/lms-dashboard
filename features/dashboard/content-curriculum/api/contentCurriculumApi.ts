import clientAxios from "@/lib/axios/clientAxios"
import {
  PagedResponse,
  ContentCurriculumQueryParams,
  ContentPdfItem,
  ContentQuizItem,
  ContentVideoItem,
  CurriculumChapterItem,
  CurriculumUnitItem,
  CurriculumLessonItem,
} from "../types/contentCurriculum.types"

// 1. PDFs
export const getPdfsPaged = async (
  params?: ContentCurriculumQueryParams
): Promise<PagedResponse<ContentPdfItem>> => {
  const res = await clientAxios.get("/content/pdfs/getall", {
    params: {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 10,
    },
  })
  return res.data?.data ?? res.data
}

export const deletePdf = async (pdfId: string): Promise<void> => {
  await clientAxios.delete(`/content/pdfs/${pdfId}`)
}

// 2. Quizzes
export const getQuizzesPaged = async (
  params?: ContentCurriculumQueryParams
): Promise<PagedResponse<ContentQuizItem>> => {
  const res = await clientAxios.get("/content/quizzes", {
    params: {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 10,
    },
  })
  return res.data?.data ?? res.data
}

export const deleteQuiz = async (quizId: string): Promise<void> => {
  await clientAxios.delete(`/content/quizzes/${quizId}`)
}

// 3. Videos
export const getVideosPaged = async (
  params?: ContentCurriculumQueryParams
): Promise<PagedResponse<ContentVideoItem>> => {
  const res = await clientAxios.get("/content/videos", {
    params: {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 10,
    },
  })
  return res.data?.data ?? res.data
}

export const deleteVideo = async (videoId: string): Promise<void> => {
  await clientAxios.delete(`/content/videos/${videoId}`)
}

// 4. Chapters
export const getChaptersPaged = async (
  params?: ContentCurriculumQueryParams & { subjectId?: string }
): Promise<PagedResponse<CurriculumChapterItem>> => {
  const res = await clientAxios.get("/curriculum/chapters", {
    params: {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 10,
      ...(params?.subjectId ? { subjectId: params.subjectId } : {}),
    },
  })
  return res.data?.data ?? res.data
}

export const deleteChapter = async (chapterId: string): Promise<void> => {
  await clientAxios.delete(`/curriculum/chapters/${chapterId}`)
}

// 5. Units
export const getUnitsPaged = async (
  params?: ContentCurriculumQueryParams
): Promise<PagedResponse<CurriculumUnitItem>> => {
  const res = await clientAxios.get("/curriculum/units", {
    params: {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 10,
    },
  })
  return res.data?.data ?? res.data
}

export const deleteUnit = async (unitId: string): Promise<void> => {
  await clientAxios.delete(`/curriculum/units/${unitId}`)
}

// 6. Lessons
export const getLessonsPaged = async (
  params?: ContentCurriculumQueryParams
): Promise<PagedResponse<CurriculumLessonItem>> => {
  const res = await clientAxios.get("/curriculum/lessons", {
    params: {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 10,
    },
  })
  return res.data?.data ?? res.data
}

export const deleteLesson = async (lessonId: string): Promise<void> => {
  await clientAxios.delete(`/curriculum/lessons/${lessonId}`)
}

