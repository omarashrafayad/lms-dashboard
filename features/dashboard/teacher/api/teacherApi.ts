import clientAxios from "@/lib/axios/clientAxios"
import {
  ApiTeacher,
  ApiSubject,
  ApiTeachingLevel,
  TeacherQueryParams,
} from "../types/teacher.types"
import { PaginatedResponse, normalizePaginatedResponse } from "@/types/pagination"

export const getTeachers = async (
  params: TeacherQueryParams = {}
): Promise<PaginatedResponse<ApiTeacher>> => {
  const queryParams: Record<string, any> = {}
  if (params.page !== undefined) queryParams.page = params.page
  if (params.pageSize !== undefined) queryParams.pageSize = params.pageSize
  if (params.search && params.search.trim()) queryParams.search = params.search.trim()
  if (params.subject && params.subject !== "all") queryParams.subject = params.subject
  if (params.status && params.status !== "all") queryParams.status = params.status
  if (params.availability && params.availability !== "all") queryParams.availability = params.availability

  const res = await clientAxios.get("/teachers", {
    params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
  })

  return normalizePaginatedResponse<ApiTeacher>(res.data, params.page, params.pageSize)
}

export const getTeacherById = async (teacherId: string): Promise<ApiTeacher> => {
  const res = await clientAxios.get(`/teachers/${teacherId}`)
  return res.data?.data || res.data
}

export const createTeacher = async (data: FormData): Promise<ApiTeacher> => {
  const res = await clientAxios.post("/teachers", data)
  return res.data?.data || res.data
}

export const updateTeacher = async (
  teacherId: string,
  data: FormData
): Promise<ApiTeacher> => {
  const res = await clientAxios.put(`/teachers/${teacherId}`, data)
  return res.data?.data || res.data
}

export const deleteTeacher = async (teacherId: string): Promise<void> => {
  await clientAxios.delete(`/teachers/${teacherId}`)
}

export const getSubjects = async (): Promise<ApiSubject[]> => {
  const res = await clientAxios.get("/curriculum/subjects")
  if (Array.isArray(res.data)) {
    return res.data
  }
  if (res.data && Array.isArray(res.data.items)) {
    return res.data.items
  }
  if (res.data && Array.isArray(res.data.data)) {
    return res.data.data
  }
  if (res.data && Array.isArray(res.data.value)) {
    return res.data.value
  }
  return []
}

export const getTeachingLevels = async (): Promise<ApiTeachingLevel[]> => {
  const res = await clientAxios.get("/teaching-levels")
  if (Array.isArray(res.data.items)) {
    return res.data.items
  }
  if (res.data && Array.isArray(res.data.items)) {
    return res.data.items
  }
  return []
}
