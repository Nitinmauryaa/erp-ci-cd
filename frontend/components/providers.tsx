"use client";

import { type ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/auth-context";
import { SidebarProvider } from "@/contexts/sidebar-context";
import { Toaster } from "@/components/ui/sonner";

// ============================================
// APP PROVIDERS
// ============================================
interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <SidebarProvider>
          {children}
          <Toaster position="top-right" />
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
