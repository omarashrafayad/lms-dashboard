import clientAxios from "@/lib/axios/clientAxios";
import {
  ApiStudent,
  ApiStudentWithProfile,
  CreateStudentPayload,
  UpdateStudentPayload,
  StudentQueryParams,
} from "../types/student.types";
import { BillingStudentFinanceOverview } from "../types/studentProfile.types";
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

export const getStudentById = async (studentId: string): Promise<ApiStudentWithProfile> => {
  const res = await clientAxios.get(`/students/${studentId}/profile`);
  const data = res.data?.data || res.data;

  const profile = data?.profile || {};
  return {
    ...profile,
    ...data,
    id: profile.id || data.id || studentId,
    fullName: profile.fullName || data.fullName || "",
    email: profile.email || data.email || "",
    phoneNumber: profile.phoneNumber || data.phoneNumber || "",
    isActive: profile.isActive ?? data.isActive ?? true,
    gender: profile.gender || data.gender || "",
    educationStage: profile.educationStage || data.educationStage || "",
    grade: profile.grade || data.grade || "",
    educationSystem: profile.educationSystem || data.educationSystem || "",
    dateOfBirth: profile.dateOfBirth || data.dateOfBirth || "",
    status: profile.status || data.status || "Active",
    createdAt: profile.createdAt || data.createdAt || "",
  };
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

export const getStudentFinance = async (
  studentId: string
): Promise<BillingStudentFinanceOverview> => {
  const res = await clientAxios.get(`/billing/students/${studentId}/finance`);
  return res.data?.data || res.data;
};

