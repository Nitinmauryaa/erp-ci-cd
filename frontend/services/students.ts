import api from "./api";
import { API_ENDPOINTS } from "@/config/api";

export const studentsService = {
  async list(params?: Record<string, string | number>) {
    const response = await api.get(API_ENDPOINTS.STUDENTS.BASE, { params });
    return response.data;
  },
  async getById(id: string) {
    const response = await api.get(API_ENDPOINTS.STUDENTS.BY_ID(id));
    return response.data;
  },
  async create(payload: Record<string, unknown>) {
    const response = await api.post(API_ENDPOINTS.STUDENTS.BASE, payload);
    return response.data;
  },
  async update(id: string, payload: Record<string, unknown>) {
    const response = await api.put(API_ENDPOINTS.STUDENTS.BY_ID(id), payload);
    return response.data;
  },
  async remove(id: string) {
    const response = await api.delete(API_ENDPOINTS.STUDENTS.BY_ID(id));
    return response.data;
  },
};
