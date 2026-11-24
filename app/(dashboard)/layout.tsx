import * as React from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { RouteGuard } from "@/components/layout/RouteGuard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background font-sans text-foreground">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Right Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-y-auto">
        <RouteGuard>{children}</RouteGuard>
      </div>
    </div>
  )
}

