import clientAxios from "@/lib/axios/clientAxios";
import {
  ApiStudent,
  CreateStudentPayload,
  UpdateStudentPayload,
  StudentQueryParams,
} from "../types/student.types";
import { PaginatedResponse, normalizePaginatedResponse } from "@/types/pagination";

export const getStudents = async (
  params: StudentQueryParams = {}
): Promise<PaginatedResponse<ApiStudent>> => {
  const queryParams: Record<string, any> = {};
  if (params.page !== undefined) queryParams.page = params.page;
  if (params.pageSize !== undefined) queryParams.pageSize = params.pageSize;
  if (params.search && params.search.trim()) queryParams.search = params.search.trim();
  if (params.stage && params.stage !== "all") queryParams.stage = params.stage;
  if (params.grade && params.grade !== "all") queryParams.grade = params.grade;
  if (params.system && params.system !== "all") queryParams.system = params.system;
  if (params.status && params.status !== "all") queryParams.status = params.status;

  const res = await clientAxios.get("/students", {
    params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
  });

  return normalizePaginatedResponse<ApiStudent>(res.data, params.page, params.pageSize);
};

export const createStudent = async (data: CreateStudentPayload) => {
  const res = await clientAxios.post("/students", data);
  return res.data;
};

export const getStudentById = async (studentId: string): Promise<ApiStudent> => {
  const res = await clientAxios.get(`/students/${studentId}`);
  return res.data?.data || res.data;
};

export const updateStudent = async (
  studentId: string,
  data: UpdateStudentPayload | FormData
): Promise<ApiStudent> => {
  const res = await clientAxios.put(`/students/${studentId}`, data);
  return res.data?.data || res.data;
};

export const deleteStudent = async (studentId: string): Promise<void> => {
  await clientAxios.delete(`/students/${studentId}`);
};
