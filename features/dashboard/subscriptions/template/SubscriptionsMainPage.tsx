"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import {
  Download,
  Plus,
  UserPlus,
  CreditCard,
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
import { RecordPaymentModal } from "../components/Transactions/RecordPaymentModal"
import {
  useSubscriptionStats,
  useSubscriptionPlans,
  useSubscribers,
  usePayments,
  useCreatePlan,
  useUpdatePlan,
  useDeletePlan,
  useAssignSubscriber,
  useUpdateSubscriberStatus,
  useRefundPayment,
  useRecordPayment,
  useReviewPayment,
  useMarkPaymentFailed,
} from "../hooks/useSubscriptions"
import {
  SubscriptionPlan,
  TransactionItem,
  CreatePlanPayload,
  AssignPlanPayload,
  RecordPaymentPayload,
} from "../types/subscriptions.types"
import { exportPaymentsLedger } from "../api/subscriptionsApi"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import GlobalError from "@/components/shared/globalerror"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"
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
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = React.useState(false)
  const [viewingInvoice, setViewingInvoice] = React.useState<TransactionItem | null>(null)
  const [refundingTxn, setRefundingTxn] = React.useState<TransactionItem | null>(null)

  // API Hooks
  const {
    data: stats,
    isLoading: isStatsLoading,
    isError: isStatsError,
  } = useSubscriptionStats()

  const {
    data: plans = [],
    isLoading: isPlansLoading,
    isError: isPlansError,
  } = useSubscriptionPlans()

  const {
    data: subscribers = [],
    isLoading: isSubsLoading,
    isError: isSubsError,
  } = useSubscribers()

  const {
    data: paymentsResponse,
    isLoading: isTxnsLoading,
    isError: isTxnsError,
  } = usePayments()

  const transactions = paymentsResponse?.items || []

  // Mutation Hooks
  const createPlanMutation = useCreatePlan()
  const updatePlanMutation = useUpdatePlan()
  const deletePlanMutation = useDeletePlan()
  const assignSubscriberMutation = useAssignSubscriber()
  const updateSubscriberStatusMutation = useUpdateSubscriberStatus()
  const refundPaymentMutation = useRefundPayment()
  const recordPaymentMutation = useRecordPayment()
  const reviewPaymentMutation = useReviewPayment()
  const markPaymentFailedMutation = useMarkPaymentFailed()

  const handleTabChange = (tab: SubscriptionsTabKey) => {
    setActiveTab(tab)
  }

  const handleCreateOrEditPlan = async (planData: CreatePlanPayload) => {
    try {
      if (editingPlan) {
        await updatePlanMutation.mutateAsync({ id: editingPlan.id, payload: planData })
        toast.success(`Plan "${planData.name}" updated successfully!`)
      } else {
        await createPlanMutation.mutateAsync(planData)
        toast.success(`Plan "${planData.name}" created successfully!`)
      }
      setIsCreatePlanOpen(false)
      setEditingPlan(null)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleDeletePlan = async (id: string) => {
    try {
      await deletePlanMutation.mutateAsync(id)
      toast.success("Subscription plan deleted successfully!")
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleAssignSubscriber = async (payload: AssignPlanPayload) => {
    try {
      await assignSubscriberMutation.mutateAsync(payload)
      toast.success("Student successfully enrolled in plan!")
      setIsAssignModalOpen(false)
      setAssigningPlan(null)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateSubscriberStatusMutation.mutateAsync({ id, status })
      toast.success(`Subscription status updated to ${status}`)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleRecordPayment = async (payload: RecordPaymentPayload) => {
    try {
      await recordPaymentMutation.mutateAsync(payload)
      toast.success("Payment recorded successfully!")
      setIsRecordPaymentOpen(false)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleApprovePayment = async (id: string) => {
    try {
      await reviewPaymentMutation.mutateAsync({ id, approve: true })
      toast.success("Payment approved successfully!")
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleRejectPayment = async (id: string) => {
    try {
      await reviewPaymentMutation.mutateAsync({ id, approve: false })
      toast.success("Payment rejected!")
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleMarkPaymentFailed = async (id: string) => {
    try {
      await markPaymentFailedMutation.mutateAsync(id)
      toast.success("Payment marked as failed")
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleRefund = async (reason: string) => {
    if (!refundingTxn) return
    try {
      await refundPaymentMutation.mutateAsync({ id: refundingTxn.id, reason })
      toast.success("Payment refunded successfully!")
      setRefundingTxn(null)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleExportReport = async () => {
    try {
      await exportPaymentsLedger()
      toast.success("Payments ledger export initiated successfully!")
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const isGlobalLoading =
    activeTab === "overview" && (isStatsLoading || isPlansLoading || isSubsLoading)
  const isGlobalError = isStatsError || isPlansError

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
              onClick={() => setIsRecordPaymentOpen(true)}
              variant="outline"
              className="flex items-center gap-2 rounded-xl h-10 px-3.5 border-emerald-200/80 bg-emerald-50/60 hover:bg-emerald-50 text-emerald-800 text-xs font-semibold cursor-pointer shadow-2xs transition-all"
            >
              <CreditCard className="size-3.5 text-emerald-600" />
              <span>Record Payment</span>
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
        />

        {/* Tab Content Display */}
        {isGlobalLoading ? (
          <LoadingSpinner title="Loading subscription data..." />
        ) : isGlobalError ? (
          <GlobalError />
        ) : (
          <>
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
              isPlansLoading ? (
                <LoadingSpinner title="Loading pricing plans..." />
              ) : (
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
                  onDeletePlan={handleDeletePlan}
                  onAssignPlan={(plan) => {
                    setAssigningPlan(plan)
                    setIsAssignModalOpen(true)
                  }}
                />
              )
            )}

            {activeTab === "subscribers" && (
              <SubscribersTable
                subscribers={subscribers}
                isLoading={isSubsLoading}
                onStatusChange={handleStatusChange}
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
                onRecordPayment={() => setIsRecordPaymentOpen(true)}
                onApprove={handleApprovePayment}
                onReject={handleRejectPayment}
                onMarkFailed={handleMarkPaymentFailed}
              />
            )}
          </>
        )}
      </main>

      {/* Modals & Dialogs */}
      <CreatePlanModal
        isOpen={isCreatePlanOpen}
        onClose={() => {
          setIsCreatePlanOpen(false)
          setEditingPlan(null)
        }}
        onSave={handleCreateOrEditPlan}
        initialPlan={editingPlan}
      />

      <AssignSubscriptionModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false)
          setAssigningPlan(null)
        }}
        onAssign={handleAssignSubscriber}
        plans={plans}
        initialPlan={assigningPlan}
      />

      <RecordPaymentModal
        isOpen={isRecordPaymentOpen}
        onClose={() => setIsRecordPaymentOpen(false)}
        onRecord={handleRecordPayment}
      />

      <InvoiceReceiptModal
        isOpen={Boolean(viewingInvoice)}
        onClose={() => setViewingInvoice(null)}
        transaction={viewingInvoice}
      />

      <RefundModal
        isOpen={Boolean(refundingTxn)}
        onClose={() => setRefundingTxn(null)}
        onConfirm={handleRefund}
        transaction={refundingTxn}
      />
    </div>
  )
}
