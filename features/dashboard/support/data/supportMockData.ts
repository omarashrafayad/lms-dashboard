import {
  SupportStats,
  SupportTicket,
  FaqItem,
  SystemServiceStatus,
} from "../types/support.types"

export const INITIAL_SUPPORT_STATS: SupportStats = {
  totalTickets: 142,
  openTickets: 12,
  inProgressTickets: 8,
  resolvedCount: 122,
  avgResponseTime: "18m",
  satisfactionRate: 98.4,
}

export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: "TICK-1048",
    subject: "Video playback stalling for Term 2 Biology Lesson 4",
    description:
      "Several students on the standard plan reported that the 1080p stream pauses frequently around the 12-minute mark. Need video re-encoding or CDN verification.",
    category: "Curriculum & Video",
    priority: "High",
    status: "Open",
    requester: {
      name: "Tariq Mansour",
      email: "tariq.mansour@alnoor.edu",
      role: "Biology Teacher",
    },
    assignedTo: {
      name: "Dina Farouk",
    },
    createdAt: "2026-10-13 11:20",
    updatedAt: "25m ago",
    messagesCount: 3,
    messages: [
      {
        id: "m-1",
        author: "Tariq Mansour",
        authorRole: "Instructor",
        content:
          "Hello support team, my students in secondary grade 2 report that Lesson 4 video buffers repeatedly at minute 12:40. Could you please check the CDN transcode?",
        createdAt: "Today at 11:20 AM",
        isStaff: false,
      },
      {
        id: "m-2",
        author: "Dina Farouk",
        authorRole: "Support Specialist",
        content:
          "Hi Tariq, we are reviewing the source transcode file now on AWS CloudFront. We will trigger an automatic cache refresh.",
        createdAt: "Today at 11:35 AM",
        isStaff: true,
      },
    ],
  },
  {
    id: "TICK-1047",
    subject: "Invoice receipt PDF missing institution tax identification number",
    description:
      "When exporting transaction TXN-9402, the printed invoice displays the general header but lacks the custom VAT/Tax ID configured under organization billing settings.",
    category: "Billing & Subscriptions",
    priority: "Medium",
    status: "In Progress",
    requester: {
      name: "Nadia El-Sayed",
      email: "nadia.finance@future-academy.org",
      role: "Finance Director",
    },
    assignedTo: {
      name: "Karim Adel",
    },
    createdAt: "2026-10-13 09:45",
    updatedAt: "1h ago",
    messagesCount: 2,
    messages: [
      {
        id: "m-3",
        author: "Nadia El-Sayed",
        authorRole: "Admin",
        content:
          "Our accounting department rejected the receipt generated this morning because the Tax ID field was left blank. Can this be regenerated with our school Tax ID # 492-108-331?",
        createdAt: "Today at 09:45 AM",
        isStaff: false,
      },
    ],
  },
  {
    id: "TICK-1046",
    subject: "Excel template bulk student import errors on Arabic names",
    description:
      "Uploading the 120-student roster gives an encoding error on rows with diacritics. Need UTF-8 BOM compatibility or template update.",
    category: "Student Accounts",
    priority: "Urgent",
    status: "Open",
    requester: {
      name: "Mahmoud Hassan",
      email: "m.hassan@modernschools.com",
      role: "System Admin",
    },
    createdAt: "2026-10-13 08:15",
    updatedAt: "2h ago",
    messagesCount: 1,
    messages: [
      {
        id: "m-4",
        author: "Mahmoud Hassan",
        authorRole: "Admin",
        content:
          "When uploading our semester intake via Excel, student full names with hamza or shaddah get rejected with 'Invalid character encoding'. Sample file attached.",
        createdAt: "Today at 08:15 AM",
        isStaff: false,
      },
    ],
  },
  {
    id: "TICK-1045",
    subject: "LaTeX math formulas not rendering in Question 14 of Midterm Quiz",
    description:
      "KaTeX math symbols display raw code syntax rather than formatted fractions and square roots in student exam preview mode.",
    category: "Exams & Grading",
    priority: "High",
    status: "In Progress",
    requester: {
      name: "Dr. Sarah Kamal",
      email: "s.kamal@stem-cairo.edu",
      role: "Math Head",
    },
    assignedTo: {
      name: "Dina Farouk",
    },
    createdAt: "2026-10-12 16:30",
    updatedAt: "4h ago",
    messagesCount: 4,
    messages: [
      {
        id: "m-5",
        author: "Dr. Sarah Kamal",
        authorRole: "Instructor",
        content:
          "In Quiz #3, question 14 has syntax `\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}` which is shown as unparsed text.",
        createdAt: "Yesterday at 4:30 PM",
        isStaff: false,
      },
      {
        id: "m-6",
        author: "Dina Farouk",
        authorRole: "Support Specialist",
        content:
          "Thank you Dr. Sarah. We identified an escape character issue during quiz import. A patch is deploying to resolve the equation rendering.",
        createdAt: "Yesterday at 5:10 PM",
        isStaff: true,
      },
    ],
  },
  {
    id: "TICK-1044",
    subject: "Offline download quota expansion request for Computer Lab #2",
    description:
      "School computer lab requires caching up to 80 lessons locally due to intermittent campus fiber link during renovation.",
    category: "Curriculum & Video",
    priority: "Low",
    status: "Resolved",
    requester: {
      name: "Ahmed Zaki",
      email: "it.zaki@delta-edu.net",
      role: "IT Coordinator",
    },
    assignedTo: {
      name: "Karim Adel",
    },
    createdAt: "2026-10-11 14:00",
    updatedAt: "1d ago",
    messagesCount: 3,
    messages: [
      {
        id: "m-7",
        author: "Ahmed Zaki",
        authorRole: "Admin",
        content:
          "We are doing campus rewiring next week and need permission to pre-cache all Chapter 3 & 4 videos across our 40 lab machines.",
        createdAt: "Oct 11 at 2:00 PM",
        isStaff: false,
      },
      {
        id: "m-8",
        author: "Karim Adel",
        authorRole: "Support Specialist",
        content:
          "Quota has been elevated to 100 offline downloads for your organization token. Valid through end of the month.",
        createdAt: "Oct 11 at 3:15 PM",
        isStaff: true,
      },
    ],
  },
  {
    id: "TICK-1043",
    subject: "Webhook signature verification error on automated plan renewals",
    description:
      "Stripe payment gateway callback endpoint reported HTTP 400 signature mismatch for recurrent subscriber billing batch.",
    category: "Technical & Platform",
    priority: "High",
    status: "Resolved",
    requester: {
      name: "DevOps Integration",
      email: "integrations@lmssite.com",
      role: "System Bot",
    },
    createdAt: "2026-10-10 03:22",
    updatedAt: "2d ago",
    messagesCount: 2,
  },
  {
    id: "TICK-1042",
    subject: "Teacher permission to publish newly added Chemistry chapters",
    description:
      "Assistant teacher role lacks publish permission toggle for unit content without principal secondary approval.",
    category: "General Inquiry",
    priority: "Low",
    status: "Closed",
    requester: {
      name: "Fatima Nour",
      email: "fatima.nour@school.edu",
      role: "Teacher Assistant",
    },
    createdAt: "2026-10-09 11:10",
    updatedAt: "3d ago",
    messagesCount: 2,
  },
]

export const SUPPORT_FAQS: FaqItem[] = [
  {
    id: "faq-1",
    category: "Curriculum & Video Playback",
    question: "What video formats and maximum file sizes are supported for lesson uploads?",
    answer:
      "The platform supports MP4 (H.264 / AAC codec recommended), WebM, and QuickTime MOV containers up to 2 GB per video file. Upon upload, the platform transcode engine automatically encodes adaptive multi-bitrate streams (360p, 480p, 720p, 1080p) and generates thumbnails.",
  },
  {
    id: "faq-2",
    category: "Curriculum & Video Playback",
    question: "How does offline video download protection work?",
    answer:
      "When 'Offline Download' is enabled on a lesson, authorized students can save encrypted media files directly to the LMS mobile or desktop application. Files are encrypted with AES-128 and tied to the student's active enrollment token, preventing file copying outside the app.",
  },
  {
    id: "faq-3",
    category: "Subscriptions & Invoicing",
    question: "How do I process a refund or adjust a subscriber's billing term?",
    answer:
      "Navigate to Subscriptions > Transactions & Invoices. Locate the target transaction and click the refund icon. You can issue a full or partial refund with an audit reason. The subscriber's access will automatically adjust according to plan renewal rules.",
  },
  {
    id: "faq-4",
    category: "Subscriptions & Invoicing",
    question: "What happens when a subscriber's manual bank transfer is pending review?",
    answer:
      "Bank transfer and cashier deposit receipts appear under Offline Payment Requests. Administrators can inspect the attached deposit slip image, compare reference numbers, and click 'Approve & Activate' to instantaneously assign the selected subscription plan.",
  },
  {
    id: "faq-5",
    category: "Exams & Grading",
    question: "Can I randomize question order and option choices for each student?",
    answer:
      "Yes. When editing an Exam or Lesson Quiz in the Quiz Settings panel, toggle 'Shuffle Questions' and 'Shuffle Answer Choices'. Each student will receive a unique seed while preserving identical scoring metrics and passing criteria.",
  },
  {
    id: "faq-6",
    category: "Platform Access & Security",
    question: "How can I invite new teachers and restrict them to specific subjects?",
    answer:
      "Go to Users > Teachers and click 'Add Teacher'. Select the assigned education stage, grades, and specific curriculum subjects. You can choose whether they have full authoring permissions or view-only grading access.",
  },
  {
    id: "faq-7",
    category: "Platform Access & Security",
    question: "What should I do if a student forgets their password or cannot log in?",
    answer:
      "Under Users > Students, locate the student record and select 'Reset Credentials'. You can either send an instant magic reset link to their registered email or generate a temporary one-time password.",
  },
]

export const SYSTEM_SERVICES_STATUS: SystemServiceStatus[] = [
  {
    id: "srv-1",
    name: "Video CDN & Streaming Delivery",
    category: "Edge Network (Akamai & Cloudflare)",
    status: "Operational",
    uptime: "99.99%",
    latency: "24 ms",
    lastChecked: "Just now",
  },
  {
    id: "srv-2",
    name: "Core API & GraphQL Gateway",
    category: "Kubernetes Cluster / App Engine",
    status: "Operational",
    uptime: "99.98%",
    latency: "38 ms",
    lastChecked: "1 min ago",
  },
  {
    id: "srv-3",
    name: "Primary Relational Database & Read Replicas",
    category: "PostgreSQL High-Availability",
    status: "Operational",
    uptime: "100.0%",
    latency: "8 ms",
    lastChecked: "Just now",
  },
  {
    id: "srv-4",
    name: "PDF Receipt & Worksheet Generation Service",
    category: "Headless Rendering Node Pool",
    status: "Operational",
    uptime: "99.95%",
    latency: "94 ms",
    lastChecked: "2 mins ago",
  },
  {
    id: "srv-5",
    name: "Payment Gateways (Stripe, Paymob, Fawry)",
    category: "External Integration Webhooks",
    status: "Operational",
    uptime: "99.99%",
    latency: "76 ms",
    lastChecked: "Just now",
  },
  {
    id: "srv-6",
    name: "SMS & WhatsApp OTP Verification Network",
    category: "Twilio & Local Telecom Providers",
    status: "Operational",
    uptime: "99.82%",
    latency: "240 ms",
    lastChecked: "3 mins ago",
  },
]
