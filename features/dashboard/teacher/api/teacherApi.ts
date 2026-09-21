import clientAxios from "@/lib/axios/clientAxios"
import {
  ApiTeacher,
  ApiSubject,
  ApiTeachingLevel,
} from "../types/teacher.types"

export const getTeachers = async (
  params: { search?: string } = {}
): Promise<ApiTeacher[]> => {
  const res = await clientAxios.get("/teachers", { params })
  if (Array.isArray(res.data)) {
    return res.data
  }
  if (res.data && Array.isArray(res.data.data)) {
    return res.data.data
  }
  return []
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
  const res = await clientAxios.get("/subjects")
  if (Array.isArray(res.data)) {
    return res.data
  }
  if (res.data && Array.isArray(res.data.data)) {
    return res.data.data
  }
  return []
}

export const getTeachingLevels = async (): Promise<ApiTeachingLevel[]> => {
  const res = await clientAxios.get("/teaching-levels")
  if (Array.isArray(res.data)) {
    return res.data
  }
  if (res.data && Array.isArray(res.data.data)) {
    return res.data.data
  }
  return []
}
