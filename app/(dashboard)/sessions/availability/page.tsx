import { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft, CalendarCheck } from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"

export const metadata: Metadata = {
  title: "Teacher Availability | Scholar LMS Admin",
}

export default function Page() {
  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Teacher Availability"
        description="Monitor teacher time slots, weekly schedules, and open booking hours."
      />
      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1300px] w-full mx-auto pb-20">
        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-12 flex flex-col items-center justify-center text-center gap-3">
          <div className="size-12 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center">
            <CalendarCheck className="size-6 stroke-[2]" />
          </div>
          <h2 className="text-base font-bold text-zinc-900">
            Teacher Schedules & Availability
          </h2>
          <p className="text-xs text-zinc-500 max-w-sm">
            Teacher availability is synced with upcoming session bookings. You can schedule sessions in All Sessions.
          </p>
          <Link
            href="/sessions"
            className="mt-2 h-9 px-4 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ChevronLeft className="size-4" />
            <span>Go to All Sessions</span>
          </Link>
        </div>
      </main>
    </div>
  )
}
