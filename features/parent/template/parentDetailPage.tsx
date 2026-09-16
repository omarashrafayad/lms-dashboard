"use client"

import * as React from "react"
import { getParentProfile } from "../data/mockParentProfile"
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

export interface ParentDetailPageProps {
  parentId: string
}

export default function ParentDetailPage({ parentId }: ParentDetailPageProps) {
  const [activeTab, setActiveTab] = React.useState<ParentTabKey>("overview")

  const profile = React.useMemo(() => {
    return getParentProfile(parentId)
  }, [parentId])

  return (
    <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1400px] w-full mx-auto pb-16">
      {/* 1. Header with Back link, Avatar, Active Badge, ID, Deactivate & Edit buttons */}
      <ParentProfileHeader
        profile={profile}
        onDeactivate={() => {
          alert(`Deactivate clicked for ${profile.name}`)
        }}
        onEdit={() => {
          alert(`Edit clicked for ${profile.name}`)
        }}
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
