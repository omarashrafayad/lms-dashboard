"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { X, RotateCcw, AlertTriangle } from "lucide-react"
import { TransactionItem } from "../../types/subscriptions.types"
import { refundPaymentSchema, RefundPaymentFormData } from "../../schema/subscription.schema"
import { Button } from "@/components/ui/button"
import { UniInput } from "@/components/shared/UniInput"
import { Form } from "@/components/ui/form"

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
  const form = useForm({
    resolver: zodResolver(refundPaymentSchema),
    defaultValues: {
      note: "Parent requested refund",
    },
  })

  React.useEffect(() => {
    if (isOpen) {
      form.reset({ note: "Parent requested refund" })
    }
  }, [isOpen, form])

  if (!isOpen || !transaction) return null

  const onSubmit = (data: RefundPaymentFormData) => {
    onConfirm(data.note)
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
                Invoice {transaction.invoiceNumber || transaction.id}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-lg hover:bg-zinc-200/60 flex items-center justify-center text-zinc-500 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit as any)} className="p-6 flex flex-col gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200/60 flex items-start gap-2.5">
              <AlertTriangle className="size-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1 text-zinc-700">
                <span className="font-semibold text-rose-900">
                  This action marks this payment as refunded.
                </span>
                <span className="text-[11px] text-zinc-500 leading-relaxed">
                  Student: <strong>{transaction.studentName || transaction.payerName || "Student"}</strong>
                  <br />
                  Amount: <strong>{transaction.amount} EGP</strong>
                </span>
              </div>
            </div>

            <UniInput
              control={form.control as any}
              name="note"
              label="Refund Justification / Reason"
              placeholder="e.g. Accidental double charge, refunded to parent"
              required
            />

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-100">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="h-9 px-4 rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-9 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs shadow-2xs cursor-pointer"
              >
                Confirm Refund
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
