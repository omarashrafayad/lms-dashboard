import clientAxios from "@/lib/axios/clientAxios"
import {
  ApiCourse,
  CreateCoursePayload,
  UpdateCoursePayload,
  CourseQueryParams,
} from "../types/course.types"
import { PaginatedResponse, normalizePaginatedResponse } from "@/types/pagination"

export const getCourses = async (
  params: CourseQueryParams = {}
): Promise<PaginatedResponse<ApiCourse>> => {
  const queryParams: Record<string, any> = {}
  if (params.page !== undefined) queryParams.page = params.page
  if (params.pageSize !== undefined) queryParams.pageSize = params.pageSize
  if (params.search && params.search.trim()) queryParams.search = params.search.trim()
  if (params.category && params.category !== "all") queryParams.category = params.category
  if (params.level && params.level !== "all") queryParams.level = params.level
  if (params.status && params.status !== "all") queryParams.status = params.status

  const res = await clientAxios.get("/curriculum/courses", {
    params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
  })

  return normalizePaginatedResponse<ApiCourse>(res.data, params.page, params.pageSize)
}

export const createCourse = async (
  data: CreateCoursePayload
): Promise<ApiCourse> => {
  const res = await clientAxios.post("/curriculum/courses", data)
  return res.data?.data || res.data?.value || res.data
}

export const getCourseById = async (courseId: string): Promise<ApiCourse> => {
  const res = await clientAxios.get(`/curriculum/courses/${courseId}`)
  return res.data?.data || res.data?.value || res.data
}

export const updateCourse = async (
  courseId: string,
  data: UpdateCoursePayload
): Promise<ApiCourse> => {
  const res = await clientAxios.put(`/curriculum/courses/${courseId}`, data)
  return res.data?.data || res.data?.value || res.data
}

export const deleteCourse = async (courseId: string): Promise<void> => {
  await clientAxios.delete(`/curriculum/courses/${courseId}`)
}

// Backward compatibility aliases
export const getCourseList = getCourses
export const getCourseDetailById = getCourseById
