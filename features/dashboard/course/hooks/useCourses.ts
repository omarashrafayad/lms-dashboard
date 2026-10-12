"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../api/courseApi"
import {
  CreateCoursePayload,
  UpdateCoursePayload,
} from "../types/course.types"

export const useCourses = (
  params: { page?: number; limit?: number; search?: string } = {},
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["courses", params],
    queryFn: () => getCourses(params),
    ...options,
  })
}

export const useCourse = (courseId: string) => {
  return useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getCourseById(courseId),
    enabled: !!courseId,
  })
}

export const useCourseDetail = useCourse

export const useCreateCourse = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateCoursePayload) => createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] })
    },
  })
}

export const useUpdateCourse = (defaultCourseId?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      courseId,
      data,
    }: {
      courseId?: string
      data: UpdateCoursePayload
    }) => {
      const id = courseId || defaultCourseId
      if (!id) throw new Error("Course ID is required for update")
      return updateCourse(id, data)
    },
    onSuccess: (_, variables) => {
      const id = variables.courseId || defaultCourseId
      queryClient.invalidateQueries({ queryKey: ["courses"] })
      if (id) {
        queryClient.invalidateQueries({ queryKey: ["course", id] })
      }
    },
  })
}

export const useDeleteCourse = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (courseId: string) => deleteCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] })
    },
  })
}
