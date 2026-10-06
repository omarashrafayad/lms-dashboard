import clientAxios from "@/lib/axios/clientAxios"
import { CourseListItem, CourseDetail, CourseFilterState } from "../types/course.types"
import { mockCourseList, mockMathFundamentalsDetail } from "../data/mockCourses"

let localCourses = [...mockCourseList]
const localCourseDetails: Record<string, CourseDetail> = {
  "course-math-fundamentals": { ...mockMathFundamentalsDetail },
}

export const getCourseList = async (
  params: Partial<CourseFilterState> | Record<string, string | undefined> = {}
): Promise<CourseListItem[]> => {
  try {
    const res = await clientAxios.get("/academic/courses", { params })
    if (Array.isArray(res.data)) return res.data
    if (res.data?.data && Array.isArray(res.data.data)) return res.data.data
  } catch (err) {
    // Local fallback
  }

  let filtered = [...localCourses]

  if (params.search) {
    const q = params.search.toLowerCase()
    filtered = filtered.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q)
    )
  }
  if (params.category && params.category !== "all") {
    filtered = filtered.filter(
      (c) => c.category.toLowerCase() === params.category?.toLowerCase()
    )
  }
  if (params.level && params.level !== "all") {
    filtered = filtered.filter(
      (c) => c.level.toLowerCase() === params.level?.toLowerCase()
    )
  }
  if (params.status && params.status !== "all") {
    filtered = filtered.filter(
      (c) => c.status.toLowerCase() === params.status?.toLowerCase()
    )
  }

  return filtered
}

export const getCourseDetailById = async (
  courseId: string
): Promise<CourseDetail> => {
  try {
    const res = await clientAxios.get(`/academic/courses/${courseId}`)
    if (res.data?.data) return res.data.data
    if (res.data) return res.data
  } catch (err) {
    // Local fallback
  }

  if (localCourseDetails[courseId]) {
    return localCourseDetails[courseId]
  }

  const foundItem = localCourses.find((c) => c.id === courseId)
  if (foundItem) {
    return {
      ...mockMathFundamentalsDetail,
      id: foundItem.id,
      title: foundItem.title,
      category: foundItem.category,
      instructor: foundItem.instructor,
      level: foundItem.level,
      status: foundItem.status,
      duration: foundItem.duration || "14h",
      stats: {
        totalLessons: foundItem.lessonsCount,
        totalVideos: foundItem.lessonsCount * 3,
        estimatedDuration: foundItem.duration || `${Math.round(foundItem.lessonsCount * 1.5)}h`,
        totalStudents: foundItem.studentsCount,
        completionRate: "74%",
      },
    }
  }

  return mockMathFundamentalsDetail
}

export const updateCourse = async (
  courseId: string,
  updatedData: Partial<CourseDetail>
): Promise<CourseDetail> => {
  try {
    const res = await clientAxios.put(`/academic/courses/${courseId}`, updatedData)
    if (res.data?.data) return res.data.data
    if (res.data) return res.data
  } catch (err) {
    // Local fallback
  }

  const existing = await getCourseDetailById(courseId)
  const merged = { ...existing, ...updatedData }
  localCourseDetails[courseId] = merged

  localCourses = localCourses.map((c) =>
    c.id === courseId
      ? {
          ...c,
          title: merged.title || c.title,
          category: merged.category || c.category,
          instructor: merged.instructor || c.instructor,
          level: merged.level || c.level,
          status: merged.status || c.status,
        }
      : c
  )

  return merged
}
