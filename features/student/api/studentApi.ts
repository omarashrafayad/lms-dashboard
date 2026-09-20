import clientAxios from "@/lib/axios/clientAxios";
import { ApiStudent, CreateStudentPayload } from "../types/student.types";


export const getStudents = async (
  params: { page?: number; limit?: number; search?: string } = {}
): Promise<ApiStudent[]> => {
  const res = await clientAxios.get("/students", { params });
  if (Array.isArray(res.data)) {
    return res.data;
  }
  if (res.data && Array.isArray(res.data.data)) {
    return res.data.data;
  }
  return [];
};

export const createStudent = async (data: CreateStudentPayload) => {
  const res = await clientAxios.post("/students", data);
  return res.data;
};

export const getStudentById = async (studentId: string): Promise<ApiStudent> => {
  const res = await clientAxios.get(`/students/${studentId}`);
  return res.data?.data || res.data;
};
