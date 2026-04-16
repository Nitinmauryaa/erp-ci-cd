"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/contexts/sidebar-context";
import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content */}
      <div
        className={cn(
          "flex min-h-screen flex-col transition-all duration-300 ease-in-out",
          isCollapsed ? "lg:pl-[68px]" : "lg:pl-64"
        )}
      >
        {/* Header */}
        <AppHeader />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border px-4 py-3 text-center text-xs text-muted-foreground lg:px-6">
          <p>College ERP Management System v1.0.0</p>
        </footer>
      </div>
    </div>
  );
}
