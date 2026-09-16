"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, ChevronDown, ChevronRight, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { PageHeader } from "@/components/layout/PageHeader"

/* ──────────────────────────────────────────────────────────
   Types
   ────────────────────────────────────────────────────────── */
interface BasicInfo {
  fullName: string
  dateOfBirth: string
  gender: string
  phone: string
  email: string
  password: string
}

interface AcademicInfo {
  educationSystem: string
  educationStage: string
  grade: string
}

// interface AccountInfo {
//   loginMethod: "Email" | "Phone Number"
//   accountStatus: "Active" | "Inactive"
// }

const STEPS = [
  { number: 1, label: "Basic", sublabel: "Information" },
  { number: 2, label: "Academic", sublabel: "Information" },
  // { number: 3, label: "Account", sublabel: "Setup" },
  { number: 3, label: "Review & Create", sublabel: "" },
] as const

/* ──────────────────────────────────────────────────────────
   Stepper Component
   ────────────────────────────────────────────────────────── */
function Stepper({
  currentStep,
  completedSteps,
}: {
  currentStep: number
  completedSteps: number[]
}) {
  return (
    <div className="w-full flex items-center justify-center px-6 py-5">
      <div className="flex items-center gap-0 w-full max-w-[620px]">
        {STEPS.map((step, idx) => {
          const isCompleted = completedSteps.includes(step.number)
          const isCurrent = currentStep === step.number
          const isLast = idx === STEPS.length - 1

          return (
            <React.Fragment key={step.number}>
              {/* Step Circle + Label */}
              <div className="flex items-center gap-2.5 shrink-0">
                {/* Circle */}
                <div
                  className={cn(
                    "size-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all",
                    isCompleted
                      ? "bg-brand-orange text-white"
                      : isCurrent
                      ? "bg-brand-orange text-white"
                      : "bg-zinc-100 text-zinc-400 border border-zinc-200/80"
                  )}
                >
                  {isCompleted ? (
                    <Check className="size-4 stroke-[2.5]" />
                  ) : (
                    step.number
                  )}
                </div>

                {/* Label */}
                <div className="flex flex-col leading-none">
                  <span
                    className={cn(
                      "text-[10px] font-medium uppercase tracking-wider",
                      isCurrent || isCompleted
                        ? "text-zinc-500"
                        : "text-zinc-400"
                    )}
                  >
                    STEP {step.number}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-semibold mt-0.5",
                      isCurrent || isCompleted
                        ? "text-zinc-900"
                        : "text-zinc-400"
                    )}
                  >
                    {step.label}
                    {step.sublabel && (
                      <>
                        <br />
                        {step.sublabel}
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div className="flex-1 mx-3">
                  <div
                    className={cn(
                      "h-px w-full",
                      isCompleted ? "bg-brand-orange" : "bg-zinc-200"
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────
   Step 1 — Basic Information
   ────────────────────────────────────────────────────────── */
function StepBasicInfo({
  data,
  onChange,
}: {
  data: BasicInfo
  onChange: (d: Partial<BasicInfo>) => void
}) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs">
      <h2 className="text-base font-bold text-zinc-900">Basic Information</h2>
      <p className="text-xs text-zinc-500 mt-1 mb-6">
        Personal details used to identify the student.
      </p>

      {/* Full Name */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-zinc-700 mb-1.5">
          Full Name <span className="text-amber-500">*</span>
        </label>
        <input
          type="text"
          required
          value={data.fullName}
          onChange={(e) => onChange({ fullName: e.target.value })}
          placeholder="e.g. Ahmed Ali"
          className="w-full h-10 px-3.5 text-xs text-zinc-800 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all placeholder:text-zinc-400"
        />
      </div>

      {/* Date of Birth & Gender */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          
          <label className="block text-xs font-medium text-zinc-700 mb-1.5">
            Date of Birth <span className="text-amber-500">*</span>
          </label>
          <input
            type="date"
            required
            value={data.dateOfBirth}
            onChange={(e) => onChange({ dateOfBirth: e.target.value })}
            className="w-full h-10 px-3.5 text-xs text-zinc-800 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all placeholder:text-zinc-400"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-1.5">
            Gender <span className="text-amber-500">*</span>
          </label>
          <div className="relative">
            <select
              required
              value={data.gender}
              onChange={(e) => onChange({ gender: e.target.value })}
              className={cn(
                "w-full h-10 px-3.5 text-xs bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all appearance-none cursor-pointer pr-10",
                data.gender ? "text-zinc-800" : "text-zinc-400"
              )}
            >
              <option value="" disabled>
                Select gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Phone Number & Email Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-1.5">
            Phone Number <span className="text-amber-500">*</span>
          </label>
          <input
            type="text"
            required
            value={data.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="+20 100 000 0000"
            className="w-full h-10 px-3.5 text-xs text-zinc-800 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all placeholder:text-zinc-400"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-1.5">
            Email Address <span className="text-amber-500">*</span>
          </label>
          <input
            type="email"
            required
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="student@example.com"
            className="w-full h-10 px-3.5 text-xs text-zinc-800 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all placeholder:text-zinc-400"
          />
        </div>
                <div>
          <label className="block text-xs font-medium text-zinc-700 mb-1.5">
            Password <span className="text-amber-500">*</span>
          </label>
          <input
            type="password"
            required
            value={data.password}
            onChange={(e) => onChange({ password: e.target.value })}
            placeholder="Password"
            className="w-full h-10 px-3.5 text-xs text-zinc-800 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all placeholder:text-zinc-400"
          />
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────
   Step 2 — Academic Information
   ────────────────────────────────────────────────────────── */
function StepAcademicInfo({
  data,
  onChange,
}: {
  data: AcademicInfo
  onChange: (d: Partial<AcademicInfo>) => void
}) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs">
      <h2 className="text-base font-bold text-zinc-900">
        Academic Information
      </h2>
      <p className="text-xs text-zinc-500 mt-1 mb-6">
        Education details for the student&apos;s academic profile.
      </p>

      {/* Education System & Education Stage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-1.5">
            Education System <span className="text-amber-500">*</span>
          </label>
          <div className="relative">
            <select
              required
              value={data.educationSystem}
              onChange={(e) =>
                onChange({ educationSystem: e.target.value })
              }
              className={cn(
                "w-full h-10 px-3.5 text-xs bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all appearance-none cursor-pointer pr-10",
                data.educationSystem ? "text-zinc-800" : "text-zinc-400"
              )}
            >
              <option value="" disabled>
                Select system
              </option>
              <option value="National">National</option>
              <option value="American">American</option>
              <option value="IGCSE">IGCSE</option>
              <option value="IB">IB</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-1.5">
            Education Stage <span className="text-amber-500">*</span>
          </label>
          <div className="relative">
            <select
              required
              value={data.educationStage}
              onChange={(e) =>
                onChange({ educationStage: e.target.value })
              }
              className={cn(
                "w-full h-10 px-3.5 text-xs bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all appearance-none cursor-pointer pr-10",
                data.educationStage ? "text-zinc-800" : "text-zinc-400"
              )}
            >
              <option value="" disabled>
                Select stage
              </option>
              <option value="Primary">Primary</option>
              <option value="Preparatory">Preparatory</option>
              <option value="Secondary">Secondary</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Grade */}
      <div>
        <label className="block text-xs font-medium text-zinc-700 mb-1.5">
          Grade <span className="text-amber-500">*</span>
        </label>
        <div className="relative">
          <select
            required
            value={data.grade}
            onChange={(e) => onChange({ grade: e.target.value })}
            className={cn(
              "w-full h-10 px-3.5 text-xs bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all appearance-none cursor-pointer pr-10",
              data.grade ? "text-zinc-800" : "text-zinc-400"
            )}
          >
            <option value="" disabled>
              Select grade
            </option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={`Grade ${i + 1}`}>
                Grade {i + 1}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────
   Step 3 — Account Setup
   ────────────────────────────────────────────────────────── */
// function StepAccountSetup({
//   data,
//   onChange,
// }: {
//   data: AccountInfo
//   onChange: (d: Partial<AccountInfo>) => void
// }) {
//   return (
//     <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs">
//       <h2 className="text-base font-bold text-zinc-900">Account Setup</h2>
//       <p className="text-xs text-zinc-500 mt-1 mb-6">
//         Configure login and account preferences.
//       </p>

//       {/* Login Method */}
//       <div className="mb-5">
//         <label className="block text-xs font-medium text-zinc-700 mb-2">
//           Login Method <span className="text-amber-500">*</span>
//         </label>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
//           {(["Email", "Phone Number"] as const).map((method) => (
//             <button
//               key={method}
//               type="button"
//               onClick={() => onChange({ loginMethod: method })}
//               className={cn(
//                 "flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer",
//                 data.loginMethod === method
//                   ? "border-amber-400 bg-[#FFFBEB] ring-1 ring-amber-400/60"
//                   : "border-zinc-200 bg-white hover:border-zinc-300"
//               )}
//             >
//               <div
//                 className={cn(
//                   "size-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors",
//                   data.loginMethod === method
//                     ? "border-amber-500 bg-white"
//                     : "border-zinc-300 bg-white"
//                 )}
//               >
//                 {data.loginMethod === method && (
//                   <div className="size-2 rounded-full bg-amber-500" />
//                 )}
//               </div>
//               <div>
//                 <div className="text-xs font-semibold text-zinc-900 leading-tight">
//                   {method}
//                 </div>
//                 <div className="text-[11px] text-zinc-500 mt-0.5">
//                   {method === "Email"
//                     ? "Sign in with an email address"
//                     : "Sign in with a phone number"}
//                 </div>
//               </div>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Account Status */}
//       <div>
//         <label className="block text-xs font-medium text-zinc-700 mb-2">
//           Account Status <span className="text-amber-500">*</span>
//         </label>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
//           {(
//             [
//               { value: "Active", desc: "Student can sign in" },
//               { value: "Inactive", desc: "Access disabled" },
//             ] as const
//           ).map((opt) => (
//             <button
//               key={opt.value}
//               type="button"
//               onClick={() => onChange({ accountStatus: opt.value })}
//               className={cn(
//                 "flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer",
//                 data.accountStatus === opt.value
//                   ? "border-amber-400 bg-[#FFFBEB] ring-1 ring-amber-400/60"
//                   : "border-zinc-200 bg-white hover:border-zinc-300"
//               )}
//             >
//               <div
//                 className={cn(
//                   "size-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors",
//                   data.accountStatus === opt.value
//                     ? "border-amber-500 bg-white"
//                     : "border-zinc-300 bg-white"
//                 )}
//               >
//                 {data.accountStatus === opt.value && (
//                   <div className="size-2 rounded-full bg-amber-500" />
//                 )}
//               </div>
//               <div>
//                 <div className="text-xs font-semibold text-zinc-900 leading-tight">
//                   {opt.value}
//                 </div>
//                 <div className="text-[11px] text-zinc-500 mt-0.5">
//                   {opt.desc}
//                 </div>
//               </div>
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

/* ──────────────────────────────────────────────────────────
   Step 4 — Review & Create
   ────────────────────────────────────────────────────────── */
function StepReview({
  basic,
  academic,
  // account,
  onEditStep,
}: {
  basic: BasicInfo
  academic: AcademicInfo
  // account: AccountInfo
  onEditStep: (step: number) => void
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs">
        <h2 className="text-base font-bold text-zinc-900">
          Review Student Information
        </h2>
        <p className="text-xs text-zinc-500 mt-1 mb-6">
          Confirm all details before creating the student account.
        </p>

        {/* Student Information Card */}
        <div className="rounded-xl border border-zinc-200/80 p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-zinc-900">
              Student Information
            </h3>
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
            >
              Edit
            </button>
          </div>
          <div className="grid grid-cols-2 gap-y-4 gap-x-8">
            <div>
              <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                FULL NAME
              </div>
              <div className="text-sm font-medium text-zinc-800">
                {basic.fullName || "—"}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                DATE OF BIRTH
              </div>
              <div className="text-sm font-medium text-zinc-800">
                {basic.dateOfBirth || "—"}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                GENDER
              </div>
              <div className="text-sm font-medium text-zinc-800">
                {basic.gender || "—"}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                EMAIL / PHONE
              </div>
              <div className="text-sm font-medium text-zinc-800">
                {[basic.email, basic.phone].filter(Boolean).join(" · ") ||
                  "—"}
              </div>
            </div>
          </div>
        </div>

        {/* Academic Information Card */}
        <div className="rounded-xl border border-zinc-200/80 p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-zinc-900">
              Academic Information
            </h3>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
            >
              Edit
            </button>
          </div>
          <div className="grid grid-cols-2 gap-y-4 gap-x-8">
            <div>
              <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                EDUCATION SYSTEM
              </div>
              <div className="text-sm font-medium text-zinc-800">
                {academic.educationSystem || "—"}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                EDUCATION STAGE
              </div>
              <div className="text-sm font-medium text-zinc-800">
                {academic.educationStage || "—"}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                GRADE
              </div>
              <div className="text-sm font-medium text-zinc-800">
                {academic.grade || "—"}
              </div>
            </div>
          </div>
        </div>

        {/* Account Information Card */}
        {/* <div className="rounded-xl border border-zinc-200/80 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-zinc-900">
              Account Information
            </h3>
            <button
              type="button"
              onClick={() => onEditStep(3)}
              className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
            >
              Edit
            </button>
          </div>
          <div className="grid grid-cols-2 gap-y-4 gap-x-8">
            <div>
              <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                LOGIN METHOD
              </div>
              <div className="text-sm font-medium text-zinc-800">
                {account.loginMethod}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                ACCOUNT STATUS
              </div>
              <div className="text-sm font-medium text-zinc-800">
                {account.accountStatus}
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────
   Success Screen
   ────────────────────────────────────────────────────────── */
function SuccessScreen() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-10 max-w-md w-full text-center flex flex-col items-center gap-5">
        {/* Green checkmark circle */}
        <div className="size-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
          <Check className="size-7 text-emerald-500 stroke-[2.5]" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-zinc-900">
            Student created successfully
          </h2>
          <p className="text-xs text-zinc-500 mt-1.5">
            The student account has been created successfully.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 w-full mt-2">
          <Link
            href="/student/student_list"
            className="w-full inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-brand-orange hover:bg-amber-500 text-sm font-semibold text-white transition-all shadow-xs cursor-pointer active:scale-[0.98]"
          >
            View Student Profile
          </Link>
          <Link
            href="/student/student_list"
            className="w-full inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-sm font-medium text-zinc-700 transition-colors shadow-2xs cursor-pointer active:scale-[0.98]"
          >
            Back to All Students
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────
   Main Add Student Page
   ────────────────────────────────────────────────────────── */
export default function StudentAddPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState(1)
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([])
  const [showSuccess, setShowSuccess] = React.useState(false)

  // Form data
  const [basic, setBasic] = React.useState<BasicInfo>({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
    password: "",
  })

  const [academic, setAcademic] = React.useState<AcademicInfo>({
    educationSystem: "",
    educationStage: "",
    grade: "",
  })

  // const [account, setAccount] = React.useState<AccountInfo>({
  //   loginMethod: "Email",
  //   accountStatus: "Active",
  // })

  const handleBasicChange = (d: Partial<BasicInfo>) =>
    setBasic((prev) => ({ ...prev, ...d }))

  const handleAcademicChange = (d: Partial<AcademicInfo>) =>
    setAcademic((prev) => ({ ...prev, ...d }))

  // const handleAccountChange = (d: Partial<AccountInfo>) =>
  //   setAccount((prev) => ({ ...prev, ...d }))

  // Validate each step
  const isStep1Valid =
    basic.fullName.trim() !== "" &&
    basic.dateOfBirth !== "" &&
    basic.gender !== "" &&
    basic.phone.trim() !== "" &&
    basic.email.trim() !== ""

  const isStep2Valid =
    academic.educationSystem !== "" &&
    academic.educationStage !== "" &&
    academic.grade !== ""

  const isStep3Valid = true // Always valid since we have defaults

  const handleNext = () => {
    if (currentStep === 1 && isStep1Valid) {
      setCompletedSteps((prev) =>
        prev.includes(1) ? prev : [...prev, 1]
      )
      setCurrentStep(2)
    } else if (currentStep === 2 && isStep2Valid) {
      setCompletedSteps((prev) =>
        prev.includes(2) ? prev : [...prev, 2]
      )
      setCurrentStep(3)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleEditStep = (step: number) => {
    setCurrentStep(step)
  }

  const handleCreate = () => {
    setShowSuccess(true)
  }

  const handleCancel = () => {
    router.push("/student/student_list")
  }

  if (showSuccess) {
    return (
      <div className="flex flex-col min-h-full">
        <PageHeader
          title="Add Student"
          description="Create a new student account on the platform."
        />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-[820px] mx-auto">
            <SuccessScreen />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Add Student"
        description="Create a new student account on the platform."
      />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-[820px] mx-auto flex flex-col gap-5">
          {/* Stepper */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
            <Stepper
              currentStep={currentStep}
              completedSteps={completedSteps}
            />
          </div>

          {/* Step Content */}
          {currentStep === 1 && (
            <StepBasicInfo data={basic} onChange={handleBasicChange} />
          )}
          {currentStep === 2 && (
            <StepAcademicInfo
              data={academic}
              onChange={handleAcademicChange}
            />
          )}
          {/* {currentStep === 3 && (
            <StepAccountSetup
              data={account}
              onChange={handleAccountChange}
            />
          )} */}
          {currentStep === 3 && (
            <StepReview
              basic={basic}
              academic={academic}
              // account={account}
              onEditStep={handleEditStep}
            />
          )}

          {/* Bottom Action Buttons */}
          <div className="flex items-center justify-between pt-1 pb-10">
            {/* Left: Cancel / Back */}
            {currentStep === 1 ? (
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-700 transition-colors shadow-2xs cursor-pointer active:scale-[0.98]"
              >
                Cancel
              </button>
            ) : (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-700 transition-colors shadow-2xs cursor-pointer active:scale-[0.98]"
              >
                <ChevronLeft className="size-3.5" />
                <span>Back</span>
              </button>
            )}

            {/* Right: Save & Continue / Create Student */}
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !isStep1Valid) ||
                  (currentStep === 2 && !isStep2Valid) 
                  // ||
                  // (currentStep === 3 && !isStep3Valid)
                }
                className="inline-flex items-center gap-1.5 px-6 py-2 rounded-xl bg-brand-orange hover:bg-amber-500 text-xs font-semibold text-white transition-all shadow-xs cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Save & Continue</span>
                <ChevronRight className="size-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCreate}
                className="px-6 py-2 rounded-xl bg-brand-orange hover:bg-amber-500 text-xs font-semibold text-white transition-all shadow-xs cursor-pointer active:scale-[0.98]"
              >
                Create Student
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
