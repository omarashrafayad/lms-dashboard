import { AxiosResponse } from "axios";

export interface User {
  _id?: string;
  name: string;
  email: string;
  active: boolean;
  phone: string;
  profileImg: string;
  createdAt: string;
  roles: string[];
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
