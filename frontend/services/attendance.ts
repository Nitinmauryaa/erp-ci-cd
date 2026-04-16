import api from "./api";
import { API_ENDPOINTS } from "@/config/api";
import { unwrapListResponse } from "./helpers";

export const attendanceService = {
  async list(params?: Record<string, string | number>) {
    const response = await api.get(API_ENDPOINTS.ATTENDANCE.BASE, { params });
    return unwrapListResponse(response.data);
  },
  async mark(payload: Record<string, unknown>) {
    const response = await api.post(API_ENDPOINTS.ATTENDANCE.MARK, payload);
    return response.data;
  },
  async update(id: string | number, payload: Record<string, unknown>) {
    const response = await api.put(API_ENDPOINTS.ATTENDANCE.BY_ID(String(id)), payload);
    return response.data;
  },
  async remove(id: string | number) {
    const response = await api.delete(API_ENDPOINTS.ATTENDANCE.BY_ID(String(id)));
    return response.data;
  },
  async byStudent(studentId: string) {
    const response = await api.get(API_ENDPOINTS.ATTENDANCE.BY_STUDENT(studentId));
    return unwrapListResponse(response.data);
  },
};
