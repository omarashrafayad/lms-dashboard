"use client"

import * as React from "react"
import { Search, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import UniTable, { type UniTableColumn } from "@/components/shared/uniTable"
import { ReferenceDataRowActions } from "./ReferenceDataRowActions"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import EmptyState from "@/components/shared/EmptyState"
import { cn } from "@/lib/utils"

export interface BaseReferenceItem {
  id: string
  name: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string | null
  [key: string]: any
}

interface ReferenceDataTableProps<T extends BaseReferenceItem> {
  data: T[]
  isLoading: boolean
  entityName: string
  onAdd: () => void
  onEdit: (item: T) => void
  onDelete: (id: string) => Promise<void> | void
  extraFilterSlot?: React.ReactNode
  extraColumns?: UniTableColumn<T>[]
  deletingId?: string | null
}

export function ReferenceDataTable<T extends BaseReferenceItem>({
  data,
  isLoading,
  entityName,
  onAdd,
  onEdit,
  onDelete,
  extraFilterSlot,
  extraColumns = [],
  deletingId,
}: ReferenceDataTableProps<T>) {
  const [search, setSearch] = React.useState("")

  const filteredData = React.useMemo(() => {
    if (!data) return []
    if (!search.trim()) return data
    const query = search.toLowerCase()
    return data.filter((item) =>
      item.name?.toLowerCase().includes(query)
    )
  }, [data, search])

  const columns = React.useMemo<UniTableColumn<T>[]>(() => {
    const cols: UniTableColumn<T>[] = [
      {
        id: "name",
        header: `${entityName.toUpperCase()} NAME`,
        headerClassName:
          "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, item) => (
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-amber-50 text-[#D97706] border border-amber-200/60 font-bold text-xs flex items-center justify-center shrink-0 select-none">
              {item.name ? item.name.charAt(0).toUpperCase() : "-"}
            </div>
            <span className="font-semibold text-sm text-zinc-900">
              {item.name}
            </span>
          </div>
        ),
      },
      ...extraColumns,
      {
        id: "status",
        header: "STATUS",
        headerClassName:
          "text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
        cell: (_, item) => {
          const active = item.isActive !== false
          return (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
                active
                  ? "text-emerald-700 bg-emerald-50/80 border-emerald-200/60"
                  : "text-zinc-600 bg-zinc-50 border-zinc-200"
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  active ? "bg-emerald-500" : "bg-zinc-400"
                )}
              />
              {active ? "Active" : "Inactive"}
            </span>
          )
        },
      },
      {
        id: "actions",
        header: "",
        className: "w-12 text-right",
        cell: (_, item) => (
          <ReferenceDataRowActions
            onEdit={() => onEdit(item)}
            onDelete={() => onDelete(item.id)}
            isDeleting={deletingId === item.id}
          />
        ),
      },
    ]

    return cols
  }, [entityName, extraColumns, onEdit, onDelete, deletingId])

  return (
    <div className="flex flex-col gap-4">
      {/* Controls Bar: Search, Filters, Add Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${entityName.toLowerCase()}...`}
              className="h-10 pl-10 pr-4 rounded-xl border-zinc-200/80 bg-zinc-50/50 text-sm placeholder:text-zinc-400 focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange transition-all"
            />
          </div>

          {extraFilterSlot}
        </div>

        <Button
          onClick={onAdd}
          className="h-10 px-4 rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-xs font-semibold text-white shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] shrink-0"
        >
          <Plus className="size-4 stroke-[2.5]" />
          <span>Add {entityName}</span>
        </Button>
      </div>

      {/* Table / Loading / Empty */}
      {isLoading ? (
        <LoadingSpinner title={`Loading ${entityName.toLowerCase()} records...`} />
      ) : filteredData.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200/80 bg-white">
          <EmptyState
            title={`No ${entityName} Records Found`}
            description={
              search
                ? `No records matching "${search}". Try adjusting your search query.`
                : `Get started by adding your first ${entityName.toLowerCase()} to the system.`
            }
            actionLabel={`Add ${entityName}`}
            onAction={onAdd}
          />
        </div>
      ) : (
        <div className="w-full">
          <UniTable
            data={filteredData}
            columns={columns}
            enablePagination={filteredData.length > 10}
            pageSize={10}
            className="rounded-2xl border-zinc-200/80 shadow-2xs"
          />
        </div>
      )}
    </div>
  )
}
