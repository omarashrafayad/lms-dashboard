"use client"

import * as React from "react"
import { Lock } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { LessonAccessSettings } from "../../types/curriculum.types"

export interface LessonSettingsCardProps {
  settings: LessonAccessSettings
  onSettingsChange?: (settings: LessonAccessSettings) => void
}

export function LessonSettingsCard({
  settings: initialSettings,
  onSettingsChange,
}: LessonSettingsCardProps) {
  const [settings, setSettings] = React.useState<LessonAccessSettings>(initialSettings)

  const handleToggle = (key: keyof LessonAccessSettings) => {
    const updated = { ...settings, [key]: !settings[key] }
    setSettings(updated)
    onSettingsChange?.(updated)
  }

  return (
    <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="size-8 rounded-lg bg-zinc-100 text-zinc-600 flex items-center justify-center shrink-0">
          <Lock className="size-4" />
        </div>
        <div className="flex flex-col">
          <h3 className="font-bold text-sm text-zinc-900">
            Access & Offline Settings
          </h3>
          <span className="text-xs text-zinc-400">
            Control who can access this lesson and what can be downloaded.
          </span>
        </div>
      </div>

      {/* Settings list with toggles */}
      <div className="flex flex-col divide-y divide-zinc-100">
        {/* Free Plan: First Video Only */}
        <div className="flex items-center justify-between py-3.5 first:pt-1">
          <div className="flex flex-col pr-4">
            <span className="font-semibold text-xs text-zinc-900">
              Free Plan: First Video Only
            </span>
            <span className="text-[11px] text-zinc-400">
              Free students can view the first video only.
            </span>
          </div>
          <Switch
            checked={settings.freePlanFirstVideoOnly}
            onCheckedChange={() => handleToggle("freePlanFirstVideoOnly")}
          />
        </div>

        {/* Premium Content */}
        <div className="flex items-center justify-between py-3.5">
          <div className="flex flex-col pr-4">
            <span className="font-semibold text-xs text-zinc-900">
              Premium Content
            </span>
            <span className="text-[11px] text-zinc-400">
              Premium students get full lesson content.
            </span>
          </div>
          <Switch
            checked={settings.premiumContent}
            onCheckedChange={() => handleToggle("premiumContent")}
          />
        </div>

        {/* Video Offline Download */}
        <div className="flex items-center justify-between py-3.5">
          <div className="flex flex-col pr-4">
            <span className="font-semibold text-xs text-zinc-900">
              Video Offline Download
            </span>
            <span className="text-[11px] text-zinc-400">
              Students can save videos for offline viewing.
            </span>
          </div>
          <Switch
            checked={settings.videoOfflineDownload}
            onCheckedChange={() => handleToggle("videoOfflineDownload")}
          />
        </div>

        {/* PDF Offline Download */}
        <div className="flex items-center justify-between py-3.5 last:pb-1">
          <div className="flex flex-col pr-4">
            <span className="font-semibold text-xs text-zinc-900">
              PDF Offline Download
            </span>
            <span className="text-[11px] text-zinc-400">
              Students can download the lesson PDF.
            </span>
          </div>
          <Switch
            checked={settings.pdfOfflineDownload}
            onCheckedChange={() => handleToggle("pdfOfflineDownload")}
          />
        </div>
      </div>
    </div>
  )
}
