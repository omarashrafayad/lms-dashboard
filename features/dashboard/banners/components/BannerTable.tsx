"use client"

import * as React from "react"
import UniTable, { UniTableColumn } from "@/components/shared/uniTable"
import { Banner } from "../types/banner.types"
import { BannerRowActions } from "./BannerRowActions"
import { ExternalLink, Image as ImageIcon, Calendar } from "lucide-react"

export interface BannerTableProps {
  data: Banner[]
  serverPagination?: {
    currentPage: number
    totalPages: number
    totalItems: number
    onPageChange: (page: number) => void
    pageSizeOptions?: number[]
    onPageSizeChange?: (pageSize: number) => void
  }
  pageSize?: number
  onEdit: (banner: Banner) => void
}

function resolveBannerImageUrl(banner: Banner): string {
  if (banner.imageUrl) {
    if (banner.imageUrl.startsWith("http://") || banner.imageUrl.startsWith("https://")) {
      return banner.imageUrl
    }
    return `https://lmssiteapi.runasp.net${banner.imageUrl.startsWith("/") ? "" : "/"}${banner.imageUrl}`
  }
  return `https://lmssiteapi.runasp.net/api/v1/content/banners/${banner.id}/image`
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "Recently"
  try {
    const d = new Date(dateStr)
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    }
  } catch {}
  return "Recently"
}

export function BannerTable({
  data,
  serverPagination,
  pageSize = 20,
  onEdit,
}: BannerTableProps) {
  const columns = React.useMemo<UniTableColumn<Banner>[]>(
    () => [
      {
        id: "banner",
        header: "BANNER",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, banner) => {
          const imgSrc = resolveBannerImageUrl(banner)
          const code = `BNR-${(banner.id || "").slice(0, 5).toUpperCase()}`

          return (
            <div className="flex items-center gap-3 py-1">
              {/* Thumbnail */}
              <div className="relative size-12 sm:w-20 sm:h-12 rounded-xl bg-zinc-100 border border-zinc-200/80 overflow-hidden shrink-0 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgSrc}
                  alt={banner.title || "Banner"}
                  className="size-full object-cover"
                  onError={(e) => {
                    // Fallback if image fails to load
                    (e.currentTarget as HTMLElement).style.display = "none"
                  }}
                />
                <ImageIcon className="size-5 text-zinc-300 absolute -z-10" />
              </div>

              {/* Title & Code */}
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-sm text-zinc-900 leading-tight truncate max-w-xs">
                  {banner.title || "Untitled Banner"}
                </span>
                <span className="font-mono text-[11px] text-zinc-400 font-normal mt-0.5">
                  {code}
                </span>
              </div>
            </div>
          )
        },
      },
      {
        id: "linkUrl",
        header: "DESTINATION LINK",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, banner) => {
          if (!banner.linkUrl) {
            return <span className="text-xs text-zinc-400">No link</span>
          }
          return (
            <a
              href={banner.linkUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-brand-orange hover:text-amber-700 font-medium truncate max-w-[200px]"
              title={banner.linkUrl}
            >
              <span className="truncate">{banner.linkUrl}</span>
              <ExternalLink className="size-3 shrink-0" />
            </a>
          )
        },
      },
      {
        id: "order",
        header: "ORDER",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, banner) => (
          <span className="inline-flex items-center justify-center size-7 rounded-lg bg-zinc-100 border border-zinc-200/80 font-mono text-xs font-semibold text-zinc-800">
            {banner.order ?? 0}
          </span>
        ),
      },
      {
        id: "status",
        header: "STATUS",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, banner) => (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
              banner.isActive
                ? "text-emerald-700 bg-emerald-50 border-emerald-200/60"
                : "text-zinc-500 bg-zinc-50 border-zinc-200"
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${
                banner.isActive ? "bg-emerald-500" : "bg-zinc-400"
              }`}
            />
            {banner.isActive ? "Active" : "Inactive"}
          </span>
        ),
      },
      {
        id: "createdAt",
        header: "CREATED",
        headerClassName: "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, banner) => (
          <div className="flex items-center gap-1.5 text-xs text-zinc-600">
            <Calendar className="size-3.5 text-zinc-400" />
            <span>{formatDate(banner.createdAt)}</span>
          </div>
        ),
      },
      {
        id: "actions",
        header: "",
        headerClassName: "w-[48px]",
        cell: (_, banner) => (
          <BannerRowActions banner={banner} onEdit={onEdit} />
        ),
      },
    ],
    [onEdit]
  )

  return (
    <UniTable<Banner>
      data={data}
      columns={columns}
      getRowId={(b) => b.id}
      serverPagination={serverPagination}
      pageSize={pageSize}
      emptyMessage="No promotional banners found. Click 'Add Banner' to create your first display banner."
    />
  )
}

