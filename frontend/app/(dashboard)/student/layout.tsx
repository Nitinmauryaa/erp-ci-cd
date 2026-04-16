"use client";

import { type ReactNode } from "react";
import { AuthGuard } from "@/contexts/auth-context";
import { DashboardLayout } from "@/components/layout";

// ============================================
// STUDENT LAYOUT
// ============================================
export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard allowedRoles={["student"]}>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
