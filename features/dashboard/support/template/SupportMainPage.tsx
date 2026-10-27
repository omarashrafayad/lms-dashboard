"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { SupportStatsCards } from "../components/SupportStatsCards"
import { SupportNavTabs } from "../components/SupportNavTabs"
import { SupportTicketsTable } from "../components/Tickets/SupportTicketsTable"
import { CreateTicketModal } from "../components/Tickets/CreateTicketModal"
import { TicketDetailModal } from "../components/Tickets/TicketDetailModal"
import { SupportFaqSection } from "../components/Faq/SupportFaqSection"
import { SystemStatusSection } from "../components/Status/SystemStatusSection"
import { ContactChannelsSection } from "../components/Contact/ContactChannelsSection"
import {
  INITIAL_SUPPORT_STATS,
  INITIAL_SUPPORT_TICKETS,
  SUPPORT_FAQS,
  SYSTEM_SERVICES_STATUS,
} from "../data/supportMockData"
import {
  SupportTabKey,
  SupportTicket,
  TicketStatus,
  TicketMessage,
} from "../types/support.types"
import { toast } from "sonner"

export function SupportMainPage() {
  const [activeTab, setActiveTab] = React.useState<SupportTabKey>("tickets")
  const [stats, setStats] = React.useState(INITIAL_SUPPORT_STATS)
  const [tickets, setTickets] = React.useState<SupportTicket[]>(INITIAL_SUPPORT_TICKETS)
  const [selectedTicket, setSelectedTicket] = React.useState<SupportTicket | null>(null)
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)

  // Handle new ticket creation
  const handleCreateTicket = (
    newTicketData: Omit<SupportTicket, "id" | "createdAt" | "updatedAt" | "messagesCount">
  ) => {
    const newId = `TICK-${1049 + tickets.length}`
    const newTicket: SupportTicket = {
      ...newTicketData,
      id: newId,
      createdAt: "Just now",
      updatedAt: "Just now",
      messagesCount: 1,
      messages: [
        {
          id: `m-${Date.now()}`,
          author: newTicketData.requester.name,
          authorRole: "Admin",
          content: newTicketData.description,
          createdAt: "Just now",
          isStaff: false,
        },
      ],
    }

    setTickets([newTicket, ...tickets])
    setStats((prev) => ({
      ...prev,
      totalTickets: prev.totalTickets + 1,
      openTickets: prev.openTickets + 1,
    }))
  }

  // Handle status changes (e.g. mark resolved)
  const handleUpdateStatus = (ticketId: string, newStatus: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: newStatus,
            updatedAt: "Just now",
          }
        }
        return t
      })
    )

    if (selectedTicket?.id === ticketId) {
      setSelectedTicket((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              updatedAt: "Just now",
            }
          : null
      )
    }

    if (newStatus === "Resolved") {
      setStats((prev) => ({
        ...prev,
        openTickets: Math.max(0, prev.openTickets - 1),
        resolvedCount: prev.resolvedCount + 1,
      }))
    }
  }

  // Handle adding messages in thread
  const handleAddMessage = (ticketId: string, message: TicketMessage) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const updatedMessages = [...(t.messages || []), message]
          return {
            ...t,
            messages: updatedMessages,
            messagesCount: updatedMessages.length,
            updatedAt: "Just now",
          }
        }
        return t
      })
    )

    if (selectedTicket?.id === ticketId) {
      setSelectedTicket((prev) => {
        if (!prev) return null
        const updated = [...(prev.messages || []), message]
        return {
          ...prev,
          messages: updated,
          messagesCount: updated.length,
          updatedAt: "Just now",
        }
      })
    }
  }

  const openTicketsCount = tickets.filter(
    (t) => t.status === "Open" || t.status === "In Progress"
  ).length

  return (
    <div className="flex flex-col min-h-full">
      {/* Page Header matching design system */}
      <PageHeader
        title="Help & Technical Support"
        description="Manage institutional support inquiries, browse troubleshooting guides, and monitor cloud platform uptime."
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setActiveTab("status")
                toast.info("Viewing live system health indicators")
              }}
              className="h-10 px-3.5 rounded-xl border-zinc-200/80 bg-white text-zinc-700 text-xs font-semibold hover:bg-zinc-50 shadow-2xs cursor-pointer gap-1.5"
            >
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>System Status</span>
            </Button>

            <Button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="h-10 px-4 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-semibold shadow-2xs gap-1.5 cursor-pointer"
            >
              <Plus className="size-4 stroke-[2.5]" />
              <span>New Ticket</span>
            </Button>
          </div>
        }
      />

      {/* Main content body */}
      <main className="flex-1 p-8 flex flex-col gap-6 max-w-[1400px] w-full">
        {/* KPI Stats Section */}
        <SupportStatsCards stats={stats} />

        {/* Navigation Tabs */}
        <SupportNavTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          openTicketsCount={openTicketsCount}
          faqCount={SUPPORT_FAQS.length}
        />

        {/* Tab View Container */}
        <div className="w-full">
          {activeTab === "tickets" && (
            <SupportTicketsTable
              tickets={tickets}
              onViewTicket={(ticket) => setSelectedTicket(ticket)}
              onCreateTicket={() => setIsCreateOpen(true)}
              onUpdateStatus={handleUpdateStatus}
            />
          )}

          {activeTab === "faq" && (
            <SupportFaqSection
              faqs={SUPPORT_FAQS}
              onOpenTicketModal={() => setIsCreateOpen(true)}
            />
          )}

          {activeTab === "status" && (
            <SystemStatusSection services={SYSTEM_SERVICES_STATUS} />
          )}

          {activeTab === "contact" && <ContactChannelsSection />}
        </div>
      </main>

      {/* Create Ticket Modal */}
      <CreateTicketModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmitTicket={handleCreateTicket}
      />

      {/* Ticket Details & Discussion Modal */}
      <TicketDetailModal
        ticket={selectedTicket}
        open={!!selectedTicket}
        onOpenChange={(open) => !open && setSelectedTicket(null)}
        onStatusChange={handleUpdateStatus}
        onAddMessage={handleAddMessage}
      />
    </div>
  )
}
