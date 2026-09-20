"use client"

import { useQuery } from "@tanstack/react-query"
import {
  getAcademicStages,
  getEducationSystems,
  getGenders,
  getGrades,
} from "../api/referenceDataApi"

export const useGenders = () => {
  return useQuery({
    queryKey: ["reference-data", "genders"],
    queryFn: getGenders,
    staleTime: 1000 * 60 * 30, // 30 minutes cache
  })
}

export const useEducationSystems = () => {
  return useQuery({
    queryKey: ["reference-data", "education-systems"],
    queryFn: getEducationSystems,
    staleTime: 1000 * 60 * 30,
  })
}

export const useAcademicStages = () => {
  return useQuery({
    queryKey: ["reference-data", "academic-stages"],
    queryFn: getAcademicStages,
    staleTime: 1000 * 60 * 30,
  })
}

export const useGrades = (academicStageId?: string) => {
  return useQuery({
    queryKey: ["reference-data", "grades", academicStageId],
    queryFn: () => getGrades(academicStageId),
    enabled: !!academicStageId,
    staleTime: 1000 * 60 * 30,
  })
}
