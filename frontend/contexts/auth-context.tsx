"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { User, UserRole, LoginCredentials, AuthState } from "@/types";
import { authApi } from "@/lib/api";

// ============================================
// DEMO MODE - Mock Users for Testing UI
// Set to false when connecting to real backend
// ============================================
const DEMO_MODE = false;

const DEMO_USERS: Record<string, { password: string; user: User }> = {
  "admin@college.edu": {
    password: "admin123",
    user: {
      id: "demo-admin-1",
      email: "admin@college.edu",
      role: "admin",
      firstName: "John",
      lastName: "Administrator",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  "faculty@college.edu": {
    password: "faculty123",
    user: {
      id: "demo-faculty-1",
      email: "faculty@college.edu",
      role: "faculty",
      firstName: "Jane",
      lastName: "Professor",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  "student@college.edu": {
    password: "student123",
    user: {
      id: "demo-student-1",
      email: "student@college.edu",
      role: "student",
      firstName: "Alex",
      lastName: "Student",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  "accountant@college.edu": {
    password: "acc123",
    user: {
      id: "demo-accountant-1",
      email: "accountant@college.edu",
      role: "accountant",
      firstName: "Sarah",
      lastName: "Finance",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
};

// ============================================
// AUTH CONTEXT TYPES
// ============================================
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

// ============================================
// AUTH CONTEXT
// ============================================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// AUTH PROVIDER
// ============================================
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);
  const router = useRouter();

  // Check authentication on mount
  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setState({ ...initialState, isLoading: false });
        return;
      }

      // Demo mode - restore user from localStorage
      if (DEMO_MODE) {
        const storedUser = localStorage.getItem("demoUser");
        if (storedUser) {
          const user = JSON.parse(storedUser) as User;
          setState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          return;
        }
      }

      const user = await authApi.getCurrentUser();
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      // Clear invalid token
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("demoUser");
      setState({ ...initialState, isLoading: false });
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login function
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setState((prev) => ({ ...prev, isLoading: true }));
      
      // Demo mode - authenticate with mock users
      if (DEMO_MODE) {
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay
        
        const demoUser = DEMO_USERS[credentials.email.toLowerCase()];
        if (demoUser && demoUser.password === credentials.password) {
          localStorage.setItem("accessToken", "demo-token-" + demoUser.user.id);
          localStorage.setItem("refreshToken", "demo-refresh-token");
          localStorage.setItem("demoUser", JSON.stringify(demoUser.user));
          
          setState({
            user: demoUser.user,
            token: "demo-token-" + demoUser.user.id,
            isAuthenticated: true,
            isLoading: false,
          });
          
          const redirectPath = getRedirectPath(demoUser.user.role);
          router.push(redirectPath);
          return;
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
          throw new Error("Invalid email or password");
        }
      }
      
      // Real API mode
      try {
        const response = await authApi.login(credentials);
        
        // Store tokens
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);

        setState({
          user: response.user,
          token: response.accessToken,
          isAuthenticated: true,
          isLoading: false,
        });

        // Redirect based on role
        const redirectPath = getRedirectPath(response.user.role);
        router.push(redirectPath);
      } catch (error) {
        setState((prev) => ({ ...prev, isLoading: false }));
        throw error;
      }
    },
    [router]
  );

  // Logout function
  const logout = useCallback(async () => {
    try {
      if (!DEMO_MODE) {
        await authApi.logout();
      }
    } catch {
      // Continue with logout even if API call fails
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("demoUser");
      setState({ ...initialState, isLoading: false });
      router.push("/login");
    }
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ============================================
// USE AUTH HOOK
// ============================================
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function getRedirectPath(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "faculty":
      return "/faculty";
    case "student":
      return "/student";
    case "accountant":
      return "/accountant";
    default:
      return "/";
  }
}

// ============================================
// AUTH GUARD COMPONENT
// ============================================
interface AuthGuardProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  fallback?: ReactNode;
}

export function AuthGuard({ children, allowedRoles, fallback }: AuthGuardProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && allowedRoles && user) {
      if (!allowedRoles.includes(user.role)) {
        router.push("/unauthorized");
      }
    }
  }, [isLoading, isAuthenticated, allowedRoles, user, router]);

  if (isLoading) {
    return fallback || <AuthLoadingSkeleton />;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}

// ============================================
// AUTH LOADING SKELETON
// ============================================
function AuthLoadingSkeleton() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
