"use client"

import React, { useState } from "react"
import {
  TrendingUp,
  Users,
  Award,
  Clock,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  ArrowUpRight,
  Filter,
  Eye,
  FileText,
  BarChart2,
} from "lucide-react"

export function TeacherAnalyticsPage() {
  const [selectedCourse, setSelectedCourse] = useState("Advanced Physics: Mechanics & Modern Physics")
  const [timeRange, setTimeRange] = useState("30d")

  const scoreBuckets = [
    { label: "90% - 100% (A+ / A)", count: 52, percentage: 32, color: "bg-emerald-500" },
    { label: "80% - 89% (B)", count: 68, percentage: 41, color: "bg-primary" },
    { label: "70% - 79% (C)", count: 28, percentage: 17, color: "bg-amber-500" },
    { label: "60% - 69% (D)", count: 12, percentage: 7, color: "bg-orange-500" },
    { label: "Below 60% (At Risk)", count: 4, percentage: 3, color: "bg-rose-500" },
  ]

  const mostViewedLessons = [
    {
      title: "Faraday's Law & Induced Electromotive Force",
      chapter: "Chapter 1: Electromagnetic Induction",
      views: 486,
      completionRate: 94,
      avgWatchTime: "42 mins",
      rating: 4.9,
    },
    {
      title: "Lenz's Law Direction Rules & Fleming Right Hand",
      chapter: "Chapter 1: Electromagnetic Induction",
      views: 412,
      completionRate: 88,
      avgWatchTime: "36 mins",
      rating: 4.8,
    },
    {
      title: "Mutual Induction & Step-Up Transformers",
      chapter: "Chapter 2: Mutual Induction",
      views: 375,
      completionRate: 85,
      avgWatchTime: "31 mins",
      rating: 4.7,
    },
    {
      title: "Self-Induction and Choke Coils in AC Circuits",
      chapter: "Chapter 3: AC Circuits",
      views: 340,
      completionRate: 79,
      avgWatchTime: "28 mins",
      rating: 4.6,
    },
  ]

  const dropOffAlerts = [
    {
      lesson: "Mutual Induction Calculus Derivation",
      dropOffRate: "38%",
      avgDropMinute: "14:20 of 45:00",
      reason: "High concentration of multi-variable calculus equations without interactive diagram checkpoint.",
      recommendation: "Add an interim formative comprehension quiz at minute 12.",
    },
    {
      lesson: "R-L-C Series Resonance Mathematical Vectors",
      dropOffRate: "31%",
      avgDropMinute: "18:05 of 50:00",
      reason: "Complex impedance phasor diagrams with abrupt difficulty spike.",
      recommendation: "Split into two 25-minute lessons with animated phasor simulation.",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
        <span className="text-xs font-semibold text-zinc-700">Curriculum Filters & Performance Metrics</span>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="text-xs rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-800 focus:outline-hidden focus:ring-2 focus:ring-brand-orange/40 shadow-xs cursor-pointer"
          >
            <option>Advanced Physics: Mechanics & Modern Physics</option>
            <option>Secondary Physics Fundamentals & Thermodynamics</option>
            <option>Applied Mathematical Physics & Vector Calculus</option>
          </select>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="text-xs rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-800 focus:outline-hidden focus:ring-2 focus:ring-brand-orange/40 shadow-xs cursor-pointer"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="term">Current Term</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Course Completion</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-foreground mt-2">78.4%</div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1 inline-flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> +5.2% vs baseline
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Active Learners</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground mt-2">152 / 164</div>
          <span className="text-xs text-muted-foreground mt-1 block">92.6% active engagement</span>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Average Exam Score</span>
            <Award className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-foreground mt-2">86.2%</div>
          <span className="text-xs text-muted-foreground mt-1 block">Grade B+ class average</span>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Total Study Hours</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-foreground mt-2">1,420 hrs</div>
          <span className="text-xs text-muted-foreground mt-1 block">~9.2 hrs/student this month</span>
        </div>
      </div>

      {/* Middle Row: Score Distribution & Weekly Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Distribution */}
        <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">Student Score Distribution</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Grades across all midterm quizzes and laboratory assignments (164 Students)
              </p>
            </div>
            <span className="text-xs font-bold text-primary px-2.5 py-1 rounded-lg bg-primary/10">
              Avg: 86.2%
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {scoreBuckets.map((bucket, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-foreground">{bucket.label}</span>
                  <span className="text-muted-foreground font-medium">
                    {bucket.count} students ({bucket.percentage}%)
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-accent/40 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${bucket.color}`}
                    style={{ width: `${bucket.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Activity Hours Heatmap */}
        <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
          <div>
            <h3 className="text-base font-bold text-foreground">Weekly Study Time Patterns</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Hourly distribution when students watch videos and submit exercises
            </p>
          </div>

          <div className="h-48 flex items-end justify-between gap-2 pt-4 px-2">
            {[
              { day: "Sat", hours: 180, pct: 65 },
              { day: "Sun", hours: 240, pct: 85 },
              { day: "Mon", hours: 210, pct: 75 },
              { day: "Tue", hours: 280, pct: 98 },
              { day: "Wed", hours: 260, pct: 90 },
              { day: "Thu", hours: 190, pct: 68 },
              { day: "Fri", hours: 90, pct: 32 },
            ].map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[10px] text-muted-foreground font-semibold">{d.hours}h</span>
                <div className="w-full bg-accent/30 rounded-t-lg h-full flex items-end overflow-hidden">
                  <div
                    className="w-full bg-primary hover:bg-primary/90 transition-all rounded-t-lg"
                    style={{ height: `${d.pct}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-foreground">{d.day}</span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-muted-foreground italic text-center pt-2 border-t border-border/50">
            Peak learning activity occurs on Tuesday and Wednesday evenings prior to live clinics.
          </p>
        </div>
      </div>

      {/* Curriculum Retention & High Drop-Off Alerts */}
      <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <div>
            <h3 className="text-base font-bold text-foreground">Curriculum Optimization Alerts</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Lessons where student exit rates exceed the 25% threshold
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {dropOffAlerts.map((alert, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2.5 text-xs"
            >
              <div className="flex items-start justify-between">
                <span className="font-bold text-foreground text-sm">{alert.lesson}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400">
                  {alert.dropOffRate} Drop-off
                </span>
              </div>

              <p className="text-muted-foreground">
                <strong className="text-foreground">Average drop point:</strong> {alert.avgDropMinute}
              </p>

              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Root Cause:</strong> {alert.reason}
              </p>

              <div className="pt-2 border-t border-amber-500/20 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Fix: {alert.recommendation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Most Viewed Lessons Table */}
      <div className="border border-border rounded-2xl bg-card overflow-hidden shadow-sm">
        <div className="p-5 border-b border-border bg-accent/20">
          <h3 className="text-base font-bold text-foreground">Most Engaged Lessons & Units</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Top performing video lectures and learning materials sorted by total replay volume
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-accent/40 border-b border-border text-muted-foreground font-semibold">
              <tr>
                <th className="py-3 px-4">Lesson Title</th>
                <th className="py-3 px-4">Curriculum Location</th>
                <th className="py-3 px-4 text-center">Total Views</th>
                <th className="py-3 px-4 text-center">Avg Watch Time</th>
                <th className="py-3 px-4 text-center">Completion Rate</th>
                <th className="py-3 px-4 text-right">Student Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mostViewedLessons.map((lesson, idx) => (
                <tr key={idx} className="hover:bg-accent/20 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-foreground max-w-xs">
                    {lesson.title}
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground">{lesson.chapter}</td>
                  <td className="py-3.5 px-4 text-center font-bold text-foreground">
                    <span className="inline-flex items-center gap-1 text-primary">
                      <Eye className="w-3.5 h-3.5" />
                      {lesson.views}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center text-muted-foreground">
                    {lesson.avgWatchTime}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {lesson.completionRate}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-foreground">
                    ★ {lesson.rating} / 5.0
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
