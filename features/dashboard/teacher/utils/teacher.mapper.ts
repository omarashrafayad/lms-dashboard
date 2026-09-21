import { ApiTeacher, Teacher, TeacherAvailabilityStatus } from "../types/teacher.types"

const AVATAR_COLORS = [
  "bg-amber-100 text-amber-700",
  "bg-sky-100 text-sky-700",
  "bg-emerald-100 text-emerald-700",
  "bg-purple-100 text-purple-700",
  "bg-rose-100 text-rose-700",
  "bg-indigo-100 text-indigo-700",
]

export function mapApiTeacherToTeacher(apiTeacher: ApiTeacher, index = 0): Teacher {
  const initials = (apiTeacher.fullName || "T")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("")

  const colorClass = AVATAR_COLORS[index % AVATAR_COLORS.length]

  let lastActive = "Recently"
  if (apiTeacher.createdAt) {
    try {
      const date = new Date(apiTeacher.createdAt)
      if (!isNaN(date.getTime())) {
        lastActive = date.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        })
      }
    } catch {
      lastActive = "Recently"
    }
  }

  // Extract unique subjects from specializations
  const subjectSet = new Set<string>()
  if (apiTeacher.specializations && Array.isArray(apiTeacher.specializations)) {
    apiTeacher.specializations.forEach((s) => {
      if (s.subjectName) subjectSet.add(s.subjectName)
    })
  }
  const subjects = Array.from(subjectSet)

  let availability: TeacherAvailabilityStatus = "Available"
  if (apiTeacher.isAvailable === false) {
    availability = "Unavailable"
  } else if (!apiTeacher.isActive) {
    availability = "Offline"
  }

  const upcomingSessions = apiTeacher.availabilitySlots?.length ?? 0

  return {
    id: apiTeacher.id,
    name: apiTeacher.fullName || "Unnamed Teacher",
    code: `TCH-${apiTeacher.id.slice(0, 5).toUpperCase()}`,
    avatarInitials: initials || "TC",
    avatarColorClass: colorClass,
    email: apiTeacher.email || "—",
    phone: apiTeacher.phoneNumber || "—",
    subjects: subjects.length > 0 ? subjects : ["General"],
    availability,
    upcomingSessions,
    status: apiTeacher.isActive ? "Active" : "Inactive",
    lastActive,
  }
}
