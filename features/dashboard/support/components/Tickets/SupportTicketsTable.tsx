"use client"

import * as React from "react"
import {
  Search,
  Filter,
  MessageSquare,
  ArrowUpDown,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  SupportTicket,
  TicketPriority,
  TicketStatus,
  TicketCategory,
} from "../../types/support.types"

interface SupportTicketsTableProps {
  tickets: SupportTicket[]
  onViewTicket: (ticket: SupportTicket) => void
  onCreateTicket: () => void
  onUpdateStatus?: (ticketId: string, newStatus: TicketStatus) => void
}

export function SupportTicketsTable({
  tickets,
  onViewTicket,
  onCreateTicket,
  onUpdateStatus,
}: SupportTicketsTableProps) {
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [priorityFilter, setPriorityFilter] = React.useState<string>("all")
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all")

  const filteredTickets = React.useMemo(() => {
    return tickets.filter((ticket) => {
      const matchSearch =
        ticket.subject.toLowerCase().includes(search.toLowerCase()) ||
        ticket.id.toLowerCase().includes(search.toLowerCase()) ||
        ticket.requester.name.toLowerCase().includes(search.toLowerCase()) ||
        ticket.description.toLowerCase().includes(search.toLowerCase())

      const matchStatus =
        statusFilter === "all" || ticket.status.toLowerCase() === statusFilter.toLowerCase()

      const matchPriority =
        priorityFilter === "all" ||
        ticket.priority.toLowerCase() === priorityFilter.toLowerCase()

      const matchCategory =
        categoryFilter === "all" || ticket.category === categoryFilter

      return matchSearch && matchStatus && matchPriority && matchCategory
    })
  }, [tickets, search, statusFilter, priorityFilter, categoryFilter])

  const getPriorityBadge = (priority: TicketPriority) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-50 text-red-700 border-red-200/80 font-bold"
      case "High":
        return "bg-orange-50 text-orange-700 border-orange-200/80 font-semibold"
      case "Medium":
        return "bg-amber-50 text-amber-800 border-amber-200/80 font-medium"
      case "Low":
        return "bg-zinc-100 text-zinc-600 border-zinc-200 font-medium"
    }
  }

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case "Open":
        return "bg-amber-50 text-amber-800 border-amber-200/80"
      case "In Progress":
        return "bg-blue-50 text-blue-700 border-blue-200/80"
      case "Resolved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/80"
      case "Closed":
        return "bg-zinc-100 text-zinc-600 border-zinc-200"
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Search and Filters Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
        {/* Left: Search input */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <Input
            type="text"
            placeholder="Search tickets by ID, subject, or requester..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9.5 h-9.5 rounded-xl border-zinc-200/80 bg-zinc-50/50 text-xs focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange"
          />
        </div>

        {/* Right: Filters & Action */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 rounded-xl border border-zinc-200/80 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 cursor-pointer shadow-2xs"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="h-9 px-3 rounded-xl border border-zinc-200/80 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 cursor-pointer shadow-2xs"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* New Ticket Button */}
          <Button
            type="button"
            onClick={onCreateTicket}
            className="h-9 px-3.5 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-semibold shadow-2xs gap-1.5 cursor-pointer ml-1"
          >
            <Plus className="size-3.5 stroke-[2.5]" />
            <span>Create Ticket</span>
          </Button>
        </div>
      </div>

      {/* Tickets List Card */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/70 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                <th className="py-3 px-4">Ticket & Subject</th>
                <th className="py-3 px-4">Requester</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4">Assigned To</th>
                <th className="py-3 px-4">Updated</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs text-zinc-700">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-zinc-50/60 transition-colors group"
                  >
                    {/* Ticket ID & Subject */}
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded-md border border-zinc-200/60">
                            {ticket.id}
                          </span>
                          <span className="text-[10px] font-medium text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded-md border border-zinc-100">
                            {ticket.category}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onViewTicket(ticket)}
                          className="font-semibold text-xs text-zinc-900 hover:text-brand-orange transition-colors text-left line-clamp-1 cursor-pointer"
                        >
                          {ticket.subject}
                        </button>
                      </div>
                    </td>

                    {/* Requester */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="size-7 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-600 font-bold text-[10px] shrink-0">
                          {ticket.requester.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-xs text-zinc-900 truncate">
                            {ticket.requester.name}
                          </span>
                          <span className="text-[11px] text-zinc-400 truncate">
                            {ticket.requester.role}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-full text-[10px] border tracking-tight inline-block",
                          getPriorityBadge(ticket.priority)
                        )}
                      >
                        {ticket.priority}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border",
                          getStatusBadge(ticket.status)
                        )}
                      >
                        <span
                          className={cn(
                            "size-1.5 rounded-full",
                            ticket.status === "Open"
                              ? "bg-amber-500 animate-pulse"
                              : ticket.status === "In Progress"
                              ? "bg-blue-500"
                              : ticket.status === "Resolved"
                              ? "bg-emerald-500"
                              : "bg-zinc-400"
                          )}
                        />
                        {ticket.status}
                      </span>
                    </td>

                    {/* Assigned Specialist */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-zinc-600">
                      {ticket.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <div className="size-5.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200/60 flex items-center justify-center text-[9px] font-bold">
                            {ticket.assignedTo.name[0]}
                          </div>
                          <span className="text-xs font-medium text-zinc-800">
                            {ticket.assignedTo.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-zinc-400 italic">
                          Unassigned
                        </span>
                      )}
                    </td>

                    {/* Updated */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-zinc-400 text-[11px]">
                      {ticket.updatedAt}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => onViewTicket(ticket)}
                          className="h-8 px-2.5 rounded-xl border-zinc-200/80 bg-white text-zinc-700 text-xs font-medium hover:bg-zinc-50 shadow-2xs gap-1.5 cursor-pointer"
                        >
                          <Eye className="size-3.5 text-zinc-500" />
                          <span>View</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-zinc-400">
                      <Search className="size-6 text-zinc-300" />
                      <span className="text-xs font-medium text-zinc-600">
                        No support tickets matched your search criteria
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSearch("")
                          setStatusFilter("all")
                          setPriorityFilter("all")
                          setCategoryFilter("all")
                        }}
                        className="text-xs font-semibold text-brand-orange hover:underline cursor-pointer"
                      >
                        Reset all filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="p-3.5 px-4 bg-zinc-50/50 border-t border-zinc-100 flex flex-wrap items-center justify-between text-xs text-zinc-500">
          <span>
            Showing <strong className="text-zinc-800">{filteredTickets.length}</strong> of{" "}
            {tickets.length} support inquiries
          </span>
          <span className="text-[11px] text-zinc-400">
            Tickets auto-sync every 60s
          </span>
        </div>
      </div>
    </div>
  )
}
