import {
  AppSettingsState,
  ActiveSessionDevice,
} from "../types/settings.types"

export const INITIAL_SETTINGS_STATE: AppSettingsState = {
  general: {
    academyName: "Innovation LMS Academy",
    tagline: "Empowering excellence in modern digital education",
    supportEmail: "support@innovation-lms.com",
    phoneNumber: "+20 100 123 4567",
    address: "New Cairo, Fifth Settlement, Cairo, Egypt",
    defaultLanguage: "en",
    timezone: "Africa/Cairo (GMT+2)",
    currency: "USD ($)",
    academicYear: "2025 - 2026",
    currentSemester: "Fall Semester",
  },
  profile: {
    fullName: "Dina Farouk",
    email: "dina.farouk@innovation-lms.com",
    phone: "+20 112 345 6789",
    role: "System Administrator",
    avatarUrl: "/dina-farouk.jpg",
    bio: "Head Administrator overseeing curriculum delivery, teacher certifications, and student progression.",
  },
  notifications: {
    emailNewStudentEnrollment: true,
    emailBookingRequests: true,
    emailPaymentTransactions: true,
    emailWeeklyDigest: false,
    pushSessionReminders: true,
    pushDirectMessages: true,
    pushSystemAlerts: true,
    smsUrgentAlerts: false,
  },
  system: {
    studentSelfRegistration: true,
    autoApproveBookings: false,
    allowTeacherCustomSlots: true,
    defaultSessionDurationMinutes: 60,
    maxStudentsPerGroupSession: 25,
    maintenanceMode: false,
  },
  security: {
    twoFactorAuth: false,
    sessionTimeoutMinutes: 30,
    loginAlerts: true,
  },
}

export const INITIAL_ACTIVE_DEVICES: ActiveSessionDevice[] = [
  {
    id: "dev-1",
    device: "Windows PC",
    browser: "Google Chrome 128.0",
    location: "Cairo, Egypt",
    ip: "197.35.120.44",
    lastActive: "Active now",
    isCurrent: true,
  },
  {
    id: "dev-2",
    device: "Apple MacBook Pro",
    browser: "Safari 17.4",
    location: "Alexandria, Egypt",
    ip: "156.208.92.12",
    lastActive: "2 hours ago",
    isCurrent: false,
  },
  {
    id: "dev-3",
    device: "iPhone 15 Pro",
    browser: "LMS Mobile App v2.4",
    location: "Cairo, Egypt",
    ip: "197.35.120.89",
    lastActive: "Yesterday at 9:15 PM",
    isCurrent: false,
  },
]
