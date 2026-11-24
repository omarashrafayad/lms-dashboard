import { AppPermission, CheckPermissionOptions } from "./permissions"

export interface RoutePermissionRule {
  /** Path prefix or exact path matcher (supports regex or prefix) */
  pathPrefix: string
  /** Permission options to evaluate */
  requirement: CheckPermissionOptions
  /** User-friendly module title for error display */
  title: string
}

/**
 * Route protection rules.
 * Sorted by specificity: more specific nested routes (e.g. `/student/add`) must precede parent paths (`/student`).
 */
export const ROUTE_PERMISSION_RULES: RoutePermissionRule[] = [
  // Students
  {
    pathPrefix: "/student/add",
    requirement: { anyPermissions: ["identity.student.create", "identity.user.create"] },
    title: "Add Student",
  },
  {
    pathPrefix: "/student",
    requirement: { anyPermissions: ["identity.student.view", "identity.user.view"] },
    title: "Students",
  },

  // Teachers
  {
    pathPrefix: "/teacher/add",
    requirement: { anyPermissions: ["identity.teacher.create", "identity.user.create"] },
    title: "Add Teacher",
  },
  {
    pathPrefix: "/teacher/dues",
    requirement: { anyPermissions: ["identity.teacher.view", "billing.payment.view"] },
    title: "Teacher Dues",
  },
  {
    pathPrefix: "/teacher",
    requirement: { anyPermissions: ["identity.teacher.view", "identity.user.view"] },
    title: "Teachers",
  },

  // Parents
  {
    pathPrefix: "/parent/add",
    requirement: { anyPermissions: ["identity.parent.create", "identity.user.create"] },
    title: "Add Parent",
  },
  {
    pathPrefix: "/parent",
    requirement: { anyPermissions: ["identity.parent.view", "identity.user.view"] },
    title: "Parents",
  },
  {
    pathPrefix: "/parents",
    requirement: { anyPermissions: ["identity.parent.view", "identity.user.view"] },
    title: "Parents",
  },

  // Curriculum & Academic
  {
    pathPrefix: "/curriculum/chapters",
    requirement: { permission: "curriculum.chapter.view" },
    title: "Chapters",
  },
  {
    pathPrefix: "/curriculum/units",
    requirement: { permission: "curriculum.unit.view" },
    title: "Units",
  },
  {
    pathPrefix: "/curriculum/lessons",
    requirement: { permission: "curriculum.lesson.view" },
    title: "Lessons",
  },
  {
    pathPrefix: "/curriculum",
    requirement: { permission: "curriculum.subject.view" },
    title: "Curriculum Subjects",
  },
  {
    pathPrefix: "/courses",
    requirement: { permission: "curriculum.course.view" },
    title: "Courses",
  },
  {
    pathPrefix: "/academic/courses",
    requirement: { permission: "curriculum.course.view" },
    title: "Courses",
  },
  {
    pathPrefix: "/academic/exams",
    requirement: { permission: "curriculum.exam.view" },
    title: "Exams",
  },
  {
    pathPrefix: "/exams",
    requirement: { permission: "curriculum.exam.view" },
    title: "Exams",
  },

  // Reference Data
  {
    pathPrefix: "/reference-data",
    requirement: { permission: "curriculum.reference.view" },
    title: "Reference Data",
  },

  // Sessions & Bookings
  {
    pathPrefix: "/sessions/schedule",
    requirement: { permission: "curriculum.session.create" },
    title: "Schedule Session",
  },
  {
    pathPrefix: "/sessions",
    requirement: { permission: "curriculum.session.view" },
    title: "Sessions & Bookings",
  },

  // Subscriptions & Billing
  {
    pathPrefix: "/subscriptions/plans",
    requirement: { permission: "billing.plan.view" },
    title: "Subscription Plans",
  },
  {
    pathPrefix: "/subscriptions/transactions",
    requirement: { permission: "billing.payment.view" },
    title: "Transactions",
  },
  {
    pathPrefix: "/subscriptions",
    requirement: { permission: "billing.subscription.view" },
    title: "Subscriptions",
  },

  // Content
  {
    pathPrefix: "/content/videos",
    requirement: { permission: "content.video.view" },
    title: "Video Content",
  },
  {
    pathPrefix: "/content/pdfs",
    requirement: { permission: "content.pdf.view" },
    title: "PDFs & Books",
  },
  {
    pathPrefix: "/content/quizzes",
    requirement: { permission: "content.quiz.view" },
    title: "Quizzes",
  },

  // Marketing & System
  {
    pathPrefix: "/banners",
    requirement: { permission: "content.banner.view" },
    title: "Banners",
  },
  {
    pathPrefix: "/coupons",
    requirement: { permission: "billing.coupon.view" },
    title: "Coupons",
  },
  {
    pathPrefix: "/notifications",
    requirement: { permission: "content.notification.view" },
    title: "Notifications",
  },
  {
    pathPrefix: "/roles",
    requirement: { anyPermissions: ["identity.role.view", "identity.permission.view"] },
    title: "Roles & Permissions",
  },

  // Overview / Dashboard (Guarded by billing.dashboard.view or identity.dashboard.view)
  {
    pathPrefix: "/overview",
    requirement: { anyPermissions: ["billing.dashboard.view", "identity.dashboard.view"] },
    title: "Overview",
  },
  {
    pathPrefix: "/",
    requirement: { anyPermissions: ["billing.dashboard.view", "identity.dashboard.view"] },
    title: "Overview",
  },
]

/**
 * Finds the permission rule for a given pathname, or undefined if unrestricted.
 */
export function getRoutePermissionRule(pathname: string): RoutePermissionRule | undefined {
  if (!pathname) return undefined
  // Normalize pathname
  const normalized = pathname.toLowerCase()

  // Exact match for root / or /overview
  if (normalized === "/" || normalized === "/overview") {
    return ROUTE_PERMISSION_RULES.find(
      (rule) => rule.pathPrefix === "/" || rule.pathPrefix === "/overview"
    )
  }

  return ROUTE_PERMISSION_RULES.find((rule) => {
    if (rule.pathPrefix === "/" || rule.pathPrefix === "/overview") return false
    return normalized.startsWith(rule.pathPrefix.toLowerCase())
  })
}
