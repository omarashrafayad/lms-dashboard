"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronDown, Check, KeyRound, Camera } from "lucide-react"
import { toast } from "sonner"
import { getStudentProfile } from "../data/mockStudentProfile"
import { cn } from "@/lib/utils"

interface StudentEditPageProps {
  studentId: string
}

// Subject options matching the design
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

// Course options matching the design
const ALL_COURSES = [
  "Mathematics",
  "English",
  "Physics",
  "Chemistry",
  "Computer Science",
  "Creative Writing",
]

const LEARNING_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const

export default function StudentEditPage({ studentId }: StudentEditPageProps) {
  const router = useRouter()
  const profile = React.useMemo(() => {
    return getStudentProfile(studentId)
  }, [studentId])

  // Form State
  const [avatarInitials, setAvatarInitials] = React.useState(
    profile.avatarInitials || "AA"
  )
  const [avatarImage, setAvatarImage] = React.useState<string | null>(null)
  const [fullName, setFullName] = React.useState(profile.fullName || "Ahmed Ali")
  const [dateOfBirth, setDateOfBirth] = React.useState(
    profile.dateOfBirth || "March 15, 2012"
  )
  const [gender, setGender] = React.useState<"Male" | "Female">(
    profile.gender || "Male"
  )
  const [phone, setPhone] = React.useState(profile.phone || "+20 100 123 4567")
  const [email, setEmail] = React.useState(
    profile.email || "ahmed@example.com"
  )

  // Academic State
  const [educationSystem, setEducationSystem] = React.useState(
    profile.educationSystem || "National"
  )
  const [educationStage, setEducationStage] = React.useState(
    profile.educationStage || "Secondary"
  )
  const [grade, setGrade] = React.useState(profile.grade || "Grade 10")
  const [school, setSchool] = React.useState(
    profile.school || "Future International School"
  )
  const [customStudentId, setCustomStudentId] = React.useState(
    profile.studentId || "STU-1024"
  )

  // Account State
  const [loginMethod, setLoginMethod] = React.useState<"Email" | "Phone Number">(
    "Email"
  )
  const [accountEmail, setAccountEmail] = React.useState(
    profile.email || "ahmed@example.com"
  )
  const [accountStatus, setAccountStatus] = React.useState<"Active" | "Inactive">(
    (profile.status as "Active" | "Inactive") || "Active"
  )

  // Learning Setup State
  const [assignedSubjects, setAssignedSubjects] = React.useState<string[]>([
    "Mathematics",
    "English",
    "Physics",
    "Computer Science",
  ])
  const [assignedCourses, setAssignedCourses] = React.useState<string[]>([
    "Mathematics",
    "English",
    "Physics",
    "Computer Science",
  ])
  const [learningLevel, setLearningLevel] = React.useState<
    "Beginner" | "Intermediate" | "Advanced"
  >("Intermediate")

  // Modals
  const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = React.useState(false)
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [isSaving, setIsSaving] = React.useState(false)

  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Toggle Subject selection
  const toggleSubject = (subj: string) => {
    setAssignedSubjects((prev) =>
      prev.includes(subj) ? prev.filter((s) => s !== subj) : [...prev, subj]
    )
  }

  // Toggle Course selection
  const toggleCourse = (crs: string) => {
    setAssignedCourses((prev) =>
      prev.includes(crs) ? prev.filter((c) => c !== crs) : [...prev, crs]
    )
  }

  // Handle Photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setAvatarImage(url)
      toast.success("Profile photo updated")
    }
  }

  // Confirm Save Changes
  const handleConfirmSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setIsConfirmModalOpen(false)
      toast.success("Student information updated successfully")
      // Redirect back to student profile or list
      router.push(`/student/${studentId}`)
    }, 600)
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPassword || newPassword !== confirmPassword) {
      toast.error("Passwords do not match or are empty")
      return
    }
    setIsPasswordModalOpen(false)
    setNewPassword("")
    setConfirmPassword("")
    toast.success("Password updated successfully")
  }

  return (
    <div className="flex-1 bg-[#F9FAFB] min-h-screen flex flex-col">
      {/* Top Header Bar */}
      <header className="bg-white border-b border-zinc-200/80 px-6 lg:px-8 pt-5 pb-5">
        <div className="max-w-[1060px] mx-auto w-full">
          {/* Back Link */}
          <div className="mb-3">
            <Link
              href="/student/student_list"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors group cursor-pointer"
            >
              <ChevronLeft className="size-4 text-zinc-400 group-hover:text-zinc-700 transition-colors" />
              <span>Back to All Students</span>
            </Link>
          </div>

          {/* Title & Student Meta */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
                Edit Student
              </h1>
              <p className="text-xs text-zinc-500 mt-1">
                Update the student&apos;s personal, academic, account, and learning information.
              </p>
            </div>

            {/* Top Right Student Badge */}
            <div className="flex items-center gap-3 self-start sm:self-auto">
              <div
                className={cn(
                  "size-10 rounded-full font-bold text-xs flex items-center justify-center shrink-0 select-none overflow-hidden",
                  profile.avatarColorClass || "bg-sky-100 text-sky-700"
                )}
              >
                {avatarImage ? (
                  <img
                    src={avatarImage}
                    alt={fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  avatarInitials
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-zinc-900 leading-tight">
                  {fullName}
                </span>
                <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-normal mt-0.5">
                  <span>{customStudentId}</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    {accountStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Form Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setIsConfirmModalOpen(true)
          }}
          className="max-w-[1060px] mx-auto flex flex-col gap-6"
        >
          {/* 1. Basic Information */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs">
            <h2 className="text-xs font-bold text-zinc-900 mb-5">
              Basic Information
            </h2>

            {/* Profile Picture */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className={cn(
                  "size-14 rounded-full font-bold text-base flex items-center justify-center shrink-0 select-none overflow-hidden",
                  profile.avatarColorClass || "bg-sky-100 text-sky-700"
                )}
              >
                {avatarImage ? (
                  <img
                    src={avatarImage}
                    alt={fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  avatarInitials
                )}
              </div>
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-zinc-700">
                    Profile Picture
                  </span>
                  <span className="text-[11px] text-zinc-400 font-normal">
                    (Optional)
                  </span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-1 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-700 transition-colors shadow-2xs cursor-pointer"
                >
                  Change photo
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div className="mb-4">
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

            {/* Date of Birth & Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
            </div>

            {/* Phone Number & Email Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Phone Number{" "}
                  <span className="text-[11px] text-zinc-400 font-normal">
                    (Optional)
                  </span>
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
                  Email Address{" "}
                  <span className="text-[11px] text-zinc-400 font-normal">
                    (Optional)
                  </span>
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

          {/* 2. Academic Information */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs">
            <h2 className="text-xs font-bold text-zinc-900 mb-5">
              Academic Information
            </h2>

            {/* Education System & Education Stage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Education System <span className="text-amber-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={educationSystem}
                    onChange={(e) => setEducationSystem(e.target.value)}
                    className="w-full h-10 px-3.5 text-xs text-zinc-800 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all appearance-none cursor-pointer pr-10"
                  >
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
                    value={educationStage}
                    onChange={(e) => setEducationStage(e.target.value)}
                    className="w-full h-10 px-3.5 text-xs text-zinc-800 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all appearance-none cursor-pointer pr-10"
                  >
                    <option value="Primary">Primary</option>
                    <option value="Preparatory">Preparatory</option>
                    <option value="Secondary">Secondary</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Grade & School Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Grade <span className="text-amber-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full h-10 px-3.5 text-xs text-zinc-800 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all appearance-none cursor-pointer pr-10"
                  >
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  School Name <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="w-full h-10 px-3.5 text-xs text-zinc-800 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all placeholder:text-zinc-400"
                />
              </div>
            </div>

            {/* Student ID */}
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Student ID <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                required
                value={customStudentId}
                onChange={(e) => setCustomStudentId(e.target.value)}
                className="w-full h-10 px-3.5 text-xs text-zinc-800 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all placeholder:text-zinc-400"
              />
            </div>
          </div>

          {/* 3. Account Information */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs">
            <h2 className="text-xs font-bold text-zinc-900 mb-5">
              Account Information
            </h2>

            {/* Login Method */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-zinc-700 mb-2">
                Login Method
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Email Option */}
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
                      Sign in with an email address
                    </div>
                  </div>
                </button>

                {/* Phone Number Option */}
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
                      Sign in with a phone number
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Account Email */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Account Email <span className="text-amber-500">*</span>
              </label>
              <input
                type="email"
                required
                value={accountEmail}
                onChange={(e) => setAccountEmail(e.target.value)}
                className="w-full h-10 px-3.5 text-xs text-zinc-800 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all placeholder:text-zinc-400"
              />
            </div>

            {/* Account Status */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-zinc-700 mb-2">
                Account Status
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Active Option */}
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
                      Student can sign in
                    </div>
                  </div>
                </button>

                {/* Inactive Option */}
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
                      Access disabled
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Password Item */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-zinc-200/80 bg-zinc-50/40">
              <div>
                <div className="text-xs font-semibold text-zinc-900 leading-tight">
                  Password
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  Changing the password is optional.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(true)}
                className="px-3.5 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-700 transition-colors shadow-2xs cursor-pointer self-start sm:self-auto"
              >
                Change Password
              </button>
            </div>
          </div>

          {/* 4. Learning Setup */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs">
            <h2 className="text-xs font-bold text-zinc-900 mb-5">
              Learning Setup
            </h2>

            {/* Assigned Subjects */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-zinc-700 mb-2">
                Assigned Subjects{" "}
                <span className="text-[11px] text-zinc-400 font-normal">
                  (Optional)
                </span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {ALL_SUBJECTS.map((subject) => {
                  const isSelected = assignedSubjects.includes(subject)
                  return (
                    <button
                      key={subject}
                      type="button"
                      onClick={() => toggleSubject(subject)}
                      className={cn(
                        "px-4 py-1.5 rounded-full text-xs transition-all cursor-pointer",
                        isSelected
                          ? "border border-amber-400 bg-[#FFFBEB] text-zinc-900 font-medium shadow-2xs"
                          : "border border-zinc-200 bg-white text-zinc-600 font-normal hover:border-zinc-300"
                      )}
                    >
                      {subject}
                    </button>
                  )
                })}
              </div>
              <p className="text-[11px] text-zinc-400 mt-2">
                Select one or more subjects.
              </p>
            </div>

            {/* Assigned Courses */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-zinc-700 mb-2">
                Assigned Courses{" "}
                <span className="text-[11px] text-zinc-400 font-normal">
                  (Optional)
                </span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {ALL_COURSES.map((course) => {
                  const isSelected = assignedCourses.includes(course)
                  return (
                    <button
                      key={course}
                      type="button"
                      onClick={() => toggleCourse(course)}
                      className={cn(
                        "px-4 py-1.5 rounded-full text-xs transition-all cursor-pointer",
                        isSelected
                          ? "border border-amber-400 bg-[#FFFBEB] text-zinc-900 font-medium shadow-2xs"
                          : "border border-zinc-200 bg-white text-zinc-600 font-normal hover:border-zinc-300"
                      )}
                    >
                      {course}
                    </button>
                  )
                })}
              </div>
              <p className="text-[11px] text-zinc-400 mt-2">
                Select one or more courses.
              </p>
            </div>

            {/* Initial Learning Level */}
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-2">
                Initial Learning Level
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {LEARNING_LEVELS.map((level) => {
                  const isSelected = learningLevel === level
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setLearningLevel(level)}
                      className={cn(
                        "flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-medium transition-all cursor-pointer",
                        isSelected
                          ? "border-amber-400 bg-[#FFFBEB] text-zinc-900 ring-1 ring-amber-400/60 font-semibold"
                          : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
                      )}
                    >
                      <div
                        className={cn(
                          "size-3.5 rounded-full border flex items-center justify-center shrink-0 transition-colors",
                          isSelected
                            ? "border-amber-500 bg-white"
                            : "border-zinc-300 bg-white"
                        )}
                      >
                        {isSelected && (
                          <div className="size-1.5 rounded-full bg-amber-500" />
                        )}
                      </div>
                      <span>{level}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-2 pb-12">
            <button
              type="button"
              onClick={() => router.push(`/student/${studentId}`)}
              className="px-5 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-700 transition-colors shadow-2xs cursor-pointer active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-xs font-semibold text-white transition-all shadow-xs cursor-pointer active:scale-[0.98]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </main>

      {/* Confirmation Modal (Matches Image 2) */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-zinc-100 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-zinc-900 leading-tight">
              Save Changes?
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed mt-2.5">
              Are you sure you want to save the changes made to this student&apos;s information?
            </p>
            <div className="flex items-center justify-end gap-2.5 mt-6">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={handleConfirmSave}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-xs font-semibold text-white transition-all shadow-xs cursor-pointer disabled:opacity-70 flex items-center gap-1.5"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-zinc-100 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-zinc-900 leading-tight">
              Change Password
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed mt-1 mb-4">
              Enter a new secure password for {fullName}.
            </p>
            <form onSubmit={handleChangePassword} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-9 px-3 text-xs text-zinc-800 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-9 px-3 text-xs text-zinc-800 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400"
                />
              </div>
              <div className="flex items-center justify-end gap-2.5 mt-3">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-xs font-semibold text-white transition-all shadow-xs cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
