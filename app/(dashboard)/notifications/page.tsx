import { Metadata } from "next"
import NotificationsMainPage from "@/features/dashboard/notifications/template/notificationsMainPage"

export const metadata: Metadata = {
  title: "Notifications & Announcements | LMS Admin",
  description: "Manage notifications, announcements, and news broadcasts.",
}

export default function NotificationsPage() {
  return <NotificationsMainPage />
}

