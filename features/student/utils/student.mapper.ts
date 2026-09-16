import { ApiStudent, Student } from "../types/student.types";

const AVATAR_COLORS = [
  "bg-sky-100 text-sky-700",
  "bg-purple-100 text-purple-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-rose-100 text-rose-700",
  "bg-indigo-100 text-indigo-700",
];

export function mapApiStudentToStudent(apiStudent: ApiStudent, index = 0): Student {
  const initials = (apiStudent.fullName || "S")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");

  const colorClass = AVATAR_COLORS[index % AVATAR_COLORS.length];

  let lastActivity = "Recently";
  if (apiStudent.createdAt) {
    try {
      const date = new Date(apiStudent.createdAt);
      if (!isNaN(date.getTime())) {
        lastActivity = date.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        });
      }
    } catch {
      lastActivity = "Recently";
    }
  }

  return {
    id: apiStudent.id,
    name: apiStudent.fullName || "Unnamed Student",
    code: `STD-${apiStudent.id.slice(0, 5).toUpperCase()}`,
    email: apiStudent.email,
    phone: apiStudent.phoneNumber || "—",
    stage: apiStudent.educationStage || "—",
    grade: apiStudent.grade || "—",
    system: apiStudent.educationSystem || "—",
    progress: 75,
    averageScore: 85,
    status: apiStudent.isActive ? "Active" : "Inactive",
    lastActivity,
    avatarInitials: initials || "ST",
    avatarColorClass: colorClass,
  };
}
