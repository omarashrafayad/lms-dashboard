import clientAxios from "@/lib/axios/clientAxios"
import {
  AcademicStage,
  EducationSystem,
  Gender,
  Grade,
} from "../types/referenceData.types"

export const getGenders = async (): Promise<Gender[]> => {
  const res = await clientAxios.get("/reference-data/genders")
  if (Array.isArray(res.data)) return res.data
  if (res.data && Array.isArray(res.data.data)) return res.data.data
  return []
}

export const getEducationSystems = async (): Promise<EducationSystem[]> => {
  const res = await clientAxios.get(
    "/reference-data/education-systems"
  )
  if (Array.isArray(res.data)) return res.data
  if (res.data && Array.isArray(res.data.data)) return res.data.data
  return []
}

export const getAcademicStages = async (): Promise<AcademicStage[]> => {
  const res = await clientAxios.get(
    "/reference-data/academic-stages"
  )
  if (Array.isArray(res.data)) return res.data
  if (res.data && Array.isArray(res.data.data)) return res.data.data
  return []
}

export const getGrades = async (academicStageId?: string): Promise<Grade[]> => {
  const res = await clientAxios.get(
    "/reference-data/grades",
    {
      params: academicStageId ? { academicStageId } : undefined,
    }
  )
  if (Array.isArray(res.data)) return res.data
  if (res.data && Array.isArray(res.data.data)) return res.data.data
  return []
}
