"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getCurriculumSubjects,
  getCurriculumSubjectById,
  createCurriculumSubject,
  updateCurriculumSubject,
  deleteCurriculumSubject,
  getLessonDetail,
  getChapters,
  createChapter,
  getUnits,
  createUnit,
  getLessons,
  createLesson,
  uploadPdf,
  getPdfs,
  deletePdf,
  uploadVideo,
  getVideos,
  deleteVideo,
  createQuiz,
  getQuizzes,
  deleteQuiz,
} from "../api/curriculumApi"
import {
  CreateSubjectPayload,
  CreateChapterPayload,
  CreateUnitPayload,
  CreateLessonPayload,
  CreatePdfPayload,
  CreateVideoPayload,
  CreateQuizPayload,
} from "../types/curriculum.types"

export const useCurriculumSubjects = (
  params: { search?: string; stage?: string; year?: string; system?: string; term?: string } = {}
) => {
  return useQuery({
    queryKey: ["curriculum-subjects", params],
    queryFn: () => getCurriculumSubjects(params),
  })
}

export const useCurriculumSubject = (subjectId: string) => {
  return useQuery({
    queryKey: ["curriculum-subject", subjectId],
    queryFn: () => getCurriculumSubjectById(subjectId),
    enabled: !!subjectId,
  })
}

export const useCreateCurriculumSubject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateSubjectPayload) => createCurriculumSubject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["curriculum-subjects"] })
    },
  })
}

export const useUpdateCurriculumSubject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateSubjectPayload> }) =>
      updateCurriculumSubject(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["curriculum-subjects"] })
      queryClient.invalidateQueries({ queryKey: ["curriculum-subject", variables.id] })
    },
  })
}

export const useDeleteCurriculumSubject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteCurriculumSubject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["curriculum-subjects"] })
    },
  })
}

export const useLessonDetail = (subjectId: string, lessonId: string) => {
  return useQuery({
    queryKey: ["curriculum-lesson", subjectId, lessonId],
    queryFn: () => getLessonDetail(subjectId, lessonId),
    enabled: !!subjectId && !!lessonId,
  })
}

// ======================== Chapters Hooks ========================
export const useChapters = (subjectId: string) => {
  return useQuery({
    queryKey: ["curriculum-chapters", subjectId],
    queryFn: () => getChapters(subjectId),
    enabled: !!subjectId,
  })
}

export const useCreateChapter = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateChapterPayload) => createChapter(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["curriculum-chapters", variables.subjectId],
      })
    },
  })
}

// ======================== Units Hooks ========================
export const useUnits = (chapterId: string) => {
  return useQuery({
    queryKey: ["curriculum-units", chapterId],
    queryFn: () => getUnits(chapterId),
    enabled: !!chapterId,
  })
}

export const useCreateUnit = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateUnitPayload) => createUnit(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["curriculum-units", variables.chapterId],
      })
      queryClient.invalidateQueries({
        queryKey: ["curriculum-chapters"],
      })
    },
  })
}

// ======================== Lessons Hooks ========================
export const useLessons = (unitId: string) => {
  return useQuery({
    queryKey: ["curriculum-lessons", unitId],
    queryFn: () => getLessons(unitId),
    enabled: !!unitId,
  })
}

export const useCreateLesson = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateLessonPayload) => createLesson(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["curriculum-lessons", variables.unitId],
      })
      queryClient.invalidateQueries({
        queryKey: ["curriculum-units"],
      })
    },
  })
}

// ======================== PDF Hooks ========================
export const useLessonPdfs = (lessonId: string) => {
  return useQuery({
    queryKey: ["curriculum-pdfs", lessonId],
    queryFn: () => getPdfs(lessonId),
    enabled: !!lessonId,
  })
}

export const useUploadPdf = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePdfPayload) => uploadPdf(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["curriculum-pdfs", variables.lessonId],
      })
      queryClient.invalidateQueries({
        queryKey: ["curriculum-lesson"],
      })
    },
  })
}

export const useDeletePdf = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ pdfId, lessonId }: { pdfId: string; lessonId: string }) =>
      deletePdf(pdfId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["curriculum-pdfs", variables.lessonId],
      })
      queryClient.invalidateQueries({
        queryKey: ["curriculum-lesson"],
      })
    },
  })
}

// ======================== Video Hooks ========================
export const useLessonVideos = (lessonId: string) => {
  return useQuery({
    queryKey: ["curriculum-videos", lessonId],
    queryFn: () => getVideos(lessonId),
    enabled: !!lessonId,
  })
}

export const useUploadVideo = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateVideoPayload) => uploadVideo(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["curriculum-videos", variables.lessonId],
      })
      queryClient.invalidateQueries({
        queryKey: ["curriculum-lesson"],
      })
    },
  })
}

export const useDeleteVideo = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ videoId, lessonId }: { videoId: string; lessonId: string }) =>
      deleteVideo(videoId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["curriculum-videos", variables.lessonId],
      })
      queryClient.invalidateQueries({
        queryKey: ["curriculum-lesson"],
      })
    },
  })
}

// ======================== Quiz Hooks ========================
export const useLessonQuizzes = (lessonId: string) => {
  return useQuery({
    queryKey: ["curriculum-quizzes", lessonId],
    queryFn: () => getQuizzes(lessonId),
    enabled: !!lessonId,
  })
}

export const useCreateQuiz = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateQuizPayload) => createQuiz(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["curriculum-quizzes", variables.request.lessonId],
      })
      queryClient.invalidateQueries({
        queryKey: ["curriculum-lesson"],
      })
    },
  })
}

export const useDeleteQuiz = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ quizId, lessonId }: { quizId: string; lessonId: string }) =>
      deleteQuiz(quizId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["curriculum-quizzes", variables.lessonId],
      })
      queryClient.invalidateQueries({
        queryKey: ["curriculum-lesson"],
      })
    },
  })
}
