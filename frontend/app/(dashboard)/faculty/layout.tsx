"use client";

import { type ReactNode } from "react";
import { AuthGuard } from "@/contexts/auth-context";
import { DashboardLayout } from "@/components/layout";

// ============================================
// FACULTY LAYOUT
// ============================================
export default function FacultyLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard allowedRoles={["faculty"]}>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
