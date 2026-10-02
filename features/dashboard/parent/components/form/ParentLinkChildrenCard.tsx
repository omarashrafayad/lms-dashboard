"use client"

import * as React from "react"
import { Search, X, Loader2 } from "lucide-react"
import { useStudents } from "@/features/dashboard/student/hooks/useStudents"
import { ApiStudent } from "@/features/dashboard/student/types/student.types"

export interface LinkedChildItem {
  id: string
  name: string
  avatarUrl?: string
  grade: string
  stage: string
  email?: string
}

export interface ParentLinkChildrenCardProps {
  linkedChildren: LinkedChildItem[]
  onAddChild: (student: ApiStudent) => void
  onRemoveChild: (id: string) => void
}

const COLOR_VARIANTS = [
  "bg-sky-100 text-sky-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-purple-100 text-purple-700",
  "bg-rose-100 text-rose-700",
]

export function ParentLinkChildrenCard({
  linkedChildren,
  onAddChild,
  onRemoveChild,
}: ParentLinkChildrenCardProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isSearching, setIsSearching] = React.useState(false)
  const searchContainerRef = React.useRef<HTMLDivElement>(null)

  // Fetch all students without search param (client-side filtering)
  const { data: apiStudents = [], isLoading: isLoadingStudents } = useStudents()

  // Close dropdown on click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearching(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Frontend search and filter out already linked children
  const searchResults = React.useMemo(() => {
    if (!apiStudents || !Array.isArray(apiStudents)) return []
    const available = apiStudents.filter(
      (s) => !linkedChildren.some((c) => c.id === s.id)
    )
    if (!searchQuery.trim()) return available

    const q = searchQuery.toLowerCase().trim()
    return available.filter((s) => {
      const name = (s.fullName || "").toLowerCase()
      const email = (s.email || "").toLowerCase()
      const stage = (s.educationStage || "").toLowerCase()
      const grade = (s.grade || "").toLowerCase()
      return (
        name.includes(q) ||
        email.includes(q) ||
        stage.includes(q) ||
        grade.includes(q)
      )
    })
  }, [apiStudents, linkedChildren, searchQuery])

  const handleSelectStudent = (student: ApiStudent) => {
    onAddChild(student)
    setSearchQuery("")
    setIsSearching(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="size-6 rounded-full bg-[#FEF3C7] text-[#D97706] text-xs font-bold flex items-center justify-center shrink-0">
            3
          </div>
          <h2 className="text-sm font-bold text-zinc-900">Link Children</h2>
        </div>
        <p className="text-xs text-zinc-400 font-normal ml-9">
          Connect existing student accounts to this parent. Linking children is optional.
        </p>
      </div>

      {/* Search Bar with dropdown */}
      <div ref={searchContainerRef} className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setIsSearching(true)
          }}
          onFocus={() => setIsSearching(true)}
          placeholder="Search students by name, email, or stage..."
          className="w-full h-10 pl-10 pr-10 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
        />

        {/* Clear search button */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {searchQuery ? (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("")
              }}
              className="text-zinc-400 hover:text-zinc-600 p-0.5 cursor-pointer"
              title="Clear search"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>

        {/* Autocomplete Dropdown */}
        {isSearching && (
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-zinc-200 rounded-xl shadow-lg z-30 py-1.5 max-h-72 overflow-y-auto divide-y divide-zinc-50">
            {isLoadingStudents ? (
              <div className="flex items-center justify-center gap-2 py-6 text-zinc-400 text-xs">
                <Loader2 className="size-4 animate-spin text-amber-500" />
                <span>Loading students...</span>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="py-6 px-4 text-center text-xs text-zinc-400">
                {searchQuery.trim()
                  ? `No students found matching "${searchQuery}"`
                  : "No available students found."}
              </div>
            ) : (
              searchResults.map((student, idx) => {
                const initials =
                  (student.fullName || "S")
                    .trim()
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((n) => n[0]?.toUpperCase())
                    .join("") || "ST"

                const colorClass = COLOR_VARIANTS[idx % COLOR_VARIANTS.length]

                return (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => handleSelectStudent(student)}
                    className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-amber-50/40 transition-colors text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`size-8 rounded-full text-xs font-semibold flex items-center justify-center shrink-0 ${colorClass}`}
                      >
                        {initials}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-zinc-900 group-hover:text-amber-700 transition-colors truncate">
                          {student.fullName || "Unnamed Student"}
                        </span>
                        <span className="text-[11px] text-zinc-400 truncate">
                          {[
                            student.grade && `Grade: ${student.grade}`,
                            student.educationStage && `Stage: ${student.educationStage}`,
                            student.email,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#D97706] bg-amber-50 group-hover:bg-[#FEF3C7] px-2.5 py-1 rounded-lg transition-colors shrink-0 ml-3">
                      + Link
                    </span>
                  </button>
                )
              })
            )}
          </div>
        )}
      </div>

      {/* Linked Children List / Table or Empty Container */}
      {linkedChildren.length === 0 ? (
        <div className="p-8 border border-dashed border-zinc-200 rounded-xl text-center flex items-center justify-center">
          <span className="text-xs text-zinc-400 font-normal">
            No children linked yet. Search above to connect existing students.
          </span>
        </div>
      ) : (
        <div className="border border-zinc-200/80 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200/80 bg-zinc-50/60">
                <th className="py-3 px-4 text-[11px] font-semibold text-zinc-400 uppercase">
                  STUDENT NAME
                </th>
                <th className="py-3 px-4 text-[11px] font-semibold text-zinc-400 uppercase">
                  GRADE
                </th>
                <th className="py-3 px-4 text-[11px] font-semibold text-zinc-400 uppercase">
                  EDUCATION STAGE
                </th>
                <th className="py-3 px-4 text-[11px] font-semibold text-zinc-400 uppercase">
                  RELATIONSHIP STATUS
                </th>
                <th className="py-3 px-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {linkedChildren.map((child) => (
                <tr key={child.id} className="hover:bg-zinc-50/50">
                  <td className="py-3 px-4 font-semibold text-zinc-900">
                    {child.name}
                  </td>
                  <td className="py-3 px-4 text-zinc-600">
                    {child.grade}
                  </td>
                  <td className="py-3 px-4 text-zinc-600">
                    {child.stage}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-[#ECFCCB] text-[#65A30D] border border-lime-200/60">
                      <span className="size-1.5 rounded-full bg-[#65A30D]" />
                      Linked
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onRemoveChild(child.id)}
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
  )
}
