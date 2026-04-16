"use client";

import { type ReactNode } from "react";
import { AuthGuard } from "@/contexts/auth-context";
import { DashboardLayout } from "@/components/layout";

// ============================================
// ACCOUNTANT LAYOUT
// ============================================
export default function AccountantLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard allowedRoles={["accountant"]}>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
