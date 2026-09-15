"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  ChevronDown,
  UploadCloud,
  FileText,
  X,
  Plus,
  RotateCcw,
} from "lucide-react"
import { toast } from "sonner"
import { getTeacherProfile } from "../data/mockTeacherProfile"
import { cn } from "@/lib/utils"

interface TeacherEditPageProps {
  teacherId: string
}

const ALL_SUBJECTS = [
  "Mathematics",
  "English",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Arabic",
  "History",
]

const EDUCATION_STAGES = ["Primary", "Preparatory", "Secondary"] as const
const TEACHING_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const

interface ScheduleSlot {
  id: string
  start: string
  end: string
}

interface DayAvailability {
  day: string
  slots: ScheduleSlot[]
}

const INITIAL_DAYS: DayAvailability[] = [
  {
    day: "Monday",
    slots: [
      { id: "mon-1", start: "09:00 AM", end: "12:00 PM" },
      { id: "mon-2", start: "01:00 PM", end: "02:00 PM" },
      { id: "mon-3", start: "02:00 PM", end: "03:00 PM" },
      { id: "mon-4", start: "03:00 PM", end: "04:00 PM" },
    ],
  },
  {
    day: "Tuesday",
    slots: [{ id: "tue-1", start: "09:00 AM", end: "04:00 PM" }],
  },
  {
    day: "Wednesday",
    slots: [{ id: "wed-1", start: "09:00 AM", end: "11:00 PM" }],
  },
  {
    day: "Thursday",
    slots: [
      { id: "thu-1", start: "09:00 AM", end: "10:00 AM" },
      { id: "thu-2", start: "01:00 PM", end: "02:00 PM" },
    ],
  },
  {
    day: "Friday",
    slots: [],
  },
  {
    day: "Saturday",
    slots: [{ id: "sat-1", start: "02:00 PM", end: "03:00 PM" }],
  },
  {
    day: "Sunday",
    slots: [],
  },
]

export default function TeacherEditPage({ teacherId }: TeacherEditPageProps) {
  const router = useRouter()
  const profile = React.useMemo(() => {
    return getTeacherProfile(teacherId)
  }, [teacherId])

  // Basic Information
  const [fullName, setFullName] = React.useState(profile.personalInfo.fullName || "Ahmed Mohamed")
  const [nationalId, setNationalId] = React.useState(profile.personalInfo.nationalId || "March 4, 1988")
  const [dateOfBirth, setDateOfBirth] = React.useState(profile.personalInfo.dateOfBirth || "March 4, 1988")
  const [gender, setGender] = React.useState<"Male" | "Female">(profile.personalInfo.gender || "Male")
  const [phone, setPhone] = React.useState(profile.personalInfo.phone || "+20 100 447 2201")
  const [email, setEmail] = React.useState(profile.personalInfo.email || "ahmed.hassan@example.com")

  // Professional Information
  const [selectedSubjects, setSelectedSubjects] = React.useState<string[]>(
    profile.professionalInfo.subjects || ["Mathematics"]
  )
  const [qualifications, setQualifications] = React.useState(
    profile.professionalInfo.qualifications || "M.Sc. in Applied Mathematics, Cairo University"
  )
  const [yearsOfExperience, setYearsOfExperience] = React.useState(
    profile.professionalInfo.yearsOfExperience || "8 years"
  )
  const [teachingLevels, setTeachingLevels] = React.useState<string[]>(
    profile.professionalInfo.teachingLevels || ["Beginner"]
  )
  const [bio, setBio] = React.useState(
    profile.professionalInfo.bio ||
      "Passionate mathematics teacher focused on building strong problem-solving foundations through clear, structured lessons."
  )

  // Account Information
  const [loginMethod, setLoginMethod] = React.useState<"Email" | "Phone Number">("Email")
  const [accountEmail, setAccountEmail] = React.useState(profile.accountInfo.email || "ahmed.hassan@example.com")
  const [accountStatus, setAccountStatus] = React.useState<"Active" | "Inactive">(profile.accountInfo.accountStatus || "Active")

  // Teaching Setup
  const [setupSubjects, setSetupSubjects] = React.useState<string[]>(["Mathematics"])
  const [educationStages, setEducationStages] = React.useState<string[]>(["Preparatory"])
  const [setupTeachingLevels, setSetupTeachingLevels] = React.useState<string[]>([])

  // Documents
  const [hasDegreeCert, setHasDegreeCert] = React.useState(true)
  const [degreeFileName, setDegreeFileName] = React.useState("Screenshot 1526.png")
  const [degreeFileSize, setDegreeFileSize] = React.useState("288 KB")

  // Availability Schedule
  const [availability, setAvailability] = React.useState<DayAvailability[]>(INITIAL_DAYS)

  const toggleSubject = (sub: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    )
  }

  const toggleTeachingLevel = (level: string) => {
    setTeachingLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    )
  }

  const toggleSetupSubject = (sub: string) => {
    setSetupSubjects((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    )
  }

  const toggleEducationStage = (stage: string) => {
    setEducationStages((prev) =>
      prev.includes(stage) ? prev.filter((s) => s !== stage) : [...prev, stage]
    )
  }

  const toggleSetupTeachingLevel = (level: string) => {
    setSetupTeachingLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    )
  }

  const addTimeSlot = (dayName: string) => {
    setAvailability((prev) =>
      prev.map((d) => {
        if (d.day === dayName) {
          const newSlot: ScheduleSlot = {
            id: `${dayName}-${Date.now()}`,
            start: "09:00 AM",
            end: "12:00 PM",
          }
          return { ...d, slots: [...d.slots, newSlot] }
        }
        return d
      })
    )
  }

  const removeTimeSlot = (dayName: string, slotId: string) => {
    setAvailability((prev) =>
      prev.map((d) => {
        if (d.day === dayName) {
          return { ...d, slots: d.slots.filter((s) => s.id !== slotId) }
        }
        return d
      })
    )
  }

  const updateTimeSlot = (
    dayName: string,
    slotId: string,
    field: "start" | "end",
    val: string
  ) => {
    setAvailability((prev) =>
      prev.map((d) => {
        if (d.day === dayName) {
          return {
            ...d,
            slots: d.slots.map((s) => (s.id === slotId ? { ...s, [field]: val } : s)),
          }
        }
        return d
      })
    )
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Teacher changes saved successfully!")
    router.push(`/teacher/${teacherId}`)
  }

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* Top Header */}
      <div className="border-b border-zinc-200/80 bg-white/70 backdrop-blur-xs py-6 px-6 md:px-8">
        <div className="max-w-[1100px] mx-auto flex flex-col gap-3">
          <Link
            href="/teacher/teacher_list"
            className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer w-fit"
          >
            <ChevronLeft className="size-4 text-zinc-400" />
            <span>Back to All Teachers</span>
          </Link>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
              Edit Teacher
            </h1>
            <p className="text-xs text-zinc-500">
              Update teacher personal information, professional details, and teaching setup.
            </p>
          </div>
        </div>
      </div>

      {/* Main Form Content */}
      <main className="flex-1 p-6 md:p-8 max-w-[1100px] w-full mx-auto flex flex-col gap-6">
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          {/* Card 1: Basic Information */}
          <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-2xs">
            <h2 className="text-sm font-bold text-zinc-900 mb-5">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Full Name <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-10 px-3.5 text-xs text-zinc-800 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all placeholder:text-zinc-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  National ID <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  className="w-full h-10 px-3.5 text-xs text-zinc-800 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all placeholder:text-zinc-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Date of Birth <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full h-10 px-3.5 text-xs text-zinc-800 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all placeholder:text-zinc-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Gender <span className="text-amber-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as "Male" | "Female")}
                    className="w-full h-10 px-3.5 text-xs text-zinc-800 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all appearance-none cursor-pointer pr-10"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Phone Number <span className="text-zinc-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 px-3.5 text-xs text-zinc-800 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all placeholder:text-zinc-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Email Address <span className="text-zinc-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 px-3.5 text-xs text-zinc-800 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all placeholder:text-zinc-400"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Professional Information */}
          <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-2xs">
            <h2 className="text-sm font-bold text-zinc-900 mb-5">
              Professional Information
            </h2>

            {/* Subjects Tags */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-zinc-700 mb-2">
                Subjects <span className="text-amber-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_SUBJECTS.map((sub) => {
                  const isSelected = selectedSubjects.includes(sub)
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => toggleSubject(sub)}
                      className={cn(
                        "px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border",
                        isSelected
                          ? "border-amber-400 bg-[#FFFBEB] text-amber-700 shadow-2xs font-semibold"
                          : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
                      )}
                    >
                      {sub}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Qualifications <span className="text-zinc-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                  className="w-full h-10 px-3.5 text-xs text-zinc-800 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Years of Experience <span className="text-zinc-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(e.target.value)}
                  className="w-full h-10 px-3.5 text-xs text-zinc-800 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all"
                />
              </div>
            </div>

            {/* Teaching Levels */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-zinc-700 mb-2">
                Teaching Levels <span className="text-zinc-400 font-normal">(Optional)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {TEACHING_LEVELS.map((level) => {
                  const isSelected = teachingLevels.includes(level)
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => toggleTeachingLevel(level)}
                      className={cn(
                        "px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border",
                        isSelected
                          ? "border-amber-400 bg-[#FFFBEB] text-amber-700 shadow-2xs font-semibold"
                          : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
                      )}
                    >
                      {level}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Bio <span className="text-zinc-400 font-normal">(Optional)</span>
              </label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-3.5 text-xs text-zinc-800 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all leading-relaxed resize-none"
              />
            </div>
          </div>

          {/* Card 3: Account Information */}
          <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-2xs">
            <h2 className="text-sm font-bold text-zinc-900 mb-5">
              Account Information
            </h2>

            {/* Login Method */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-zinc-700 mb-2">
                Login Method <span className="text-amber-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button
                  type="button"
                  onClick={() => setLoginMethod("Email")}
                  className={cn(
                    "flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer",
                    loginMethod === "Email"
                      ? "border-amber-400 bg-[#FFFBEB] ring-1 ring-amber-400/60"
                      : "border-zinc-200 bg-white hover:border-zinc-300"
                  )}
                >
                  <div
                    className={cn(
                      "size-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                      loginMethod === "Email"
                        ? "border-amber-500 bg-white"
                        : "border-zinc-300 bg-white"
                    )}
                  >
                    {loginMethod === "Email" && (
                      <div className="size-2 rounded-full bg-amber-500" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-900 leading-tight">
                      Email
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">
                      Sign in with email and password
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setLoginMethod("Phone Number")}
                  className={cn(
                    "flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer",
                    loginMethod === "Phone Number"
                      ? "border-amber-400 bg-[#FFFBEB] ring-1 ring-amber-400/60"
                      : "border-zinc-200 bg-white hover:border-zinc-300"
                  )}
                >
                  <div
                    className={cn(
                      "size-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                      loginMethod === "Phone Number"
                        ? "border-amber-500 bg-white"
                        : "border-zinc-300 bg-white"
                    )}
                  >
                    {loginMethod === "Phone Number" && (
                      <div className="size-2 rounded-full bg-amber-500" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-900 leading-tight">
                      Phone Number
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">
                      Sign in with phone number
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Email Input */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Email <span className="text-amber-500">*</span>
              </label>
              <input
                type="email"
                required
                value={accountEmail}
                onChange={(e) => setAccountEmail(e.target.value)}
                className="w-full h-10 px-3.5 text-xs text-zinc-800 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all"
              />
            </div>

            {/* Account Status */}
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-2">
                Account Status
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button
                  type="button"
                  onClick={() => setAccountStatus("Active")}
                  className={cn(
                    "flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer",
                    accountStatus === "Active"
                      ? "border-amber-400 bg-[#FFFBEB] ring-1 ring-amber-400/60"
                      : "border-zinc-200 bg-white hover:border-zinc-300"
                  )}
                >
                  <div
                    className={cn(
                      "size-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                      accountStatus === "Active"
                        ? "border-amber-500 bg-white"
                        : "border-zinc-300 bg-white"
                    )}
                  >
                    {accountStatus === "Active" && (
                      <div className="size-2 rounded-full bg-amber-500" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-900 leading-tight">
                      Active
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">
                      Can receive bookings
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setAccountStatus("Inactive")}
                  className={cn(
                    "flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer",
                    accountStatus === "Inactive"
                      ? "border-amber-400 bg-[#FFFBEB] ring-1 ring-amber-400/60"
                      : "border-zinc-200 bg-white hover:border-zinc-300"
                  )}
                >
                  <div
                    className={cn(
                      "size-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                      accountStatus === "Inactive"
                        ? "border-amber-500 bg-white"
                        : "border-zinc-300 bg-white"
                    )}
                  >
                    {accountStatus === "Inactive" && (
                      <div className="size-2 rounded-full bg-amber-500" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-900 leading-tight">
                      Inactive
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">
                      Cannot receive bookings
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Card 4: Teaching Setup */}
          <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-2xs">
            <h2 className="text-sm font-bold text-zinc-900 mb-5">
              Teaching Setup
            </h2>

            {/* Subjects */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-zinc-700 mb-2">
                Subjects <span className="text-zinc-400 font-normal">(Optional)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_SUBJECTS.map((sub) => {
                  const isSelected = setupSubjects.includes(sub)
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => toggleSetupSubject(sub)}
                      className={cn(
                        "px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border",
                        isSelected
                          ? "border-amber-400 bg-[#FFFBEB] text-amber-700 shadow-2xs font-semibold"
                          : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
                      )}
                    >
                      {sub}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Education Stages */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-zinc-700 mb-2">
                Education Stages <span className="text-zinc-400 font-normal">(Optional)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {EDUCATION_STAGES.map((stg) => {
                  const isSelected = educationStages.includes(stg)
                  return (
                    <button
                      key={stg}
                      type="button"
                      onClick={() => toggleEducationStage(stg)}
                      className={cn(
                        "px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border",
                        isSelected
                          ? "border-amber-400 bg-[#FFFBEB] text-amber-700 shadow-2xs font-semibold"
                          : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
                      )}
                    >
                      {stg}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Teaching Levels */}
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-2">
                Teaching Levels <span className="text-zinc-400 font-normal">(Optional)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {TEACHING_LEVELS.map((lvl) => {
                  const isSelected = setupTeachingLevels.includes(lvl)
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => toggleSetupTeachingLevel(lvl)}
                      className={cn(
                        "px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border",
                        isSelected
                          ? "border-amber-400 bg-[#FFFBEB] text-amber-700 shadow-2xs font-semibold"
                          : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
                      )}
                    >
                      {lvl}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Card 5: Verification Documents */}
          <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-2xs">
            <h2 className="text-sm font-bold text-zinc-900 mb-1">
              Verification Documents
            </h2>
            <p className="text-xs text-zinc-500 mb-6">
              Upload the required documents to verify this teacher's identity and academic qualifications.
            </p>

            {/* University Degree Certificate */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-medium text-zinc-700">
                  University Degree Certificate
                </label>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200/70">
                  <span className="size-1.5 rounded-full bg-amber-500" />
                  Pending Review
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mb-3">
                Upload a clear image of the teacher's university degree certificate.
              </p>

              {hasDegreeCert ? (
                <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 bg-zinc-50/50">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-zinc-800 flex items-center justify-center text-white shrink-0 shadow-2xs">
                      <FileText className="size-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-zinc-800">
                        {degreeFileName}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {degreeFileSize}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toast.info("Select a new file to replace")}
                      className="text-xs font-medium text-zinc-600 hover:text-zinc-900 px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 transition-colors cursor-pointer"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasDegreeCert(false)}
                      className="text-xs font-medium text-red-600 hover:text-red-700 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => {
                    setHasDegreeCert(true)
                    setDegreeFileName("University_Certificate.pdf")
                    setDegreeFileSize("1.2 MB")
                  }}
                  className="border-2 border-dashed border-zinc-200 hover:border-amber-400 rounded-2xl p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center bg-zinc-50/30"
                >
                  <div className="size-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 mb-2">
                    <UploadCloud className="size-5" />
                  </div>
                  <span className="text-xs font-semibold text-zinc-800 mb-0.5">
                    Upload Certificate
                  </span>
                  <span className="text-[11px] text-zinc-400 mb-1">
                    Drag & drop or browse
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    JPG, JPEG, PNG, PDF - Max 5 MB
                  </span>
                </div>
              )}
            </div>

            {/* National ID */}
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                National ID <span className="text-amber-500">*</span>
              </label>
              <p className="text-[11px] text-zinc-400 mb-3">
                Upload a clear image of the teacher's national ID.
              </p>

              <div
                onClick={() => toast.success("National ID selected")}
                className="border-2 border-dashed border-zinc-200 hover:border-amber-400 rounded-2xl p-7 text-center cursor-pointer transition-colors flex flex-col items-center justify-center bg-zinc-50/30"
              >
                <div className="size-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 mb-2">
                  <UploadCloud className="size-5" />
                </div>
                <span className="text-xs font-semibold text-zinc-800 mb-0.5">
                  Upload Certificate
                </span>
                <span className="text-[11px] text-zinc-400 mb-1">
                  Drag & drop or browse
                </span>
                <span className="text-[10px] text-zinc-400">
                  JPG, JPEG, PNG - Max 5 MB
                </span>
              </div>
            </div>
          </div>

          {/* Card 6: Availability */}
          <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-2xs">
            <h2 className="text-sm font-bold text-zinc-900 mb-6">
              Availability
            </h2>

            <div className="flex flex-col divide-y divide-zinc-100">
              {availability.map((dayItem) => (
                <div
                  key={dayItem.day}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  {/* Day Column */}
                  <div className="w-28 text-xs font-semibold text-zinc-800 shrink-0">
                    {dayItem.day}
                  </div>

                  {/* Slots row */}
                  <div className="flex-1 flex flex-wrap items-center gap-3">
                    {dayItem.slots.length === 0 ? (
                      <span className="text-xs text-zinc-400 italic">
                        Unavailable
                      </span>
                    ) : (
                      dayItem.slots.map((slot) => (
                        <div
                          key={slot.id}
                          className="inline-flex items-center gap-2 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-xl text-xs"
                        >
                          <input
                            type="text"
                            value={slot.start}
                            onChange={(e) =>
                              updateTimeSlot(dayItem.day, slot.id, "start", e.target.value)
                            }
                            className="w-18 text-xs font-medium text-zinc-800 bg-transparent focus:outline-none focus:text-amber-600"
                          />
                          <span className="text-zinc-400">-</span>
                          <input
                            type="text"
                            value={slot.end}
                            onChange={(e) =>
                              updateTimeSlot(dayItem.day, slot.id, "end", e.target.value)
                            }
                            className="w-18 text-xs font-medium text-zinc-800 bg-transparent focus:outline-none focus:text-amber-600"
                          />
                          <button
                            type="button"
                            onClick={() => removeTimeSlot(dayItem.day, slot.id)}
                            className="text-zinc-400 hover:text-red-500 transition-colors p-0.5 ml-0.5 cursor-pointer"
                          >
                            <X className="size-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Slot Button */}
                  <div className="shrink-0">
                    <button
                      type="button"
                      onClick={() => addTimeSlot(dayItem.day)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 shadow-2xs transition-colors cursor-pointer"
                    >
                      <Plus className="size-3.5" />
                      <span>Add time slot</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Actions Bar */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/teacher/teacher_list"
              className="px-6 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 transition-colors cursor-pointer shadow-2xs"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand-orange hover:bg-amber-500 text-xs font-semibold text-white transition-all shadow-2xs cursor-pointer active:scale-[0.98]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
