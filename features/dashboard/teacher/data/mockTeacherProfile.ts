import { TeacherProfile } from "../types/teacherProfile.types"

export const defaultTeacherProfile: TeacherProfile = {
  id: "TCH-1024",
  name: "Ahmed Hassan",
  code: "TCH-1024",
  avatarInitials: "AH",
  avatarColorClass: "bg-sky-100 text-sky-700",
  status: "Active",
  availabilityStatus: "Available",
  kpis: {
    totalStudents: 24,
    upcomingSessions: 3,
    completedSessions: 128,
    averageRating: 4.8,
    teachingHours: 214,
  },
  personalInfo: {
    fullName: "Ahmed Hassan",
    nationalId: "28803041234567",
    dateOfBirth: "March 4, 1988",
    gender: "Male",
    email: "ahmed.hassan@example.com",
    phone: "+20 100 447 2201",
  },
  professionalInfo: {
    subjects: ["Mathematics"],
    qualifications: "M.Sc. in Applied Mathematics, Cairo University",
    yearsOfExperience: "8 years",
    teachingLevels: ["Preparatory", "Secondary"],
    bio: "Passionate mathematics teacher focused on building strong problem-solving foundations through clear, structured lessons.",
  },
  teachingSetup: {
    subjects: ["Mathematics"],
    educationStages: ["Preparatory", "Secondary"],
    teachingLevels: ["Intermediate", "Advanced"],
  },
  accountInfo: {
    loginMethod: "Email",
    email: "ahmed.hassan@example.com",
    accountStatus: "Active",
  },
  verificationDocuments: {
    degreeCertificate: {
      fileName: "Screenshot 1526.png",
      fileSize: "288 KB",
      status: "Pending Review",
    },
    nationalIdImage: {
      uploaded: false,
    },
  },
  weeklyAvailability: [
    {
      day: "Monday",
      slots: [
        { id: "mon-1", start: "09:00 AM", end: "12:00 PM", status: "Available" },
        { id: "mon-2", start: "04:00 PM", end: "05:00 PM", status: "Available" },
        { id: "mon-3", start: "05:00 PM", end: "06:00 PM", status: "Booked" },
        { id: "mon-4", start: "06:00 PM", end: "08:00 PM", status: "Available" },
      ],
    },
    {
      day: "Tuesday",
      slots: [
        { id: "tue-1", start: "05:00 PM", end: "07:00 PM", status: "Available" },
      ],
    },
    {
      day: "Wednesday",
      slots: [
        { id: "wed-1", start: "09:00 AM", end: "01:00 PM", status: "Available" },
      ],
    },
    {
      day: "Thursday",
      slots: [
        { id: "thu-1", start: "04:00 PM", end: "05:00 PM", status: "Booked" },
        { id: "thu-2", start: "05:00 PM", end: "08:00 PM", status: "Available" },
      ],
    },
    {
      day: "Friday",
      slots: [],
      isUnavailable: true,
    },
    {
      day: "Saturday",
      slots: [
        { id: "sat-1", start: "02:00 PM", end: "06:00 PM", status: "Available" },
      ],
    },
    {
      day: "Sunday",
      slots: [],
      isUnavailable: true,
    },
  ],
  upcomingSessions: [
    {
      id: "ses-1",
      studentName: "Ahmed Ali",
      subject: "Mathematics",
      date: "Sep 15, 2026",
      time: "5:00 PM",
      sessionType: "Private",
      status: "Confirmed",
    },
    {
      id: "ses-2",
      studentName: "Mariam Hassan",
      subject: "Mathematics",
      date: "Sep 16, 2026",
      time: "4:00 PM",
      sessionType: "Private",
      status: "Confirmed",
    },
    {
      id: "ses-3",
      studentName: "Omar Khaled",
      subject: "Mathematics",
      date: "Sep 18, 2026",
      time: "6:00 PM",
      sessionType: "Group",
      status: "Pending",
    },
  ],
  previousSessions: [
    {
      id: "ses-4",
      studentName: "Ahmed Ali",
      subject: "Mathematics",
      date: "Sep 8, 2026",
      time: "5:00 PM",
      sessionType: "Private",
      status: "Completed",
    },
    {
      id: "ses-5",
      studentName: "Mariam Hassan",
      subject: "Mathematics",
      date: "Sep 5, 2026",
      time: "4:00 PM",
      sessionType: "Private",
      status: "Completed",
    },
  ],
}

export function getTeacherProfile(id: string): TeacherProfile {
  // If id matches or fallback to default
  return {
    ...defaultTeacherProfile,
    id: id || "TCH-1024",
    code: id || "TCH-1024",
  }
}
