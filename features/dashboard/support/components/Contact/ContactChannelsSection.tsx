"use client"

import * as React from "react"
import {
  MessageSquare,
  Phone,
  Mail,
  UserCheck,
  Clock,
  Copy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function ContactChannelsSection() {
  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email)
    toast.success(`Copied ${email} to clipboard!`)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* 1. Live Chat */}
      <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col justify-between gap-5 group hover:border-brand-orange/40 transition-all">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="size-11 rounded-xl bg-amber-50 text-brand-orange border border-amber-200/70 flex items-center justify-center shadow-2xs">
              <MessageSquare className="size-5" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Specialists Online
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-bold text-zinc-900">
              Interactive Live Chat
            </h3>
            <p className="text-xs text-zinc-500 leading-normal">
              Connect directly with our technical support engineers for immediate troubleshooting and quick platform queries.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-3 border-t border-zinc-100">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Clock className="size-3.5 text-zinc-400" />
            <span>Average first response: <strong>~2 minutes</strong></span>
          </div>
          <Button
            type="button"
            onClick={() => toast.info("Connecting to live chat agent... One moment.")}
            className="w-full h-9.5 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-semibold shadow-2xs cursor-pointer"
          >
            Start Live Conversation
          </Button>
        </div>
      </div>

      {/* 2. Phone Hotline */}
      <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col justify-between gap-5 group hover:border-brand-orange/40 transition-all">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="size-11 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/70 flex items-center justify-center shadow-2xs">
              <Phone className="size-5" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Toll-Free Priority
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-bold text-zinc-900">
              Direct Telephone Hotline
            </h3>
            <p className="text-xs text-zinc-500 leading-normal">
              Speak directly with a senior support engineer for urgent incidents or platform connectivity matters.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-3 border-t border-zinc-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">Hotline Number:</span>
            <span className="font-mono font-bold text-zinc-900">
              +20 (2) 2795-8800
            </span>
          </div>
          <a
            href="tel:+20227958800"
            className="w-full inline-flex items-center justify-center h-9.5 rounded-xl border border-zinc-200/80 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
          >
            Call Technical Support
          </a>
        </div>
      </div>

      {/* 3. Official Email Support */}
      <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col justify-between gap-5 group hover:border-brand-orange/40 transition-all">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="size-11 rounded-xl bg-purple-50 text-purple-600 border border-purple-200/70 flex items-center justify-center shadow-2xs">
              <Mail className="size-5" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
              24/7 Ticketing
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-bold text-zinc-900">
              Official Email Ticketing
            </h3>
            <p className="text-xs text-zinc-500 leading-normal">
              Send detailed reports, logs, and billing inquiries. Every email automatically generates an audited ticket ID.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-3 border-t border-zinc-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">Support Mail:</span>
            <span className="font-mono font-bold text-zinc-900">
              support@lms-platform.com
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleCopyEmail("support@lms-platform.com")}
            className="w-full inline-flex items-center justify-center gap-1.5 h-9.5 rounded-xl border border-zinc-200/80 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
          >
            <Copy className="size-3.5 text-zinc-500" />
            <span>Copy Email Address</span>
          </button>
        </div>
      </div>

      {/* 4. Dedicated Account Representative */}
      <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col justify-between gap-5 group hover:border-brand-orange/40 transition-all">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="size-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/70 flex items-center justify-center shadow-2xs">
              <UserCheck className="size-5" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Enterprise Manager
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-bold text-zinc-900">
              Institutional Account Manager
            </h3>
            <p className="text-xs text-zinc-500 leading-normal">
              Your assigned client success partner for curriculum onboarding, custom contract upgrades, and teacher workshops.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-3 border-t border-zinc-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">Partner:</span>
            <span className="font-semibold text-zinc-900">
              Dina Farouk (Sr. Partner)
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleCopyEmail("dina.farouk@lms-platform.com")}
            className="w-full inline-flex items-center justify-center gap-1.5 h-9.5 rounded-xl border border-zinc-200/80 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
          >
            <Mail className="size-3.5 text-zinc-500" />
            <span>Contact Account Manager</span>
          </button>
        </div>
      </div>
    </div>
  )
}
