"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getStudentCourses,
  getStudentCourseDetail,
  getStudentCourseProgress,
  getStudentCourseLessonDetail,
  getStudentSessions,
  getStudentExams,
  getStudentExamDetail,
  submitStudentExamAttempt,
  getStudentExamResult,
  getStudentSubjects,
  getStudentSubjectDetail,
  getStudentChapterUnits,
  getStudentUnitLessons,
  getStudentSubjectLessonDetail,
  getStudentLessonQuiz,
  getStudentQuiz,
  getStudentQuizDetail,
  getNextStudentQuizGroup,
  submitStudentQuizAttempt,
  getStudentQuizResult,
  getStudentHome,
} from "../api/studentPortalApi"
import {
  StudentCoursesQueryParams,
  StudentExamsQueryParams,
  StudentExamAttemptPayload,
  StudentSubjectsQueryParams,
  StudentQuizAttemptPayload,
} from "../types/studentApi.types"

export const useStudentCourses = (params: StudentCoursesQueryParams = {}) => {
  return useQuery({
    queryKey: ["student-courses", params],
    queryFn: () => getStudentCourses(params),
  })
}

export const useStudentCourse = (courseId: string) => {
  return useQuery({
    queryKey: ["student-course", courseId],
    queryFn: () => getStudentCourseDetail(courseId),
    enabled: !!courseId,
  })
}

export const useStudentCourseProgress = (courseId: string) => {
  return useQuery({
    queryKey: ["student-course-progress", courseId],
    queryFn: () => getStudentCourseProgress(courseId),
    enabled: !!courseId,
  })
}

export const useStudentLessonDetail = (lessonId: string) => {
  return useQuery({
    queryKey: ["student-course-lesson-detail", lessonId],
    queryFn: () => getStudentCourseLessonDetail(lessonId),
    enabled: !!lessonId,
  })
}

export const useStudentSessions = () => {
  return useQuery({
    queryKey: ["student-sessions"],
    queryFn: () => getStudentSessions(),
  })
}

export const useStudentExams = (params: StudentExamsQueryParams = {}) => {
  return useQuery({
    queryKey: ["student-exams", params],
    queryFn: () => getStudentExams(params),
  })
}

export const useStudentExam = (examId: string) => {
  return useQuery({
    queryKey: ["student-exam", examId],
    queryFn: () => getStudentExamDetail(examId),
    enabled: !!examId,
  })
}

export const useStudentExamResult = (examId: string, enabled = true) => {
  return useQuery({
    queryKey: ["student-exam-result", examId],
    queryFn: () => getStudentExamResult(examId),
    enabled: !!examId && enabled,
  })
}

export const useSubmitStudentExamAttempt = (examId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: StudentExamAttemptPayload) =>
      submitStudentExamAttempt(examId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-exams"] })
      queryClient.invalidateQueries({ queryKey: ["student-exam", examId] })
      queryClient.invalidateQueries({ queryKey: ["student-exam-result", examId] })
    },
  })
}

export const useStudentSubjects = (params: StudentSubjectsQueryParams = {}) => {
  return useQuery({
    queryKey: ["student-subjects", params],
    queryFn: () => getStudentSubjects(params),
  })
}

export const useStudentSubjectDetail = (subjectId: string) => {
  return useQuery({
    queryKey: ["student-subject-detail", subjectId],
    queryFn: () => getStudentSubjectDetail(subjectId),
    enabled: !!subjectId,
  })
}

export const useStudentChapterUnits = (subjectId: string, chapterId: string) => {
  return useQuery({
    queryKey: ["student-chapter-units", subjectId, chapterId],
    queryFn: () => getStudentChapterUnits(subjectId, chapterId),
    enabled: !!subjectId && !!chapterId,
  })
}

export const useStudentUnitLessons = (
  subjectId: string,
  chapterId: string,
  unitId: string
) => {
  return useQuery({
    queryKey: ["student-unit-lessons", subjectId, chapterId, unitId],
    queryFn: () => getStudentUnitLessons(subjectId, chapterId, unitId),
    enabled: !!subjectId && !!chapterId && !!unitId,
  })
}

export const useStudentSubjectLessonDetail = (lessonId: string) => {
  return useQuery({
    queryKey: ["student-subject-lesson-detail", lessonId],
    queryFn: () => getStudentSubjectLessonDetail(lessonId),
    enabled: !!lessonId,
  })
}

export const useStudentLessonQuiz = (lessonId: string) => {
  return useQuery({
    queryKey: ["student-lesson-quiz", lessonId],
    queryFn: () => getStudentLessonQuiz(lessonId),
    enabled: !!lessonId,
  })
}

export const useStudentQuiz = (quizId: string) => {
  return useQuery({
    queryKey: ["student-quiz", quizId],
    queryFn: () => getStudentQuiz(quizId),
    enabled: !!quizId,
  })
}

export const useStudentQuizDetail = (quizId: string) => {
  return useQuery({
    queryKey: ["student-quiz-detail", quizId],
    queryFn: () => getStudentQuizDetail(quizId),
    enabled: !!quizId,
  })
}

export const useStudentQuizResult = (quizId: string, enabled = true) => {
  return useQuery({
    queryKey: ["student-quiz-result", quizId],
    queryFn: () => getStudentQuizResult(quizId),
    enabled: !!quizId && enabled,
  })
}

export const useSubmitStudentQuizAttempt = (quizId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: StudentQuizAttemptPayload) =>
      submitStudentQuizAttempt(quizId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-quiz", quizId] })
      queryClient.invalidateQueries({ queryKey: ["student-quiz-detail", quizId] })
      queryClient.invalidateQueries({ queryKey: ["student-quiz-result", quizId] })
      queryClient.invalidateQueries({ queryKey: ["student-lesson-quiz"] })
      queryClient.invalidateQueries({ queryKey: ["student-subject-lesson-detail"] })
      queryClient.invalidateQueries({ queryKey: ["student-course-lesson-detail"] })
    },
  })
}

export const useNextStudentQuizGroup = (quizId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (groupId: string) => getNextStudentQuizGroup(quizId, groupId),
    onSuccess: (data) => {
      queryClient.setQueryData(["student-quiz", quizId], data)
      queryClient.invalidateQueries({ queryKey: ["student-quiz-detail", quizId] })
    },
  })
}

export const useStudentHome = () => {
  return useQuery({
    queryKey: ["student-home"],
    queryFn: () => getStudentHome(),
  })
}
