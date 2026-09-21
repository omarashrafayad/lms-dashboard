"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getCurriculumSubjects,
  getCurriculumSubjectById,
  createCurriculumSubject,
  updateCurriculumSubject,
  deleteCurriculumSubject,
  getLessonDetail,
} from "../api/curriculumApi"
import { CreateSubjectPayload } from "../types/curriculum.types"

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
