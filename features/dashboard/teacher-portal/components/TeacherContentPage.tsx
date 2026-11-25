"use client"

import * as React from "react"
import {
  FolderKanban,
  Search,
  Filter,
  Plus,
  PlayCircle,
  FileText,
  HelpCircle,
  Edit,
  Trash2,
  Copy,
  CheckCircle2,
  Clock,
  Layers,
} from "lucide-react"
import { TeacherContentItem } from "../types/teacherPortal.types"
import { MOCK_CONTENT_LIBRARY } from "../data/mockTeacherData"
import { TeacherCreateLessonModal } from "./TeacherCreateLessonModal"

export function TeacherContentPage() {
  const [activeCategory, setActiveCategory] = React.useState<string>("all")
  const [searchTerm, setSearchTerm] = React.useState("")
  const [contentItems, setContentItems] = React.useState<TeacherContentItem[]>(MOCK_CONTENT_LIBRARY)
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)

  const filteredItems = React.useMemo(() => {
    return contentItems.filter((item) => {
      if (activeCategory !== "all" && item.type !== activeCategory) return false
      if (
        searchTerm &&
        !item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.subject.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false
      }
      return true
    })
  }, [contentItems, activeCategory, searchTerm])

  const handleSaveLesson = (newLesson: any) => {
    const item: TeacherContentItem = {
      id: `cnt-${Date.now()}`,
      title: newLesson.title,
      type: newLesson.lessonType,
      subject: newLesson.subject,
      course: newLesson.course,
      unitName: newLesson.unit,
      chapterName: newLesson.chapter,
      creationDate: "Just now",
      lastUpdated: "Just now",
      status: newLesson.status,
      duration: `${newLesson.durationMins} mins`,
    }
    setContentItems([item, ...contentItems])
  }

  const getTypeIcon = (type: TeacherContentItem["type"]) => {
    switch (type) {
      case "video":
        return <PlayCircle className="size-4 text-blue-600" />
      case "pdf":
        return <FileText className="size-4 text-rose-600" />
      case "quiz":
        return <HelpCircle className="size-4 text-purple-600" />
      default:
        return <Layers className="size-4 text-emerald-600" />
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Actions Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="relative min-w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search content repository..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-brand-orange/40 transition-all"
            />
          </div>
          <span className="text-xs font-medium text-zinc-500">
            {filteredItems.length} Materials
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-xs shadow-sm shadow-brand-orange/20 transition-all cursor-pointer shrink-0"
        >
          <Plus className="size-4" />
          <span>Create Lesson</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-zinc-100 border border-zinc-200/70 max-w-fit overflow-x-auto">
        {[
          { key: "all", label: "All Content" },
          { key: "video", label: "Videos" },
          { key: "pdf", label: "PDF Documents" },
          { key: "quiz", label: "Quizzes" },
          { key: "lesson", label: "Lesson Modules" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveCategory(tab.key)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === tab.key
                ? "bg-white text-zinc-950 shadow-2xs font-bold border border-zinc-200/60"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Library Table */}
      <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col gap-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/70 text-zinc-500 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Course & Hierarchy</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4">Size / Duration</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-zinc-900 flex items-center gap-2.5">
                    {getTypeIcon(item.type)}
                    <span className="truncate max-w-xs">{item.title}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-700 capitalize">
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-600">
                    <span className="font-semibold text-zinc-800 block truncate max-w-xs">{item.course}</span>
                    <span className="text-[11px] text-zinc-400 truncate max-w-xs block">
                      {item.unitName} • {item.chapterName}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-500">{item.creationDate}</td>
                  <td className="py-3.5 px-4 font-mono text-zinc-600">
                    {item.fileSize || item.duration || "—"}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === "published"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => alert(`Previewing ${item.title}...`)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors cursor-pointer"
                        title="Preview"
                      >
                        <PlayCircle className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => alert(`Editing ${item.title}...`)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-600 hover:bg-zinc-100 transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setContentItems(contentItems.filter((i) => i.id !== item.id))
                          alert("Content archived/deleted!")
                        }}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-zinc-100 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Lesson Modal */}
      <TeacherCreateLessonModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={handleSaveLesson}
      />
    </div>
  )
}
