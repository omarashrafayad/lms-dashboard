"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ShieldAlert, ArrowLeft, Home, RefreshCw } from "lucide-react"
import { usePermissions } from "@/lib/rbac/usePermissions"
import { getRoutePermissionRule } from "@/lib/rbac/routePermissions"

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { can, isLoading } = usePermissions()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const rule = React.useMemo(() => getRoutePermissionRule(pathname), [pathname])

  // If there's no restriction on this route, render children immediately
  if (!rule) {
    return <>{children}</>
  }

  // During SSR or initial client mount or query loading, render a calm loading state
  if (!mounted || isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 rounded-full border-2 border-brand-orange/30 border-t-brand-orange animate-spin" />
          <p className="text-xs font-medium text-zinc-400 animate-pulse">
            Verifying permissions...
          </p>
        </div>
      </div>
    )
  }

  // Evaluate permission requirement
  const isAuthorized = can(rule.requirement)

  if (!isAuthorized) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 min-h-[75vh]">
        <div className="max-w-md w-full bg-white rounded-3xl border border-zinc-200/80 p-8 shadow-sm text-center flex flex-col items-center animate-in fade-in-50 zoom-in-95 duration-200">
          <div className="size-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-5 text-red-500 shadow-sm">
            <ShieldAlert className="size-8 stroke-[1.8]" />
          </div>

          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-red-100/70 text-red-700 mb-2">
            403 • Access Denied
          </span>

          <h2 className="text-xl font-bold text-zinc-900 mb-2">
            Permission Required
          </h2>

          <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
            You do not have the required permissions to access the{" "}
            <span className="font-semibold text-zinc-800">{rule.title}</span>{" "}
            module. Please contact your system administrator to request access.
          </p>

          <div className="flex items-center gap-3 w-full">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
            >
              <ArrowLeft className="size-3.5" />
              <span>Go Back</span>
            </button>

            {can({ anyPermissions: ["billing.dashboard.view", "identity.dashboard.view"] }) && pathname !== "/" && (
              <Link
                href="/"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-orange text-white text-xs font-semibold hover:bg-brand-orange/90 transition-colors shadow-sm cursor-pointer"
              >
                <Home className="size-3.5" />
                <span>Dashboard</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
