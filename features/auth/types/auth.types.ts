import { AxiosResponse } from "axios";

export type RoleType = "admin" | "teacher" | "student" | "instructor" | "Instructor" | string;

export const isInstructorRole = (role?: string | null): boolean => {
  if (!role) return false;
  const r = role.toLowerCase().trim();
  return r === "instructor" || r === "teacher";
};

export const isStudentRole = (role?: string | null): boolean => {
  if (!role) return false;
  const r = role.toLowerCase().trim();
  return r === "student";
};

export interface User {
  id?: string;
  _id?: string;
  fullName: string;
  email: string;
  active: boolean;
  phone: string;
  profileImg: string;
  createdAt: string;
  roles: string[];
  role?: RoleType;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface AuthActionResult {
  success: boolean;
  data?: AuthResponse;
  error?: string;
  message?: string;
  response?: AxiosResponse;
}
