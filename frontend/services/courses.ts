import api from "./api";
import { API_ENDPOINTS } from "@/config/api";
import { unwrapListResponse } from "./helpers";

export const coursesService = {
  async list(params?: Record<string, string | number>) {
    const response = await api.get(API_ENDPOINTS.COURSES.BASE, { params });
    return unwrapListResponse(response.data);
  },
  async create(payload: Record<string, unknown>) {
    const response = await api.post(API_ENDPOINTS.COURSES.BASE, payload);
    return response.data;
  },
  async update(courseCode: string | number, payload: Record<string, unknown>) {
    const response = await api.put(API_ENDPOINTS.COURSES.BY_ID(String(courseCode)), payload);
    return response.data;
  },
  async remove(courseCode: string | number) {
    const response = await api.delete(API_ENDPOINTS.COURSES.BY_ID(String(courseCode)));
    return response.data;
  },
};
