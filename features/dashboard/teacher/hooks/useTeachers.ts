"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getSubjects,
  getTeachingLevels,
} from "../api/teacherApi"

export const useTeachers = (params: { search?: string } = {}) => {
  return useQuery({
    queryKey: ["teachers", params],
    queryFn: () => getTeachers(params),
  })
}

export const useTeacher = (teacherId: string) => {
  return useQuery({
    queryKey: ["teacher", teacherId],
    queryFn: () => getTeacherById(teacherId),
    enabled: !!teacherId,
  })
}

export const useCreateTeacher = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: FormData) => createTeacher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] })
    },
  })
}

export const useUpdateTeacher = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      teacherId,
      data,
    }: {
      teacherId: string
      data: FormData
    }) => updateTeacher(teacherId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] })
      queryClient.invalidateQueries({ queryKey: ["teacher", variables.teacherId] })
    },
  })
}

export const useDeleteTeacher = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (teacherId: string) => deleteTeacher(teacherId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] })
    },
  })
}

export const useTeacherSubjects = () => {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: () => getSubjects(),
    staleTime: 5 * 60 * 1000,
  })
}

export const useTeacherLevels = () => {
  return useQuery({
    queryKey: ["teaching-levels"],
    queryFn: () => getTeachingLevels(),
    staleTime: 5 * 60 * 1000,
  })
}
