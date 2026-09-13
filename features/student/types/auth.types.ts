import { AxiosResponse } from "axios";

export interface User {
  _id?: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  phone: string;
  profileImg: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  data: User;
}

export interface AuthActionResult {
  success: boolean;
  data?: AuthResponse;
  error?: string;
  message?: string;
  response?: AxiosResponse;
}
