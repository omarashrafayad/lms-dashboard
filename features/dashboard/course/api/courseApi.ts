import clientAxios from "@/lib/axios/clientAxios"
import {
  ApiCourse,
  CreateCoursePayload,
  UpdateCoursePayload,
} from "../types/course.types"

export const getCourses = async (
  params: { page?: number; limit?: number; search?: string } = {}
): Promise<ApiCourse[]> => {
  const queryParams: Record<string, any> = {}
  if (params.page !== undefined) queryParams.page = params.page
  if (params.limit !== undefined) queryParams.limit = params.limit
  if (params.search && params.search.trim()) queryParams.search = params.search.trim()

  const res = await clientAxios.get("/curriculum/courses", {
    params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
  })
  if (Array.isArray(res.data)) {
    return res.data
  }
  if (res.data && Array.isArray(res.data.data)) {
    return res.data.data
  }
  if (res.data && Array.isArray(res.data.value)) {
    return res.data.value
  }
  return []
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
