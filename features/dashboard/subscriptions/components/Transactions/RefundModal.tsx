"use client"

import * as React from "react"
import { X, RotateCcw, AlertTriangle } from "lucide-react"
import { TransactionItem } from "../../types/subscriptions.types"
import { Button } from "@/components/ui/button"

interface RefundModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
  transaction: TransactionItem | null
}

export function RefundModal({
  isOpen,
  onClose,
  onConfirm,
  transaction,
}: RefundModalProps) {
  const [reason, setReason] = React.useState("Parent requested refund")

  if (!isOpen || !transaction) return null

  const handleConfirm = () => {
    onConfirm(reason)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl border border-zinc-200/90 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <RotateCcw className="size-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-900">
                Issue Transaction Refund
              </h2>
              <p className="text-[11px] text-zinc-500">
                Invoice {transaction.invoiceNumber}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-lg hover:bg-zinc-200/60 flex items-center justify-center text-zinc-500 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200/60 flex items-start gap-2.5">
            <AlertTriangle className="size-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-rose-900 leading-relaxed">
              Refunding will mark this transaction as <strong>Refunded</strong>, reverse
              the amount ({transaction.amount.toLocaleString()} {transaction.currency}), and update subscriber metrics.
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="font-semibold text-zinc-700">Payer Details:</span>
            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/70 text-zinc-800 space-y-1">
              <div>Payer: <strong>{transaction.payerName}</strong> ({transaction.payerRole})</div>
              <div>Student: <strong>{transaction.studentName}</strong></div>
              <div>Item: <strong>{transaction.planOrItem}</strong></div>
              <div>Original Method: <strong>{transaction.paymentMethod}</strong></div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-zinc-700">Refund Reason:</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="rounded-xl h-10 px-3 border border-zinc-200 bg-white text-zinc-800"
            >
              <option value="Parent requested refund">Parent requested refund</option>
              <option value="Accidental duplicate transaction">Accidental duplicate transaction</option>
              <option value="Curriculum / schedule change">Curriculum / schedule change</option>
              <option value="Billing dispute resolved">Billing dispute resolved</option>
              <option value="Scholarship / waiver applied">Scholarship / waiver applied</option>
            </select>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl h-9 text-xs text-zinc-600"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              className="bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-xl h-9 px-4 text-xs shadow-2xs"
            >
              Confirm Refund
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
