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
        c.subject.toLowerCase().includes(q) ||
        c.system.toLowerCase().includes(q)
    )
  }
  if (params.stage && params.stage !== "all") {
    filtered = filtered.filter((c) => c.stage.toLowerCase() === params.stage?.toLowerCase())
  }
  if (params.year && params.year !== "all") {
    filtered = filtered.filter((c) => c.academicYear.includes(params.year as string))
  }
  if (params.system && params.system !== "all") {
    filtered = filtered.filter((c) => c.system.toLowerCase() === params.system?.toLowerCase())
  }
  if (params.subject && params.subject !== "all") {
    filtered = filtered.filter((c) => c.subject.toLowerCase() === params.subject?.toLowerCase())
  }
  if (params.status && params.status !== "all") {
    filtered = filtered.filter((c) => c.status.toLowerCase() === params.status?.toLowerCase())
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
      level: foundItem.level,
      stage: foundItem.stage,
      status: foundItem.status,
      subject: foundItem.subject,
      system: foundItem.system,
      academicYear: foundItem.academicYear,
      stats: {
        totalLessons: foundItem.lessonsCount,
        totalVideos: foundItem.lessonsCount * 3,
        estimatedDuration: `${Math.round(foundItem.lessonsCount * 0.7)}h`,
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
  const updated: CourseDetail = {
    ...existing,
    ...updatedData,
    id: courseId,
  }
  localCourseDetails[courseId] = updated

  // Update in localCourses list
  const index = localCourses.findIndex((c) => c.id === courseId)
  if (index !== -1) {
    localCourses[index] = {
      ...localCourses[index],
      title: updated.title,
      stage: updated.stage,
      level: updated.level,
      subject: updated.subject,
      system: updated.system,
      academicYear: updated.academicYear,
      lessonsCount: updated.lessons.length,
      lastUpdated: "Just now",
    }
  }

  return updated
}
