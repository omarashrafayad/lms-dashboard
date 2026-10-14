"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getCurriculumSubjects,
  // getCurriculumSubjectById,
  getCurriculumSubjectStructure,
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
  getPdfById,
  updatePdf,
  deletePdf,
  uploadVideo,
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  createQuiz,
  getQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
} from "../api/curriculumApi"
import {
  CreateSubjectPayload,
  CreateChapterPayload,
  CreateUnitPayload,
  CreateLessonPayload,
  CreatePdfPayload,
  UpdatePdfPayload,
  CreateVideoPayload,
  UpdateVideoPayload,
  CreateQuizPayload,
  UpdateQuizPayload,
} from "../types/curriculum.types"

export const useCurriculumSubjects = (
  params: { search?: string; stage?: string; year?: string; system?: string; term?: string } = {}
) => {
  return useQuery({
    queryKey: ["curriculum-subjects", params],
    queryFn: () => getCurriculumSubjects(params),
  })
}

// export const useCurriculumSubject = (subjectId: string) => {
//   return useQuery({
//     queryKey: ["curriculum-subject", subjectId],
//     queryFn: () => getCurriculumSubjectById(subjectId),
//     enabled: !!subjectId,
//   })
// }

export const useCurriculumSubjectStructure = (subjectId: string) => {
  return useQuery({
    queryKey: ["curriculum-subject-structure", subjectId],
    queryFn: () => getCurriculumSubjectStructure(subjectId),
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
      queryClient.invalidateQueries({ queryKey: ["curriculum-subject-structure", variables.id] })
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
      queryClient.invalidateQueries({
        queryKey: ["curriculum-subject-structure", variables.subjectId],
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

export const useCreateUnit = (subjectId?: string) => {
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
      queryClient.invalidateQueries({
        queryKey: ["curriculum-subject-structure"],
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

export const useCreateLesson = (subjectId?: string) => {
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
      queryClient.invalidateQueries({
        queryKey: ["curriculum-subject-structure"],
      })
    },
  })
}

// ======================== PDF Hooks ========================
export const useLessonPdfs = (lessonId?: string) => {
  return useQuery({
    queryKey: ["curriculum-pdfs", lessonId],
    queryFn: () => (lessonId ? getPdfs(lessonId) : Promise.resolve([])),
    enabled: !!lessonId,
  })
}

export const usePdfById = (pdfId?: string) => {
  return useQuery({
    queryKey: ["curriculum-pdf", pdfId],
    queryFn: () => (pdfId ? getPdfById(pdfId) : Promise.resolve(null)),
    enabled: !!pdfId,
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

export const useUpdatePdf = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      pdfId,
      lessonId,
      data,
    }: {
      pdfId: string
      lessonId?: string
      data: UpdatePdfPayload
    }) => updatePdf(pdfId, data),
    onSuccess: (_, variables) => {
      if (variables.lessonId) {
        queryClient.invalidateQueries({
          queryKey: ["curriculum-pdfs", variables.lessonId],
        })
      }
      queryClient.invalidateQueries({
        queryKey: ["curriculum-pdf", variables.pdfId],
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
export const useLessonVideos = (lessonId?: string) => {
  return useQuery({
    queryKey: ["curriculum-videos", lessonId],
    queryFn: () => (lessonId ? getVideos(lessonId) : Promise.resolve([])),
    enabled: !!lessonId,
  })
}

export const useVideoById = (videoId?: string) => {
  return useQuery({
    queryKey: ["curriculum-video", videoId],
    queryFn: () => (videoId ? getVideoById(videoId) : Promise.resolve(null)),
    enabled: !!videoId,
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

export const useUpdateVideo = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      videoId,
      lessonId,
      data,
    }: {
      videoId: string
      lessonId?: string
      data: UpdateVideoPayload
    }) => updateVideo(videoId, data),
    onSuccess: (_, variables) => {
      if (variables.lessonId) {
        queryClient.invalidateQueries({
          queryKey: ["curriculum-videos", variables.lessonId],
        })
      }
      queryClient.invalidateQueries({
        queryKey: ["curriculum-video", variables.videoId],
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
export const useLessonQuizzes = (lessonId?: string) => {
  return useQuery({
    queryKey: ["curriculum-quizzes", lessonId],
    queryFn: () => (lessonId ? getQuizzes(lessonId) : Promise.resolve([])),
    enabled: !!lessonId,
  })
}

export const useQuizById = (quizId?: string) => {
  return useQuery({
    queryKey: ["curriculum-quiz", quizId],
    queryFn: () => (quizId ? getQuizById(quizId) : Promise.resolve(null)),
    enabled: !!quizId,
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

export const useUpdateQuiz = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      quizId,
      lessonId,
      data,
    }: {
      quizId: string
      lessonId?: string
      data: UpdateQuizPayload
    }) => updateQuiz(quizId, data),
    onSuccess: (_, variables) => {
      if (variables.lessonId) {
        queryClient.invalidateQueries({
          queryKey: ["curriculum-quizzes", variables.lessonId],
        })
      }
      queryClient.invalidateQueries({
        queryKey: ["curriculum-quiz", variables.quizId],
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
