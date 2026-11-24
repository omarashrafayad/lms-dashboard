"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentFinance,
  getMyStudentProfile,
  getMyStudentFinance,
} from "../api/studentApi";
import {
  CreateStudentPayload,
  UpdateStudentPayload,
  StudentQueryParams,
} from "../types/student.types";

export const useStudents = (
  params: StudentQueryParams = {},
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["students", params],
    queryFn: () => getStudents(params),
    ...options,
  });
};

export const useStudent = (
  studentId: string,
  options?: { enabled?: boolean; retry?: boolean | number } & Record<string, any>
) => {
  return useQuery({
    queryKey: ["student", studentId],
    queryFn: () => getStudentById(studentId),
    enabled: options?.enabled !== undefined ? options.enabled && !!studentId : !!studentId,
    ...options,
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStudentPayload) => createStudent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      studentId,
      data,
    }: {
      studentId: string;
      data: UpdateStudentPayload | FormData;
    }) => updateStudent(studentId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student", variables.studentId] });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (studentId: string) => deleteStudent(studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};

export const useStudentFinance = (
  studentId: string,
  options?: { enabled?: boolean; retry?: boolean | number } & Record<string, any>
) => {
  return useQuery({
    queryKey: ["student-finance", studentId],
    queryFn: () => getStudentFinance(studentId),
    enabled: options?.enabled !== undefined ? options.enabled && !!studentId : !!studentId,
    ...options,
  });
};

export const useMyStudentProfile = (
  options?: { enabled?: boolean; retry?: boolean | number } & Record<string, any>
) => {
  return useQuery({
    queryKey: ["student", "me"],
    queryFn: () => getMyStudentProfile(),
    ...options,
  });
};

export const useMyStudentFinance = (
  options?: { enabled?: boolean; retry?: boolean | number } & Record<string, any>
) => {
  return useQuery({
    queryKey: ["student-finance", "me"],
    queryFn: () => getMyStudentFinance(),
    ...options,
  });
};

