"use client";

import { type ReactNode } from "react";
import { AuthGuard } from "@/contexts/auth-context";
import { DashboardLayout } from "@/components/layout";

// ============================================
// ADMIN LAYOUT
// ============================================
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard allowedRoles={["admin"]}>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
