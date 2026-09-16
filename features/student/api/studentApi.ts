import clientAxios from "@/lib/axios/clientAxios";
import { ApiStudent, CreateStudentPayload } from "../types/student.types";

const resolveUrl = (path: string) => {
  const baseURL = clientAxios.defaults.baseURL || "";
  if (baseURL.includes("/api/v1") && path.startsWith("/api/v1")) {
    return path.replace(/^\/api\/v1/, "");
  }
  return path;
};

export const getStudents = async (
  params: { page?: number; limit?: number; search?: string } = {}
): Promise<ApiStudent[]> => {
  const res = await clientAxios.get(resolveUrl("/api/v1/students"), { params });
  if (Array.isArray(res.data)) {
    return res.data;
  }
  if (res.data && Array.isArray(res.data.data)) {
    return res.data.data;
  }
  return [];
};

export const createStudent = async (data: CreateStudentPayload) => {
  const res = await clientAxios.post(resolveUrl("/api/v1/students"), data);
  return res.data;
};

export const getStudentById = async (studentId: string): Promise<ApiStudent> => {
  const res = await clientAxios.get(resolveUrl(`/api/v1/students/${studentId}`));
  return res.data?.data || res.data;
};
