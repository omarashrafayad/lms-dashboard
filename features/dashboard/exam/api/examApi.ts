import clientAxios from "@/lib/axios/clientAxios"
import {
  ApiExam,
  CreateExamPayload,
  UpdateExamPayload,
  ApiExamQuestion,
  ExamQueryParams,
} from "../types/exam.types"
import { PaginatedResponse, normalizePaginatedResponse } from "@/types/pagination"

export const getExams = async (
  params: ExamQueryParams = {}
): Promise<PaginatedResponse<ApiExam>> => {
  const queryParams: Record<string, any> = {}
  if (params.page !== undefined) queryParams.page = params.page
  if (params.pageSize !== undefined) queryParams.pageSize = params.pageSize
  if (params.search && params.search.trim()) queryParams.search = params.search.trim()
  if (params.examType && params.examType !== "all") queryParams.examType = params.examType
  if (params.level && params.level !== "all") queryParams.level = params.level
  if (params.status && params.status !== "all") queryParams.status = params.status
  if (params.subject && params.subject !== "all") queryParams.subject = params.subject
  if (params.month && params.month !== "all") queryParams.month = params.month
  if (params.academicYear && params.academicYear !== "all") queryParams.academicYear = params.academicYear

  const res = await clientAxios.get("/curriculum/exams", {
    params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
  })

  return normalizePaginatedResponse<ApiExam>(res.data, params.page, params.pageSize)
}

export const getExamById = async (examId: string): Promise<ApiExam> => {
  const res = await clientAxios.get(`/curriculum/exams/${examId}`)
  return res.data?.data || res.data?.value || res.data
}

export const createExam = async (
  data: CreateExamPayload
): Promise<ApiExam> => {
  const res = await clientAxios.post("/curriculum/exams", data)
  return res.data?.data || res.data?.value || res.data
}

export const updateExam = async (
  examId: string,
  data: UpdateExamPayload
): Promise<ApiExam> => {
  const res = await clientAxios.put(`/curriculum/exams/${examId}`, data)
  return res.data?.data || res.data?.value || res.data
}

export const deleteExam = async (examId: string): Promise<void> => {
  await clientAxios.delete(`/curriculum/exams/${examId}`)
}

export const duplicateExamApi = async (examId: string): Promise<ApiExam> => {
  const res = await clientAxios.post(`/curriculum/exams/${examId}/duplicate`)
  return res.data?.data || res.data?.value || res.data
}

export const getExamQuestions = async (
  examId: string
): Promise<ApiExamQuestion[]> => {
  const res = await clientAxios.get(`/curriculum/exams/${examId}/questions`)
  if (Array.isArray(res.data)) {
    return res.data
  }
  if (res.data?.value && Array.isArray(res.data.value)) {
    return res.data.value
  }
  if (res.data?.data && Array.isArray(res.data.data)) {
    return res.data.data
  }
  return []
}
