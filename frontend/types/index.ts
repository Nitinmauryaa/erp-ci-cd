// ============================================
// USER & AUTH TYPES
// ============================================
export type UserRole = "admin" | "faculty" | "student" | "accountant";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// ============================================
// STUDENT TYPES
// ============================================
export interface Student {
  id: string;
  userId: string;
  rollNumber: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  guardianName: string;
  guardianPhone: string;
  departmentId: string;
  courseId: string;
  semester: number;
  batch: string;
  admissionDate: string;
  status: "active" | "inactive" | "graduated" | "suspended";
  avatar?: string;
}

export interface StudentFormData {
  rollNumber: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  guardianName: string;
  guardianPhone: string;
  departmentId: string;
  courseId: string;
  semester: number;
  batch: string;
}

// ============================================
// FACULTY TYPES
// ============================================
export interface Faculty {
  id: string;
  userId: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  qualification: string;
  specialization: string;
  departmentId: string;
  designation: string;
  joiningDate: string;
  status: "active" | "inactive" | "on_leave";
  avatar?: string;
  assignedSubjects: string[];
  assignedCourses: string[];
}

export interface FacultyFormData {
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  qualification: string;
  specialization: string;
  departmentId: string;
  designation: string;
}

// ============================================
// DEPARTMENT TYPES
// ============================================
export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  headOfDepartment?: string;
  establishedYear: number;
  status: "active" | "inactive";
}

// ============================================
// COURSE TYPES
// ============================================
export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  departmentId: string;
  duration: number; // in semesters
  totalCredits: number;
  status: "active" | "inactive";
}

// ============================================
// SUBJECT TYPES
// ============================================
export interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
  courseId: string;
  semester: number;
  credits: number;
  type: "theory" | "practical" | "both";
  status: "active" | "inactive";
}

// ============================================
// ATTENDANCE TYPES
// ============================================
export interface Attendance {
  id: string;
  studentId: string;
  subjectId: string;
  facultyId: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  remarks?: string;
}

export interface AttendanceRecord {
  date: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  status: "present" | "absent" | "late" | "excused";
}

export interface AttendanceSummary {
  studentId: string;
  subjectId: string;
  totalClasses: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

// ============================================
// MARKS TYPES
// ============================================
export interface Marks {
  id: string;
  studentId: string;
  subjectId: string;
  examType: "internal" | "midterm" | "final" | "assignment" | "practical";
  maxMarks: number;
  obtainedMarks: number;
  semester: number;
  academicYear: string;
  remarks?: string;
}

export interface Result {
  id: string;
  studentId: string;
  semester: number;
  academicYear: string;
  subjects: {
    subjectId: string;
    subjectName: string;
    internal: number;
    midterm: number;
    final: number;
    practical: number;
    total: number;
    grade: string;
    credits: number;
  }[];
  totalMarks: number;
  percentage: number;
  cgpa: number;
  status: "pass" | "fail" | "pending";
  publishedAt?: string;
}

// ============================================
// FEE TYPES
// ============================================
export interface Fee {
  id: string;
  studentId: string;
  feeType: "tuition" | "hostel" | "library" | "examination" | "other";
  amount: number;
  dueDate: string;
  status: "pending" | "paid" | "overdue" | "partial";
  paidAmount: number;
  paidDate?: string;
  paymentMethod?: "cash" | "card" | "upi" | "bank_transfer";
  transactionId?: string;
  semester: number;
  academicYear: string;
  remarks?: string;
}

export interface FeeReceipt {
  id: string;
  feeId: string;
  receiptNumber: string;
  studentId: string;
  amount: number;
  paidDate: string;
  paymentMethod: string;
  generatedBy: string;
}

export interface FeeSummary {
  totalFees: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
}

// ============================================
// TIMETABLE TYPES
// ============================================
export interface TimetableSlot {
  id: string;
  day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";
  startTime: string;
  endTime: string;
  subjectId: string;
  facultyId: string;
  courseId: string;
  semester: number;
  room: string;
  type: "lecture" | "practical" | "tutorial";
}

export interface Timetable {
  id: string;
  courseId: string;
  semester: number;
  academicYear: string;
  slots: TimetableSlot[];
  status: "draft" | "published";
}

// ============================================
// NOTIFICATION TYPES
// ============================================
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  targetRole: UserRole | "all";
  targetUsers?: string[];
  createdBy: string;
  createdAt: string;
  readBy: string[];
  expiresAt?: string;
}

// ============================================
// REPORT TYPES
// ============================================
export interface ReportFilter {
  startDate?: string;
  endDate?: string;
  departmentId?: string;
  courseId?: string;
  semester?: number;
  studentId?: string;
  facultyId?: string;
}

export interface AttendanceReport {
  period: string;
  totalStudents: number;
  averageAttendance: number;
  subjectWise: {
    subjectName: string;
    attendance: number;
  }[];
}

export interface FeeReport {
  period: string;
  totalCollected: number;
  totalPending: number;
  totalOverdue: number;
  collectionByMonth: {
    month: string;
    amount: number;
  }[];
}

// ============================================
// DASHBOARD TYPES
// ============================================
export interface DashboardStats {
  totalStudents: number;
  totalFaculty: number;
  totalCourses: number;
  totalDepartments: number;
  attendancePercentage: number;
  feesCollected: number;
  feesPending: number;
  recentActivities: Activity[];
}

export interface Activity {
  id: string;
  type: string;
  message: string;
  userId: string;
  userName: string;
  createdAt: string;
}

// ============================================
// API TYPES
// ============================================
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, string[]>;
}

// ============================================
// TABLE & FORM TYPES
// ============================================
export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface FilterState {
  search: string;
  status?: string;
  departmentId?: string;
  courseId?: string;
  semester?: number;
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
