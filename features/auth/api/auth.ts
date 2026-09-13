"use server";
import serverAxios from "@/lib/axios/serverAxios"
import { cookies } from "next/headers";
import { AxiosError } from "axios";
import { AuthActionResult, AuthResponse } from "@/features/auth/types/auth.types";

async function postAuth(
  endpoint: string,
  payload: object
): Promise<AuthActionResult> {
  try {
    const res = await serverAxios.post<AuthResponse>(endpoint, payload);

    const token = res.data.token;
    const role = res.data.data.role;

    if (token) {
      const cookieStore = await cookies();
      cookieStore.set({
        name: "token",
        value: token,
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      if (role) {
        cookieStore.set({
          name: "role",
          value: role,
          httpOnly: true,
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });
      }
    }

    return { success: true, data: res.data };
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    console.error(`${endpoint} error:`, error?.response?.data || error.message);

    return {
      success: false,
      error: error?.response?.data?.message || "Something went wrong",
    };
  }
}

export const signupAction = async (data: {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}) => postAuth("auth/signup", data);


export const loginAction = async (data: { email: string; password: string }) =>
  postAuth("auth/login", data);


export async function getProfile() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token || token === "undefined" || token === "null") {
      return {
        user: null,
        token: null,
      };
    }

    const response = await serverAxios.get("user/getMe");
    return {
      user: response.data?.data || null,
      token,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        return { user: null, token: null };
      }
    }

    return {
      user: null,
      token: null,
    };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  cookieStore.delete("role");
}



