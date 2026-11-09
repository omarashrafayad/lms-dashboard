import { Metadata } from "next"
import BannerAddPage from "@/features/dashboard/banners/template/bannerAddPage"

export const metadata: Metadata = {
  title: "Add Banner | LMS Admin",
  description: "Create and publish a new promotional banner.",
}

export default function AddBannerRoute() {
  return <BannerAddPage />
}

