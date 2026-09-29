import clientAxios from "@/lib/axios/clientAxios"
import {
  AcademicStage,
  EducationSystem,
  Gender,
  Grade,
  CreateReferenceDataPayload,
  UpdateReferenceDataPayload,
  CreateGradePayload,
  UpdateGradePayload,
} from "../types/referenceData.types"

// ==========================================
// Academic Stages
// ==========================================
export const getAcademicStages = async (): Promise<AcademicStage[]> => {
  const res = await clientAxios.get("/reference-data/academic-stages")
  if (Array.isArray(res.data)) return res.data
  if (res.data && Array.isArray(res.data.data)) return res.data.data
  return []
}

export const createAcademicStage = async (
  data: CreateReferenceDataPayload
): Promise<AcademicStage> => {
  const res = await clientAxios.post("/reference-data/academic-stages", data)
  return res.data?.data || res.data
}

export const updateAcademicStage = async (
  id: string,
  data: UpdateReferenceDataPayload
): Promise<AcademicStage> => {
  const res = await clientAxios.put(`/reference-data/academic-stages/${id}`, data)
  return res.data?.data || res.data
}

export const deleteAcademicStage = async (id: string): Promise<void> => {
  await clientAxios.delete(`/reference-data/academic-stages/${id}`)
}

// ==========================================
// Education Systems
// ==========================================
export const getEducationSystems = async (): Promise<EducationSystem[]> => {
  const res = await clientAxios.get("/reference-data/education-systems")
  if (Array.isArray(res.data)) return res.data
  if (res.data && Array.isArray(res.data.data)) return res.data.data
  return []
}

export const createEducationSystem = async (
  data: CreateReferenceDataPayload
): Promise<EducationSystem> => {
  const res = await clientAxios.post("/reference-data/education-systems", data)
  return res.data?.data || res.data
}

export const updateEducationSystem = async (
  id: string,
  data: UpdateReferenceDataPayload
): Promise<EducationSystem> => {
  const res = await clientAxios.put(`/reference-data/education-systems/${id}`, data)
  return res.data?.data || res.data
}

export const deleteEducationSystem = async (id: string): Promise<void> => {
  await clientAxios.delete(`/reference-data/education-systems/${id}`)
}

// ==========================================
// Genders
// ==========================================
export const getGenders = async (): Promise<Gender[]> => {
  const res = await clientAxios.get("/reference-data/genders")
  if (Array.isArray(res.data)) return res.data
  if (res.data && Array.isArray(res.data.data)) return res.data.data
  return []
}

export const createGender = async (
  data: CreateReferenceDataPayload
): Promise<Gender> => {
  const res = await clientAxios.post("/reference-data/genders", data)
  return res.data?.data || res.data
}

export const updateGender = async (
  id: string,
  data: UpdateReferenceDataPayload
): Promise<Gender> => {
  const res = await clientAxios.put(`/reference-data/genders/${id}`, data)
  return res.data?.data || res.data
}

export const deleteGender = async (id: string): Promise<void> => {
  await clientAxios.delete(`/reference-data/genders/${id}`)
}

// ==========================================
// Grades
// ==========================================
export const getGrades = async (academicStageId?: string): Promise<Grade[]> => {
  const res = await clientAxios.get("/reference-data/grades", {
    params: academicStageId ? { academicStageId } : undefined,
  })
  if (Array.isArray(res.data)) return res.data
  if (res.data && Array.isArray(res.data.data)) return res.data.data
  return []
}

export const createGrade = async (data: CreateGradePayload): Promise<Grade> => {
  const res = await clientAxios.post("/reference-data/grades", data)
  return res.data?.data || res.data
}

export const updateGrade = async (
  id: string,
  data: UpdateGradePayload
): Promise<Grade> => {
  const res = await clientAxios.put(`/reference-data/grades/${id}`, data)
  return res.data?.data || res.data
}

export const deleteGrade = async (id: string): Promise<void> => {
  await clientAxios.delete(`/reference-data/grades/${id}`)
}
