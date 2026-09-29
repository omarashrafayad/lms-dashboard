"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getAcademicStages,
  createAcademicStage,
  updateAcademicStage,
  deleteAcademicStage,
  getEducationSystems,
  createEducationSystem,
  updateEducationSystem,
  deleteEducationSystem,
  getGenders,
  createGender,
  updateGender,
  deleteGender,
  getGrades,
  createGrade,
  updateGrade,
  deleteGrade,
} from "../api/referenceDataApi"
import {
  CreateReferenceDataPayload,
  UpdateReferenceDataPayload,
  CreateGradePayload,
  UpdateGradePayload,
} from "../types/referenceData.types"

// ==========================================
// Academic Stages Hooks
// ==========================================
export const useAcademicStages = () => {
  return useQuery({
    queryKey: ["reference-data", "academic-stages"],
    queryFn: getAcademicStages,
    staleTime: 1000 * 60 * 10,
  })
}

export const useCreateAcademicStage = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateReferenceDataPayload) => createAcademicStage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reference-data", "academic-stages"],
      })
    },
  })
}

export const useUpdateAcademicStage = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: UpdateReferenceDataPayload
    }) => updateAcademicStage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reference-data", "academic-stages"],
      })
      queryClient.invalidateQueries({
        queryKey: ["reference-data", "grades"],
      })
    },
  })
}

export const useDeleteAcademicStage = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAcademicStage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reference-data", "academic-stages"],
      })
      queryClient.invalidateQueries({
        queryKey: ["reference-data", "grades"],
      })
    },
  })
}

// ==========================================
// Education Systems Hooks
// ==========================================
export const useEducationSystems = () => {
  return useQuery({
    queryKey: ["reference-data", "education-systems"],
    queryFn: getEducationSystems,
    staleTime: 1000 * 60 * 10,
  })
}

export const useCreateEducationSystem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateReferenceDataPayload) => createEducationSystem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reference-data", "education-systems"],
      })
    },
  })
}

export const useUpdateEducationSystem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: UpdateReferenceDataPayload
    }) => updateEducationSystem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reference-data", "education-systems"],
      })
    },
  })
}

export const useDeleteEducationSystem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteEducationSystem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reference-data", "education-systems"],
      })
    },
  })
}

// ==========================================
// Genders Hooks
// ==========================================
export const useGenders = () => {
  return useQuery({
    queryKey: ["reference-data", "genders"],
    queryFn: getGenders,
    staleTime: 1000 * 60 * 10,
  })
}

export const useCreateGender = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateReferenceDataPayload) => createGender(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reference-data", "genders"],
      })
    },
  })
}

export const useUpdateGender = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: UpdateReferenceDataPayload
    }) => updateGender(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reference-data", "genders"],
      })
    },
  })
}

export const useDeleteGender = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteGender(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reference-data", "genders"],
      })
    },
  })
}

// ==========================================
// Grades Hooks
// ==========================================
export const useGrades = (academicStageId?: string) => {
  return useQuery({
    queryKey: ["reference-data", "grades", academicStageId || "all"],
    queryFn: () => getGrades(academicStageId),
    staleTime: 1000 * 60 * 10,
  })
}

export const useCreateGrade = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateGradePayload) => createGrade(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reference-data", "grades"],
      })
    },
  })
}

export const useUpdateGrade = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: UpdateGradePayload
    }) => updateGrade(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reference-data", "grades"],
      })
    },
  })
}

export const useDeleteGrade = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteGrade(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reference-data", "grades"],
      })
    },
  })
}
