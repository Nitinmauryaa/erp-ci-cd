import api from "./api";
import { API_ENDPOINTS } from "@/config/api";
import type { AuthResponse, LoginCredentials, User, UserRole } from "@/types";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export const authService = {
  async register(payload: RegisterPayload): Promise<{ success: boolean; message: string; data: User }> {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, payload);
    return response.data;
  },
  async login(payload: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, payload);
    return response.data;
  },
  async logout(): Promise<void> {
    await api.post(API_ENDPOINTS.AUTH.LOGOUT);
  },
  async me(): Promise<User> {
    const response = await api.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },
  async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await api.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
    return response.data;
  },
};
