import type { ApiResponse, AuthResponse, LoginCredentials, User } from "@/types";
import { authService } from "@/services/auth";

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => authService.login(credentials),
  logout: async (): Promise<void> => authService.logout(),
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const tokens = await authService.refresh(refreshToken);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: await authService.me(),
    };
  },
  getCurrentUser: async (): Promise<User> => authService.me(),
  register: authService.register,
  forgotPassword: async (): Promise<ApiResponse<null>> => {
    throw new Error("Forgot password endpoint is not implemented on backend yet.");
  },
  resetPassword: async (): Promise<ApiResponse<null>> => {
    throw new Error("Reset password endpoint is not implemented on backend yet.");
  },
};
