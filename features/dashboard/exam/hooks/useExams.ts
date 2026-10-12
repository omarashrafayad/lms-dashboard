"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  duplicateExamApi,
  getExamQuestions,
} from "../api/examApi"
import { CreateExamPayload, UpdateExamPayload } from "../types/exam.types"

export const useExams = (
  params: {
    page?: number
    pageSize?: number
    search?: string
    examType?: string
    level?: string
    status?: string
    subject?: string
    month?: string
    academicYear?: string
  } = {},
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["exams", params],
    queryFn: () => getExams(params),
    ...options,
  })
}

export const useExam = (examId: string) => {
  return useQuery({
    queryKey: ["exam", examId],
    queryFn: () => getExamById(examId),
    enabled: !!examId,
  })
}

export const useCreateExam = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateExamPayload) => createExam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] })
    },
  })
}

export const useUpdateExam = (defaultExamId?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      examId,
      data,
    }: {
      examId?: string
      data: UpdateExamPayload
    }) => {
      const id = examId || defaultExamId
      if (!id) throw new Error("Exam ID is required for update")
      return updateExam(id, data)
    },
    onSuccess: (_, variables) => {
      const id = variables.examId || defaultExamId
      queryClient.invalidateQueries({ queryKey: ["exams"] })
      if (id) {
        queryClient.invalidateQueries({ queryKey: ["exam", id] })
      }
    },
  })
}

export const useDeleteExam = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (examId: string) => deleteExam(examId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] })
    },
  })
}

export const useDuplicateExam = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (examId: string) => duplicateExamApi(examId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] })
    },
  })
}

export const useExamQuestions = (examId: string) => {
  return useQuery({
    queryKey: ["exam-questions", examId],
    queryFn: () => getExamQuestions(examId),
    enabled: !!examId,
  })
}
