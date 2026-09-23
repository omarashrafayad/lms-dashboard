import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getCourseList, getCourseDetailById, updateCourse } from "../api/courseApi"
import { CourseFilterState, CourseDetail } from "../types/course.types"

export const useCourses = (filters: CourseFilterState) => {
  return useQuery({
    queryKey: ["courses", filters],
    queryFn: () => getCourseList(filters),
    staleTime: 1000 * 60 * 5,
  })
}

export const useCourseDetail = (courseId: string) => {
  return useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getCourseDetailById(courseId),
    enabled: Boolean(courseId),
    staleTime: 1000 * 60 * 5,
  })
}

export const useUpdateCourse = (courseId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (updatedData: Partial<CourseDetail>) =>
      updateCourse(courseId, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] })
      queryClient.invalidateQueries({ queryKey: ["course", courseId] })
    },
  })
}
