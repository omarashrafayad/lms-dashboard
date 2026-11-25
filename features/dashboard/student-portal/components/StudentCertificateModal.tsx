"use client"

import * as React from "react"
import {
  X,
  Download,
  Share2,
  Award,
  CheckCircle2,
  Sparkles,
  QrCode,
  ShieldCheck,
} from "lucide-react"
import { Certificate } from "../types/studentPortal.types"

interface StudentCertificateModalProps {
  certificate: Certificate | null
  isOpen: boolean
  onClose: () => void
}

export function StudentCertificateModal({
  certificate,
  isOpen,
  onClose,
}: StudentCertificateModalProps) {
  if (!isOpen || !certificate) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800">
              Verified Credential
            </span>
            <span className="text-xs text-zinc-500 font-mono">
              ID: {certificate.credentialId}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-500 hover:bg-zinc-100 cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Certificate Canvas Area */}
        <div className="p-6 md:p-8 overflow-y-auto flex flex-col items-center justify-center bg-zinc-100">
          {/* Framed Certificate */}
          <div className="relative w-full max-w-2xl bg-[#FFFDF8] rounded-2xl border-8 border-[#C9A96E] p-8 md:p-12 shadow-2xl flex flex-col items-center text-center gap-6 text-[#2C2416]">
            {/* Inner Border */}
            <div className="absolute inset-2 border border-[#E8D7B5] pointer-events-none rounded-lg" />

            {/* Emblem */}
            <div className="size-16 rounded-full bg-gradient-to-br from-[#E2C785] to-[#B08D43] flex items-center justify-center shadow-lg text-white">
              <Award className="size-8 stroke-[1.8]" />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#8C6D31]">
                OFFICIAL CERTIFICATE OF COMPLETION
              </span>
              <h2 className="text-xl md:text-2xl font-serif font-black tracking-tight text-[#1F190F]">
                Academic Distinction Award
              </h2>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-zinc-500 italic">This is proudly presented to:</span>
              <h3 className="text-2xl md:text-3xl font-serif font-extrabold text-[#7A5B1E] border-b-2 border-[#C9A96E]/50 pb-2 px-8">
                {certificate.studentName}
              </h3>
            </div>

            <p className="text-xs text-zinc-700 max-w-lg leading-relaxed">
              For successfully fulfilling all academic requirements, practical laboratory assessments, and theoretical examinations for the course:
            </p>

            <span className="text-base font-bold text-zinc-900 bg-amber-50/80 px-4 py-1.5 rounded-xl border border-amber-200/60">
              {certificate.courseName}
            </span>

            <span className="text-xs text-zinc-500">
              Completion Rate: <strong>{certificate.completionPercentage}%</strong> • Issued on <strong>{certificate.issueDate}</strong>
            </span>

            {/* Signatures & Seal */}
            <div className="w-full flex items-end justify-between pt-6 border-t border-[#E8D7B5] text-xs">
              <div className="flex flex-col items-center">
                <span className="font-serif italic text-base text-zinc-800">Tarek El-Sayed</span>
                <span className="text-[10px] text-zinc-400 border-t border-zinc-300 pt-0.5 mt-1">
                  Lead Course Instructor
                </span>
              </div>

              {/* Gold Verification Badge */}
              <div className="size-16 rounded-full border-2 border-dashed border-[#B08D43] flex flex-col items-center justify-center text-[9px] font-bold text-[#8C6D31] uppercase">
                <ShieldCheck className="size-5 text-[#B08D43]" />
                <span>VERIFIED</span>
              </div>

              <div className="flex flex-col items-center">
                <span className="font-serif italic text-base text-zinc-800">Dina Farouk</span>
                <span className="text-[10px] text-zinc-400 border-t border-zinc-300 pt-0.5 mt-1">
                  Director of Academic Board
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100 bg-zinc-50">
          <span className="text-xs text-zinc-500">
            Issuing Authority: {certificate.issuer}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(`https://lms.edu/verify/${certificate.credentialId}`)
                alert("Credential verification link copied to clipboard!")
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 text-xs font-semibold cursor-pointer"
            >
              <Share2 className="size-3.5" />
              <span>Share Credential</span>
            </button>

            <button
              type="button"
              onClick={() => alert(`Downloading high-resolution PDF for certificate ${certificate.credentialId}...`)}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md cursor-pointer"
            >
              <Download className="size-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
