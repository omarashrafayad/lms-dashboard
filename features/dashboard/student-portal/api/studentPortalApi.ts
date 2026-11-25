import clientAxios from "@/lib/axios/clientAxios"
import {
  StudentCoursesQueryParams,
  StudentCoursesResponse,
  StudentCourseDetailResponse,
  StudentCourseProgressResponse,
  StudentLessonDetailResponse,
  StudentSessionsResponse,
  StudentExamsQueryParams,
  StudentExamsResponse,
  StudentExamDetailResponse,
  StudentExamAttemptPayload,
  StudentExamResultResponse,
  StudentSubjectsQueryParams,
  StudentSubjectsResponse,
  StudentSubjectDetailResponse,
  StudentSubjectUnit,
  StudentUnitLessonsResponse,
  StudentSubjectLessonDetailResponse,
  StudentQuizResponse,
  StudentQuizDetailResponse,
  StudentQuizAttemptPayload,
  StudentQuizResultResponse,
  StudentHomeResponse,
} from "../types/studentApi.types"

const unwrap = <T>(res: { data: any }): T => {
  return (res.data?.data ?? res.data) as T
}

// -------------------------------------------------------------
// 1. My Courses (/api/v1/mobile/student/courses)
// -------------------------------------------------------------
export const getStudentCourses = async (
  params: StudentCoursesQueryParams = {}
): Promise<StudentCoursesResponse> => {
  const queryParams: Record<string, any> = {}
  if (params.page !== undefined) queryParams.page = params.page
  if (params.pageSize !== undefined) queryParams.pageSize = params.pageSize
  if (params.search && params.search.trim()) queryParams.search = params.search.trim()

  const res = await clientAxios.get("/mobile/student/courses", {
    params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
  })
  return unwrap<StudentCoursesResponse>(res)
}

// -------------------------------------------------------------
// 2. Course Details (/api/v1/mobile/student/courses/{courseId})
// -------------------------------------------------------------
export const getStudentCourseDetail = async (
  courseId: string
): Promise<StudentCourseDetailResponse> => {
  const res = await clientAxios.get(`/mobile/student/courses/${courseId}`)
  return unwrap<StudentCourseDetailResponse>(res)
}

// -------------------------------------------------------------
// 3. Course Progress & Curriculum (/api/v1/mobile/student/courses/{courseId}/progress)
// -------------------------------------------------------------
export const getStudentCourseProgress = async (
  courseId: string
): Promise<StudentCourseProgressResponse> => {
  const res = await clientAxios.get(`/mobile/student/courses/${courseId}/progress`)
  return unwrap<StudentCourseProgressResponse>(res)
}

// -------------------------------------------------------------
// 4. Course Lesson Content (/api/v1/mobile/student/course-lessons/{lessonId})
// -------------------------------------------------------------
export const getStudentCourseLessonDetail = async (
  lessonId: string
): Promise<StudentLessonDetailResponse> => {
  const res = await clientAxios.get(`/mobile/student/course-lessons/${lessonId}`)
  return unwrap<StudentLessonDetailResponse>(res)
}

// -------------------------------------------------------------
// 5. My Sessions (/api/v1/mobile/student/sessions)
// -------------------------------------------------------------
export const getStudentSessions = async (): Promise<StudentSessionsResponse> => {
  const res = await clientAxios.get("/mobile/student/sessions")
  return unwrap<StudentSessionsResponse>(res)
}

// -------------------------------------------------------------
// 6. My Exams (/api/v1/mobile/student/exams)
// -------------------------------------------------------------
export const getStudentExams = async (
  params: StudentExamsQueryParams = {}
): Promise<StudentExamsResponse> => {
  const queryParams: Record<string, any> = {}
  if (params.page !== undefined) queryParams.page = params.page
  if (params.pageSize !== undefined) queryParams.pageSize = params.pageSize

  const res = await clientAxios.get("/mobile/student/exams", {
    params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
  })
  return unwrap<StudentExamsResponse>(res)
}

// -------------------------------------------------------------
// 7. Exam Details (/api/v1/mobile/student/exams/{examId})
// -------------------------------------------------------------
export const getStudentExamDetail = async (
  examId: string
): Promise<StudentExamDetailResponse> => {
  const res = await clientAxios.get(`/mobile/student/exams/${examId}`)
  return unwrap<StudentExamDetailResponse>(res)
}

// 8. Submit Exam Attempt (/api/v1/mobile/student/exams/{examId}/attempts)
export const submitStudentExamAttempt = async (
  examId: string,
  payload: StudentExamAttemptPayload
): Promise<StudentExamResultResponse> => {
  const res = await clientAxios.post(`/mobile/student/exams/${examId}/attempts`, payload)
  return unwrap<StudentExamResultResponse>(res)
}

// 9. Get Exam Result (/api/v1/mobile/student/exams/{examId}/result)
export const getStudentExamResult = async (
  examId: string
): Promise<StudentExamResultResponse> => {
  const res = await clientAxios.get(`/mobile/student/exams/${examId}/result`)
  return unwrap<StudentExamResultResponse>(res)
}

// -------------------------------------------------------------
// 10. My Subjects (/api/v1/mobile/student/subjects)
// -------------------------------------------------------------
export const getStudentSubjects = async (
  params: StudentSubjectsQueryParams = {}
): Promise<StudentSubjectsResponse> => {
  const queryParams: Record<string, any> = {}
  if (params.page !== undefined) queryParams.page = params.page
  if (params.pageSize !== undefined) queryParams.pageSize = params.pageSize
  if (params.search && params.search.trim()) queryParams.search = params.search.trim()

  const res = await clientAxios.get("/mobile/student/subjects", {
    params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
  })
  return unwrap<StudentSubjectsResponse>(res)
}

// -------------------------------------------------------------
// 11. Subject Detail (/api/v1/mobile/student/subjects/{subjectId})
// -------------------------------------------------------------
export const getStudentSubjectDetail = async (
  subjectId: string
): Promise<StudentSubjectDetailResponse> => {
  const res = await clientAxios.get(`/mobile/student/subjects/${subjectId}`)
  return unwrap<StudentSubjectDetailResponse>(res)
}

// -------------------------------------------------------------
// 12. Chapter Units (/api/v1/mobile/student/subjects/{subjectId}/chapters/{chapterId}/units)
// -------------------------------------------------------------
export const getStudentChapterUnits = async (
  subjectId: string,
  chapterId: string
): Promise<StudentSubjectUnit[]> => {
  const res = await clientAxios.get(
    `/mobile/student/subjects/${subjectId}/chapters/${chapterId}/units`
  )
  return unwrap<StudentSubjectUnit[]>(res)
}

// -------------------------------------------------------------
// 13. Unit Lessons (/api/v1/mobile/student/subjects/{subjectId}/chapters/{chapterId}/units/{unitId}/lessons)
// -------------------------------------------------------------
export const getStudentUnitLessons = async (
  subjectId: string,
  chapterId: string,
  unitId: string
): Promise<StudentUnitLessonsResponse> => {
  const res = await clientAxios.get(
    `/mobile/student/subjects/${subjectId}/chapters/${chapterId}/units/${unitId}/lessons`
  )
  return unwrap<StudentUnitLessonsResponse>(res)
}

// -------------------------------------------------------------
// 14. Subject Lesson Detail (/api/v1/mobile/student/lessons/{lessonId})
// -------------------------------------------------------------
export const getStudentSubjectLessonDetail = async (
  lessonId: string
): Promise<StudentSubjectLessonDetailResponse> => {
  const res = await clientAxios.get(`/mobile/student/lessons/${lessonId}`)
  return unwrap<StudentSubjectLessonDetailResponse>(res)
}

// -------------------------------------------------------------
// 15. Lesson Quiz (/api/v1/mobile/student/lessons/{lessonId}/quiz)
// -------------------------------------------------------------
export const getStudentLessonQuiz = async (
  lessonId: string
): Promise<StudentQuizResponse> => {
  const res = await clientAxios.get(`/mobile/student/lessons/${lessonId}/quiz`)
  return unwrap<StudentQuizResponse>(res)
}

// -------------------------------------------------------------
// 16. Quiz By Id (/api/v1/mobile/student/quizzes/{quizId})
// -------------------------------------------------------------
export const getStudentQuiz = async (quizId: string): Promise<StudentQuizResponse> => {
  const res = await clientAxios.get(`/mobile/student/quizzes/${quizId}`)
  return unwrap<StudentQuizResponse>(res)
}

// -------------------------------------------------------------
// 17. Quiz Full Detail (/api/v1/mobile/student/quizzes/{quizId}/detail)
// -------------------------------------------------------------
export const getStudentQuizDetail = async (
  quizId: string
): Promise<StudentQuizDetailResponse> => {
  const res = await clientAxios.get(`/mobile/student/quizzes/${quizId}/detail`)
  return unwrap<StudentQuizDetailResponse>(res)
}

// -------------------------------------------------------------
// 18. Next Quiz Group (/api/v1/mobile/student/quizzes/{quizId}/groups/{groupId}/next)
// -------------------------------------------------------------
export const getNextStudentQuizGroup = async (
  quizId: string,
  groupId: string
): Promise<StudentQuizResponse> => {
  try {
    const res = await clientAxios.post(
      `/mobile/student/quizzes/${quizId}/groups/${groupId}/next`
    )
    return unwrap<StudentQuizResponse>(res)
  } catch (err: any) {
    if (err?.response?.status === 405) {
      const res = await clientAxios.get(
        `/mobile/student/quizzes/${quizId}/groups/${groupId}/next`
      )
      return unwrap<StudentQuizResponse>(res)
    }
    throw err
  }
}

// -------------------------------------------------------------
// 19. Submit Quiz Attempt (/api/v1/mobile/student/quizzes/{quizId}/attempts)
// -------------------------------------------------------------
export const submitStudentQuizAttempt = async (
  quizId: string,
  payload: StudentQuizAttemptPayload
): Promise<StudentQuizResultResponse> => {
  const res = await clientAxios.post(`/mobile/student/quizzes/${quizId}/attempts`, payload)
  return unwrap<StudentQuizResultResponse>(res)
}

// -------------------------------------------------------------
// 20. Get Quiz Result (/api/v1/mobile/student/quizzes/{quizId}/result)
// -------------------------------------------------------------
export const getStudentQuizResult = async (
  quizId: string
): Promise<StudentQuizResultResponse> => {
  const res = await clientAxios.get(`/mobile/student/quizzes/${quizId}/result`)
  return unwrap<StudentQuizResultResponse>(res)
}

// -------------------------------------------------------------
// 21. Student Home / Overview (/api/v1/mobile/student/home)
// -------------------------------------------------------------
export const getStudentHome = async (): Promise<StudentHomeResponse> => {
  const res = await clientAxios.get("/mobile/student/home")
  return unwrap<StudentHomeResponse>(res)
}
