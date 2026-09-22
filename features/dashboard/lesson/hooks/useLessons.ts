"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getLessonList,
  getLessonDetailById,
  deleteLessonById,
  createLesson,
  updateLesson,
} from "../api/lessonApi"
import {
  CreateLessonPayload,
  UpdateLessonPayload,
  LessonFilterState,
} from "../types/lesson.types"

export const useLessonList = (
  params: Partial<LessonFilterState> | Record<string, string | undefined> = {}
) => {
  return useQuery({
    queryKey: ["lessons-list", params],
    queryFn: () => getLessonList(params),
  })
}

export const useLessonDetailById = (lessonId: string) => {
  return useQuery({
    queryKey: ["lesson-detail", lessonId],
    queryFn: () => getLessonDetailById(lessonId),
    enabled: !!lessonId,
  })
}

export const useCreateLesson = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateLessonPayload) => createLesson(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons-list"] })
    },
  })
}

export const useUpdateLesson = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      lessonId,
      data,
    }: {
      lessonId: string
      data: UpdateLessonPayload
    }) => updateLesson(lessonId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["lessons-list"] })
      queryClient.invalidateQueries({
        queryKey: ["lesson-detail", variables.lessonId],
      })
    },
  })
}

export const useDeleteLesson = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (lessonId: string) => deleteLessonById(lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons-list"] })
    },
  })
}
