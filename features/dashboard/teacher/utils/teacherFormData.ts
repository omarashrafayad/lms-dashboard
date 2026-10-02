import { CreateTeacherFormData, UpdateTeacherFormData } from "../schema/teacher.schema"

export interface TeacherFormDataOptions {
  degreeFile: File | null
  nationalIdFile: File | null
  availabilitySlotsJson: string
}

type CommonTeacherFields = Pick<
  CreateTeacherFormData,
  | "fullName"
  | "phoneNumber"
  | "nationalId"
  | "dateOfBirth"
  | "genderId"
  | "qualifications"
  | "yearsOfExperience"
  | "bio"
  | "history"
  | "isActive"
  | "isAvailable"
  | "subjectIds"
  | "teachingLevelIds"
  | "educationStageIds"
>

function appendCommonTeacherFields(
  formData: FormData,
  data: CommonTeacherFields,
  options: TeacherFormDataOptions
): void {
  formData.append("FullName", data.fullName.trim())
  formData.append("PhoneNumber", data.phoneNumber.trim())
  formData.append("NationalId", data.nationalId.trim())

  if (data.dateOfBirth) {
    formData.append("DateOfBirth", data.dateOfBirth)
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

  formData.append("IsActive", String(data.isActive))
  formData.append("IsAvailable", "true")

  // Multi-select arrays
  data.subjectIds.forEach((id) => formData.append("SubjectIds", id))
  data.teachingLevelIds.forEach((id) =>
    formData.append("TeachingLevelIds", id)
  )
  data.educationStageIds.forEach((id) =>
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
}

export function buildCreateTeacherFormData(
  data: CreateTeacherFormData,
  options: TeacherFormDataOptions
): FormData {
  const formData = new FormData()

  formData.append("Email", data.email.trim())
  formData.append("Password", data.password)

  appendCommonTeacherFields(formData, data, options)

  return formData
}

export function buildUpdateTeacherFormData(
  data: UpdateTeacherFormData,
  options: TeacherFormDataOptions
): FormData {
  const formData = new FormData()

  appendCommonTeacherFields(formData, data, options)

  return formData
}
