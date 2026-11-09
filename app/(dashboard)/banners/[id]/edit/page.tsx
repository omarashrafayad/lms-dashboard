import { Metadata } from "next"
import BannerEditPage from "@/features/dashboard/banners/template/bannerEditPage"

export const metadata: Metadata = {
  title: "Edit Banner | LMS Admin",
  description: "Update promotional banner graphic, link, and priority order.",
}

interface BannerEditRouteProps {
  params: Promise<{ id: string }>
}

export default async function BannerEditRoute({ params }: BannerEditRouteProps) {
  const { id } = await params
  return <BannerEditPage bannerId={id} />
}

