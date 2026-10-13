"use client"

import * as React from "react"
import {
  Search,
  ChevronDown,
  HelpCircle,
  BookOpen,
  MessageCircle,
  ExternalLink,
  Sparkles,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { FaqItem } from "../../types/support.types"

interface SupportFaqSectionProps {
  faqs: FaqItem[]
  onOpenTicketModal: () => void
}

export function SupportFaqSection({
  faqs,
  onOpenTicketModal,
}: SupportFaqSectionProps) {
  const [search, setSearch] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All")
  const [openFaqIds, setOpenFaqIds] = React.useState<Record<string, boolean>>({
    "faq-1": true,
  })

  const categories = [
    "All",
    "Curriculum & Video Playback",
    "Subscriptions & Invoicing",
    "Exams & Grading",
    "Platform Access & Security",
  ]

  const toggleFaq = (id: string) => {
    setOpenFaqIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const filteredFaqs = React.useMemo(() => {
    return faqs.filter((faq) => {
      const matchCategory =
        selectedCategory === "All" || faq.category === selectedCategory
      const matchSearch =
        faq.question.toLowerCase().includes(search.toLowerCase()) ||
        faq.answer.toLowerCase().includes(search.toLowerCase())
      return matchCategory && matchSearch
    })
  }, [faqs, search, selectedCategory])

  return (
    <div className="flex flex-col gap-6">
      {/* Knowledge Base Search Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white p-8 overflow-hidden shadow-sm">
        <div className="absolute -right-12 -bottom-12 size-64 rounded-full bg-brand-orange/15 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center text-center max-w-xl mx-auto gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold backdrop-blur-xs border border-white/10">
            <Sparkles className="size-3.5" />
            <span>LMS Knowledge Base & Guides</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            How can our support team help you today?
          </h2>
          <p className="text-xs text-zinc-400 font-normal">
            Browse step-by-step guides, troubleshooting workflows, and operational instructions for instructors and administrators.
          </p>

          <div className="relative w-full max-w-md mt-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <Input
              type="text"
              placeholder="Search tutorials, error codes, playback FAQs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9.5 h-10 rounded-xl bg-white/95 text-zinc-900 text-xs border-0 focus-visible:ring-2 focus-visible:ring-brand-orange shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer border",
              selectedCategory === cat
                ? "bg-zinc-900 text-white border-zinc-900 shadow-2xs font-semibold"
                : "bg-white text-zinc-600 border-zinc-200/80 hover:bg-zinc-50 hover:text-zinc-900"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQs Accordion */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Accordion list */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = !!openFaqIds[faq.id]
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl border border-zinc-200/80 bg-white shadow-2xs overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-4.5 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-zinc-50/60 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-7 rounded-lg bg-amber-50 text-brand-orange flex items-center justify-center shrink-0">
                        <BookOpen className="size-3.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                          {faq.category}
                        </span>
                        <span className="text-xs font-bold text-zinc-900">
                          {faq.question}
                        </span>
                      </div>
                    </div>

                    <ChevronDown
                      className={cn(
                        "size-4 text-zinc-400 shrink-0 transition-transform duration-200",
                        isOpen && "rotate-180 text-zinc-800"
                      )}
                    />
                  </button>

                  {isOpen && (
                    <div className="p-4.5 pt-0 text-xs text-zinc-600 leading-relaxed font-normal border-t border-zinc-100 bg-zinc-50/30">
                      {faq.answer}
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <div className="p-8 rounded-2xl border border-dashed border-zinc-200 bg-white text-center flex flex-col items-center justify-center gap-2">
              <HelpCircle className="size-6 text-zinc-300" />
              <span className="text-xs font-semibold text-zinc-700">
                No articles matching "{search}"
              </span>
              <button
                type="button"
                onClick={() => {
                  setSearch("")
                  setSelectedCategory("All")
                }}
                className="text-xs text-brand-orange font-semibold hover:underline cursor-pointer"
              >
                Clear search filter
              </button>
            </div>
          )}
        </div>

        {/* Right: Quick Help & Escalation Card */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50/70 via-white to-amber-50/30 border border-amber-200/70 shadow-2xs flex flex-col gap-4">
            <div className="size-10 rounded-xl bg-amber-100 text-brand-orange flex items-center justify-center shadow-2xs">
              <MessageCircle className="size-5" />
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-bold text-zinc-900">
                Still have questions?
              </h3>
              <p className="text-xs text-zinc-500 font-normal leading-normal">
                If the documentation doesn't solve your issue, our senior engineers and pedagogical support team can assist you directly.
              </p>
            </div>

            <Button
              type="button"
              onClick={onOpenTicketModal}
              className="h-9 px-4 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-semibold shadow-2xs cursor-pointer"
            >
              Open Support Ticket
            </Button>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-3">
            <span className="text-xs font-bold text-zinc-900">
              Popular Guides & Resources
            </span>
            <div className="flex flex-col divide-y divide-zinc-100 text-xs">
              <a
                href="#curriculum"
                className="py-2.5 text-zinc-600 hover:text-brand-orange flex items-center justify-between transition-colors"
              >
                <span>Encoding 1080p Videos for Offline Caching</span>
                <ExternalLink className="size-3 text-zinc-400" />
              </a>
              <a
                href="#subscriptions"
                className="py-2.5 text-zinc-600 hover:text-brand-orange flex items-center justify-between transition-colors"
              >
                <span>Automated Tax Invoicing Setup Guide</span>
                <ExternalLink className="size-3 text-zinc-400" />
              </a>
              <a
                href="#grading"
                className="py-2.5 text-zinc-600 hover:text-brand-orange flex items-center justify-between transition-colors"
              >
                <span>KaTeX Math Notation Reference Sheet</span>
                <ExternalLink className="size-3 text-zinc-400" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
