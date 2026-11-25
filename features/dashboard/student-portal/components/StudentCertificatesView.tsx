"use client"

import * as React from "react"
import {
  Award,
  Download,
  Share2,
  CheckCircle2,
  Search,
  Sparkles,
  ExternalLink,
} from "lucide-react"
import { Certificate } from "../types/studentPortal.types"
import { MOCK_STUDENT_CERTIFICATES } from "../data/mockStudentData"
import { StudentCertificateModal } from "./StudentCertificateModal"

export function StudentCertificatesView() {
  const [selectedCert, setSelectedCert] = React.useState<Certificate | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const handleOpenCertificate = (cert: Certificate) => {
    setSelectedCert(cert)
    setIsModalOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-50 text-brand-orange border border-amber-200/60">
              <Award className="size-5" />
            </span>
            <h1 className="text-xl font-extrabold text-zinc-900 tracking-tight">
              Earned Diplomas & Certificates ({MOCK_STUDENT_CERTIFICATES.length})
            </h1>
          </div>
          <p className="text-xs text-zinc-500">
            Accredited credentials earned upon 100% completion of secondary curriculum syllabus and passing comprehensive assessments
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert("Downloading all earned credentials bundle as ZIP...")}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-xs shadow-sm shadow-brand-orange/20 transition-all cursor-pointer"
        >
          <Download className="size-3.5" />
          <span>Download All Certificates</span>
        </button>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {MOCK_STUDENT_CERTIFICATES.map((cert) => (
          <div
            key={cert.id}
            className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between gap-5 group"
          >
            <div className="flex flex-col gap-3">
              {/* Header Badges */}
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-800 border border-indigo-200/60">
                  {cert.credentialId}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="size-3" /> 100% Completed
                </span>
              </div>

              {/* Title & Course */}
              <div>
                <h3 className="text-base font-bold text-zinc-900 leading-snug group-hover:text-indigo-700 transition-colors">
                  {cert.title}
                </h3>
                <span className="text-xs text-zinc-500 font-medium">
                  {cert.courseName}
                </span>
              </div>

              {/* Info Badges */}
              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100 flex flex-col gap-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-[11px]">Recipient</span>
                  <span className="font-bold text-zinc-800">{cert.studentName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-[11px]">Issue Date</span>
                  <span className="font-semibold text-zinc-700">{cert.issueDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-[11px]">Issuer</span>
                  <span className="text-zinc-600 truncate max-w-[200px]">{cert.issuer}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => handleOpenCertificate(cert)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-xs shadow-sm shadow-brand-orange/20 transition-all cursor-pointer"
              >
                <Award className="size-4" />
                <span>View Certificate</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`https://lms.edu/verify/${cert.credentialId}`)
                  alert("Link copied!")
                }}
                className="p-2.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-700 transition-colors cursor-pointer"
                title="Share Certificate"
              >
                <Share2 className="size-4" />
              </button>

              <button
                type="button"
                onClick={() => alert(`Downloading ${cert.title} PDF...`)}
                className="p-2.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-700 transition-colors cursor-pointer"
                title="Download PDF"
              >
                <Download className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <StudentCertificateModal
        certificate={selectedCert}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
