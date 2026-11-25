"use client"

import React, { useState } from "react"
import {
  MessageSquare,
  HelpCircle,
  Bell,
  Send,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Pin,
  Trash2,
  MoreVertical,
  Paperclip,
  Share2,
  Users,
} from "lucide-react"
import {
  TeacherQuestionAnswer,
  TeacherDiscussion,
  TeacherAnnouncement,
} from "../types/teacherPortal.types"
import {
  MOCK_TEACHER_QUESTIONS,
  MOCK_TEACHER_DISCUSSIONS,
  MOCK_TEACHER_ANNOUNCEMENTS,
} from "../data/mockTeacherData"

export function TeacherCommunicationPage() {
  const [activeTab, setActiveTab] = useState<"qa" | "discussions" | "announcements" | "chat">("qa")

  // Q&A state
  const [questions, setQuestions] = useState<TeacherQuestionAnswer[]>(MOCK_TEACHER_QUESTIONS)
  const [answeringQuestionId, setAnsweringQuestionId] = useState<string | null>(null)
  const [replyInput, setReplyInput] = useState("")

  // Discussions state
  const [discussions, setDiscussions] = useState<TeacherDiscussion[]>(MOCK_TEACHER_DISCUSSIONS)

  // Announcements state
  const [announcements, setAnnouncements] = useState<TeacherAnnouncement[]>(MOCK_TEACHER_ANNOUNCEMENTS)
  const [isNewAnnouncementOpen, setIsNewAnnouncementOpen] = useState(false)
  const [annTitle, setAnnTitle] = useState("")
  const [annDesc, setAnnDesc] = useState("")
  const [annCourse, setAnnCourse] = useState("Advanced Physics: Mechanics & Modern Physics")

  // Chat direct messages state
  const [selectedStudentChat, setSelectedStudentChat] = useState("Ahmed Mansour")
  const [chatMessages, setChatMessages] = useState([
    { sender: "Ahmed Mansour", text: "Dr. Tarek, will tomorrow's clinic cover Lenz's law numerical questions?", time: "01:15 PM", isMe: false },
    { sender: "Dr. Tarek El-Sayed", text: "Yes Ahmed, we will work through 5 past paper problems on induced EMF and direction rules.", time: "01:22 PM", isMe: true },
    { sender: "Ahmed Mansour", text: "Thank you Dr. Tarek, looking forward to it!", time: "01:25 PM", isMe: false },
  ])
  const [chatInput, setChatInput] = useState("")

  const handleSendReply = (questionId: string) => {
    if (!replyInput.trim()) return
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              replyText: replyInput,
              status: "answered",
            }
          : q
      )
    )
    setAnsweringQuestionId(null)
    setReplyInput("")
  }

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    setChatMessages([
      ...chatMessages,
      {
        sender: "Dr. Tarek El-Sayed",
        text: chatInput,
        time: "Just now",
        isMe: true,
      },
    ])
    setChatInput("")
  }

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault()
    if (!annTitle.trim()) return

    const newAnn: TeacherAnnouncement = {
      id: `t-ann-${Date.now()}`,
      title: annTitle,
      description: annDesc,
      targetCourse: annCourse,
      publishedDate: "Today",
      recipientsCount: 164,
      readCount: 1,
      status: "published",
    }
    setAnnouncements([newAnn, ...announcements])
    setIsNewAnnouncementOpen(false)
    setAnnTitle("")
    setAnnDesc("")
  }

  return (
    <div className="space-y-6">
      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-700">Communication Center</span>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200/60">
            {questions.filter((q) => q.status === "new").length} New Questions
          </span>
        </div>

        {activeTab === "announcements" && (
          <button
            onClick={() => setIsNewAnnouncementOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-bold shadow-sm shadow-brand-orange/20 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            New Announcement
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border">
        {[
          { id: "qa", label: "Student Q&A Questions", count: questions.filter((q) => q.status === "new").length, icon: HelpCircle },
          { id: "chat", label: "Direct Student Messages", count: 1, icon: MessageSquare },
          { id: "discussions", label: "Course Discussions", count: discussions.length, icon: Users },
          { id: "announcements", label: "Announcements & Broadcasts", count: announcements.length, icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    activeTab === tab.id
                      ? "bg-primary/15 text-primary"
                      : "bg-accent text-muted-foreground"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* TAB 1: Student Q&A */}
      {activeTab === "qa" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {questions.map((q) => (
              <div
                key={q.id}
                className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-4 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                      {q.studentName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground text-sm">{q.studentName}</span>
                        <span className="text-xs text-muted-foreground">• {q.course}</span>
                      </div>
                      <p className="text-xs text-primary font-medium mt-0.5">Lesson: {q.lesson}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        q.status === "new"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {q.status === "new" ? "Awaiting Reply" : "Answered"}
                    </span>
                    <span className="text-xs text-muted-foreground">{q.submittedDate}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-accent/20 border border-border text-foreground text-sm leading-relaxed">
                  "{q.questionText}"
                </div>

                {q.replyText ? (
                  <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 space-y-1">
                    <span className="text-[11px] font-bold text-primary block">Your Answer:</span>
                    <p className="text-xs text-foreground/90 leading-relaxed">{q.replyText}</p>
                  </div>
                ) : (
                  <div>
                    {answeringQuestionId === q.id ? (
                      <div className="space-y-3 pt-2">
                        <textarea
                          rows={3}
                          value={replyInput}
                          onChange={(e) => setReplyInput(e.target.value)}
                          placeholder="Type your explanation or scientific answer for the student..."
                          className="w-full p-3 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setAnsweringQuestionId(null)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSendReply(q.id)}
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            <Send className="w-3.5 h-3.5" />
                            Post Answer
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setAnsweringQuestionId(q.id)
                          setReplyInput("")
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Reply to Student
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Direct Messages / Chat */}
      {activeTab === "chat" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[550px] border border-border rounded-2xl bg-card overflow-hidden shadow-sm">
          {/* Contacts List */}
          <div className="border-r border-border p-4 flex flex-col h-full bg-accent/10">
            <div className="relative mb-3">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search students..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-border bg-background"
              />
            </div>

            <div className="space-y-1 overflow-y-auto flex-1">
              {[
                { name: "Ahmed Mansour", lastMsg: "Thank you Dr. Tarek!", time: "01:25 PM", unread: 0 },
                { name: "Mariam El-Shazly", lastMsg: "Sent the revised calculation PDF.", time: "11:40 AM", unread: 1 },
                { name: "Kareem Adel", lastMsg: "Can I attend the Thursday session?", time: "Yesterday", unread: 0 },
                { name: "Salma Youssef", lastMsg: "Understood, thank you!", time: "2 days ago", unread: 0 },
              ].map((contact, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedStudentChat(contact.name)}
                  className={`p-3 rounded-xl cursor-pointer transition-colors flex items-center justify-between ${
                    selectedStudentChat === contact.name
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-accent/40"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                      {contact.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-xs">{contact.name}</p>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">{contact.lastMsg}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-muted-foreground">{contact.time}</span>
                    {contact.unread > 0 && (
                      <span className="w-2 h-2 rounded-full bg-primary block ml-auto mt-1" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="col-span-2 flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-accent/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                  {selectedStudentChat.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm">{selectedStudentChat}</h3>
                  <span className="text-[11px] text-emerald-500 font-medium">Online • Grade 12 STEM</span>
                </div>
              </div>
            </div>

            {/* Messages Thread */}
            <div className="p-4 overflow-y-auto flex-1 space-y-3 bg-background">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.isMe ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.isMe
                        ? "bg-primary text-primary-foreground rounded-br-none shadow-sm"
                        : "bg-accent/40 border border-border text-foreground rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1 px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendChat} className="p-3 border-t border-border flex items-center gap-2 bg-card">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={`Message ${selectedStudentChat}...`}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: Discussions */}
      {activeTab === "discussions" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {discussions.map((disc) => (
              <div
                key={disc.id}
                className="p-5 rounded-2xl border border-border bg-card shadow-sm flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {disc.status === "pinned" && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        <Pin className="w-3 h-3" /> Pinned by Teacher
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">{disc.course}</span>
                  </div>
                  <h3 className="font-bold text-foreground text-sm">{disc.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    Started by <span className="text-foreground font-medium">{disc.authorName}</span> • Last activity {disc.lastActivity}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="text-center">
                    <span className="text-sm font-bold text-foreground block">{disc.repliesCount}</span>
                    <span className="text-[10px] text-muted-foreground">Replies</span>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg border border-border hover:bg-accent text-foreground font-semibold transition-colors">
                    Moderate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Announcements */}
      {activeTab === "announcements" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                      {ann.targetCourse}
                    </span>
                    <h3 className="text-base font-bold text-foreground mt-2">{ann.title}</h3>
                  </div>
                  <span className="text-xs text-muted-foreground">{ann.publishedDate}</span>
                </div>

                <p className="text-xs text-foreground/85 leading-relaxed">{ann.description}</p>

                <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>{ann.recipientsCount} Students Notified</span>
                    <span>•</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      {ann.readCount} Opened & Read
                    </span>
                  </div>
                  <button className="text-rose-500 hover:text-rose-600 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Announcement Modal */}
      {isNewAnnouncementOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-lg rounded-2xl shadow-2xl border border-border overflow-hidden">
            <div className="p-5 border-b border-border bg-accent/20 flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">Create Course Announcement</h2>
              <button
                onClick={() => setIsNewAnnouncementOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Target Course</label>
                <select
                  value={annCourse}
                  onChange={(e) => setAnnCourse(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option>Advanced Physics: Mechanics & Modern Physics</option>
                  <option>Secondary Physics Fundamentals & Thermodynamics</option>
                  <option>Applied Mathematical Physics & Vector Calculus</option>
                  <option>All Enrolled Students (Global Broadcast)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule update for tomorrow's live clinic"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Message Content *</label>
                <textarea
                  rows={4}
                  required
                  value={annDesc}
                  onChange={(e) => setAnnDesc(e.target.value)}
                  placeholder="Write clear announcement instructions for students..."
                  className="w-full p-3 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsNewAnnouncementOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
