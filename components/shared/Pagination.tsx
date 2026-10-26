"use client"

import { cn } from "@/lib/utils"
import {
    Pagination as UiPagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/components/ui/pagination"

interface PaginationProps {
    currentPage: number
    totalPages: number
    totalItems: number
    pageSize: number
    onPageChange: (page: number) => void
    itemLabel?: string
    pageSizeOptions?: number[]
    onPageSizeChange?: (pageSize: number) => void
}

export function Pagination({
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    onPageChange,
    itemLabel = "items",
    pageSizeOptions,
    onPageSizeChange,
}: PaginationProps) {
    const effectiveTotalPages = Math.max(1, totalPages)
    const getPageNumbers = () => {
        const pages: (number | string)[] = []
        const maxVisible = 5

        if (effectiveTotalPages <= maxVisible) {
            for (let i = 1; i <= effectiveTotalPages; i++) {
                pages.push(i)
            }
            return pages
        }

        pages.push(1)

        let start = Math.max(2, currentPage - 1)
        let end = Math.min(effectiveTotalPages - 1, currentPage + 1)

        if (currentPage <= 3) {
            start = 2
            end = 4
        }

        if (currentPage >= effectiveTotalPages - 2) {
            start = effectiveTotalPages - 3
            end = effectiveTotalPages - 1
        }

        if (start > 2) {
            pages.push("...")
        }

        for (let i = start; i <= end; i++) {
            if (i > 1 && i < effectiveTotalPages) {
                pages.push(i)
            }
        }

        if (end < effectiveTotalPages - 1) {
            pages.push("...")
        }

        pages.push(effectiveTotalPages)

        return pages
    }

    const pageNumbers = getPageNumbers()
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
    const endItem = Math.min(currentPage * pageSize, totalItems)

    return (
        <div className="flex flex-wrap items-center justify-between gap-4 w-full p-4 md:p-6 bg-white dark:bg-zinc-900 border-t border-divider">
            {/* Page Info & Size Selector */}
            <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground whitespace-nowrap">
                <span>
                    Showing {startItem}-{endItem} from {totalItems} {itemLabel}
                </span>

                {pageSizeOptions && onPageSizeChange && (
                    <div className="flex items-center gap-1.5 ml-2 text-xs">
                        <span className="text-zinc-400">Per page:</span>
                        <select
                            value={pageSize}
                            onChange={(e) => onPageSizeChange(Number(e.target.value))}
                            className="h-8 px-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold cursor-pointer outline-none focus:ring-1 focus:ring-primary"
                        >
                            {pageSizeOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <UiPagination className="justify-end mx-0 w-auto">
                <PaginationContent className="gap-2">
                    {/* Previous Button */}
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                if (currentPage > 1) onPageChange(currentPage - 1)
                            }}
                            className={cn(
                                "h-9 w-9 p-0 flex items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors border-none cursor-pointer",
                                currentPage <= 1 && "pointer-events-none opacity-50 cursor-not-allowed"
                            )}
                        />
                    </PaginationItem>

                    {/* Page Numbers */}
                    {pageNumbers.map((page, index) => {
                        if (page === "...") {
                            return (
                                <PaginationItem key={`ellipsis-${index}`}>
                                    <PaginationEllipsis className="h-9 w-9 flex items-center justify-center text-zinc-500" />
                                </PaginationItem>
                            )
                        }

                        const pageNum = page as number
                        const isActive = pageNum === currentPage

                        return (
                            <PaginationItem key={pageNum}>
                                <PaginationLink
                                    href="#"
                                    isActive={isActive}
                                    className={cn(
                                        "flex h-9 w-9 items-center justify-center rounded-lg cursor-pointer text-sm font-semibold transition-all border-none shadow-none",
                                        isActive
                                            ? "bg-primary text-white hover:bg-primary/90"
                                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                    )}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        onPageChange(pageNum)
                                    }}
                                >
                                    {pageNum}
                                </PaginationLink>
                            </PaginationItem>
                        )
                    })}

                    {/* Next Button */}
                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                if (currentPage < effectiveTotalPages) onPageChange(currentPage + 1)
                            }}
                            className={cn(
                                "h-9 w-9 p-0 flex items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors border-none cursor-pointer",
                                currentPage >= effectiveTotalPages && "pointer-events-none opacity-50 cursor-not-allowed"
                            )}
                        />
                    </PaginationItem>
                </PaginationContent>
            </UiPagination>
        </div>
    )
}