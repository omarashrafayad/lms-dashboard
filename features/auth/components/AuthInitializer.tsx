"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { User } from "@/features/auth/types/auth.types";

interface AuthInitializerProps {
  user: User | null;
  token: string | null;
}

export default function AuthInitializer({ user, token }: AuthInitializerProps) {
  const { setAuth, setToken, logout } = useAuthStore();

  useEffect(() => {
    if (user && token) {
      setAuth(user);
      setToken(token);
    } else {
      logout();
    }
  }, [user, token, setAuth, setToken, logout]);

  return null;
}

