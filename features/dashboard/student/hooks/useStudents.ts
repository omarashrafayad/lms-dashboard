"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../api/studentApi";
import { CreateStudentPayload, UpdateStudentPayload } from "../types/student.types";

export const useStudents = (
  params: { page?: number; limit?: number; search?: string } = {},
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["students", params],
    queryFn: () => getStudents(params),
    ...options,
  });
};

export const useStudent = (studentId: string) => {
  return useQuery({
    queryKey: ["student", studentId],
    queryFn: () => getStudentById(studentId),
    enabled: !!studentId,
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
