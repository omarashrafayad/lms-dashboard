"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import {
  Download,
  Plus,
  UserPlus,
  RefreshCw,
  Sparkles,
} from "lucide-react"
import { SubscriptionsHeaderStats } from "../components/SubscriptionsHeaderStats"
import { SubscriptionsNavTabs, SubscriptionsTabKey } from "../components/SubscriptionsNavTabs"
import { SubscriptionsAnalyticsOverview } from "../components/Overview/SubscriptionsAnalyticsOverview"
import { PlansGridView } from "../components/Plans/PlansGridView"
import { CreatePlanModal } from "../components/Plans/CreatePlanModal"
import { SubscribersTable } from "../components/Subscribers/SubscribersTable"
import { AssignSubscriptionModal } from "../components/Subscribers/AssignSubscriptionModal"
import { TransactionsTable } from "../components/Transactions/TransactionsTable"
import { InvoiceReceiptModal } from "../components/Transactions/InvoiceReceiptModal"
import { RefundModal } from "../components/Transactions/RefundModal"
import { PaymentRequestsView } from "../components/Requests/PaymentRequestsView"
import {
  useSubscriptionStats,
  useSubscriptionPlans,
  useSubscribers,
  useTransactions,
  usePaymentRequests,
  useCreatePlan,
  useUpdatePlan,
  useDeletePlan,
  useAssignSubscriber,
  useUpdateSubscriberStatus,
  useRefundTransaction,
  useReviewPaymentRequest,
} from "../hooks/useSubscriptions"
import {
  SubscriptionPlan,
  TransactionItem,
  SubscriberItem,
} from "../types/subscriptions.types"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import { toast } from "sonner"

interface SubscriptionsMainPageProps {
  initialTab?: SubscriptionsTabKey
}

export function SubscriptionsMainPage({
  initialTab = "overview",
}: SubscriptionsMainPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab") as SubscriptionsTabKey | null

  const [activeTab, setActiveTab] = React.useState<SubscriptionsTabKey>(
    tabParam || initialTab
  )

  // Modals state
  const [isCreatePlanOpen, setIsCreatePlanOpen] = React.useState(false)
  const [editingPlan, setEditingPlan] = React.useState<SubscriptionPlan | null>(null)
  const [isAssignModalOpen, setIsAssignModalOpen] = React.useState(false)
  const [assigningPlan, setAssigningPlan] = React.useState<SubscriptionPlan | null>(null)
  const [viewingInvoice, setViewingInvoice] = React.useState<TransactionItem | null>(null)
  const [refundingTxn, setRefundingTxn] = React.useState<TransactionItem | null>(null)

  // API Hooks
  const { data: stats } = useSubscriptionStats()
  const { data: plans = [], isLoading: isPlansLoading } = useSubscriptionPlans()
  const { data: subscribers = [], isLoading: isSubsLoading } = useSubscribers()
  const { data: transactions = [], isLoading: isTxnsLoading } = useTransactions()
  const { data: paymentRequests = [], isLoading: isReqsLoading } = usePaymentRequests()

  // Mutation Hooks
  const createPlanMutation = useCreatePlan()
  const updatePlanMutation = useUpdatePlan()
  const deletePlanMutation = useDeletePlan()
  const assignSubscriberMutation = useAssignSubscriber()
  const updateSubscriberStatusMutation = useUpdateSubscriberStatus()
  const refundTransactionMutation = useRefundTransaction()
  const reviewPaymentRequestMutation = useReviewPaymentRequest()

  const handleTabChange = (tab: SubscriptionsTabKey) => {
    setActiveTab(tab)
  }

  const handleCreateOrEditPlan = (planData: any) => {
    if (editingPlan) {
      updatePlanMutation.mutate({ id: editingPlan.id, payload: planData })
    } else {
      createPlanMutation.mutate(planData)
    }
  }

  const handleExportReport = () => {
    toast.success("Financial statement for current term exported successfully!")
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Page Header */}
      <PageHeader
        title="Subscriptions & Payments"
        description="Manage curriculum subscription tiers, student enrollment status, transaction ledger, and offline wallet payments."
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              onClick={handleExportReport}
              className="hidden sm:flex items-center gap-2 rounded-xl h-10 px-3.5 border-zinc-200/80 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-medium cursor-pointer shadow-2xs"
            >
              <Download className="size-3.5 text-zinc-400" />
              <span>Export Ledger</span>
            </Button>

            <Button
              onClick={() => {
                setAssigningPlan(null)
                setIsAssignModalOpen(true)
              }}
              variant="outline"
              className="flex items-center gap-2 rounded-xl h-10 px-3.5 border-zinc-200/80 bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-medium cursor-pointer shadow-2xs"
            >
              <UserPlus className="size-3.5 text-[#F59E0B]" />
              <span>Assign Plan</span>
            </Button>

            <Button
              onClick={() => {
                setEditingPlan(null)
                setIsCreatePlanOpen(true)
              }}
              className="bg-[#F59E0B] hover:bg-amber-500 text-white font-medium rounded-xl h-10 px-4 gap-2 text-xs shadow-2xs cursor-pointer transition-all hover:brightness-95 active:scale-[0.98]"
            >
              <Plus className="size-4 stroke-[2.5]" />
              <span>Create Plan</span>
            </Button>
          </div>
        }
      />

      {/* Main Content Hub */}
      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-7xl w-full mx-auto pb-24">
        {/* Top 4 KPI Metric Cards */}
        <SubscriptionsHeaderStats
          stats={stats}
          onSelectTab={handleTabChange}
        />

        {/* Tab Navigation Switcher */}
        <SubscriptionsNavTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          subscribersCount={subscribers.length}
          plansCount={plans.length}
          requestsCount={paymentRequests.filter((r) => r.status === "Pending").length}
        />

        {/* Tab Content Display */}
        {activeTab === "overview" && (
          <SubscriptionsAnalyticsOverview
            stats={stats}
            plans={plans}
            recentTransactions={transactions}
            subscribers={subscribers}
            onSelectTab={handleTabChange}
            onAssignNew={() => {
              setAssigningPlan(null)
              setIsAssignModalOpen(true)
            }}
            onAddNewPlan={() => {
              setEditingPlan(null)
              setIsCreatePlanOpen(true)
            }}
          />
        )}

        {activeTab === "plans" && (
          <PlansGridView
            plans={plans}
            onAddNewPlan={() => {
              setEditingPlan(null)
              setIsCreatePlanOpen(true)
            }}
            onEditPlan={(plan) => {
              setEditingPlan(plan)
              setIsCreatePlanOpen(true)
            }}
            onDeletePlan={(id) => deletePlanMutation.mutate(id)}
            onAssignPlan={(plan) => {
              setAssigningPlan(plan)
              setIsAssignModalOpen(true)
            }}
          />
        )}

        {activeTab === "subscribers" && (
          <SubscribersTable
            subscribers={subscribers}
            isLoading={isSubsLoading}
            onStatusChange={(id, status) =>
              updateSubscriberStatusMutation.mutate({ id, status })
            }
            onAssignNew={() => {
              setAssigningPlan(null)
              setIsAssignModalOpen(true)
            }}
          />
        )}

        {activeTab === "transactions" && (
          <TransactionsTable
            transactions={transactions}
            isLoading={isTxnsLoading}
            onViewInvoice={(t) => setViewingInvoice(t)}
            onRefund={(t) => setRefundingTxn(t)}
          />
        )}

        {/* {activeTab === "requests" && (
          <PaymentRequestsView
            requests={paymentRequests}
            isLoading={isReqsLoading}
            onApprove={(id) => reviewPaymentRequestMutation.mutate({ id, status: "Approved" })}
            onReject={(id) => reviewPaymentRequestMutation.mutate({ id, status: "Rejected" })}
          />
        )} */}
      </main>

      {/* Modals & Dialogs */}
      <CreatePlanModal
        isOpen={isCreatePlanOpen}
        onClose={() => setIsCreatePlanOpen(false)}
        onSave={handleCreateOrEditPlan}
        initialPlan={editingPlan}
      />

      <AssignSubscriptionModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onAssign={(payload) => assignSubscriberMutation.mutate(payload)}
        plans={plans}
        initialPlan={assigningPlan}
      />

      <InvoiceReceiptModal
        isOpen={Boolean(viewingInvoice)}
        onClose={() => setViewingInvoice(null)}
        transaction={viewingInvoice}
      />

      <RefundModal
        isOpen={Boolean(refundingTxn)}
        onClose={() => setRefundingTxn(null)}
        onConfirm={(reason) => {
          if (refundingTxn) {
            refundTransactionMutation.mutate({ id: refundingTxn.id, reason })
          }
        }}
        transaction={refundingTxn}
      />
    </div>
  )
}
