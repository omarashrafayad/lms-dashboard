// Student Portal API Types matching Backend Contract

// 1. /api/v1/mobile/student/courses
export interface StudentCourseItem {
  id: string
  name: string
  description: string
  category: string
  difficultyLevel: string
  status: string
  coverImageUrl: string | null
  leadInstructor: string
  estimatedDurationHours: number
  lessonsCount: number
}

export interface StudentCoursesQueryParams {
  search?: string
  page?: number
  pageSize?: number
}

export interface StudentCoursesResponse {
  items: StudentCourseItem[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

// 2. /api/v1/mobile/student/courses/{courseId}
export interface StudentCourseDetail {
  id: string
  name: string
  description: string
  category: string
  difficultyLevel: string
  leadInstructor: string
  coverImageUrl: string | null
  estimatedDurationHours: number
  status: string
}

export interface StudentCourseInstructor {
  id: string
  fullName: string
  profilePhotoUrl: string | null
  bio: string
}

export interface StudentCourseDetailResponse {
  course: StudentCourseDetail
  instructor: StudentCourseInstructor | null
  lessonCount: number
}

// 3. /api/v1/mobile/student/courses/{courseId}/progress
export interface StudentCourseEnrollment {
  enrollmentId: string
  courseId: string
  status: string
  enrolledAt: string
}

export interface StudentCourseCompletion {
  totalLessons: number
  completedLessons: number
  percentage: number
}

export interface StudentProgressLesson {
  id: string
  name: string
  description: string
  lessonOrder: number
  durationMinutes: number
  status: string
}

export interface StudentCourseProgressResponse {
  course: StudentCourseDetail
  enrollment: StudentCourseEnrollment
  completion: StudentCourseCompletion
  lessons: StudentProgressLesson[]
}

// 4. Shared Lesson Media & Quiz Models
export interface StudentLessonVideo {
  id: string
  title: string
  url: string
  fileSizeBytes: number
  durationSeconds: number
  order: number
  isOfflineAvailable: boolean
}

export interface StudentLessonMaterial {
  id: string
  lessonId: string
  title: string
  filePath: string
  fileUrl: string
  bookImageUrl: string | null
  fileSize: number
  isOfflineAvailable: boolean
}

export interface StudentLessonQuiz {
  id: string
  title: string
  groupId: string
  groupName: string
  position: number
  totalPositions: number
  questionsCount: number
  passingScore: number
  timeLimitMinutes: number
  isComplete: boolean
  hasPassed: boolean
  attempts: number
}

export interface StudentLessonQuizGroup {
  id: string
  name: string
  order: number
  position: number
  totalPositions: number
  questionsCount: number
  isOpen: boolean
  hasPassed: boolean
  attempts: number
  percentage: number
  nextGroupId: string | null
}

// /api/v1/mobile/student/course-lessons/{lessonId}
export interface StudentLessonDetailResponse {
  course: StudentCourseDetail
  lesson: {
    id: string
    name: string
    description: string
    lessonOrder: number
    durationMinutes: number
  }
  status: string
  videos: StudentLessonVideo[]
  materials: StudentLessonMaterial[]
  quiz: StudentLessonQuiz | null
  quizGroups: StudentLessonQuizGroup[]
  nextLesson: {
    id: string
    name: string
    lessonOrder: number
  } | null
}

// 5. /api/v1/mobile/student/sessions
export interface StudentSessionItem {
  sessionId: string
  bookingId: string
  teacherId: string
  teacherName: string
  subjectName: string
  callType: string
  scheduledStart: string
  scheduledEnd: string
  durationMinutes: number
  sessionStatus: string
  bookingStatus: string
  meetingUrl: string
  isAwaitingTeacher: boolean
  isJoinable: boolean
  canCancel: boolean
}

export interface StudentSessionsResponse {
  pointsBalance: number
  upcoming: StudentSessionItem[]
  previous: StudentSessionItem[]
}

// 6. /api/v1/mobile/student/exams
export interface StudentExamItem {
  id: string
  title: string
  examType: string
  level: string
  status: string
  durationMinutes: number
  questionCount: number
  totalPoints: number
  subjects: string[]
  availableFrom: string
  availableTo: string
}

export interface StudentExamsQueryParams {
  page?: number
  pageSize?: number
}

export interface StudentExamsResponse {
  items: StudentExamItem[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

// 7. /api/v1/mobile/student/exams/{examId}
export interface StudentExamDetail {
  id: string
  title: string
  description: string
  examType: string
  level: string
  educationStage: string
  academicYear: string
  term: string
  month: string
  subjects: string[]
  courseId: string
  courseName: string
  durationMinutes: number
  attemptsAllowed: number
  passingScore: number
  questionCount: number
  totalPoints: number
  availability: string
  availableFrom: string
  availableTo: string
}

export interface StudentExamAccessResult {
  id: string
  score: number
  earnedPoints: number
  correctAnswers: number
  wrongAnswers: number
  status: string
  attempts: number
  completionMinutes: number
  completedAt: string
}

export interface StudentExamAccess {
  canAttempt: boolean
  closedReason: string
  attemptsUsed: number
  remainingAttempts: number
  result?: StudentExamAccessResult | null
}

export interface StudentExamQuestion {
  id: string
  order: number
  questionText: string
  questionType: string
  points: number
  options: string[]
  isRequired: boolean
}

export interface StudentExamDetailResponse {
  exam: StudentExamDetail
  access: StudentExamAccess
  questions: StudentExamQuestion[]
}

export interface StudentExamAttemptPayload {
  answers: Array<{
    questionId: string
    answer: string
  }>
  timeSpentSeconds?: number
}

export interface StudentExamResultAnswer {
  questionId: string
  order?: number
  questionText?: string
  options?: string[]
  submittedAnswer?: string
  isCorrect?: boolean
  correctAnswerText?: string
  explanation?: string
}

export interface StudentExamResultResponse {
  exam?: StudentExamDetail
  result?: StudentExamAccessResult
  id?: string
  score?: number
  earnedPoints?: number
  totalPoints?: number
  percentage?: number
  correctAnswers?: number
  wrongAnswers?: number
  status?: string
  attempts?: number
  completionMinutes?: number
  completedAt?: string
  passed?: boolean
  answers?: StudentExamResultAnswer[]
}

// 8. /api/v1/mobile/student/subjects
export interface StudentSubjectItem {
  id: string
  name: string
  educationStageName: string
  gradeName: string
  educationSystemName: string
  term: string
}

export interface StudentSubjectsQueryParams {
  search?: string
  page?: number
  pageSize?: number
}

export interface StudentSubjectsResponse {
  items: StudentSubjectItem[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

// 9. /api/v1/mobile/student/subjects/{subjectId}
export interface StudentSubjectTeacher {
  id: string
  fullName: string
  profilePhotoUrl: string | null
  phoneNumber: string
  email: string
  teachingLevelName: string
}

export interface StudentSubjectChapter {
  id: string
  name: string
  description: string
  order: number
  unitCount: number
  lessonCount: number
}

export interface StudentSubjectDetailResponse {
  subject: {
    id: string
    name: string
    term: string
    status: string
    educationStageName: string
    gradeName: string
    educationSystemName: string
    createdAt: string
  }
  counts: {
    chapters: number
    units: number
    lessons: number
  }
  progress: {
    totalLessons: number
    completedLessons: number
    percentage: number
  }
  teacher: StudentSubjectTeacher | null
  chapters: StudentSubjectChapter[]
  materials: StudentLessonMaterial[]
}

// 10. /api/v1/mobile/student/subjects/{subjectId}/chapters/{chapterId}/units
export interface StudentSubjectUnit {
  id: string
  name: string
  description: string
  order: number
  lessonCount: number
}

// 11. /api/v1/mobile/student/subjects/{subjectId}/chapters/{chapterId}/units/{unitId}/lessons
export interface StudentPlacement {
  subject: {
    id: string
    name: string
    educationStageName: string
  }
  chapter: {
    id: string
    name: string
  }
  unit: {
    id: string
    name: string
    description: string
    order: number
  }
}

export interface StudentUnitLessonItem {
  id: string
  name: string
  description: string
  durationMinutes: number
  lessonOrder: number
  status: string
}

export interface StudentUnitLessonsResponse {
  placement: StudentPlacement
  lessonCount: number
  lessons: StudentUnitLessonItem[]
}

// 12. /api/v1/mobile/student/lessons/{lessonId}
export interface StudentSubjectLessonDetailResponse {
  lesson: {
    id: string
    name: string
    description: string
    lessonOrder: number
    durationMinutes: number
  }
  placement: StudentPlacement
  teacher: StudentSubjectTeacher | null
  status: string
  videos: StudentLessonVideo[]
  materials: StudentLessonMaterial[]
  quiz: StudentLessonQuiz | null
  quizGroups: StudentLessonQuizGroup[]
  nextLesson: {
    id: string
    name: string
    lessonOrder: number
  } | null
}

// 13. Quizzes Endpoints
export interface StudentQuizQuestion {
  id: string
  order: number
  questionText: string
  options: string[]
}

export interface StudentQuizResponse {
  id: string
  lessonId: string
  title: string
  groupId: string
  groupName: string
  groupOrder: number
  totalQuestions: number
  timeLimitMinutes: number
  passingScore: number
  isComplete: boolean
  questions: StudentQuizQuestion[]
  groups: StudentLessonQuizGroup[]
}

export interface StudentQuizDetailGroup extends StudentLessonQuizGroup {
  questions: StudentQuizQuestion[]
}

export interface StudentQuizDetailResponse {
  id: string
  lessonId: string
  title: string
  timeLimitMinutes: number
  passingScore: number
  isComplete: boolean
  groups: StudentQuizDetailGroup[]
}

export interface StudentQuizAttemptPayload {
  answers: Array<{
    questionId: string
    answer: string
  }>
  timeSpentSeconds: number
}

export interface StudentQuizAttemptSummary {
  id: string
  quizId: string
  quizGroupId: string
  title: string
  groupName: string
  groupOrder: number
  studentId: string
  totalQuestions: number
  correctAnswers: number
  wrongAnswers: number
  percentage: number
  passed: boolean
  passingScore: number
  attempts: number
  timeSpentSeconds: number
  completedAt: string
  nextGroupId: string | null
  hasMoreGroups: boolean
  isQuizComplete: boolean
}

export interface StudentQuizAnswerReview {
  questionId: string
  order: number
  questionText: string
  options: string[]
  submittedAnswer: string
  isCorrect: boolean
  correctOptionIndex: number
  correctAnswerText: string
  explanation: string
}

export interface StudentQuizResultResponse {
  attempt: StudentQuizAttemptSummary
  placement?: StudentPlacement
  answers: StudentQuizAnswerReview[]
}

// 14. /api/v1/mobile/student/home (Overview)
export interface StudentHomeProfile {
  id: string
  fullName: string
  firstName: string
  level: string
  academicStage: string
  grade: string
  educationSystem: string
  profilePhotoUrl: string | null
}

export interface StudentHomeQuickAccess {
  teachers: number
  courses: number
  subjects: number
  exams: number
}

export interface StudentHomeTeacherSpecialization {
  subjectId: string
  subjectName: string
  teachingLevelId: string
  teachingLevelName: string
  academicStageId: string
  academicStageName: string
}

export interface StudentHomeTeacherAvailabilitySlot {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
}

export interface StudentHomeTeacherSessionItem {
  id: string
  title: string
  courseOrSubject: string
  studentName: string
  studentCount: number
  scheduledStart: string
  scheduledEnd: string
  durationMinutes: number
  sessionType: string
  status: string
  displayStatus: string
}

export interface StudentHomeTeacher {
  id: string
  email: string
  fullName: string
  phoneNumber: string
  nationalId: string
  gender: string
  dateOfBirth: string
  educationStage: string
  educationSystem: string
  qualifications: string
  yearsOfExperience: number
  costPerHour: number
  applicationPercentage: number
  bio: string
  history: string
  isActive: boolean
  isAvailable: boolean
  profilePhotoUrl: string | null
  universityDegreeCertificateUrl: string | null
  nationalIdDocumentUrl: string | null
  createdAt: string
  role: string
  specializations: StudentHomeTeacherSpecialization[]
  availabilitySlots: StudentHomeTeacherAvailabilitySlot[]
  sessions: {
    upcomingCount: number
    previousCount: number
    upcoming: StudentHomeTeacherSessionItem[]
    previous: StudentHomeTeacherSessionItem[]
  }
  audioPointsPerMinute: number
  videoPointsPerMinute: number
}

export interface StudentHomeNewsItem {
  id: string
  title: string
  summary: string
  imageUrl: string | null
  publishedAt: string
  createdAt: string
}

export interface StudentHomeBannerItem {
  id: string
  title: string
  imageUrl: string
  linkUrl: string | null
  order: number
}

export interface StudentHomeResponse {
  student: StudentHomeProfile
  quickAccess: StudentHomeQuickAccess
  teachers: StudentHomeTeacher[]
  courses: StudentCourseItem[]
  subjects: StudentSubjectItem[]
  exams: StudentExamItem[]
  news: StudentHomeNewsItem[]
  banners: StudentHomeBannerItem[]
}

