"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStudents, getStudentById, createStudent } from "../api/studentApi";
import { CreateStudentPayload } from "../types/student.types";

export const useStudents = (
  params: { page?: number; limit?: number; search?: string } = {}
) => {
  return useQuery({
    queryKey: ["students", params],
    queryFn: () => getStudents(params),
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
