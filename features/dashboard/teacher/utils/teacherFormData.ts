import { CreateTeacherFormData, UpdateTeacherFormData } from "../schema/teacher.schema"

export interface TeacherFormDataOptions {
  isActive: boolean
  selectedSubjectIds: string[]
  selectedTeachingLevelIds: string[]
  selectedEducationStageIds: string[]
  degreeFile: File | null
  nationalIdFile: File | null
  availabilitySlotsJson: string
}

export function buildCreateTeacherFormData(
  data: CreateTeacherFormData,
  options: TeacherFormDataOptions
): FormData {
  const formData = new FormData()

  formData.append("Email", data.email.trim())
  formData.append("Password", data.password)
  formData.append("FullName", data.fullName.trim())
  formData.append("PhoneNumber", data.phoneNumber.trim())
  formData.append("NationalId", data.nationalId.trim())

  if (data.dateOfBirth) {
    try {
      const parsed = new Date(data.dateOfBirth)
      formData.append(
        "DateOfBirth",
        !isNaN(parsed.getTime()) ? parsed.toISOString() : data.dateOfBirth
      )
    } catch {
      formData.append("DateOfBirth", data.dateOfBirth)
    }
  }

  formData.append("GenderId", data.genderId)

  if (data.qualifications?.trim()) {
    formData.append("Qualifications", data.qualifications.trim())
  }
  formData.append("YearsOfExperience", String(Number(data.yearsOfExperience) || 0))
  if (data.bio?.trim()) {
    formData.append("Bio", data.bio.trim())
  }
  if (data.history?.trim()) {
    formData.append("History", data.history.trim())
  }

  formData.append("IsActive", String(options.isActive))
  formData.append("IsAvailable", "true")

  // Multi-select arrays
  options.selectedSubjectIds.forEach((id) => formData.append("SubjectIds", id))
  options.selectedTeachingLevelIds.forEach((id) =>
    formData.append("TeachingLevelIds", id)
  )
  options.selectedEducationStageIds.forEach((id) =>
    formData.append("EducationStageIds", id)
  )

  // Files
  if (options.degreeFile) {
    formData.append("UniversityDegreeCertificate", options.degreeFile)
  }
  if (options.nationalIdFile) {
    formData.append("NationalIdDocument", options.nationalIdFile)
  }

  // AvailabilitySlotsJson
  formData.append("AvailabilitySlotsJson", options.availabilitySlotsJson)

  return formData
}

export function buildUpdateTeacherFormData(
  data: UpdateTeacherFormData,
  options: TeacherFormDataOptions
): FormData {
  const formData = new FormData()

  formData.append("FullName", data.fullName.trim())
  formData.append("PhoneNumber", data.phoneNumber.trim())
  formData.append("NationalId", data.nationalId.trim())

  if (data.dateOfBirth) {
    try {
      const parsed = new Date(data.dateOfBirth)
      formData.append(
        "DateOfBirth",
        !isNaN(parsed.getTime()) ? parsed.toISOString() : data.dateOfBirth
      )
    } catch {
      formData.append("DateOfBirth", data.dateOfBirth)
    }
  }

  formData.append("GenderId", data.genderId)

  if (data.qualifications?.trim()) {
    formData.append("Qualifications", data.qualifications.trim())
  }
  formData.append("YearsOfExperience", String(Number(data.yearsOfExperience) || 0))
  if (data.bio?.trim()) {
    formData.append("Bio", data.bio.trim())
  }
  if (data.history?.trim()) {
    formData.append("History", data.history.trim())
  }

  formData.append("IsActive", String(options.isActive))
  formData.append("IsAvailable", "true")

  // Multi-select arrays
  options.selectedSubjectIds.forEach((id) => formData.append("SubjectIds", id))
  options.selectedTeachingLevelIds.forEach((id) =>
    formData.append("TeachingLevelIds", id)
  )
  options.selectedEducationStageIds.forEach((id) =>
    formData.append("EducationStageIds", id)
  )

  // Files
  if (options.degreeFile) {
    formData.append("UniversityDegreeCertificate", options.degreeFile)
  }
  if (options.nationalIdFile) {
    formData.append("NationalIdDocument", options.nationalIdFile)
  }

  // AvailabilitySlotsJson
  formData.append("AvailabilitySlotsJson", options.availabilitySlotsJson)

  return formData
}
