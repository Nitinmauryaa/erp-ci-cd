"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Loader2 } from "lucide-react";

// ============================================
// ROOT PAGE - Redirects based on auth status
// ============================================
export default function RootPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Redirect based on role
    switch (user?.role) {
      case "admin":
        router.push("/admin");
        break;
      case "faculty":
        router.push("/faculty");
        break;
      case "student":
        router.push("/student");
        break;
      case "accountant":
        router.push("/accountant");
        break;
      default:
        router.push("/login");
    }
  }, [isAuthenticated, isLoading, user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
}
