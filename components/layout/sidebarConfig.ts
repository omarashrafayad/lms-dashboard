import * as React from "react"
import {
  GraduationCap,
  LayoutGrid,
  Calendar,
  CreditCard,
  HelpCircle,
  Settings,
  Database,
  Ticket,
  Bell,
  Image as ImageIcon,
  ShieldCheck,
  Video,
} from "lucide-react"
import { AppPermission, CheckPermissionOptions } from "@/lib/rbac/permissions"

export interface NavChildItem {
  id: string
  label: string
  href: string
  permission?: AppPermission | string
  anyPermissions?: (AppPermission | string)[]
  isActive?: (pathname: string) => boolean
}

export interface NavSubGroup {
  id: string
  label: string
  permission?: AppPermission | string
  anyPermissions?: (AppPermission | string)[]
  children: NavChildItem[]
  isActive?: (pathname: string) => boolean
}

export interface NavParentGroup {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  iconClassName?: string
  permission?: AppPermission | string
  anyPermissions?: (AppPermission | string)[]
  /** Either sub-groups (e.g. Users -> Students) OR direct child links (e.g. Academic -> Subjects) */
  subGroups?: NavSubGroup[]
  directLinks?: NavChildItem[]
  isActive?: (pathname: string) => boolean
}

export interface NavSingleItem {
  id: string
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  permission?: AppPermission | string
  anyPermissions?: (AppPermission | string)[]
  isActive?: (pathname: string) => boolean
}

export type SidebarItem =
  | { type: "parent"; group: NavParentGroup }
  | { type: "single"; item: NavSingleItem }

export const SIDEBAR_ITEMS: SidebarItem[] = [
  // Overview (Guarded by billing.dashboard.view or identity.dashboard.view)
  {
    type: "single",
    item: {
      id: "overview",
      label: "Overview",
      href: "/",
      icon: LayoutGrid,
      anyPermissions: ["billing.dashboard.view", "identity.dashboard.view"],
      isActive: (p) => p === "/" || p === "/overview",
    },
  },

  // Users Group (Level 1: Users -> Level 2: Students/Teachers/Parents -> Level 3: Links)
  {
    type: "parent",
    group: {
      id: "users",
      label: "Users",
      icon: LayoutGrid,
      iconClassName: "rotate-45",
      isActive: (p) =>
        p.startsWith("/student") ||
        p.startsWith("/teacher") ||
        p.startsWith("/parent") ||
        p.startsWith("/parents"),
      subGroups: [
        {
          id: "students",
          label: "Students",
          isActive: (p) => p.startsWith("/student"),
          children: [
            {
              id: "all-students",
              label: "All Students",
              href: "/student/student_list",
              anyPermissions: ["identity.student.view", "identity.user.view"],
              isActive: (p) =>
                p.startsWith("/student") &&
                p !== "/student/add" &&
                p !== "/student/requests",
            },
            {
              id: "add-student",
              label: "Add Student",
              href: "/student/add",
              anyPermissions: ["identity.student.create", "identity.user.create"],
              isActive: (p) => p === "/student/add",
            },
          ],
        },
        {
          id: "teachers",
          label: "Teachers",
          isActive: (p) => p.startsWith("/teacher"),
          children: [
            {
              id: "all-teachers",
              label: "All Teachers",
              href: "/teacher/teacher_list",
              anyPermissions: ["identity.teacher.view", "identity.user.view"],
              isActive: (p) =>
                p.startsWith("/teacher") &&
                p !== "/teacher/add" &&
                p !== "/teacher/dues",
            },
            {
              id: "teacher-dues",
              label: "Teacher Dues",
              href: "/teacher/dues",
              anyPermissions: ["identity.teacher.view", "billing.payment.view"],
              isActive: (p) => p === "/teacher/dues",
            },
            {
              id: "add-teacher",
              label: "Add Teacher",
              href: "/teacher/add",
              anyPermissions: ["identity.teacher.create", "identity.user.create"],
              isActive: (p) => p === "/teacher/add",
            },
          ],
        },
        {
          id: "parents",
          label: "Parents",
          isActive: (p) => p.startsWith("/parent") || p.startsWith("/parents"),
          children: [
            {
              id: "all-parents",
              label: "All Parents",
              href: "/parent/parent_list",
              anyPermissions: ["identity.parent.view", "identity.user.view"],
              isActive: (p) =>
                (p.startsWith("/parent") || p.startsWith("/parents")) &&
                p !== "/parent/add",
            },
            {
              id: "add-parent",
              label: "Add Parent",
              href: "/parent/add",
              anyPermissions: ["identity.parent.create", "identity.user.create"],
              isActive: (p) => p === "/parent/add",
            },
          ],
        },
      ],
    },
  },

  // Academic Management
  {
    type: "parent",
    group: {
      id: "academic",
      label: "Academic Management",
      icon: GraduationCap,
      isActive: (p) =>
        p.startsWith("/curriculum") ||
        p.startsWith("/academic") ||
        p.startsWith("/courses") ||
        p.startsWith("/exams"),
      directLinks: [
        {
          id: "academic-subjects",
          label: "Subjects",
          href: "/curriculum",
          permission: "curriculum.subject.view",
          isActive: (p) =>
            p === "/curriculum" ||
            (p.startsWith("/curriculum") &&
              !p.startsWith("/curriculum/chapters") &&
              !p.startsWith("/curriculum/units") &&
              !p.startsWith("/curriculum/lessons")),
        },
        {
          id: "academic-courses",
          label: "Courses",
          href: "/courses",
          permission: "curriculum.course.view",
          isActive: (p) =>
            p.startsWith("/courses") || p.startsWith("/academic/courses"),
        },
        {
          id: "academic-exams",
          label: "Exams",
          href: "/academic/exams",
          permission: "curriculum.exam.view",
          isActive: (p) =>
            p.startsWith("/academic/exams") || p.startsWith("/exams"),
        },
      ],
    },
  },

  // Reference Data
  {
    type: "parent",
    group: {
      id: "reference-data",
      label: "Reference Data",
      icon: Database,
      isActive: (p) => p.startsWith("/reference-data"),
      directLinks: [
        {
          id: "ref-stages",
          label: "Academic Stages",
          href: "/reference-data/academic-stages",
          permission: "curriculum.reference.view",
          isActive: (p) =>
            p.startsWith("/reference-data/academic-stages") ||
            p === "/reference-data",
        },
        {
          id: "ref-education-systems",
          label: "Education Systems",
          href: "/reference-data/education-systems",
          permission: "curriculum.reference.view",
          isActive: (p) => p.startsWith("/reference-data/education-systems"),
        },
        {
          id: "ref-grades",
          label: "Grades",
          href: "/reference-data/grades",
          permission: "curriculum.reference.view",
          isActive: (p) => p.startsWith("/reference-data/grades"),
        },
        {
          id: "ref-terms",
          label: "Academic Terms",
          href: "/reference-data/terms",
          permission: "curriculum.reference.view",
          isActive: (p) => p.startsWith("/reference-data/terms"),
        },
        {
          id: "ref-teaching-levels",
          label: "Teaching Levels",
          href: "/reference-data/teaching-levels",
          permission: "curriculum.reference.view",
          isActive: (p) => p.startsWith("/reference-data/teaching-levels"),
        },
        {
          id: "ref-genders",
          label: "Genders",
          href: "/reference-data/genders",
          permission: "curriculum.reference.view",
          isActive: (p) => p.startsWith("/reference-data/genders"),
        },
      ],
    },
  },

  // Sessions & Bookings
  {
    type: "parent",
    group: {
      id: "sessions",
      label: "Sessions & Bookings",
      icon: Calendar,
      isActive: (p) => p.startsWith("/sessions"),
      directLinks: [
        {
          id: "all-sessions",
          label: "All Sessions",
          href: "/sessions",
          permission: "curriculum.session.view",
          isActive: (p) =>
            p.startsWith("/sessions") &&
            !p.startsWith("/sessions/requests") &&
            !p.startsWith("/sessions/availability"),
        },
        {
          id: "reschedule-requests",
          label: "Reschedule Requests",
          href: "/sessions/requests",
          permission: "curriculum.session.view",
          isActive: (p) => p.startsWith("/sessions/requests"),
        },
        {
          id: "availability",
          label: "Availability",
          href: "/sessions/availability",
          permission: "curriculum.session.view",
          isActive: (p) => p.startsWith("/sessions/availability"),
        },
      ],
    },
  },

  // Subscriptions & Payments
  {
    type: "parent",
    group: {
      id: "subscriptions",
      label: "Subscriptions & Payments",
      icon: CreditCard,
      isActive: (p) => p.startsWith("/subscriptions"),
      directLinks: [
        {
          id: "subs-overview",
          label: "Overview & All",
          href: "/subscriptions",
          permission: "billing.subscription.view",
          isActive: (p) => p === "/subscriptions",
        },
        {
          id: "subs-plans",
          label: "Pricing Plans",
          href: "/subscriptions/plans",
          permission: "billing.plan.view",
          isActive: (p) => p === "/subscriptions/plans",
        },
        {
          id: "subs-transactions",
          label: "Transactions & Invoices",
          href: "/subscriptions/transactions",
          permission: "billing.payment.view",
          isActive: (p) => p === "/subscriptions/transactions",
        },
      ],
    },
  },

  // Content
  {
    type: "parent",
    group: {
      id: "content",
      label: "Content",
      icon: Video,
      isActive: (p) =>
        p.startsWith("/content") ||
        p.startsWith("/curriculum/chapters") ||
        p.startsWith("/curriculum/units") ||
        p.startsWith("/curriculum/lessons"),
      directLinks: [
        {
          id: "content-videos",
          label: "Videos",
          href: "/content/videos",
          permission: "content.video.view",
          isActive: (p) => p.startsWith("/content/videos"),
        },
        {
          id: "content-pdfs",
          label: "PDFs & Books",
          href: "/content/pdfs",
          permission: "content.pdf.view",
          isActive: (p) => p.startsWith("/content/pdfs"),
        },
        {
          id: "content-quizzes",
          label: "Quizzes",
          href: "/content/quizzes",
          permission: "content.quiz.view",
          isActive: (p) => p.startsWith("/content/quizzes"),
        },
        {
          id: "content-chapters",
          label: "Chapters",
          href: "/curriculum/chapters",
          permission: "curriculum.chapter.view",
          isActive: (p) => p.startsWith("/curriculum/chapters"),
        },
        {
          id: "content-units",
          label: "Units",
          href: "/curriculum/units",
          permission: "curriculum.unit.view",
          isActive: (p) => p.startsWith("/curriculum/units"),
        },
        {
          id: "content-lessons",
          label: "Lessons",
          href: "/curriculum/lessons",
          permission: "curriculum.lesson.view",
          isActive: (p) =>
            p.startsWith("/curriculum/lessons") ||
            p.startsWith("/lessons") ||
            p.startsWith("/academic/lessons"),
        },
      ],
    },
  },

  // Banners
  {
    type: "single",
    item: {
      id: "banners",
      label: "Banners",
      href: "/banners",
      icon: ImageIcon,
      permission: "content.banner.view",
      isActive: (p) => p.startsWith("/banners"),
    },
  },

  // Coupons
  {
    type: "single",
    item: {
      id: "coupons",
      label: "Coupons",
      href: "/coupons",
      icon: Ticket,
      permission: "billing.coupon.view",
      isActive: (p) => p.startsWith("/coupons"),
    },
  },

  // Notifications
  {
    type: "single",
    item: {
      id: "notifications",
      label: "Notifications",
      href: "/notifications",
      icon: Bell,
      permission: "content.notification.view",
      isActive: (p) => p.startsWith("/notifications"),
    },
  },

  // Roles & Permissions
  {
    type: "single",
    item: {
      id: "roles",
      label: "Roles & Permissions",
      href: "/roles",
      icon: ShieldCheck,
      anyPermissions: ["identity.role.view", "identity.permission.view"],
      isActive: (p) => p.startsWith("/roles"),
    },
  },

  // Support
  {
    type: "single",
    item: {
      id: "support",
      label: "Support",
      href: "/support",
      icon: HelpCircle,
      isActive: (p) => p.startsWith("/support"),
    },
  },
]

/**
 * Pure recursive filtering function:
 * Filters out unauthorized leaf links, and automatically eliminates any empty sub-group
 * or parent menu whose children are all unauthorized.
 */
export function filterSidebarItems(
  items: SidebarItem[],
  can: (options: CheckPermissionOptions) => boolean
): SidebarItem[] {
  const result: SidebarItem[] = []

  for (const item of items) {
    if (item.type === "single") {
      const allowed = can({
        permission: item.item.permission,
        anyPermissions: item.item.anyPermissions,
      })
      if (allowed) {
        result.push(item)
      }
    } else if (item.type === "parent") {
      const group = item.group

      // If parent has subGroups (like Users -> Students / Teachers / Parents)
      if (group.subGroups && group.subGroups.length > 0) {
        const filteredSubGroups: NavSubGroup[] = []

        for (const sub of group.subGroups) {
          const filteredChildren = sub.children.filter((child) =>
            can({
              permission: child.permission,
              anyPermissions: child.anyPermissions,
            })
          )

          // Only keep sub-group if it has at least one visible child link
          if (filteredChildren.length > 0) {
            filteredSubGroups.push({
              ...sub,
              children: filteredChildren,
            })
          }
        }

        // Only keep parent group if at least one sub-group survived
        if (filteredSubGroups.length > 0) {
          result.push({
            type: "parent",
            group: {
              ...group,
              subGroups: filteredSubGroups,
            },
          })
        }
      }
      // If parent has directLinks (like Academic Management -> Subjects, Courses, Exams)
      else if (group.directLinks && group.directLinks.length > 0) {
        const filteredDirectLinks = group.directLinks.filter((link) =>
          can({
            permission: link.permission,
            anyPermissions: link.anyPermissions,
          })
        )

        // Only keep parent group if at least one link survived
        if (filteredDirectLinks.length > 0) {
          result.push({
            type: "parent",
            group: {
              ...group,
              directLinks: filteredDirectLinks,
            },
          })
        }
      }
    }
  }

  return result
}
