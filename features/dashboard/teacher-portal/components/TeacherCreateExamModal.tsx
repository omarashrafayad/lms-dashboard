"use client"

import * as React from "react"
import {
  X,
  FileCheck2,
  Plus,
  Trash2,
  CheckCircle2,
  HelpCircle,
  Clock,
  Award,
  Sparkles,
} from "lucide-react"

interface TeacherCreateExamModalProps {
  isOpen: boolean
  onClose: () => void
  onSave?: (exam: any) => void
  onExamCreated?: (exam: any) => void
}

export function TeacherCreateExamModal({
  isOpen,
  onClose,
  onSave,
  onExamCreated,
}: TeacherCreateExamModalProps) {
  const [step, setStep] = React.useState<1 | 2 | 3>(1)
  const [title, setTitle] = React.useState("")
  const [subject, setSubject] = React.useState("Physics")
  const [course, setCourse] = React.useState("Advanced Physics: Mechanics & Modern Physics")
  const [durationMins, setDurationMins] = React.useState(60)
  const [totalMarks, setTotalMarks] = React.useState(50)
  const [passMarks, setPassMarks] = React.useState(30)
  const [randomizeQs, setRandomizeQs] = React.useState(true)
  const [allowReview, setAllowReview] = React.useState(true)

  const [questions, setQuestions] = React.useState([
    {
      id: "q-1",
      text: "According to Faraday's law of electromagnetic induction, the magnitude of induced emf is proportional to:",
      type: "mcq",
      marks: 5,
      options: [
        "The magnetic flux itself",
        "The rate of change of magnetic flux with respect to time",
        "The circuit resistance",
        "The conductor temperature",
      ],
      correctOption: 1,
      explanation: "Faraday's formula states that e = -N(dΦ/dt).",
    },
    {
      id: "q-2",
      text: "Lenz's law is a consequence of the conservation of energy principle.",
      type: "true_false",
      marks: 5,
      options: ["True", "False"],
      correctOption: 0,
      explanation: "Induced current opposes change to preserve energy conservation.",
    },
  ])

  if (!isOpen) return null

  const handleAddQuestion = () => {
    const newQ = {
      id: `q-${Date.now()}`,
      text: "Enter your question text here...",
      type: "mcq",
      marks: 5,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctOption: 0,
      explanation: "Add explanation here...",
    }
    setQuestions([...questions, newQ])
  }

  const handleRemoveQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const handleSubmit = (publish = false) => {
    if (!title) {
      alert("Please provide an exam title.")
      return
    }
    const createdExam = {
      id: `tch-ex-${Date.now()}`,
      title,
      subject,
      course,
      duration: `${durationMins} mins`,
      totalMarks,
      passingMarks: passMarks,
      questionsCount: questions.length,
      status: publish ? "published" : "draft",
      startDate: "Today",
      endDate: "In 7 days",
      participantsCount: 0,
    }
    if (onSave) {
      onSave(createdExam)
    }
    if (onExamCreated) {
      onExamCreated(createdExam)
    }
    alert(publish ? "Exam published and scheduled for students!" : "Exam saved as draft!")
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800">
              Exam Creation Studio
            </span>
            <h3 className="font-bold text-sm text-zinc-900">
              Create New Assessment
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-500 hover:bg-zinc-100 cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Stepper Navigation */}
        <div className="flex items-center justify-around p-3 border-b border-zinc-100 bg-zinc-50/50 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`flex items-center gap-2 cursor-pointer ${
              step === 1 ? "text-rose-700 font-bold" : "text-zinc-400"
            }`}
          >
            <span className="size-5 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center">1</span>
            <span>Basic Info</span>
          </button>
          <button
            type="button"
            onClick={() => setStep(2)}
            className={`flex items-center gap-2 cursor-pointer ${
              step === 2 ? "text-rose-700 font-bold" : "text-zinc-400"
            }`}
          >
            <span className="size-5 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center">2</span>
            <span>Configuration</span>
          </button>
          <button
            type="button"
            onClick={() => setStep(3)}
            className={`flex items-center gap-2 cursor-pointer ${
              step === 3 ? "text-rose-700 font-bold" : "text-zinc-400"
            }`}
          >
            <span className="size-5 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center">3</span>
            <span>Questions ({questions.length})</span>
          </button>
        </div>

        {/* Stepper Content */}
        <div className="p-6 overflow-y-auto flex flex-col gap-5 text-xs text-zinc-700">
          {/* STEP 1: Basic Information */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-zinc-800">Exam Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Physics Term 2 Comprehensive Midterm"
                  className="px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-rose-500/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-zinc-800">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:outline-hidden"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Advanced Mechanics">Advanced Mechanics</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-zinc-800">Related Course</label>
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:outline-hidden"
                  >
                    <option value="Advanced Physics: Mechanics & Modern Physics">Advanced Physics</option>
                    <option value="Secondary Physics Fundamentals & Thermodynamics">Physics Fundamentals</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Configuration */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-zinc-800">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={durationMins}
                    onChange={(e) => setDurationMins(Number(e.target.value))}
                    className="px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:outline-hidden"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-zinc-800">Total Marks</label>
                  <input
                    type="number"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(Number(e.target.value))}
                    className="px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:outline-hidden"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-zinc-800">Passing Score</label>
                  <input
                    type="number"
                    value={passMarks}
                    onChange={(e) => setPassMarks(Number(e.target.value))}
                    className="px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={randomizeQs}
                    onChange={(e) => setRandomizeQs(e.target.checked)}
                    className="size-4 rounded accent-rose-600"
                  />
                  <span className="font-semibold text-zinc-800">Randomize question order for each student</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowReview}
                    onChange={(e) => setAllowReview(e.target.checked)}
                    className="size-4 rounded accent-rose-600"
                  />
                  <span className="font-semibold text-zinc-800">Allow students to review full answer explanations after grading</span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 3: Questions Management */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-zinc-900">
                  Questions Pool ({questions.length} Items)
                </span>
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-2xs cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  <span>Add Question</span>
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-zinc-800">
                        Q{idx + 1} ({q.marks} Marks • {q.type.toUpperCase()})
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(q.id)}
                        className="text-zinc-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={q.text}
                      onChange={(e) => {
                        const updated = [...questions]
                        updated[idx].text = e.target.value
                        setQuestions(updated)
                      }}
                      className="px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-semibold focus:outline-hidden"
                    />

                    {q.options && (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {q.options.map((opt, optIdx) => (
                          <div
                            key={optIdx}
                            className={`p-2 rounded-lg border text-[11px] font-medium ${
                              q.correctOption === optIdx
                                ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold"
                                : "bg-white border-zinc-200 text-zinc-600"
                            }`}
                          >
                            {opt} {q.correctOption === optIdx ? "✓ Correct" : ""}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100 bg-zinc-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-zinc-200 font-semibold text-zinc-700 hover:bg-zinc-100 cursor-pointer text-xs"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((step - 1) as any)}
                className="px-4 py-2 rounded-xl border border-zinc-200 bg-white font-semibold text-zinc-700 text-xs hover:bg-zinc-100 cursor-pointer"
              >
                Back
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((step + 1) as any)}
                className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold text-xs cursor-pointer"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                className="px-6 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Publish Exam
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
