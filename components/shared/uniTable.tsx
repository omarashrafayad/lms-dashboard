"use client"

import * as React from "react"
import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender, type ColumnDef } from "@tanstack/react-table"
import { Check, Minus, Trash2, Pencil, Eye, ImageOff, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Pagination } from "./Pagination"
// import { getImageUrl } from "@/lib/image.utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "motion/react"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"

import { HeaderContext, CellContext } from "@tanstack/react-table"

export { Check, Minus, Trash2, Pencil, Eye, RotateCcw }

// Types for flexible cell rendering
export type CellRenderer<TData> = (value: unknown, row: TData, props: CellContext<TData, unknown>) => React.ReactNode

export interface UniTableColumn<TData> {
    id: string
    header: string | React.ReactNode | ((props: HeaderContext<TData, unknown>) => React.ReactNode)
    accessorKey?: keyof TData | string
    cell?: CellRenderer<TData>
    enableSorting?: boolean
    className?: string
    headerClassName?: string
}

export interface UniTableProps<TData> {
    data: TData[]
    columns: UniTableColumn<TData>[]
    className?: string
    enablePagination?: boolean
    pageSize?: number
    emptyMessage?: React.ReactNode
    itemLabel?: string
    showSelection?: boolean
    onSelectionChange?: (selectedRows: TData[]) => void
    getRowId?: (row: TData) => string
    serverPagination?: {
        currentPage: number
        totalPages: number
        totalItems: number
        onPageChange: (page: number) => void
    }
}

/**
 * ProductCell helper for rendering a product image with title and subtitle
 */
export function ProductCell({
    image,
    title,
    subtitle,
    imageSize = "h-12 w-12",
    className
}: {
    image?: string;
    title: string;
    subtitle?: string;
    imageSize?: string;
    className?: string;
}) {
    // const imageUrl = getImageUrl(image)

    return (
        <div className={cn("flex items-center gap-3", className)}>
            <Avatar className={cn("rounded-xl bg-zinc-100 shrink-0", imageSize)}>
                <AvatarImage src={image || undefined} alt={title} className="object-cover" />
                <AvatarFallback className="rounded-xl bg-zinc-200 text-zinc-400">
                    <ImageOff className="h-5 w-5" />
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 leading-tight">{title}</span>
                {subtitle && <span className="text-xs text-zinc-500 mt-0.5">{subtitle}</span>}
            </div>
        </div>
    )
}

/**
 * Selection icon for the header (e.g. "Select All" state)
 */
export function SelectionHeader({
    checked,
    indeterminate,
    onChange,
    label
}: {
    checked?: boolean;
    indeterminate?: boolean;
    onChange?: (checked: boolean) => void;
    label?: string
}) {
    return (
        <div className="flex items-center gap-3">
            <Checkbox
                checked={checked}
                onCheckedChange={(val) => onChange?.(!!val)}
                className={cn(
                    "rounded transition-colors shrink-0",
                    (checked || indeterminate)
                        ? "bg-primary border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white"
                        : "border-zinc-300 bg-white"
                )}
            />
            {label && <span className="whitespace-nowrap">{label}</span>}
        </div>
    )
}

/**
 * Selection icon for a row
 */
export function SelectionCell({
    checked = false,
    onChange,
    id
}: {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    id?: string | number
}) {
    return (
        <div className="flex items-center gap-3">
            <Checkbox
                checked={checked}
                onCheckedChange={(val) => onChange?.(!!val)}
                className={cn(
                    "rounded transition-colors shrink-0",
                    checked ? "bg-primary border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white" : "border-zinc-300 bg-white"
                )}
            />
            {id && <span className="font-semibold text-primary whitespace-nowrap">{id}</span>}
        </div>
    )
}

/**
 * ActionButton helper for rendering a single action button
 */
export function ActionButton({
    icon: Icon,
    onClick,
    variant = "default"
}: {
    icon: React.ComponentType<{ className?: string }>;
    onClick?: () => void;
    variant?: "default" | "danger"
}) {
    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
                e.stopPropagation();
                onClick?.();
            }}
            className={cn(
                "h-8 w-8 rounded-lg shrink-0 cursor-pointer",
                variant === "danger"
                    ? "text-red-500 hover:bg-red-50 hover:text-red-600"
                    : "text-zinc-500 hover:bg-zinc-100"
            )}
        >
            <Icon className="h-5 w-5" />
        </Button>
    )
}

/**
 * ActionCell helper for rendering a group of action buttons
 */
export function ActionCell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-1">
            {children}
        </div>
    )
}

/**
 * StatusSelectCell helper for rendering a status dropdown with colors
 */
export function StatusSelectCell({
    value,
    onValueChange,
    options,
    colorMap,
    className
}: {
    value: string;
    onValueChange: (newValue: string) => void;
    options: string[];
    colorMap: Record<string, string>;
    className?: string;
}) {
    return (
        <Select value={value} onValueChange={(val) => { if (val) onValueChange(val) }}>
            <SelectTrigger
                className={cn(
                    "h-8 w-[130px] border px-3 py-1 rounded-lg font-medium shadow-none transition-colors",
                    colorMap[value] || "bg-zinc-100 text-zinc-600 border-zinc-200",
                    className
                )}
            >
                <SelectValue>
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {options.map((option) => (
                    <SelectItem
                        key={option}
                        value={option}
                        className={cn(
                            "flex items-center gap-2",
                        )}
                    >
                        <div className={cn("size-2 rounded-full", colorMap[option]?.split(" ")[0]?.replace("bg-", "bg-") || "bg-zinc-400")} />
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

function UniTable<TData>({
    data,
    columns,
    className,
    enablePagination = false,
    pageSize = 10,
    emptyMessage = "No data found",
    itemLabel = "items",
    onSelectionChange,
    getRowId,
    serverPagination,
}: UniTableProps<TData>) {
    const [rowSelection, setRowSelection] = React.useState({})

    const tableColumns = React.useMemo<ColumnDef<TData>[]>(() => {
        return columns.map((col) => ({
            id: col.id,
            accessorKey: col.accessorKey as string,
            header: (headerProps) => {
                if (typeof col.header === "function") {
                    return col.header(headerProps)
                }
                return col.header
            },
            cell: (cellProps) => {
                const value = cellProps.getValue()
                if (col.cell) {
                    return col.cell(value, cellProps.row.original, cellProps)
                }
                return value ?? "-"
            },
            enableSorting: col.enableSorting ?? false,
        }))
    }, [columns])

    const table = useReactTable({
        data,
        columns: tableColumns,
        state: {
            rowSelection,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        getRowId: getRowId,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
        initialState: {
            pagination: {
                pageSize,
            },
        },
    })

    // Use a ref to store the latest callback to avoid unnecessary effect triggers
    const onSelectionChangeRef = React.useRef(onSelectionChange)
    onSelectionChangeRef.current = onSelectionChange

    // Trigger onSelectionChange when selection updates
    React.useEffect(() => {
        if (onSelectionChangeRef.current) {
            const selectedRows = table.getSelectedRowModel().flatRows.map(row => row.original)
            onSelectionChangeRef.current(selectedRows)
        }
    }, [rowSelection])

    if (data.length === 0) {
        return (
            <div className={cn("text-center py-20 text-muted-foreground bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800", className)}>
                {emptyMessage}
            </div>
        )
    }

    return (
        <div className={cn("w-full h-full bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm", className)}>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
                                {headerGroup.headers.map((header) => {
                                    const column = columns.find((col) => col.id === header.id)
                                    return (
                                        <th
                                            key={header.id}
                                            className={cn(
                                                "h-12 px-4 py-3 align-middle font-semibold text-zinc-600 dark:text-zinc-400 first:pl-6 last:pr-6 whitespace-nowrap",
                                                column?.headerClassName
                                            )}
                                        >
                                            <div className="flex items-center gap-2">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </div>
                                        </th>
                                    )
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="relative">
                        <AnimatePresence mode="popLayout" initial={false}>
                            {table.getRowModel().rows.map((row) => (
                                <motion.tr
                                    key={row.id}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors cursor-default"
                                >
                                    {row.getVisibleCells().map((cell) => {
                                        const column = columns.find((col) => col.id === cell.column.id)
                                        return (
                                            <td
                                                key={cell.id}
                                                className={cn(
                                                    "p-4 align-middle first:pl-6 last:pr-6",
                                                    column?.className
                                                )}
                                            >
                                                <div className="flex items-center whitespace-nowrap">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </div>
                                            </td>
                                        )
                                    })}
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {(serverPagination || enablePagination) && (
                <Pagination
                    currentPage={serverPagination?.currentPage ?? table.getState().pagination.pageIndex + 1}
                    totalPages={serverPagination?.totalPages ?? table.getPageCount()}
                    totalItems={serverPagination?.totalItems ?? data.length}
                    pageSize={pageSize}
                    onPageChange={serverPagination?.onPageChange ?? ((page) => table.setPageIndex(page - 1))}
                    itemLabel={itemLabel}
                />
            )}
        </div>
    )
}

export default UniTable