"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, Check, X, Search, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import { getParentProfile } from "../data/mockParentProfile"
import { mockStudents } from "@/features/dashboard/student/data/mockStudents"
import { useParent, useUpdateParent } from "../hooks/useParents"
import { updateParentSchema } from "../schema/parent.schema"
import { toast } from "sonner"

export interface ParentEditPageProps {
  parentId: string
}

interface LinkedChildItem {
  id: string
  name: string
  avatarUrl?: string
  grade: string
  stage: string
}

export default function ParentEditPage({ parentId }: ParentEditPageProps) {
  const router = useRouter()

  const { data: apiParent, isLoading: isFetchingParent } = useParent(parentId)
  const updateParentMutation = useUpdateParent()

  const profile = React.useMemo(() => {
    return getParentProfile(parentId)
  }, [parentId])

  // Form State initialized
  const [firstName, setFirstName] = React.useState("")
  const [lastName, setLastName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [status, setStatus] = React.useState<"Active" | "Inactive">("Active")
  const [sendWelcomeEmail, setSendWelcomeEmail] = React.useState(false)

  // Sync state when apiParent or profile is ready
  React.useEffect(() => {
    if (apiParent) {
      setFirstName(apiParent.firstName || "")
      setLastName(apiParent.lastName || "")
      setEmail(apiParent.email || "")
      setPhone(apiParent.phoneNumber || "")
      setStatus(apiParent.isActive ? "Active" : "Inactive")
    } else if (profile) {
      const parts = (profile.name || "").split(" ")
      setFirstName(parts[0] || "")
      setLastName(parts.slice(1).join(" ") || "")
      setEmail(profile.email || "")
      setPhone(profile.phone || "")
      setStatus(profile.status || "Active")
    }
  }, [apiParent, profile])

  // Linked Children
  const [linkedChildren, setLinkedChildren] = React.useState<LinkedChildItem[]>(() =>
    profile.linkedChildren.map((c) => ({
      id: c.id,
      name: c.name,
      avatarUrl: c.avatarUrl,
      grade: c.grade,
      stage: c.stage,
    }))
  )
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isSearching, setIsSearching] = React.useState(false)

  // Derived Full Name
  const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(" ")

  // Search Results
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase()
    return mockStudents
      .filter(
        (s) =>
          !linkedChildren.some((c) => c.name === s.name) &&
          (s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q))
      )
      .slice(0, 5)
  }, [searchQuery, linkedChildren])

  const handleAddChild = (student: (typeof mockStudents)[0]) => {
    setLinkedChildren((prev) => [
      ...prev,
      {
        id: student.id,
        name: student.name,
        grade: student.grade,
        stage: student.stage,
      },
    ])
    setSearchQuery("")
    setIsSearching(false)
  }

  const handleRemoveChild = (id: string) => {
    setLinkedChildren((prev) => prev.filter((c) => c.id !== id))
  }

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault()

    const parseResult = updateParentSchema.safeParse({
      firstName,
      lastName,
      email,
      phoneNumber: phone,
      isActive: status === "Active",
    })

    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues[0]?.message || "Please check required fields."
      toast.error(errorMsg)
      return
    }

    try {
      await updateParentMutation.mutateAsync({
        parentId,
        data: {
          firstName: parseResult.data.firstName,
          lastName: parseResult.data.lastName,
          email: parseResult.data.email,
          phoneNumber: parseResult.data.phoneNumber,
          isActive: parseResult.data.isActive,
        },
      })
      toast.success("Parent updated successfully")
      router.push("/parent/parent_list")
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update parent. Please check input data."
      toast.error(errorMsg)
    }
  }

  if (isFetchingParent) {
    return (
      <div className="flex flex-col min-h-full items-center justify-center p-12">
        <Loader2 className="size-8 text-brand-orange animate-spin mb-3" />
        <span className="text-sm text-zinc-500">Loading parent details...</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Page Header */}
      <PageHeader
        title="Edit Parent"
        description="Update this parent's account information and linked children."
      />

      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1400px] w-full mx-auto pb-16">
        {/* Back Link */}
        <div>
          <Link
            href="/parent/parent_list"
            className="inline-flex items-center gap-2 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <ChevronLeft className="size-4 text-zinc-500" />
            <span>Back to All Parents</span>
          </Link>
        </div>

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column (Forms): Span 2 */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* 1. Basic Information */}
            <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="size-6 rounded-full bg-[#FEF3C7] text-[#D97706] text-xs font-bold flex items-center justify-center shrink-0">
                  1
                </div>
                <h2 className="text-sm font-bold text-zinc-900">
                  Basic Information
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-zinc-700">
                    First Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Hana"
                    className="w-full h-10 px-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
                  />
                </div>

                {/* Last Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-zinc-700">
                    Last Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Mostafa"
                    className="w-full h-10 px-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-zinc-700">
                    Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hana@example.com"
                    className="w-full h-10 px-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
                  />
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-zinc-700">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+20 100 447 2210"
                    className="w-full h-10 px-3.5 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
                  />
                </div>
              </div>

              <span className="text-[11px] text-zinc-400 font-normal">
                Email and phone number are required for parent account notification and access.
              </span>
            </div>

            {/* 2. Account Information */}
            <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="size-6 rounded-full bg-[#FEF3C7] text-[#D97706] text-xs font-bold flex items-center justify-center shrink-0">
                  2
                </div>
                <h2 className="text-sm font-bold text-zinc-900">
                  Account Information
                </h2>
              </div>

              {/* Status Segmented Buttons */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-zinc-700">
                  Account Status
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStatus("Active")}
                    className={`flex-1 sm:flex-none sm:w-36 h-10 rounded-xl text-xs font-semibold cursor-pointer transition-all border ${status === "Active"
                        ? "bg-[#FEF3C7] text-zinc-900 border-[#FDE68A] shadow-2xs"
                        : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
                      }`}
                  >
                    Active
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatus("Inactive")}
                    className={`flex-1 sm:flex-none sm:w-36 h-10 rounded-xl text-xs font-semibold cursor-pointer transition-all border ${status === "Inactive"
                        ? "bg-[#FEF3C7] text-zinc-900 border-[#FDE68A] shadow-2xs"
                        : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
                      }`}
                  >
                    Inactive
                  </button>
                </div>
              </div>

              {/* Send Welcome Email Checkbox */}
              <label className="flex items-center gap-2.5 cursor-pointer select-none pt-1">
                <input
                  type="checkbox"
                  checked={sendWelcomeEmail}
                  onChange={(e) => setSendWelcomeEmail(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`size-4 rounded-sm border flex items-center justify-center transition-colors ${sendWelcomeEmail
                      ? "bg-[#F59E0B] border-[#F59E0B] text-white"
                      : "border-zinc-300 bg-white"
                    }`}
                >
                  {sendWelcomeEmail && <Check className="size-3 stroke-[3]" />}
                </div>
                <span className="text-xs text-zinc-700 font-normal">
                  Resend welcome email / notification
                </span>
              </label>
            </div>

            {/* 3. Link Children */}
            <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <div className="size-6 rounded-full bg-[#FEF3C7] text-[#D97706] text-xs font-bold flex items-center justify-center shrink-0">
                    3
                  </div>
                  <h2 className="text-sm font-bold text-zinc-900">
                    Link Children
                  </h2>
                </div>
                <p className="text-xs text-zinc-400 font-normal ml-9">
                  Manage the students connected to this parent account.
                </p>
              </div>

              {/* Search Bar for adding children */}
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setIsSearching(true)
                  }}
                  onFocus={() => setIsSearching(true)}
                  placeholder="Search students by name or code to link..."
                  className="w-full h-10 pl-10 pr-4 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
                />

                {/* Autocomplete Dropdown */}
                {isSearching && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-200/90 rounded-xl shadow-lg z-20 overflow-hidden divide-y divide-zinc-100">
                    {searchResults.map((student) => (
                      <div
                        key={student.id}
                        onClick={() => handleAddChild(student)}
                        className="px-4 py-2.5 flex items-center justify-between hover:bg-zinc-50 cursor-pointer transition-colors"
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-zinc-900">
                            {student.name}
                          </span>
                          <span className="text-[11px] text-zinc-400">
                            {student.grade} • {student.code}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="text-xs font-medium text-[#D97706] hover:underline"
                        >
                          + Link
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Linked Children List */}
              {linkedChildren.length === 0 ? (
                <div className="p-6 rounded-xl border border-dashed border-zinc-200 text-center">
                  <span className="text-xs text-zinc-400">
                    No children linked yet. Use the search bar above to link students.
                  </span>
                </div>
              ) : (
                <div className="border border-zinc-200/80 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-50 border-b border-zinc-200/80 text-zinc-400 uppercase text-[10px] font-semibold">
                      <tr>
                        <th className="py-2.5 px-4">Student</th>
                        <th className="py-2.5 px-4">Grade & Stage</th>
                        <th className="py-2.5 px-4">Status</th>
                        <th className="py-2.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {linkedChildren.map((child) => (
                        <tr key={child.id} className="hover:bg-zinc-50/50">
                          <td className="py-3 px-4 font-semibold text-zinc-900">
                            {child.name}
                          </td>
                          <td className="py-3 px-4 text-zinc-600">
                            {child.grade} ({child.stage})
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium text-[#4D7C0F] bg-[#ECFCCB]">
                              <span className="size-1.5 rounded-full bg-[#65A30D]" />
                              Linked
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveChild(child.id)}
                              className="text-zinc-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                              title="Unlink child"
                            >
                              <X className="size-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Review Live Summary */}
          <div className="lg:col-span-1 sticky top-24 flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col gap-6">
              {/* Review Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-zinc-900">Review</h3>
                <span className="text-xs text-zinc-400 font-normal">
                  Live summary
                </span>
              </div>

              {/* Parent Information Summary */}
              <div className="flex flex-col gap-3">
                <span className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                  PARENT INFORMATION
                </span>

                <div className="flex flex-col divide-y divide-zinc-100 text-xs">
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-zinc-400 font-normal">Full Name</span>
                    <span className="font-semibold text-zinc-900">
                      {fullName || profile.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-zinc-400 font-normal">Email</span>
                    <span className="font-semibold text-zinc-900 break-all">
                      {email}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-zinc-400 font-normal">Phone</span>
                    <span className="font-semibold text-zinc-900">
                      {phone}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-zinc-400 font-normal">
                      Account Status
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${status === "Active"
                          ? "text-emerald-700 bg-emerald-50 border-emerald-200/60"
                          : "text-zinc-500 bg-zinc-50 border-zinc-200"
                        }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${status === "Active" ? "bg-emerald-500" : "bg-zinc-400"
                          }`}
                      />
                      {status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Linked Children Summary */}
              <div className="flex flex-col gap-3">
                <span className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                  LINKED CHILDREN ({linkedChildren.length})
                </span>

                {linkedChildren.length === 0 ? (
                  <span className="text-xs text-zinc-400 font-normal">
                    No children selected.
                  </span>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {linkedChildren.map((child) => (
                      <div
                        key={child.id}
                        className="flex items-center gap-2.5 text-xs"
                      >
                        <div className="size-7 rounded-full overflow-hidden shrink-0 border border-zinc-200 bg-zinc-100 flex items-center justify-center">
                          {child.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={child.avatarUrl}
                              alt={child.name}
                              className="size-full object-cover"
                            />
                          ) : (
                            <span className="font-semibold text-[10px] text-zinc-700">
                              {child.name.slice(0, 2).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-zinc-900 leading-tight">
                            {child.name}
                          </span>
                          <span className="text-[11px] text-zinc-400">
                            {child.grade}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Save Changes and Cancel Buttons */}
              <div className="flex flex-col gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  disabled={updateParentMutation.isPending}
                  className="w-full h-10 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-white font-medium text-xs flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateParentMutation.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Check className="size-4 stroke-[2.5]" />
                  )}
                  <span>{updateParentMutation.isPending ? "Saving..." : "Save Changes"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/parent/parent_list")}
                  className="w-full h-10 rounded-xl bg-white border border-zinc-200/90 hover:bg-zinc-50 text-zinc-700 font-medium text-xs flex items-center justify-center transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
