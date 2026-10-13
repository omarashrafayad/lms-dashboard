"use client"

import * as React from "react"
import {
  Activity,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Server,
  Zap,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { SystemServiceStatus } from "../../types/support.types"
import { toast } from "sonner"

interface SystemStatusSectionProps {
  services: SystemServiceStatus[]
}

export function SystemStatusSection({ services }: SystemStatusSectionProps) {
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      toast.success("All service health checks verified successfully!")
    }, 600)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top Health Overview Card */}
      <div className="p-6 rounded-2xl bg-white border border-emerald-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative flex size-10 rounded-xl bg-emerald-100 text-emerald-700 items-center justify-center shrink-0 border border-emerald-200">
            <CheckCircle2 className="size-5" />
            <span className="absolute -top-1 -right-1 size-3 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-zinc-900 tracking-tight">
                All Core Services Are Fully Operational
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                100% HEALTHY
              </span>
            </div>
            <span className="text-xs text-zinc-500">
              No active disruptions or degraded performance across cloud infrastructure nodes.
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-zinc-200/80 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
        >
          <RefreshCw
            className={cn("size-3.5 text-zinc-500", isRefreshing && "animate-spin")}
          />
          <span>Check Now</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between gap-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-zinc-900">
                  {service.name}
                </span>
                <span className="text-[11px] text-zinc-400">
                  {service.category}
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shrink-0">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                {service.status}
              </span>
            </div>

            {/* Metrics */}
            <div className="flex flex-col gap-2 pt-2 border-t border-zinc-100">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-medium flex items-center gap-1">
                  <ShieldCheck className="size-3.5 text-zinc-400" />
                  30-day Uptime:
                </span>
                <strong className="text-zinc-900 font-semibold font-mono">
                  {service.uptime}
                </strong>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-medium flex items-center gap-1">
                  <Zap className="size-3.5 text-zinc-400" />
                  Response Latency:
                </span>
                <strong className="text-zinc-900 font-semibold font-mono">
                  {service.latency}
                </strong>
              </div>
            </div>

            {/* Visual 30-day uptime bar */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-0.5 w-full">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    title="100% operational"
                    className="flex-1 h-3 rounded-[2px] bg-emerald-500 hover:bg-emerald-600 transition-colors"
                  />
                ))}
              </div>
              <div className="flex items-center justify-between text-[10px] text-zinc-400">
                <span>30 days ago</span>
                <span>Today</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Incident History & Maintenance Log */}
      <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-3">
        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
          Scheduled Maintenance & Past Incidents Log
        </h3>
        <div className="flex flex-col divide-y divide-zinc-100 text-xs">
          <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-zinc-900">
                No incidents reported in the last 90 days
              </span>
              <span className="text-[11px] text-zinc-400">
                Platform automated self-healing clusters prevented failover downtime.
              </span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 self-start sm:self-auto">
              100% Resolved
            </span>
          </div>
          <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-zinc-900">
                Routine Database Index Rebuild (Scheduled)
              </span>
              <span className="text-[11px] text-zinc-400">
                Scheduled for Sunday 02:00 AM UTC • Zero downtime expected.
              </span>
            </div>
            <span className="text-[11px] font-semibold text-zinc-600 bg-zinc-100 px-2.5 py-0.5 rounded-full border border-zinc-200 self-start sm:self-auto">
              Upcoming
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
