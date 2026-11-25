"use client"

import React, { useState } from "react"
import {
  DollarSign,
  TrendingUp,
  Download,
  CreditCard,
  Building,
  Smartphone,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  X,
  FileSpreadsheet,
} from "lucide-react"
import { TeacherEarningsRecord } from "../types/teacherPortal.types"
import { MOCK_TEACHER_EARNINGS } from "../data/mockTeacherData"

export function TeacherEarningsPage() {
  const [earnings, setEarnings] = useState<TeacherEarningsRecord[]>(MOCK_TEACHER_EARNINGS)
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false)
  const [payoutAmount, setPayoutAmount] = useState<number>(18000)
  const [payoutMethod, setPayoutMethod] = useState("instapay")
  const [payoutSuccess, setPayoutSuccess] = useState(false)
  const [exportNotice, setExportNotice] = useState(false)

  const availableBalance = 18000
  const totalLifetime = 125000
  const paidOut = 107000

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault()
    setPayoutSuccess(true)
    setTimeout(() => {
      setPayoutSuccess(false)
      setIsPayoutModalOpen(false)
    }, 1500)
  }

  const handleExportStatement = () => {
    setExportNotice(true)
    setTimeout(() => setExportNotice(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-700">Net Teacher Commission: 70%</span>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200/60">
            Available: {availableBalance.toLocaleString()} EGP
          </span>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportStatement}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-zinc-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsPayoutModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-bold shadow-sm shadow-brand-orange/20 transition-all cursor-pointer"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Request Payout</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-primary/20 bg-primary/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Available for Payout</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground mt-2">
            {availableBalance.toLocaleString()} <span className="text-xs font-semibold text-muted-foreground">EGP</span>
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1 inline-flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Instant transfer eligible
          </span>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Lifetime Net Earnings</span>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground mt-2">
            {totalLifetime.toLocaleString()} <span className="text-xs font-semibold text-muted-foreground">EGP</span>
          </div>
          <span className="text-xs text-muted-foreground mt-1 block">Accrued over 18 months</span>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Total Paid to Date</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground mt-2">
            {paidOut.toLocaleString()} <span className="text-xs font-semibold text-muted-foreground">EGP</span>
          </div>
          <span className="text-xs text-muted-foreground mt-1 block">Disbursed via CIB Bank</span>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Revenue Share Tier</span>
            <ShieldCheck className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground mt-2">
            70% <span className="text-xs font-semibold text-muted-foreground">Teacher Net</span>
          </div>
          <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-1 block">
            Senior Master Partner Tier
          </span>
        </div>
      </div>

      {/* Payout Channels Card */}
      <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
        <h3 className="text-base font-bold text-foreground">Registered Payout Channels</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-border bg-accent/20 flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <Building className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground text-sm">Commercial International Bank (CIB)</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/15 text-primary">
                  Default
                </span>
              </div>
              <p className="text-xs text-muted-foreground">IBAN: EG380010004500000982144109</p>
              <p className="text-xs text-muted-foreground">Account Holder: Dr. Tarek Ahmed El-Sayed</p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-accent/20 flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground text-sm">InstaPay Instant Payout</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  Instant (0 fee)
                </span>
              </div>
              <p className="text-xs text-muted-foreground">InstaPay Address: <strong className="text-foreground">tarek.physics@instapay</strong></p>
              <p className="text-xs text-muted-foreground">Phone: +20 109 876 5432</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions History Table */}
      <div className="border border-border rounded-2xl bg-card overflow-hidden shadow-sm">
        <div className="p-5 border-b border-border bg-accent/20 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground">Earnings & Payout Ledger</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Itemized statement of student course enrollments and monthly payouts
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-accent/40 border-b border-border text-muted-foreground font-semibold">
              <tr>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Course & Cohort Reference</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-center">Gross Volume</th>
                <th className="py-3 px-4 text-center">Platform Fee (30%)</th>
                <th className="py-3 px-4 text-center">Net Earnings (70%)</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {earnings.map((row) => (
                <tr key={row.id} className="hover:bg-accent/20 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                    {row.transactionId}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-foreground">{row.course}</p>
                    <span className="text-[11px] text-muted-foreground">{row.studentOrRef}</span>
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground">{row.date}</td>
                  <td className="py-3.5 px-4 text-center font-medium text-foreground">
                    {row.grossAmount.toLocaleString()} EGP
                  </td>
                  <td className="py-3.5 px-4 text-center text-muted-foreground">
                    -{Math.round(row.grossAmount * 0.3).toLocaleString()} EGP
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    +{row.netEarnings.toLocaleString()} EGP
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        row.status === "paid"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {row.status === "paid" ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Paid Out
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3" /> Processing
                        </>
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout Request Modal */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border overflow-hidden">
            <div className="p-5 border-b border-border bg-accent/20 flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">Request Earnings Withdrawal</h2>
              <button
                onClick={() => setIsPayoutModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRequestPayout} className="p-6 space-y-4">
              <div className="p-3.5 rounded-xl border border-border bg-accent/10 flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Current Available Balance</span>
                <span className="font-bold text-foreground text-sm">{availableBalance.toLocaleString()} EGP</span>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Withdrawal Amount (EGP) *
                </label>
                <input
                  type="number"
                  min="500"
                  max={availableBalance}
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm font-bold rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Destination Channel *</label>
                <div className="space-y-2">
                  <label
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer text-xs transition-colors ${
                      payoutMethod === "instapay"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-accent/20"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="method"
                        checked={payoutMethod === "instapay"}
                        onChange={() => setPayoutMethod("instapay")}
                      />
                      <span className="font-semibold text-foreground">InstaPay (Immediate transfer)</span>
                    </div>
                    <span className="text-muted-foreground">tarek.physics@instapay</span>
                  </label>

                  <label
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer text-xs transition-colors ${
                      payoutMethod === "cib"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-accent/20"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="method"
                        checked={payoutMethod === "cib"}
                        onChange={() => setPayoutMethod("cib")}
                      />
                      <span className="font-semibold text-foreground">CIB Bank Transfer (1-2 business days)</span>
                    </div>
                    <span className="text-muted-foreground">****-9821</span>
                  </label>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsPayoutModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-all"
                >
                  {payoutSuccess ? "Payout Submitted!" : "Confirm Payout"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
