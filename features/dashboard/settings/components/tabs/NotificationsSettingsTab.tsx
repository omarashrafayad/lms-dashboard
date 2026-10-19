"use client"

import * as React from "react"
import { Bell, Mail, Smartphone, MessageSquareText } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { NotificationSettings } from "../../types/settings.types"

interface NotificationsSettingsTabProps {
  settings: NotificationSettings
  onChange: (updated: Partial<NotificationSettings>) => void
}

export function NotificationsSettingsTab({
  settings,
  onChange,
}: NotificationsSettingsTabProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Email Notifications */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs">
        <div className="flex items-start gap-4 pb-5 border-b border-zinc-100">
          <div className="size-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-blue-600">
            <Mail className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-900 tracking-tight">
              Email Notifications
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Select which events and transaction updates trigger email notices to the admin address.
            </p>
          </div>
        </div>

        <div className="flex flex-col divide-y divide-zinc-100">
          {/* Item 1 */}
          <div className="flex items-center justify-between py-4">
            <div className="flex flex-col gap-0.5 pr-4">
              <span className="text-xs font-semibold text-zinc-900">
                New Student Registrations
              </span>
              <span className="text-[11px] text-zinc-400">
                Send an immediate email whenever a student signs up or completes their profile.
              </span>
            </div>
            <Switch
              checked={settings.emailNewStudentEnrollment}
              onCheckedChange={(checked) =>
                onChange({ emailNewStudentEnrollment: checked })
              }
            />
          </div>

          {/* Item 2 */}
          <div className="flex items-center justify-between py-4">
            <div className="flex flex-col gap-0.5 pr-4">
              <span className="text-xs font-semibold text-zinc-900">
                Session Booking Requests & Reschedules
              </span>
              <span className="text-[11px] text-zinc-400">
                Receive notifications when a private tutoring session or group lecture is requested.
              </span>
            </div>
            <Switch
              checked={settings.emailBookingRequests}
              onCheckedChange={(checked) =>
                onChange({ emailBookingRequests: checked })
              }
            />
          </div>

          {/* Item 3 */}
          <div className="flex items-center justify-between py-4">
            <div className="flex flex-col gap-0.5 pr-4">
              <span className="text-xs font-semibold text-zinc-900">
                Billing & Subscription Payments
              </span>
              <span className="text-[11px] text-zinc-400">
                Get transactional receipts and alerts for completed renewals and refunds.
              </span>
            </div>
            <Switch
              checked={settings.emailPaymentTransactions}
              onCheckedChange={(checked) =>
                onChange({ emailPaymentTransactions: checked })
              }
            />
          </div>

          {/* Item 4 */}
          <div className="flex items-center justify-between py-4">
            <div className="flex flex-col gap-0.5 pr-4">
              <span className="text-xs font-semibold text-zinc-900">
                Weekly Executive Digest
              </span>
              <span className="text-[11px] text-zinc-400">
                Receive a weekly Monday morning summary of active attendees, revenue, and teacher ratings.
              </span>
            </div>
            <Switch
              checked={settings.emailWeeklyDigest}
              onCheckedChange={(checked) =>
                onChange({ emailWeeklyDigest: checked })
              }
            />
          </div>
        </div>
      </div>

      {/* In-App & Mobile Push Notifications */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs">
        <div className="flex items-start gap-4 pb-5 border-b border-zinc-100">
          <div className="size-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 text-brand-orange">
            <Bell className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-900 tracking-tight">
              In-App & Mobile Push Alerts
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Live badges and sound notifications inside the LMS browser dashboard and mobile companion apps.
            </p>
          </div>
        </div>

        <div className="flex flex-col divide-y divide-zinc-100">
          {/* Push Item 1 */}
          <div className="flex items-center justify-between py-4">
            <div className="flex flex-col gap-0.5 pr-4">
              <span className="text-xs font-semibold text-zinc-900">
                Upcoming Session Reminders (15 mins prior)
              </span>
              <span className="text-[11px] text-zinc-400">
                Alert admins and educators before classroom streams or private 1-on-1 sessions kick off.
              </span>
            </div>
            <Switch
              checked={settings.pushSessionReminders}
              onCheckedChange={(checked) =>
                onChange({ pushSessionReminders: checked })
              }
            />
          </div>

          {/* Push Item 2 */}
          <div className="flex items-center justify-between py-4">
            <div className="flex flex-col gap-0.5 pr-4">
              <span className="text-xs font-semibold text-zinc-900">
                Direct Messaging & Chat Alerts
              </span>
              <span className="text-[11px] text-zinc-400">
                Pop-up indicator when teachers, parents, or staff post an urgent inquiry.
              </span>
            </div>
            <Switch
              checked={settings.pushDirectMessages}
              onCheckedChange={(checked) =>
                onChange({ pushDirectMessages: checked })
              }
            />
          </div>

          {/* Push Item 3 */}
          <div className="flex items-center justify-between py-4">
            <div className="flex flex-col gap-0.5 pr-4">
              <span className="text-xs font-semibold text-zinc-900">
                System Infrastructure & Service Alerts
              </span>
              <span className="text-[11px] text-zinc-400">
                Immediate notification if cloud storage, video transcoding, or database latency rises.
              </span>
            </div>
            <Switch
              checked={settings.pushSystemAlerts}
              onCheckedChange={(checked) =>
                onChange({ pushSystemAlerts: checked })
              }
            />
          </div>
        </div>
      </div>

      {/* SMS & WhatsApp Emergency Broadcasts */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs">
        <div className="flex items-start gap-4 pb-5 border-b border-zinc-100">
          <div className="size-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
            <Smartphone className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-900 tracking-tight">
              SMS Emergency Broadcasts
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              High-priority carrier SMS alerts delivered directly to verified administrative mobile numbers.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-5">
          <div className="flex flex-col gap-0.5 pr-4">
            <span className="text-xs font-semibold text-zinc-900">
              Critical Security & Severe Disruption Alerts
            </span>
            <span className="text-[11px] text-zinc-400">
              Only sends text messages for emergency weather cancellations or suspicious account takeovers.
            </span>
          </div>
          <Switch
            checked={settings.smsUrgentAlerts}
            onCheckedChange={(checked) =>
              onChange({ smsUrgentAlerts: checked })
            }
          />
        </div>
      </div>
    </div>
  )
}
