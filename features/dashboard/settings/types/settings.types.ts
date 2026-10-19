export type SettingsTabKey =
  | "general"
  | "profile"
  | "notifications"
  | "system"
  | "security"

export interface GeneralSettings {
  academyName: string
  tagline: string
  supportEmail: string
  phoneNumber: string
  address: string
  defaultLanguage: "en" | "ar"
  timezone: string
  currency: string
  academicYear: string
  currentSemester: string
}

export interface ProfileSettings {
  fullName: string
  email: string
  phone: string
  role: string
  avatarUrl: string
  bio: string
}

export interface NotificationSettings {
  emailNewStudentEnrollment: boolean
  emailBookingRequests: boolean
  emailPaymentTransactions: boolean
  emailWeeklyDigest: boolean
  pushSessionReminders: boolean
  pushDirectMessages: boolean
  pushSystemAlerts: boolean
  smsUrgentAlerts: boolean
}

export interface SystemSettings {
  studentSelfRegistration: boolean
  autoApproveBookings: boolean
  allowTeacherCustomSlots: boolean
  defaultSessionDurationMinutes: number
  maxStudentsPerGroupSession: number
  maintenanceMode: boolean
}

export interface SecuritySettings {
  twoFactorAuth: boolean
  sessionTimeoutMinutes: number
  loginAlerts: boolean
}

export interface ActiveSessionDevice {
  id: string
  device: string
  browser: string
  location: string
  ip: string
  lastActive: string
  isCurrent: boolean
}

export interface AppSettingsState {
  general: GeneralSettings
  profile: ProfileSettings
  notifications: NotificationSettings
  system: SystemSettings
  security: SecuritySettings
}
