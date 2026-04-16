import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Building2,
  ClipboardList,
  FileText,
  Calendar,
  CreditCard,
  BarChart3,
  Bell,
  Settings,
  User,
  BookMarked,
  Receipt,
  type LucideIcon,
} from "lucide-react";
import type { UserRole } from "@/types";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  children?: NavItem[];
}

export interface NavigationConfig {
  main: NavItem[];
  secondary: NavItem[];
}

// ============================================
// ADMIN NAVIGATION
// ============================================
export const adminNavigation: NavigationConfig = {
  main: [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Students",
      href: "/admin/students",
      icon: GraduationCap,
    },
    {
      title: "Faculty",
      href: "/admin/faculty",
      icon: Users,
    },
    {
      title: "Departments",
      href: "/admin/departments",
      icon: Building2,
    },
    {
      title: "Courses",
      href: "/admin/courses",
      icon: BookOpen,
    },
    {
      title: "Subjects",
      href: "/admin/subjects",
      icon: BookMarked,
    },
    {
      title: "Attendance",
      href: "/admin/attendance",
      icon: ClipboardList,
    },
    {
      title: "Marks",
      href: "/admin/marks",
      icon: FileText,
    },
    {
      title: "Results",
      href: "/admin/results",
      icon: BarChart3,
    },
    {
      title: "Fees",
      href: "/admin/fees",
      icon: CreditCard,
    },
    {
      title: "Timetable",
      href: "/admin/timetable",
      icon: Calendar,
    },
    {
      title: "Reports",
      href: "/admin/reports",
      icon: BarChart3,
    },
  ],
  secondary: [
    {
      title: "Notifications",
      href: "/admin/notifications",
      icon: Bell,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ],
};

// ============================================
// FACULTY NAVIGATION
// ============================================
export const facultyNavigation: NavigationConfig = {
  main: [
    {
      title: "Dashboard",
      href: "/faculty",
      icon: LayoutDashboard,
    },
    {
      title: "My Students",
      href: "/faculty/students",
      icon: GraduationCap,
    },
    {
      title: "Attendance",
      href: "/faculty/attendance",
      icon: ClipboardList,
    },
    {
      title: "Marks",
      href: "/faculty/marks",
      icon: FileText,
    },
    {
      title: "My Courses",
      href: "/faculty/courses",
      icon: BookOpen,
    },
    {
      title: "Timetable",
      href: "/faculty/timetable",
      icon: Calendar,
    },
  ],
  secondary: [
    {
      title: "Notifications",
      href: "/faculty/notifications",
      icon: Bell,
    },
    {
      title: "Profile",
      href: "/faculty/profile",
      icon: User,
    },
  ],
};

// ============================================
// STUDENT NAVIGATION
// ============================================
export const studentNavigation: NavigationConfig = {
  main: [
    {
      title: "Dashboard",
      href: "/student",
      icon: LayoutDashboard,
    },
    {
      title: "My Courses",
      href: "/student/courses",
      icon: BookOpen,
    },
    {
      title: "My Attendance",
      href: "/student/attendance",
      icon: ClipboardList,
    },
    {
      title: "My Results",
      href: "/student/results",
      icon: FileText,
    },
    {
      title: "My Fees",
      href: "/student/fees",
      icon: CreditCard,
    },
    {
      title: "Timetable",
      href: "/student/timetable",
      icon: Calendar,
    },
  ],
  secondary: [
    {
      title: "Notifications",
      href: "/student/notifications",
      icon: Bell,
    },
    {
      title: "Profile",
      href: "/student/profile",
      icon: User,
    },
  ],
};

// ============================================
// ACCOUNTANT NAVIGATION
// ============================================
export const accountantNavigation: NavigationConfig = {
  main: [
    {
      title: "Dashboard",
      href: "/accountant",
      icon: LayoutDashboard,
    },
    {
      title: "Fees",
      href: "/accountant/fees",
      icon: CreditCard,
    },
    {
      title: "Students",
      href: "/accountant/students",
      icon: GraduationCap,
    },
    {
      title: "Receipts",
      href: "/accountant/receipts",
      icon: Receipt,
    },
    {
      title: "Reports",
      href: "/accountant/reports",
      icon: BarChart3,
    },
  ],
  secondary: [
    {
      title: "Notifications",
      href: "/accountant/notifications",
      icon: Bell,
    },
    {
      title: "Profile",
      href: "/accountant/profile",
      icon: User,
    },
  ],
};

// ============================================
// NAVIGATION BY ROLE
// ============================================
export const navigationByRole: Record<UserRole, NavigationConfig> = {
  admin: adminNavigation,
  faculty: facultyNavigation,
  student: studentNavigation,
  accountant: accountantNavigation,
};

export function getNavigationForRole(role: UserRole): NavigationConfig {
  return navigationByRole[role] || studentNavigation;
}
