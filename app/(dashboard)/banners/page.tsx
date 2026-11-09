import { Metadata } from "next"
import BannerListPage from "@/features/dashboard/banners/template/bannerListPage"

export const metadata: Metadata = {
  title: "Promotional Banners | LMS Admin",
  description: "Create, configure, and manage promotional banners and carousel announcements.",
}

export default function BannersPage() {
  return <BannerListPage />
}

