"use client"

import React, { useState } from "react"
import {
  User,
  GraduationCap,
  Calendar,
  Lock,
  Mail,
  Phone,
  MapPin,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Shield,
  Save,
  Bell,
} from "lucide-react"
import { MOCK_TEACHER_PROFILE } from "../data/mockTeacherData"

export function TeacherProfilePage() {
  const [profile, setProfile] = useState(MOCK_TEACHER_PROFILE)
  const [activeTab, setActiveTab] = useState<"personal" | "qualifications" | "schedule" | "security">("personal")
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Interactive Availability Scheduler State
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"]
  const [schedule, setSchedule] = useState<Record<string, Record<string, boolean>>>({
    Sunday: { "09:00 - 12:00 (Morning)": true, "14:00 - 17:00 (Afternoon)": true, "18:00 - 21:00 (Evening Live)": true },
    Monday: { "09:00 - 12:00 (Morning)": false, "14:00 - 17:00 (Afternoon)": true, "18:00 - 21:00 (Evening Live)": true },
    Tuesday: { "09:00 - 12:00 (Morning)": true, "14:00 - 17:00 (Afternoon)": true, "18:00 - 21:00 (Evening Live)": true },
    Wednesday: { "09:00 - 12:00 (Morning)": false, "14:00 - 17:00 (Afternoon)": true, "18:00 - 21:00 (Evening Live)": true },
    Thursday: { "09:00 - 12:00 (Morning)": true, "14:00 - 17:00 (Afternoon)": false, "18:00 - 21:00 (Evening Live)": false },
  })

  // Notification Preferences
  const [notifs, setNotifs] = useState({
    newSubmissions: true,
    urgentQuestions: true,
    liveReminders: true,
    weeklyDigest: false,
  })

  const toggleSlot = (day: string, slot: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [slot]: !prev[day][slot],
      },
    }))
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-700">Instructor Account & Credentials</span>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200/60">
            Faculty Profile
          </span>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-bold shadow-sm shadow-brand-orange/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          {saveSuccess ? "Changes Saved!" : "Save Profile Settings"}
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile and availability changes updated successfully.</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="p-6 rounded-2xl border border-border bg-card shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-24 h-24 rounded-2xl bg-amber-50 border-2 border-brand-orange/40 text-brand-orange font-bold text-3xl flex items-center justify-center shrink-0">
          TE
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-bold text-foreground">{profile.fullName}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-orange/20 text-amber-800 border border-brand-orange/30">
              Senior Professor
            </span>
          </div>

          <p className="text-sm text-muted-foreground font-medium">{profile.title}</p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-muted-foreground pt-1">
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-brand-orange" /> {profile.email}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-brand-orange" /> {profile.phone}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-brand-orange" /> {profile.address}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-accent/20 text-center min-w-[140px]">
          <span className="text-xs text-muted-foreground font-semibold">Experience</span>
          <p className="text-xl font-bold text-foreground mt-0.5">{profile.experienceYears} Years</p>
          <span className="text-[11px] text-primary font-medium">STEM Certified</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border">
        {[
          { id: "personal", label: "Personal & Academic Info", icon: User },
          { id: "qualifications", label: "Qualifications & Degrees", icon: GraduationCap },
          { id: "schedule", label: "Weekly Live Availability", icon: Calendar },
          { id: "security", label: "Security & Preferences", icon: Shield },
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
            </button>
          )
        })}
      </div>

      {/* TAB 1: Personal Info */}
      {activeTab === "personal" && (
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-6">
          <h3 className="text-base font-bold text-foreground">Teacher Profile Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">Full Name</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">Academic Title</label>
              <input
                type="text"
                value={profile.title}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">Phone Number</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">Specialization</label>
              <input
                type="text"
                value={profile.specialization}
                onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">Office Address</label>
              <input
                type="text"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-foreground block mb-1">Assigned Subjects</label>
            <div className="flex flex-wrap gap-2">
              {profile.assignedSubjects.map((subj, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-accent/40 border border-border text-foreground"
                >
                  {subj}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-foreground block mb-1">Professional Bio</label>
            <textarea
              rows={4}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full p-3 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      )}

      {/* TAB 2: Qualifications */}
      {activeTab === "qualifications" && (
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-6">
          <h3 className="text-base font-bold text-foreground">Degrees & Professional Accreditations</h3>

          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-border bg-accent/20 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-foreground text-sm">Doctor of Philosophy (Ph.D.)</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{profile.education}</p>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 inline-block">
                  Verified Academic Credential
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground block">Professional Certifications & Honors</label>
              {profile.qualifications.map((qual, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl border border-border bg-card flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" />
                    <span className="font-medium text-foreground">{qual}</span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Weekly Live Availability */}
      {activeTab === "schedule" && (
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-foreground">Weekly Office Hours & Live Clinic Availability</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select time intervals when you are available to host live sessions, Q&A office hours, or one-on-one student consultations.
            </p>
          </div>

          <div className="border border-border rounded-xl overflow-hidden pt-2">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-accent/40 border-b border-border text-muted-foreground font-semibold">
                  <tr>
                    <th className="py-3 px-4 w-32">Day</th>
                    <th className="py-3 px-4 text-center">09:00 - 12:00 (Morning)</th>
                    <th className="py-3 px-4 text-center">14:00 - 17:00 (Afternoon)</th>
                    <th className="py-3 px-4 text-center">18:00 - 21:00 (Evening Live)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {days.map((day) => (
                    <tr key={day} className="hover:bg-accent/20 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-foreground">{day}</td>

                      {["09:00 - 12:00 (Morning)", "14:00 - 17:00 (Afternoon)", "18:00 - 21:00 (Evening Live)"].map(
                        (slot) => {
                          const isAvailable = schedule[day]?.[slot] ?? false
                          return (
                            <td key={slot} className="py-3.5 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => toggleSlot(day, slot)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                  isAvailable
                                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                                    : "bg-muted text-muted-foreground hover:bg-accent"
                                }`}
                              >
                                {isAvailable ? "Available" : "Unavailable"}
                              </button>
                            </td>
                          )
                        }
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Security & Preferences */}
      {activeTab === "security" && (
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-6">
          <h3 className="text-base font-bold text-foreground">Account Security & Notifications</h3>

          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-border bg-accent/20 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-foreground text-sm">Two-Factor Authentication (2FA)</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Protect gradebook access and earnings withdrawals with SMS or Authenticator verification.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Enabled
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Notification Subscriptions
              </h4>

              <div className="space-y-2">
                {[
                  { key: "newSubmissions", label: "New Exam & Assignment Submissions", desc: "Notify when a student uploads work waiting for grading" },
                  { key: "urgentQuestions", label: "Student Lesson Inquiries", desc: "Notify immediately when a student asks a lesson question" },
                  { key: "liveReminders", label: "Live Session Reminders", desc: "Send 15-minute countdown alert before scheduled live classes" },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="p-3.5 rounded-xl border border-border bg-card flex items-center justify-between cursor-pointer hover:bg-accent/20 transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-foreground text-xs block">{item.label}</span>
                      <span className="text-[11px] text-muted-foreground">{item.desc}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={(notifs as any)[item.key]}
                      onChange={() =>
                        setNotifs({ ...notifs, [item.key]: !(notifs as any)[item.key] })
                      }
                      className="w-4 h-4 accent-primary"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
