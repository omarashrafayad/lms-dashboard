"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import { Save, RotateCcw, Check, Loader2 } from "lucide-react"
import { SettingsNavTabs } from "../components/SettingsNavTabs"
import { GeneralSettingsTab } from "../components/tabs/GeneralSettingsTab"
import { ProfileSettingsTab } from "../components/tabs/ProfileSettingsTab"
import { NotificationsSettingsTab } from "../components/tabs/NotificationsSettingsTab"
import { SystemSettingsTab } from "../components/tabs/SystemSettingsTab"
import { SecuritySettingsTab } from "../components/tabs/SecuritySettingsTab"
import { INITIAL_SETTINGS_STATE } from "../data/settingsMockData"
import {
  SettingsTabKey,
  AppSettingsState,
  GeneralSettings,
  ProfileSettings,
  NotificationSettings,
  SystemSettings,
  SecuritySettings,
} from "../types/settings.types"
import { toast } from "sonner"

export function SettingsMainPage() {
  const [activeTab, setActiveTab] = React.useState<SettingsTabKey>("general")
  const [settings, setSettings] = React.useState<AppSettingsState>(INITIAL_SETTINGS_STATE)
  const [isSaving, setIsSaving] = React.useState(false)
  const [hasChanges, setHasChanges] = React.useState(false)

  const updateGeneral = (updated: Partial<GeneralSettings>) => {
    setSettings((prev) => ({
      ...prev,
      general: { ...prev.general, ...updated },
    }))
    setHasChanges(true)
  }

  const updateProfile = (updated: Partial<ProfileSettings>) => {
    setSettings((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...updated },
    }))
    setHasChanges(true)
  }

  const updateNotifications = (updated: Partial<NotificationSettings>) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, ...updated },
    }))
    setHasChanges(true)
  }

  const updateSystem = (updated: Partial<SystemSettings>) => {
    setSettings((prev) => ({
      ...prev,
      system: { ...prev.system, ...updated },
    }))
    setHasChanges(true)
  }

  const updateSecurity = (updated: Partial<SecuritySettings>) => {
    setSettings((prev) => ({
      ...prev,
      security: { ...prev.security, ...updated },
    }))
    setHasChanges(true)
  }

  const handleSaveChanges = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setHasChanges(false)
      toast.success("Settings saved successfully!")
    }, 600)
  }

  const handleResetDefaults = () => {
    setSettings(INITIAL_SETTINGS_STATE)
    setHasChanges(false)
    toast.info("Settings restored to default configurations")
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Page Header */}
      <PageHeader
        title="Settings & System Configuration"
        description="Manage your institutional academy profile, administrator credentials, notification rules, and security preferences."
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={handleResetDefaults}
              className="h-10 px-3.5 rounded-xl border-zinc-200/80 bg-white text-zinc-700 text-xs font-semibold hover:bg-zinc-50 shadow-2xs cursor-pointer gap-1.5"
            >
              <RotateCcw className="size-3.5 text-zinc-400" />
              <span>Reset</span>
            </Button>

            <Button
              type="button"
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="h-10 px-4 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-semibold shadow-2xs gap-1.5 cursor-pointer disabled:opacity-70 transition-all"
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="size-4 stroke-[2.5]" />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </div>
        }
      />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1400px] w-full">
        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <SettingsNavTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {hasChanges && (
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-full animate-fade-in">
              • Unsaved changes
            </span>
          )}
        </div>

        {/* Tab View Container */}
        <div className="w-full">
          {activeTab === "general" && (
            <GeneralSettingsTab
              settings={settings.general}
              onChange={updateGeneral}
            />
          )}

          {activeTab === "profile" && (
            <ProfileSettingsTab
              settings={settings.profile}
              onChange={updateProfile}
            />
          )}

          {activeTab === "notifications" && (
            <NotificationsSettingsTab
              settings={settings.notifications}
              onChange={updateNotifications}
            />
          )}

          {activeTab === "system" && (
            <SystemSettingsTab
              settings={settings.system}
              onChange={updateSystem}
            />
          )}

          {activeTab === "security" && (
            <SecuritySettingsTab
              settings={settings.security}
              onChange={updateSecurity}
            />
          )}
        </div>
      </main>
    </div>
  )
}
