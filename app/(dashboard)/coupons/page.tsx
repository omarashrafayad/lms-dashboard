import { Metadata } from "next"
import CouponsMainPage from "@/features/dashboard/coupons/template/couponsMainPage"

export const metadata: Metadata = {
  title: "Promotional Coupons | LMS Admin",
  description: "Create, distribute, and manage discount promo codes and campaign vouchers.",
}

export default function CouponsPage() {
  return <CouponsMainPage />
}

