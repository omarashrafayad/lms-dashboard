"use client"

import * as React from "react"
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Sparkles,
  Calendar,
  Tag,
  ArrowRight,
  Download,
  ShieldCheck,
  Zap,
} from "lucide-react"
import { MOCK_SUBSCRIPTION_PLANS, MOCK_PAYMENT_TRANSACTIONS } from "../data/mockStudentData"

export function StudentSubscriptionsView() {
  const [couponCode, setCouponCode] = React.useState("")
  const [appliedCoupon, setAppliedCoupon] = React.useState<{ code: string; discountPct: number } | null>(null)
  const [couponError, setCouponError] = React.useState<string | null>(null)
  const [autoRenew, setAutoRenew] = React.useState(true)

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    setCouponError(null)
    const code = couponCode.trim().toUpperCase()

    if (code === "EXCELLENCE25") {
      setAppliedCoupon({ code: "EXCELLENCE25", discountPct: 25 })
    } else if (code === "SUMMER50") {
      setAppliedCoupon({ code: "SUMMER50", discountPct: 50 })
    } else {
      setCouponError("Invalid coupon code. Try EXCELLENCE25 for 25% off.")
      setAppliedCoupon(null)
    }
  }

  const currentPlan = MOCK_SUBSCRIPTION_PLANS.find((p) => p.isCurrent) || MOCK_SUBSCRIPTION_PLANS[1]

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <CreditCard className="size-5" />
            </span>
            <h1 className="text-xl font-extrabold text-zinc-900 tracking-tight">
              Subscription & Academic Plans
            </h1>
          </div>
          <p className="text-xs text-zinc-500">
            Manage your educational tier, explore membership benefits, apply promo coupons, and download billing invoices
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 w-fit">
          ● Active Subscription • Verified
        </span>
      </div>

      {/* Current Subscription Card with Duration Indicator */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-black text-white p-6 md:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-400 text-amber-950">
                Current Active Plan
              </span>
              <span className="text-xs text-zinc-400">
                Renews Oct 01, 2026
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold">
              {currentPlan.name}
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {currentPlan.tagline}. Full access to all 8 STEM secondary curriculum subjects and live interactive teaching rooms.
            </p>

            {/* Duration Visual Bar (38 Days Remaining) */}
            <div className="flex flex-col gap-1.5 pt-3">
              <div className="flex items-center justify-between text-xs text-zinc-300">
                <span>Academic Year Progress</span>
                <span className="font-bold text-amber-400">38 Days Remaining (Term 2)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 w-3/4" />
              </div>
              <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-0.5">
                <span>Start: Sep 15, 2025</span>
                <span>Expiry: Oct 01, 2026</span>
              </div>
            </div>
          </div>

          {/* Price & Auto-renewal toggle */}
          <div className="flex flex-col md:items-end gap-3 bg-white/10 p-5 rounded-2xl border border-white/15 backdrop-blur-xs shrink-0">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-amber-300">
                {currentPlan.price} EGP
              </span>
              <span className="text-xs text-zinc-300">/ month</span>
            </div>

            <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRenew}
                onChange={(e) => setAutoRenew(e.target.checked)}
                className="size-4 rounded accent-emerald-500"
              />
              <span>Auto-Renew Enabled (15% Off)</span>
            </label>

            <button
              type="button"
              onClick={() => alert("Redirecting to secure subscription billing management...")}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              Manage Billing Details
            </button>
          </div>
        </div>
      </div>

      {/* Available Plans Comparison */}
      <div className="flex flex-col gap-4">
        <h2 className="text-base font-bold text-zinc-900">
          Compare Available Subscription Tiers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_SUBSCRIPTION_PLANS.map((plan) => {
            const isCurrent = plan.isCurrent
            const discountedPrice = appliedCoupon
              ? Math.round(plan.price * (1 - appliedCoupon.discountPct / 100))
              : plan.price

            return (
              <div
                key={plan.id}
                className={`p-6 rounded-3xl border flex flex-col justify-between gap-6 transition-all shadow-2xs ${
                  isCurrent
                    ? "bg-amber-50/20 border-amber-300 ring-2 ring-amber-400/30"
                    : "bg-white border-zinc-200/80 hover:border-zinc-300"
                }`}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-zinc-900">{plan.name}</span>
                    {isCurrent && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-amber-950">
                        Current Plan
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-500 min-h-[32px]">
                    {plan.tagline}
                  </p>

                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-zinc-900">
                      {discountedPrice} EGP
                    </span>
                    <span className="text-xs text-zinc-400">/ month</span>
                    {appliedCoupon && (
                      <span className="text-xs text-rose-600 line-through ml-2">
                        {plan.price} EGP
                      </span>
                    )}
                  </div>

                  {/* Included features */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-zinc-100 text-xs">
                    <span className="font-bold text-[11px] text-zinc-700 uppercase tracking-wider">
                      Included Benefits:
                    </span>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-zinc-600">
                        <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                    {plan.restrictedFeatures.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-zinc-400 line-through">
                        <XCircle className="size-3.5 text-zinc-300 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isCurrent}
                  onClick={() => alert(`Upgraded to ${plan.name}!`)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    isCurrent
                      ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                      : "bg-brand-orange hover:bg-brand-orange/90 text-white shadow-sm shadow-brand-orange/20"
                  }`}
                >
                  {isCurrent ? "Active Plan" : "Upgrade Plan"}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Coupon Application Card */}
      <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Tag className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-zinc-900">
              Have a Promotional Discount Coupon?
            </h3>
            <p className="text-xs text-zinc-500">
              Enter voucher code (e.g. <strong className="text-zinc-700">EXCELLENCE25</strong>) to apply discount on upcoming renewals.
            </p>
          </div>
        </div>

        <form onSubmit={handleApplyCoupon} className="flex items-center gap-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="COUPON CODE"
            className="px-4 py-2 rounded-xl bg-white border border-zinc-300 text-xs font-bold text-zinc-800 uppercase focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-xs shadow-2xs transition-colors cursor-pointer"
          >
            Apply Code
          </button>
        </form>
      </div>

      {appliedCoupon && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center justify-between">
          <span>
            🎉 Coupon code &quot;{appliedCoupon.code}&quot; applied successfully! You get a {appliedCoupon.discountPct}% instant discount.
          </span>
          <button
            type="button"
            onClick={() => setAppliedCoupon(null)}
            className="text-xs text-emerald-950 underline cursor-pointer"
          >
            Remove
          </button>
        </div>
      )}

      {couponError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800">
          {couponError}
        </div>
      )}

      {/* Payment & Invoices History Table */}
      <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <h2 className="text-base font-bold text-zinc-900">
            Billing & Invoices History
          </h2>
          <span className="text-xs text-zinc-400">All Transactions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/70 text-zinc-500 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 font-bold">Transaction ID</th>
                <th className="py-3 px-4 font-bold">Plan Details</th>
                <th className="py-3 px-4 font-bold">Payment Method</th>
                <th className="py-3 px-4 font-bold">Amount</th>
                <th className="py-3 px-4 font-bold">Date</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {MOCK_PAYMENT_TRANSACTIONS.map((tx) => (
                <tr key={tx.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-zinc-800">
                    {tx.transactionId}
                  </td>
                  <td className="py-3 px-4 font-semibold text-zinc-900">{tx.planName}</td>
                  <td className="py-3 px-4 text-zinc-600">{tx.paymentMethod}</td>
                  <td className="py-3 px-4 font-extrabold text-zinc-900">
                    {tx.amount} EGP
                    {tx.discount > 0 && (
                      <span className="block text-[10px] text-emerald-600 font-normal">
                        Saved {tx.discount} EGP
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-zinc-500">{tx.date}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-fit">
                      <CheckCircle2 className="size-3" /> Paid
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => alert(`Downloading PDF invoice for ${tx.transactionId}...`)}
                      className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-700 transition-colors cursor-pointer"
                      title="Download Tax Invoice"
                    >
                      <Download className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
