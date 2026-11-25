"use client"

import * as React from "react"
import Link from "next/link"
import {
  Bell,
  CheckCircle2,
  Trash2,
  CheckCheck,
  Video,
  FileCheck2,
  ClipboardList,
  BookOpen,
  CreditCard,
  Sparkles,
} from "lucide-react"
import { StudentNotification } from "../types/studentPortal.types"
import { MOCK_STUDENT_NOTIFICATIONS } from "../data/mockStudentData"

export function StudentNotificationsView() {
  const [activeCategory, setActiveCategory] = React.useState<string>("all")
  const [notifications, setNotifications] = React.useState<StudentNotification[]>(MOCK_STUDENT_NOTIFICATIONS)

  const filtered = React.useMemo(() => {
    return notifications.filter((n) => {
      if (activeCategory === "all") return true
      if (activeCategory === "unread") return !n.isRead
      return n.category === activeCategory
    })
  }, [notifications, activeCategory])

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    )
  }

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const getCategoryIcon = (cat: StudentNotification["category"]) => {
    switch (cat) {
      case "sessions":
        return <Video className="size-4 text-purple-600" />
      case "exams":
        return <FileCheck2 className="size-4 text-rose-600" />
      case "assignments":
        return <ClipboardList className="size-4 text-blue-600" />
      case "courses":
        return <BookOpen className="size-4 text-emerald-600" />
      case "subscriptions":
        return <CreditCard className="size-4 text-amber-600" />
      default:
        return <Bell className="size-4 text-zinc-600" />
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Bell className="size-5" />
            </span>
            <h1 className="text-xl font-extrabold text-zinc-900 tracking-tight">
              Notifications & Alerts Center
            </h1>
          </div>
          <p className="text-xs text-zinc-500">
            Real-time updates regarding live lectures, upcoming assignment deadlines, published grades, and system notices
          </p>
        </div>

        <button
          type="button"
          onClick={handleMarkAllRead}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 font-semibold text-zinc-700 text-xs transition-colors cursor-pointer"
        >
          <CheckCheck className="size-4 text-emerald-600" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-zinc-100 border border-zinc-200/70 overflow-x-auto">
        {[
          { key: "all", label: "All" },
          { key: "unread", label: "Unread" },
          { key: "sessions", label: "Live Sessions" },
          { key: "exams", label: "Exams" },
          { key: "assignments", label: "Assignments" },
          { key: "courses", label: "Courses" },
          { key: "subscriptions", label: "Subscriptions" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveCategory(tab.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === tab.key
                ? "bg-white text-emerald-900 shadow-2xs font-bold"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="flex flex-col gap-3">
        {filtered.length > 0 ? (
          filtered.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 shadow-2xs ${
                !notif.isRead
                  ? "bg-emerald-50/30 border-emerald-200 ring-1 ring-emerald-300/40"
                  : "bg-white border-zinc-200/80"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="size-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
                  {getCategoryIcon(notif.category)}
                </div>

                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-xs text-zinc-900 leading-snug">
                      {notif.title}
                    </h3>
                    {!notif.isRead && (
                      <span className="size-2 rounded-full bg-emerald-500" />
                    )}
                  </div>

                  <p className="text-xs text-zinc-600 leading-relaxed max-w-2xl">
                    {notif.description}
                  </p>

                  <span className="text-[10px] text-zinc-400 mt-1">
                    {notif.timestamp}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={notif.link}
                  className="px-3 py-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold transition-colors"
                >
                  View
                </Link>

                <button
                  type="button"
                  onClick={() => handleToggleRead(notif.id)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
                  title={notif.isRead ? "Mark unread" : "Mark read"}
                >
                  <CheckCircle2 className="size-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(notif.id)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 rounded-3xl bg-white border border-zinc-200/80 text-center flex flex-col items-center justify-center gap-2">
            <Bell className="size-10 text-zinc-300" />
            <h3 className="text-sm font-bold text-zinc-800">No notifications in this category</h3>
            <p className="text-xs text-zinc-500">You are completely up to date.</p>
          </div>
        )}
      </div>
    </div>
  )
}
