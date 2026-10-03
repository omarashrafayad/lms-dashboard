"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ParentProfileHeader } from "../components/profile/ParentProfileHeader"
import { ParentKpiCards } from "../components/profile/ParentKpiCards"
import { ParentTabs, ParentTabKey } from "../components/profile/ParentTabs"
import { ParentOverviewTab } from "../components/profile/ParentOverviewTab"
import { ParentChildrenTab } from "../components/profile/ParentChildrenTab"
import { ParentSubscriptionsTab } from "../components/profile/ParentSubscriptionsTab"
import { ParentTransactionsTab } from "../components/profile/ParentTransactionsTab"
import { ParentPersonalInfoTab } from "../components/profile/ParentPersonalInfoTab"
import { ParentPointsSessionsTab } from "../components/profile/ParentPointsSessionsTab"
import { ParentPaymentRequestsTab } from "../components/profile/ParentPaymentRequestsTab"
import { ParentActivityHistoryTab } from "../components/profile/ParentActivityHistoryTab"
import { useParent, useUpdateParent } from "../hooks/useParents"
import { ParentProfile, ParentLinkedChild } from "../types/parentProfile.types"
import { Loader2, AlertCircle, ChevronLeft } from "lucide-react"
import { toast } from "sonner"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"
import LoadingSpinner from "@/components/shared/LoadingSpinner"

export interface ParentDetailPageProps {
  parentId: string
}

export default function ParentDetailPage({ parentId }: ParentDetailPageProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = React.useState<ParentTabKey>("overview")

  const { data: apiParent, isLoading, isError, error } = useParent(parentId)
  const updateMutation = useUpdateParent()

  const profile = React.useMemo<ParentProfile | null>(() => {
    if (!apiParent) return null

    const fullName =
      apiParent.fullName ||
      `${apiParent.firstName || ""} ${apiParent.lastName || ""}`.trim() ||
      "Parent"

    const initials =
      fullName
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0].toUpperCase())
        .join("") || "P"

    // Format createdAt date
    let regDate = "—"
    if (apiParent.createdAt) {
      try {
        const d = new Date(apiParent.createdAt)
        if (!isNaN(d.getTime())) {
          regDate = d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        }
      } catch (e) {
        // fallback
      }
    }

    // Map linked students from API
    const rawStudents = apiParent.linkedStudents || apiParent.childIds || []
    const mappedChildren: ParentLinkedChild[] = rawStudents.map((student, idx) => {
      const studentName = student.fullName || student.name || `Student ${idx + 1}`
      const studentInitials =
        studentName
          .trim()
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 2)
          .map((n) => n[0].toUpperCase())
          .join("") || "ST"

      return {
        id: student.id || `student-${idx}`,
        studentId: student.id || "",
        name: studentName,
        email: student.email || "",
        avatarInitials: studentInitials,
        avatarColorClass: "bg-blue-100 text-blue-700",
        grade: student.grade || "—",
        stage: student.educationStage || "—",
        educationSystem: "National",
        relationshipStatus: "Linked",
        activeSubscriptionStatus: "Active",
        hasSubscription: true,
      }
    })

    return {
      id: apiParent.id,
      code: `PAR-${(apiParent.id || "").slice(0, 6).toUpperCase()}`,
      name: fullName,
      avatarInitials: initials,
      avatarColorClass: "bg-amber-100 text-amber-800",
      status: apiParent.isActive ? "Active" : "Inactive",
      email: apiParent.email || "—",
      phone: apiParent.phoneNumber || "—",
      registeredDate: regDate,
      kpis: {
        linkedChildren: mappedChildren.length,
        activeSubscriptions: mappedChildren.length,
        pointsBalance: 0,
        pendingRequests: 0,
      },
      linkedChildren: mappedChildren,
      recentActivity: [],
      personalInfo: {
        fullName,
        nationalId: "—",
        email: apiParent.email || "—",
        phone: apiParent.phoneNumber || "—",
        secondaryPhone: "—",
        address: "—",
        city: "—",
        country: "—",
        relationshipToStudents: apiParent.role || "Parent",
        preferredLanguage: "Arabic",
        emergencyContactName: "—",
        emergencyContactPhone: "—",
      },
      subscriptions: [],
      pointsDetails: {
        currentBalance: 0,
        totalEarned: 0,
        totalRedeemed: 0,
        privateSessionsRemaining: 0,
        privateSessionsUsed: 0,
      },
      paymentRequests: [],
      transactions: [],
      activityHistory: [],
    }
  }, [apiParent])

  const handleToggleStatus = async () => {
    if (!apiParent) return
    const nextStatus = !apiParent.isActive
    try {
      await updateMutation.mutateAsync({
        parentId,
        data: {
          firstName: apiParent.firstName,
          lastName: apiParent.lastName,
          email: apiParent.email,
          phoneNumber: apiParent.phoneNumber,
          isActive: nextStatus,
          childIds: (apiParent.linkedStudents || [])
            .map((s) => s.id)
            .filter(Boolean) as string[],
        },
      })
      toast.success(
        nextStatus
          ? "Parent account activated successfully"
          : "Parent account deactivated successfully"
      )
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleEdit = () => {
    router.push(`/parent/${parentId}/edit`)
  }

  // Loading State
  if (isLoading) {
    return (
      <main className="flex-1 p-6 md:p-8 flex flex-col items-center justify-center min-h-[400px]">
        <LoadingSpinner title="Loading parent details..." />
      </main>
    )
  }

  // Error State (when API fails or parent not found)
  if (!profile) {
    return (
      <main className="flex-1 p-6 md:p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md flex flex-col items-center">
          <div className="size-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
            <AlertCircle className="size-6" />
          </div>
          <h2 className="text-lg font-bold text-zinc-900 mb-1">
            Failed to load parent
          </h2>
          <p className="text-xs text-zinc-500 mb-5">
            {error instanceof Error
              ? error.message
              : "Could not retrieve details for this parent."}
          </p>
          <Link
            href="/parent/parent_list"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-orange hover:bg-brand-orange/90 shadow-2xs transition-all"
          >
            <ChevronLeft className="size-4" />
            <span>Back to All Parents</span>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1400px] w-full mx-auto pb-16">
      {/* 1. Header with Back link, Avatar, Active Badge, ID, Deactivate & Edit buttons */}
      <ParentProfileHeader
        profile={profile}
        onDeactivate={handleToggleStatus}
        onEdit={handleEdit}
        isUpdating={updateMutation.isPending}
      />

      {/* 2. Top 4 KPI Cards */}
      <ParentKpiCards kpis={profile.kpis} />

      {/* 3. Tab Navigation Bar */}
      <ParentTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 4. Tab Content */}
      <div className="w-full pt-1">
        {activeTab === "overview" && (
          <ParentOverviewTab
            profile={profile}
            onNavigateToChildrenTab={() => setActiveTab("children")}
          />
        )}

        {activeTab === "personal_info" && (
          <ParentPersonalInfoTab personalInfo={profile.personalInfo} />
        )}

        {activeTab === "children" && (
          <ParentChildrenTab childrenList={profile.linkedChildren} />
        )}

        {activeTab === "subscriptions" && (
          <ParentSubscriptionsTab subscriptions={profile.subscriptions} />
        )}

        {activeTab === "points_sessions" && (
          <ParentPointsSessionsTab pointsDetails={profile.pointsDetails} />
        )}

        {activeTab === "payment_requests" && (
          <ParentPaymentRequestsTab paymentRequests={profile.paymentRequests} />
        )}

        {activeTab === "transactions" && (
          <ParentTransactionsTab transactions={profile.transactions} />
        )}

        {activeTab === "activity_history" && (
          <ParentActivityHistoryTab activityHistory={profile.activityHistory} />
        )}
      </div>
    </main>
  )
}
