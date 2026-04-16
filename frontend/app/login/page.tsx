"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  GraduationCap, 
  Loader2, 
  AlertCircle, 
  ShieldCheck, 
  Users, 
  GraduationCapIcon, 
  Calculator,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import type { UserRole } from "@/types";

const ROLE_CONFIG = {
  admin: {
    label: "Administrator",
    icon: ShieldCheck,
    email: "admin@college.edu",
    password: "admin123",
    description: "Full system access",
    color: "from-primary to-primary/70",
  },
  faculty: {
    label: "Faculty",
    icon: Users,
    email: "faculty@college.edu",
    password: "faculty123",
    description: "Manage attendance & marks",
    color: "from-chart-2 to-chart-2/70",
  },
  student: {
    label: "Student",
    icon: GraduationCapIcon,
    email: "student@college.edu",
    password: "student123",
    description: "View grades & attendance",
    color: "from-chart-3 to-chart-3/70",
  },
  accountant: {
    label: "Accountant",
    icon: Calculator,
    email: "accountant@college.edu",
    password: "acc123",
    description: "Manage fees & payments",
    color: "from-chart-4 to-chart-4/70",
  },
} as const;

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    const config = ROLE_CONFIG[role];
    setEmail(config.email);
    setPassword(config.password);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login({ email, password });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Invalid email or password";
      setError(errorMessage);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/80 p-12 lg:flex">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-4 -top-4 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        </div>
        
        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">College ERP</h1>
            <p className="text-xs text-white/70">Management System</p>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative space-y-6">
          <h2 className="text-4xl font-bold leading-tight text-white text-balance">
            Streamline Your Institution&apos;s Management
          </h2>
          <p className="text-lg text-white/80 max-w-md">
            A comprehensive ERP solution for managing students, faculty, attendance, fees, and academic records.
          </p>
          
          {/* Features */}
          <div className="space-y-3 pt-4">
            {[
              "Complete Student Management",
              "Attendance & Marks Tracking",
              "Fee Collection & Reports",
              "Multi-role Access Control"
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3 text-white/90">
                <CheckCircle2 className="h-5 w-5 text-white/70" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative text-sm text-white/60">
          <p>Trusted by 100+ educational institutions worldwide</p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex flex-1 flex-col justify-center bg-background px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="mb-8 flex flex-col items-center lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <GraduationCap className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="mt-4 text-2xl font-bold">College ERP</h1>
          </div>

          <div className="mb-8 hidden lg:block">
            <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Select your role and sign in to continue
            </p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Select Role
            </Label>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {(Object.keys(ROLE_CONFIG) as UserRole[]).map((role) => {
                const config = ROLE_CONFIG[role];
                const Icon = config.icon;
                const isSelected = selectedRole === role;
                
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleSelect(role)}
                    className={`group relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200 ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/50 hover:bg-muted/50"
                    }`}
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${config.color} text-white transition-transform group-hover:scale-110`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">{config.label}</span>
                    {isSelected && (
                      <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <CheckCircle2 className="h-3 w-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Login Form */}
          <Card className="border-0 shadow-none bg-transparent">
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 px-0">
                {error && (
                  <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-11 bg-muted/50"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm">Password</Label>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-11 bg-muted/50"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="h-11 w-full text-sm font-medium"
                  disabled={isLoading || !selectedRole}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                <Button asChild variant="outline" className="h-11 w-full text-sm font-medium">
                  <Link href="/register">Create Account</Link>
                </Button>
              </CardContent>
            </form>
          </Card>

          {/* Demo Notice */}
          <div className="mt-6 flex items-center justify-center gap-2 rounded-lg border border-dashed border-primary/30 bg-primary/5 px-4 py-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Demo Mode</span> - Click a role to auto-fill credentials
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
