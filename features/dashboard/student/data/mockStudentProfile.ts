import { StudentProfile } from "../types/studentProfile.types"
import { mockStudents } from "./mockStudents"

export const defaultStudentProfile: StudentProfile = {
  id: "1",
  name: "Ahmed Ali",
  code: "STD-1024",
  avatarInitials: "AA",
  avatarColorClass: "bg-sky-100 text-sky-700",
  status: "Active",
  stage: "Secondary",
  grade: "Grade 10",
  system: "National",
  school: "Future International School",

  fullName: "Ahmed Ali",
  dateOfBirth: "March 15, 2012",
  gender: "Male",
  email: "ahmed@example.com",
  phone: "+20 100 123 4567",

  educationSystem: "National",
  educationStage: "Secondary",
  studentId: "STU-1024",

  kpis: {
    overallProgress: 78,
    averageScore: 85,
    completedCourses: 6,
    completedLessons: 42,
    upcomingSessions: 2,
  },

  learningProgress: {
    overallProgress: 78,
    currentLevel: "Intermediate",
    completedLessons: 42,
    totalLessons: 54,
    completedCourses: 6,
    totalCourses: 8,
    averageScore: 85,
  },

  courses: [
    {
      id: "c1",
      name: "Mathematics",
      progress: 75,
      score: 88,
      status: "In Progress",
    },
    {
      id: "c2",
      name: "English",
      progress: 72,
      score: 81,
      status: "In Progress",
    },
    {
      id: "c3",
      name: "Physics",
      progress: 100,
      score: 92,
      status: "Completed",
    },
    {
      id: "c4",
      name: "Computer Science",
      progress: 65,
      score: 79,
      status: "In Progress",
    },
  ],

  lessons: [
    {
      id: "l1",
      name: "Quadratic Equations",
      course: "Mathematics",
      completedDate: "Sep 10, 2026",
      status: "Completed",
    },
    {
      id: "l2",
      name: "Newton's Laws",
      course: "Physics",
      completedDate: "Sep 8, 2026",
      status: "Completed",
    },
    {
      id: "l3",
      name: "Essay Structure",
      course: "English",
      completedDate: "Sep 5, 2026",
      status: "Completed",
    },
    {
      id: "l4",
      name: "Arrays & Loops",
      course: "Computer Science",
      completedDate: "Sep 3, 2026",
      status: "In Progress",
    },
  ],

  exams: [
    {
      id: "e1",
      name: "Midterm Exam",
      course: "Mathematics",
      date: "Sep 5, 2026",
      score: 88,
      result: "Passed",
    },
    {
      id: "e2",
      name: "Unit Test",
      course: "Physics",
      date: "Aug 28, 2026",
      score: 92,
      result: "Passed",
    },
    {
      id: "e3",
      name: "English Assessment",
      course: "English",
      date: "Aug 20, 2026",
      score: 81,
      result: "Passed",
    },
  ],

  sessions: {
    upcoming: [
      {
        id: "s1",
        subject: "Mathematics",
        instructor: "Mr. Hassan",
        dateText: "Sun, Sep 15, 2026",
        timeText: "4:00 PM",
        status: "Upcoming",
      },
      {
        id: "s2",
        subject: "Physics",
        instructor: "Ms. Layla",
        dateText: "Tue, Sep 17, 2026",
        timeText: "6:00 PM",
        status: "Upcoming",
      },
    ],
    previous: [
      {
        id: "s3",
        subject: "English",
        instructor: "Ms. Nour",
        dateText: "Sep 8, 2026",
        timeText: "5:00 PM",
        status: "Attended",
      },
      {
        id: "s4",
        subject: "Computer Science",
        instructor: "Mr. Karim",
        dateText: "Sep 2, 2026",
        timeText: "3:00 PM",
        status: "Attended",
      },
    ],
  },

  subscription: {
    plan: "Basic",
    status: "Active",
    startDate: "Sep 1, 2026",
    expiryDate: "Sep 30, 2026",
  },

  parent: {
    name: "Sara Ali",
    relationship: "Mother",
    email: "sara@example.com",
    phone: "+20 101 987 6543",
  },

  activityHistory: [
    {
      id: "a1",
      title: "Completed Mathematics Lesson",
      timestamp: "Sep 10, 2026 • 5:14 PM",
    },
    {
      id: "a2",
      title: "Submitted Physics Assignment",
      timestamp: "Sep 9, 2026 • 11:20 AM",
    },
    {
      id: "a3",
      title: "Completed English Assessment",
      timestamp: "Aug 20, 2026 • 2:05 PM",
    },
    {
      id: "a4",
      title: "Joined a live session",
      timestamp: "Aug 18, 2026 • 4:00 PM",
    },
  ],
}

export function getStudentProfile(id: string): StudentProfile {
  const matchedStudent = mockStudents.find((s) => s.id === id)

  if (!matchedStudent) {
    return defaultStudentProfile
  }

  // Merge matched student info if someone selects another student
  return {
    ...defaultStudentProfile,
    id: matchedStudent.id,
    name: matchedStudent.name,
    fullName: matchedStudent.name,
    code: matchedStudent.code || "STD-1024",
    studentId: matchedStudent.code?.replace("STD-", "STU-") || "STU-1024",
    email: matchedStudent.email,
    phone: matchedStudent.phone,
    stage: matchedStudent.stage,
    educationStage: matchedStudent.stage,
    grade: matchedStudent.grade,
    system: matchedStudent.system,
    educationSystem: matchedStudent.system,
    avatarInitials: matchedStudent.avatarInitials,
    avatarColorClass: matchedStudent.avatarColorClass,
    status: matchedStudent.status,
    kpis: {
      ...defaultStudentProfile.kpis,
      overallProgress: matchedStudent.progress,
      averageScore: matchedStudent.averageScore,
    },
    learningProgress: {
      ...defaultStudentProfile.learningProgress,
      overallProgress: matchedStudent.progress,
      averageScore: matchedStudent.averageScore,
    },
  }
}
