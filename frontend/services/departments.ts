import api from "./api";
import { API_ENDPOINTS } from "@/config/api";
import { unwrapListResponse } from "./helpers";

export const departmentsService = {
  async list(params?: Record<string, string | number>) {
    const response = await api.get(API_ENDPOINTS.DEPARTMENTS.BASE, { params });
    return unwrapListResponse(response.data);
  },
  async create(payload: Record<string, unknown>) {
    const response = await api.post(API_ENDPOINTS.DEPARTMENTS.BASE, payload);
    return response.data;
  },
  async update(id: string | number, payload: Record<string, unknown>) {
    const response = await api.put(API_ENDPOINTS.DEPARTMENTS.BY_ID(String(id)), payload);
    return response.data;
  },
  async remove(id: string | number) {
    const response = await api.delete(API_ENDPOINTS.DEPARTMENTS.BY_ID(String(id)));
    return response.data;
  },
};
