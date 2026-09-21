"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getLessonList, getLessonDetailById, deleteLessonById } from "../api/lessonApi"

export const useLessonList = (params: Record<string, string | undefined> = {}) => {
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

export const useDeleteLesson = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (lessonId: string) => deleteLessonById(lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons-list"] })
    },
  })
}
