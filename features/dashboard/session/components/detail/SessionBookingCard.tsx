"use client"

import * as React from "react"
import { NormalizedSessionDetail } from "../../utils/sessionDetail.utils"

export interface SessionBookingCardProps {
  booking: NormalizedSessionDetail["booking"]
}

export function SessionBookingCard({ booking }: SessionBookingCardProps) {
  const isPaid = booking.isPaid

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col gap-5">
      <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
        Booking Information
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            BOOKING ID
          </span>
          <span className="font-semibold text-zinc-900">
            {booking.code}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            BOOKING STATUS
          </span>
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0]">
              <span className="size-1.5 rounded-full bg-[#16A34A]" />
              {booking.status}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            REQUESTED DATE
          </span>
          <span className="font-semibold text-zinc-900">
            {booking.requestedDate}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            REQUESTED TIME
          </span>
          <span className="font-semibold text-zinc-900">
            {booking.requestedTime}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            BOOKING CREATED AT
          </span>
          <span className="font-semibold text-zinc-900">
            {booking.createdAt}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            PAYMENT STATUS
          </span>
          <div>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                isPaid
                  ? "bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]"
                  : "bg-zinc-100 text-zinc-700 border-zinc-200"
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${
                  isPaid ? "bg-[#16A34A]" : "bg-zinc-400"
                }`}
              />
              {booking.paymentStatus}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1 sm:col-span-2 pt-2 border-t border-zinc-100">
          <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            TOTAL PAYMENT
          </span>
          <span className="font-bold text-sm text-zinc-900">
            {booking.totalPayment}
          </span>
        </div>
      </div>
    </div>
  )
}
