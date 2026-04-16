import api from "./api";
import { API_ENDPOINTS } from "@/config/api";
import { unwrapListResponse } from "./helpers";

export const subjectsService = {
  async list(params?: Record<string, string | number>) {
    const response = await api.get(API_ENDPOINTS.SUBJECTS.BASE, { params });
    return unwrapListResponse(response.data);
  },
  async create(payload: Record<string, unknown>) {
    const response = await api.post(API_ENDPOINTS.SUBJECTS.BASE, payload);
    return response.data;
  },
  async update(id: string | number, payload: Record<string, unknown>) {
    const response = await api.put(API_ENDPOINTS.SUBJECTS.BY_ID(String(id)), payload);
    return response.data;
  },
  async remove(id: string | number) {
    const response = await api.delete(API_ENDPOINTS.SUBJECTS.BY_ID(String(id)));
    return response.data;
  },
};
