import { ApiParent, Parent } from "../types/parent.types"

const AVATAR_COLORS = [
  "bg-amber-100 text-amber-700",
  "bg-purple-100 text-purple-700",
  "bg-sky-100 text-sky-700",
  "bg-emerald-100 text-emerald-700",
  "bg-rose-100 text-rose-700",
  "bg-indigo-100 text-indigo-700",
]

export function mapApiParentToParent(apiParent: ApiParent, index = 0): Parent {
  const name =
    apiParent.fullName ||
    [apiParent.firstName, apiParent.lastName].filter(Boolean).join(" ") ||
    "Unnamed Parent"

  const initials =
    [apiParent.firstName?.[0], apiParent.lastName?.[0]]
      .filter(Boolean)
      .join("")
      .toUpperCase() ||
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join("") ||
    "PR"

  const colorClass = AVATAR_COLORS[index % AVATAR_COLORS.length]

  let registeredDate = "Recently"
  if (apiParent.createdAt) {
    try {
      const date = new Date(apiParent.createdAt)
      if (!isNaN(date.getTime())) {
        registeredDate = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      }
    } catch {
      registeredDate = "Recently"
    }
  }

  const linkedStudents = Array.isArray(apiParent.linkedStudents)
    ? apiParent.linkedStudents
    : []

  const childrenNames = linkedStudents.map(
    (s) => s.fullName || s.name || "Student"
  )

  return {
    id: apiParent.id,
    name,
    avatarInitials: initials,
    avatarColorClass: colorClass,
    email: apiParent.email,
    phone: apiParent.phoneNumber || "—",
    childrenCount: linkedStudents.length,
    childrenNames,
    activeSubscriptions: 0,
    status: apiParent.isActive ? "Active" : "Inactive",
    registeredDate,
  }
}
