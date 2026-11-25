import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, RoleType, isInstructorRole, isStudentRole } from "@/features/auth/types/auth.types";

export interface DemoProfile {
  student: User;
  teacher: User;
  instructor: User;
  admin: User;
}

const INSTRUCTOR_PROFILE: User = {
  id: "tch-55102",
  _id: "tch-55102",
  fullName: "Dr. Tarek El-Sayed",
  email: "tarek.elsayed@lms-edu.com",
  active: true,
  phone: "+20 109 876 5432",
  profileImg: "/dina-farouk.jpg",
  createdAt: "2024-08-15T09:30:00.000Z",
  roles: ["Instructor"],
  role: "Instructor",
};

export const DEMO_PROFILES: DemoProfile = {
  student: {
    id: "stu-88241",
    _id: "stu-88241",
    fullName: "Ahmed Mansour",
    email: "ahmed.mansour@student.edu",
    active: true,
    phone: "+20 101 234 5678",
    profileImg: "/dina-farouk.jpg",
    createdAt: "2025-09-01T08:00:00.000Z",
    roles: ["student"],
    role: "student",
  },
  teacher: INSTRUCTOR_PROFILE,
  instructor: INSTRUCTOR_PROFILE,
  admin: {
    id: "adm-00101",
    _id: "adm-00101",
    fullName: "Dina Farouk",
    email: "dina.farouk@lms-admin.com",
    active: true,
    phone: "+20 100 000 1122",
    profileImg: "/dina-farouk.jpg",
    createdAt: "2024-01-01T00:00:00.000Z",
    roles: ["admin"],
    role: "admin",
  },
};

interface AuthState {
  user: User | null;
  token: string | null;
  role: RoleType;
  setAuth: (user: User | null) => void;
  setToken: (token: string) => void;
  setRole: (role: RoleType) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: DEMO_PROFILES.student,
      token: "demo-jwt-token",
      role: "student",
      setAuth: (user: User | null) => {
        let detectedRole: RoleType = "admin";
        const rawRole = (user?.role || "").toLowerCase().trim();
        const rawRoles = (user?.roles || []).map((r) => String(r).toLowerCase().trim());

        if (
          rawRole.includes("instructor") ||
          rawRole.includes("teacher") ||
          rawRoles.some((r) => r.includes("instructor") || r.includes("teacher"))
        ) {
          detectedRole = "Instructor";
        } else if (rawRole.includes("student") || rawRoles.some((r) => r.includes("student"))) {
          detectedRole = "student";
        } else if (rawRole.includes("admin") || rawRoles.some((r) => r.includes("admin"))) {
          detectedRole = "admin";
        }
        set({ user, role: detectedRole });
      },
      setToken: (token: string) => set({ token }),
      setRole: (newRole: RoleType) => {
        const key = newRole.toLowerCase() as keyof DemoProfile;
        const profile = DEMO_PROFILES[key] || {
          fullName: isInstructorRole(newRole)
            ? "Dr. Tarek El-Sayed"
            : isStudentRole(newRole)
            ? "Ahmed Mansour"
            : "Dina Farouk",
          email: `${newRole}@lms.com`,
          active: true,
          phone: "+20 100 000 0000",
          profileImg: "/dina-farouk.jpg",
          createdAt: new Date().toISOString(),
          roles: [newRole],
          role: newRole,
        };
        set({ role: newRole, user: profile });
      },
      logout: () => set({ user: null, token: null, role: "admin" }),
    }),
    {
      name: "user",
      partialize: (state) => ({ user: state.user, role: state.role }),
    }
  )
);
