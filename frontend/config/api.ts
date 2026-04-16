// ============================================
// API CONFIGURATION
// ============================================

// Base URL for your FastAPI backend
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export const API_VERSION = "v1";
export const API_URL = `${API_BASE_URL}/api/${API_VERSION}`;

// ============================================
// API ENDPOINTS
// ============================================
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    ME: "/auth/me",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },
  
  // Users
  USERS: {
    BASE: "/users",
    BY_ID: (id: string) => `/users/${id}`,
    CHANGE_PASSWORD: (id: string) => `/users/${id}/change-password`,
  },
  
  // Students
  STUDENTS: {
    BASE: "/students",
    BY_ID: (id: string) => `/students/${id}`,
    SEARCH: "/students/search",
    BY_COURSE: (courseId: string) => `/students/course/${courseId}`,
    BY_DEPARTMENT: (deptId: string) => `/students/department/${deptId}`,
  },
  
  // Faculty
  FACULTY: {
    BASE: "/faculty",
    BY_ID: (id: string) => `/faculty/${id}`,
    SEARCH: "/faculty/search",
    BY_DEPARTMENT: (deptId: string) => `/faculty/department/${deptId}`,
    ASSIGN_SUBJECTS: (id: string) => `/faculty/${id}/subjects`,
    ASSIGN_COURSES: (id: string) => `/faculty/${id}/courses`,
  },
  
  // Departments
  DEPARTMENTS: {
    BASE: "/departments",
    BY_ID: (id: string) => `/departments/${id}`,
  },
  
  // Courses
  COURSES: {
    BASE: "/courses",
    BY_ID: (id: string) => `/courses/${id}`,
    BY_DEPARTMENT: (deptId: string) => `/courses/department/${deptId}`,
  },
  
  // Subjects
  SUBJECTS: {
    BASE: "/subjects",
    BY_ID: (id: string) => `/subjects/${id}`,
    BY_COURSE: (courseId: string) => `/subjects/course/${courseId}`,
  },
  
  // Attendance
  ATTENDANCE: {
    BASE: "/attendance",
    BY_ID: (id: string) => `/attendance/${id}`,
    MARK: "/attendance/mark",
    BY_STUDENT: (studentId: string) => `/attendance/student/${studentId}`,
    BY_SUBJECT: (subjectId: string) => `/attendance/subject/${subjectId}`,
    REPORT: "/attendance/report",
    SUMMARY: (studentId: string) => `/attendance/summary/${studentId}`,
  },
  
  // Marks
  MARKS: {
    BASE: "/marks",
    BY_ID: (id: string) => `/marks/${id}`,
    UPLOAD: "/marks/upload",
    BY_STUDENT: (studentId: string) => `/marks/student/${studentId}`,
    BY_SUBJECT: (subjectId: string) => `/marks/subject/${subjectId}`,
    PUBLISH: "/marks/publish",
  },
  
  // Results
  RESULTS: {
    BASE: "/results",
    BY_STUDENT: (studentId: string) => `/results/student/${studentId}`,
    GENERATE: "/results/generate",
    PUBLISH: "/results/publish",
    DOWNLOAD: (resultId: string) => `/results/${resultId}/download`,
  },
  
  // Fees
  FEES: {
    BASE: "/fees",
    BY_ID: (id: string) => `/fees/${id}`,
    BY_STUDENT: (studentId: string) => `/fees/student/${studentId}`,
    COLLECT: "/fees/collect",
    PENDING: "/fees/pending",
    OVERDUE: "/fees/overdue",
    RECEIPT: (feeId: string) => `/fees/${feeId}/receipt`,
    SUMMARY: "/fees/summary",
  },
  
  // Timetable
  TIMETABLE: {
    BASE: "/timetable",
    BY_ID: (id: string) => `/timetable/${id}`,
    BY_COURSE: (courseId: string) => `/timetable/course/${courseId}`,
    BY_FACULTY: (facultyId: string) => `/timetable/faculty/${facultyId}`,
    BY_STUDENT: (studentId: string) => `/timetable/student/${studentId}`,
  },
  
  // Notifications
  NOTIFICATIONS: {
    BASE: "/notifications",
    BY_ID: (id: string) => `/notifications/${id}`,
    SEND: "/notifications/send",
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    UNREAD_COUNT: "/notifications/unread-count",
  },
  
  // Reports
  REPORTS: {
    ATTENDANCE: "/reports/attendance",
    FEES: "/reports/fees",
    RESULTS: "/reports/results",
    STUDENTS: "/reports/students",
  },
  
  // Dashboard
  DASHBOARD: {
    ADMIN: "/dashboard/admin",
    FACULTY: "/dashboard/faculty",
    STUDENT: "/dashboard/student",
    ACCOUNTANT: "/dashboard/accountant",
  },
} as const;

// ============================================
// REQUEST TIMEOUT
// ============================================
export const REQUEST_TIMEOUT = 30000; // 30 seconds

// ============================================
// PAGINATION DEFAULTS
// ============================================
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMIT_OPTIONS: [10, 25, 50, 100],
} as const;
