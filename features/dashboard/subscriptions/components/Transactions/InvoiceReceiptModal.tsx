"use client"

import * as React from "react"
import { X, Printer, Download, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react"
import { TransactionItem } from "../../types/subscriptions.types"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface InvoiceReceiptModalProps {
  isOpen: boolean
  onClose: () => void
  transaction: TransactionItem | null
}

export function InvoiceReceiptModal({
  isOpen,
  onClose,
  transaction,
}: InvoiceReceiptModalProps) {
  if (!isOpen || !transaction) return null

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    toast.success(`Invoice ${transaction.invoiceNumber} downloaded as PDF`)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl border border-zinc-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Action Bar (hidden on print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/70 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-900">
              Payment Receipt / Tax Invoice
            </span>
            <span className="text-[11px] font-mono text-zinc-400">
              {transaction.invoiceNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="h-8 px-3 rounded-xl text-xs gap-1.5 border-zinc-200 text-zinc-700 cursor-pointer"
            >
              <Printer className="size-3.5" />
              <span>Print</span>
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleDownload}
              className="h-8 px-3 rounded-xl text-xs gap-1.5 bg-zinc-900 text-white cursor-pointer"
            >
              <Download className="size-3.5" />
              <span>Download PDF</span>
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="size-8 rounded-lg hover:bg-zinc-200/60 flex items-center justify-center text-zinc-500 transition-colors ml-1 cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6 text-zinc-900">
          {/* Brand Header */}
          <div className="flex items-start justify-between pb-6 border-b border-zinc-200">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-xl bg-[#F59E0B] flex items-center justify-center text-white shadow-xs">
                <svg className="size-6 fill-white" viewBox="0 0 24 24">
                  <path d="M12 2C12 7.52285 7.52285 12 2 12C7.52285 12 12 16.4772 12 22C12 16.4772 16.4772 12 22 12C16.4772 12 12 7.52285 12 2Z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-zinc-900 tracking-tight">
                  Lumina Learning Academy
                </span>
                <span className="text-xs text-zinc-400">
                  Tax Registration: 492-881-019 • Cairo, Egypt
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-emerald-300 bg-emerald-50 text-emerald-800">
                <CheckCircle2 className="size-3.5 text-emerald-600" />
                <span>{transaction.status.toUpperCase()}</span>
              </div>
              <span className="text-xs text-zinc-500 mt-1 font-mono">
                {transaction.invoiceNumber}
              </span>
            </div>
          </div>

          {/* Two-Column Metadata */}
          <div className="grid grid-cols-2 gap-6 text-xs">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                BILLED TO:
              </span>
              <span className="font-bold text-sm text-zinc-900">
                {transaction.payerName}
              </span>
              <span className="text-zinc-600">Student: {transaction.studentName} ({transaction.studentGrade})</span>
              <span className="text-zinc-500 font-mono">{transaction.payerPhone}</span>
              <span className="text-zinc-500">{transaction.payerEmail}</span>
            </div>

            <div className="flex flex-col gap-1 items-end text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                INVOICE DETAILS:
              </span>
              <span className="text-zinc-600">
                Date: <strong className="text-zinc-900">{transaction.date}</strong>
              </span>
              <span className="text-zinc-600">
                Payment Method:{" "}
                <strong className="text-zinc-900">{transaction.paymentMethod}</strong>
              </span>
              <span className="text-zinc-500 font-mono text-[11px]">
                Ref: {transaction.gatewayReference}
              </span>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-zinc-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-[10px] uppercase font-bold text-zinc-500">
                <tr>
                  <th className="py-2.5 px-4">ITEM DESCRIPTION</th>
                  <th className="py-2.5 px-4">TYPE</th>
                  <th className="py-2.5 px-4 text-right">UNIT PRICE</th>
                  <th className="py-2.5 px-4 text-right">TOTAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                <tr>
                  <td className="py-3 px-4 font-semibold text-zinc-800">
                    {transaction.planOrItem}
                  </td>
                  <td className="py-3 px-4 text-zinc-500">{transaction.type}</td>
                  <td className="py-3 px-4 text-right text-zinc-700">
                    {transaction.amount.toLocaleString()} {transaction.currency}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-zinc-900">
                    {transaction.amount.toLocaleString()} {transaction.currency}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="flex justify-end text-xs">
            <div className="w-64 flex flex-col gap-2">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal:</span>
                <span>
                  {transaction.amount.toLocaleString()} {transaction.currency}
                </span>
              </div>
              {transaction.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount Applied:</span>
                  <span>
                    -{transaction.discount.toLocaleString()} {transaction.currency}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-zinc-500">
                <span>Platform & Service Fee:</span>
                <span>0.00 {transaction.currency}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-zinc-200 text-sm font-extrabold text-zinc-900">
                <span>Total Paid:</span>
                <span>
                  {(transaction.amount - transaction.discount).toLocaleString()}{" "}
                  {transaction.currency}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Official Notice */}
          <div className="pt-6 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-emerald-600" />
              <span>Verified digital receipt issued by Lumina Billing Engine</span>
            </div>
            <span>Support: billing@lumina.edu.eg</span>
          </div>
        </div>
      </div>
    </div>
  )
}
