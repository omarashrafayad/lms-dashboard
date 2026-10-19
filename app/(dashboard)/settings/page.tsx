import { Metadata } from "next"
import { SettingsMainPage } from "@/features/dashboard/settings/template/SettingsMainPage"

export const metadata: Metadata = {
  title: "Settings & Configuration | LMS Dashboard",
  description:
    "Configure institutional academy details, administrator credentials, notification rules, and platform preferences.",
}

export default function SettingsPage() {
  return <SettingsMainPage />
}
