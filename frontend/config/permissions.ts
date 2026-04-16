import type { UserRole } from "@/types";

// ============================================
// PERMISSION DEFINITIONS
// ============================================
export const PERMISSIONS = {
  // Student permissions
  STUDENTS_VIEW: "students:view",
  STUDENTS_CREATE: "students:create",
  STUDENTS_EDIT: "students:edit",
  STUDENTS_DELETE: "students:delete",
  
  // Faculty permissions
  FACULTY_VIEW: "faculty:view",
  FACULTY_CREATE: "faculty:create",
  FACULTY_EDIT: "faculty:edit",
  FACULTY_DELETE: "faculty:delete",
  
  // Department permissions
  DEPARTMENTS_VIEW: "departments:view",
  DEPARTMENTS_CREATE: "departments:create",
  DEPARTMENTS_EDIT: "departments:edit",
  DEPARTMENTS_DELETE: "departments:delete",
  
  // Course permissions
  COURSES_VIEW: "courses:view",
  COURSES_CREATE: "courses:create",
  COURSES_EDIT: "courses:edit",
  COURSES_DELETE: "courses:delete",
  
  // Subject permissions
  SUBJECTS_VIEW: "subjects:view",
  SUBJECTS_CREATE: "subjects:create",
  SUBJECTS_EDIT: "subjects:edit",
  SUBJECTS_DELETE: "subjects:delete",
  
  // Attendance permissions
  ATTENDANCE_VIEW: "attendance:view",
  ATTENDANCE_MARK: "attendance:mark",
  ATTENDANCE_EDIT: "attendance:edit",
  ATTENDANCE_REPORTS: "attendance:reports",
  
  // Marks permissions
  MARKS_VIEW: "marks:view",
  MARKS_UPLOAD: "marks:upload",
  MARKS_EDIT: "marks:edit",
  MARKS_PUBLISH: "marks:publish",
  
  // Results permissions
  RESULTS_VIEW: "results:view",
  RESULTS_GENERATE: "results:generate",
  RESULTS_PUBLISH: "results:publish",
  
  // Fees permissions
  FEES_VIEW: "fees:view",
  FEES_COLLECT: "fees:collect",
  FEES_EDIT: "fees:edit",
  FEES_REPORTS: "fees:reports",
  FEES_RECEIPT: "fees:receipt",
  
  // Timetable permissions
  TIMETABLE_VIEW: "timetable:view",
  TIMETABLE_CREATE: "timetable:create",
  TIMETABLE_EDIT: "timetable:edit",
  
  // Reports permissions
  REPORTS_VIEW: "reports:view",
  REPORTS_GENERATE: "reports:generate",
  REPORTS_EXPORT: "reports:export",
  
  // Notifications permissions
  NOTIFICATIONS_VIEW: "notifications:view",
  NOTIFICATIONS_SEND: "notifications:send",
  NOTIFICATIONS_MANAGE: "notifications:manage",
  
  // Settings permissions
  SETTINGS_VIEW: "settings:view",
  SETTINGS_EDIT: "settings:edit",
  USERS_MANAGE: "users:manage",
  ROLES_MANAGE: "roles:manage",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// ============================================
// ROLE-BASED PERMISSIONS
// ============================================
export const rolePermissions: Record<UserRole, Permission[]> = {
  admin: Object.values(PERMISSIONS), // Admin has all permissions
  
  faculty: [
    PERMISSIONS.STUDENTS_VIEW,
    PERMISSIONS.COURSES_VIEW,
    PERMISSIONS.SUBJECTS_VIEW,
    PERMISSIONS.ATTENDANCE_VIEW,
    PERMISSIONS.ATTENDANCE_MARK,
    PERMISSIONS.ATTENDANCE_EDIT,
    PERMISSIONS.MARKS_VIEW,
    PERMISSIONS.MARKS_UPLOAD,
    PERMISSIONS.MARKS_EDIT,
    PERMISSIONS.RESULTS_VIEW,
    PERMISSIONS.TIMETABLE_VIEW,
    PERMISSIONS.NOTIFICATIONS_VIEW,
  ],
  
  student: [
    PERMISSIONS.COURSES_VIEW,
    PERMISSIONS.SUBJECTS_VIEW,
    PERMISSIONS.ATTENDANCE_VIEW,
    PERMISSIONS.MARKS_VIEW,
    PERMISSIONS.RESULTS_VIEW,
    PERMISSIONS.FEES_VIEW,
    PERMISSIONS.TIMETABLE_VIEW,
    PERMISSIONS.NOTIFICATIONS_VIEW,
  ],
  
  accountant: [
    PERMISSIONS.STUDENTS_VIEW,
    PERMISSIONS.FEES_VIEW,
    PERMISSIONS.FEES_COLLECT,
    PERMISSIONS.FEES_EDIT,
    PERMISSIONS.FEES_REPORTS,
    PERMISSIONS.FEES_RECEIPT,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_GENERATE,
    PERMISSIONS.REPORTS_EXPORT,
    PERMISSIONS.NOTIFICATIONS_VIEW,
  ],
};

// ============================================
// PERMISSION UTILITIES
// ============================================
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}

export function getPermissionsForRole(role: UserRole): Permission[] {
  return rolePermissions[role] || [];
}

// ============================================
// ROUTE PERMISSIONS
// ============================================
export const routePermissions: Record<string, Permission[]> = {
  "/admin/students": [PERMISSIONS.STUDENTS_VIEW],
  "/admin/students/create": [PERMISSIONS.STUDENTS_CREATE],
  "/admin/faculty": [PERMISSIONS.FACULTY_VIEW],
  "/admin/faculty/create": [PERMISSIONS.FACULTY_CREATE],
  "/admin/departments": [PERMISSIONS.DEPARTMENTS_VIEW],
  "/admin/courses": [PERMISSIONS.COURSES_VIEW],
  "/admin/subjects": [PERMISSIONS.SUBJECTS_VIEW],
  "/admin/attendance": [PERMISSIONS.ATTENDANCE_VIEW, PERMISSIONS.ATTENDANCE_MARK],
  "/admin/marks": [PERMISSIONS.MARKS_VIEW, PERMISSIONS.MARKS_UPLOAD],
  "/admin/results": [PERMISSIONS.RESULTS_VIEW, PERMISSIONS.RESULTS_GENERATE],
  "/admin/fees": [PERMISSIONS.FEES_VIEW, PERMISSIONS.FEES_COLLECT],
  "/admin/timetable": [PERMISSIONS.TIMETABLE_VIEW, PERMISSIONS.TIMETABLE_CREATE],
  "/admin/reports": [PERMISSIONS.REPORTS_VIEW, PERMISSIONS.REPORTS_GENERATE],
  "/admin/settings": [PERMISSIONS.SETTINGS_VIEW, PERMISSIONS.SETTINGS_EDIT],
  "/admin/notifications": [PERMISSIONS.NOTIFICATIONS_VIEW, PERMISSIONS.NOTIFICATIONS_SEND],
};

export function canAccessRoute(role: UserRole, route: string): boolean {
  const requiredPermissions = routePermissions[route];
  if (!requiredPermissions) return true; // No permissions required
  return hasAnyPermission(role, requiredPermissions);
}
