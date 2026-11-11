"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getPdfsPaged,
  deletePdf,
  getQuizzesPaged,
  deleteQuiz,
  getVideosPaged,
  deleteVideo,
  getChaptersPaged,
  deleteChapter,
  getUnitsPaged,
  deleteUnit,
  getLessonsPaged,
  deleteLesson,
} from "../api/contentCurriculumApi"
import { ContentCurriculumQueryParams } from "../types/contentCurriculum.types"

// 1. PDFs
export const usePdfs = (params?: ContentCurriculumQueryParams) => {
  return useQuery({
    queryKey: ["content-pdfs", params?.page, params?.pageSize],
    queryFn: () => getPdfsPaged(params),
  })
}

export const useDeletePdf = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (pdfId: string) => deletePdf(pdfId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content-pdfs"] })
    },
  })
}

// 2. Quizzes
export const useQuizzes = (params?: ContentCurriculumQueryParams) => {
  return useQuery({
    queryKey: ["content-quizzes", params?.page, params?.pageSize],
    queryFn: () => getQuizzesPaged(params),
  })
}

export const useDeleteQuiz = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (quizId: string) => deleteQuiz(quizId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content-quizzes"] })
    },
  })
}

// 3. Videos
export const useVideos = (params?: ContentCurriculumQueryParams) => {
  return useQuery({
    queryKey: ["content-videos", params?.page, params?.pageSize],
    queryFn: () => getVideosPaged(params),
  })
}

export const useDeleteVideo = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (videoId: string) => deleteVideo(videoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content-videos"] })
    },
  })
}

// 4. Chapters
export const useChapters = (
  params?: ContentCurriculumQueryParams & { subjectId?: string }
) => {
  return useQuery({
    queryKey: ["curriculum-chapters", params?.page, params?.pageSize, params?.subjectId],
    queryFn: () => getChaptersPaged(params),
  })
}

export const useDeleteChapter = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (chapterId: string) => deleteChapter(chapterId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["curriculum-chapters"] })
    },
  })
}

// 5. Units
export const useUnits = (params?: ContentCurriculumQueryParams) => {
  return useQuery({
    queryKey: ["curriculum-units", params?.page, params?.pageSize],
    queryFn: () => getUnitsPaged(params),
  })
}

export const useDeleteUnit = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (unitId: string) => deleteUnit(unitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["curriculum-units"] })
    },
  })
}

// 6. Lessons
export const useLessons = (params?: ContentCurriculumQueryParams) => {
  return useQuery({
    queryKey: ["curriculum-lessons", params?.page, params?.pageSize],
    queryFn: () => getLessonsPaged(params),
  })
}

export const useDeleteLesson = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (lessonId: string) => deleteLesson(lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["curriculum-lessons"] })
      queryClient.invalidateQueries({ queryKey: ["lessons-list"] })
    },
  })
}

