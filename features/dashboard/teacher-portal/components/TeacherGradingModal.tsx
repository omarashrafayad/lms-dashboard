"use client"

import React, { useState } from "react"
import {
  X,
  Award,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  Send,
  RotateCcw,
  Sparkles,
  Paperclip,
} from "lucide-react"
import { TeacherSubmission } from "../types/teacherPortal.types"

interface TeacherGradingModalProps {
  isOpen: boolean
  onClose: () => void
  submission: TeacherSubmission | null
  onGradeSubmitted?: (id: string, grade: number, feedback: string) => void
}

export function TeacherGradingModal({
  isOpen,
  onClose,
  submission,
  onGradeSubmitted,
}: TeacherGradingModalProps) {
  const [grade, setGrade] = useState<number>(submission?.grade ?? 18)
  const [feedback, setFeedback] = useState<string>(
    submission?.teacherFeedback ??
      "Excellent logical breakdown of the electromagnetic induction process. Make sure to clearly state the direction using Lenz's rule next time."
  )
  const [rubricScores, setRubricScores] = useState({
    conceptualUnderstanding: 9, // out of 10
    mathematicalDerivation: 5, // out of 5
    clarityAndNotation: 4, // out of 5
  })
  const [isSuccess, setIsSuccess] = useState(false)
  const [isRevisionMode, setIsRevisionMode] = useState(false)

  if (!isOpen || !submission) return null

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSuccess(true)
    if (onGradeSubmitted) {
      onGradeSubmitted(submission.id, grade, feedback)
    }
    setTimeout(() => {
      setIsSuccess(false)
      onClose()
    }, 1200)
  }

  const quickFeedbacks = [
    "Flawless calculation and clear notations!",
    "Good conceptual grasp; check your arithmetic in step 3.",
    "Well reasoned, but remember to specify the SI units.",
    "Please review Faraday's law sign conventions in chapter 3.",
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border border-border overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border bg-gradient-to-r from-card to-accent/10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                Evaluation & Grading Workspace
              </span>
              <span className="text-xs text-muted-foreground">{submission.course}</span>
            </div>
            <h2 className="text-xl font-bold text-foreground mt-2">{submission.assessmentTitle}</h2>
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span>Submitted: {submission.submittedAt}</span>
              <span>•</span>
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                Waiting {submission.waitingTime}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Student Info Card */}
          <div className="p-4 rounded-xl border border-border bg-accent/20 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                {submission.studentName.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">{submission.studentName}</p>
                <p className="text-xs text-muted-foreground">ID: {submission.studentId}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="text-right">
                <span className="text-muted-foreground">Total Marks</span>
                <p className="font-bold text-foreground text-sm">{submission.totalMarks} Marks</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-right">
                <span className="text-muted-foreground">Type</span>
                <p className="font-bold capitalize text-primary text-sm">{submission.assessmentType}</p>
              </div>
            </div>
          </div>

          {/* Student Submitted Answer Section */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Student Submitted Work
            </h3>
            <div className="p-4 rounded-xl border border-border bg-background space-y-3">
              {submission.answerText ? (
                <div className="text-sm text-foreground/90 leading-relaxed font-sans bg-accent/10 p-3 rounded-lg border border-border/50">
                  {submission.answerText}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  No text submitted directly. Review the uploaded document attachment below.
                </p>
              )}

              {/* Attachments */}
              {submission.attachedFiles && submission.attachedFiles.length > 0 && (
                <div className="pt-2 border-t border-border/50">
                  <span className="text-xs font-semibold text-muted-foreground mb-2 block">
                    Attached Files ({submission.attachedFiles.length})
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {submission.attachedFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2 rounded-lg border border-border bg-card hover:bg-accent/40 text-xs transition-colors"
                      >
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="font-medium text-foreground">{file.name}</span>
                        <span className="text-[10px] text-muted-foreground">({file.size})</span>
                        <button
                          type="button"
                          className="ml-2 text-primary hover:text-primary/80 transition-colors"
                          title="Download Student File"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Rubric Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center justify-between">
              <span>Rubric Breakdown</span>
              <span className="text-primary font-medium text-xs normal-case">
                Rubric Total: {rubricScores.conceptualUnderstanding + rubricScores.mathematicalDerivation + rubricScores.clarityAndNotation} / 20
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl border border-border bg-accent/10 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-foreground">Conceptual Understanding</span>
                  <span className="text-primary font-bold">{rubricScores.conceptualUnderstanding} / 10</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={rubricScores.conceptualUnderstanding}
                  onChange={(e) => {
                    const val = Number(e.target.value)
                    setRubricScores({ ...rubricScores, conceptualUnderstanding: val })
                    setGrade(val + rubricScores.mathematicalDerivation + rubricScores.clarityAndNotation)
                  }}
                  className="w-full accent-primary"
                />
              </div>

              <div className="p-3 rounded-xl border border-border bg-accent/10 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-foreground">Mathematical Derivation</span>
                  <span className="text-primary font-bold">{rubricScores.mathematicalDerivation} / 5</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={rubricScores.mathematicalDerivation}
                  onChange={(e) => {
                    const val = Number(e.target.value)
                    setRubricScores({ ...rubricScores, mathematicalDerivation: val })
                    setGrade(rubricScores.conceptualUnderstanding + val + rubricScores.clarityAndNotation)
                  }}
                  className="w-full accent-primary"
                />
              </div>

              <div className="p-3 rounded-xl border border-border bg-accent/10 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-foreground">Clarity & Notation</span>
                  <span className="text-primary font-bold">{rubricScores.clarityAndNotation} / 5</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={rubricScores.clarityAndNotation}
                  onChange={(e) => {
                    const val = Number(e.target.value)
                    setRubricScores({ ...rubricScores, clarityAndNotation: val })
                    setGrade(rubricScores.conceptualUnderstanding + rubricScores.mathematicalDerivation + val)
                  }}
                  className="w-full accent-primary"
                />
              </div>
            </div>
          </div>

          {/* Final Score Input */}
          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between gap-4">
            <div>
              <p className="font-bold text-foreground text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                Final Assigned Score
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Maximum allowed marks: {submission.totalMarks}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max={submission.totalMarks}
                value={grade}
                onChange={(e) => setGrade(Number(e.target.value))}
                className="w-20 px-3 py-1.5 text-center text-lg font-bold rounded-lg border border-primary/40 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="text-sm font-semibold text-muted-foreground">/ {submission.totalMarks}</span>
            </div>
          </div>

          {/* Feedback & Comments */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                Teacher Feedback & Guidance
              </label>
              <span className="text-[10px] text-muted-foreground">Visible to the student</span>
            </div>

            {/* Quick response pills */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {quickFeedbacks.map((qf, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setFeedback((prev) => (prev ? `${prev} ${qf}` : qf))}
                  className="text-[11px] px-2 py-0.5 rounded-full border border-border bg-accent/30 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                >
                  + {qf.slice(0, 32)}...
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Write qualitative constructive feedback for the student..."
              className="w-full p-3 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border bg-accent/20 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setIsRevisionMode(!isRevisionMode)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Request Resubmission
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveGrade}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSuccess ? "Grade Saved!" : "Save & Publish Grade"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
