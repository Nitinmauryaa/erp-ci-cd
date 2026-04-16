import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/config/api";
import type { ApiResponse, Department } from "@/types";
import { unwrapBackendList } from "./pagination";

export type DepartmentPayload = Omit<Department, "id">;

// ============================================
// DEPARTMENTS API SERVICE
// ============================================
export const departmentsApi = {
  getAll: async (): Promise<Department[]> => {
    const payload = await apiClient.get<unknown>(API_ENDPOINTS.DEPARTMENTS.BASE);
    const response = unwrapBackendList<Partial<Department> & { id: string | number }>(payload);

    return response.map((item) => ({
      id: String(item.id),
      name: item.name || "",
      code: item.code || "",
      description: item.description || "",
      headOfDepartment: item.headOfDepartment,
      establishedYear: item.establishedYear || new Date().getFullYear(),
      status: item.status || "active",
    }));
  },

  getById: async (id: string): Promise<Department> => {
    const item = await apiClient.get<Partial<Department> & { id: string | number }>(
      API_ENDPOINTS.DEPARTMENTS.BY_ID(id)
    );

    return {
      id: String(item.id),
      name: item.name || "",
      code: item.code || "",
      description: item.description || "",
      headOfDepartment: item.headOfDepartment,
      establishedYear: item.establishedYear || new Date().getFullYear(),
      status: item.status || "active",
    };
  },

  create: async (data: DepartmentPayload): Promise<Department> => {
    const created = await apiClient.post<{ id: string | number; name: string; code: string }>(
      API_ENDPOINTS.DEPARTMENTS.BASE,
      { name: data.name, code: data.code }
    );
    return {
      id: String(created.id),
      name: created.name,
      code: created.code,
      description: data.description,
      headOfDepartment: data.headOfDepartment,
      establishedYear: data.establishedYear,
      status: data.status,
    };
  },

  update: async (id: string, data: Partial<DepartmentPayload>): Promise<Department> => {
    return apiClient.put<Department>(API_ENDPOINTS.DEPARTMENTS.BY_ID(id), data);
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    return apiClient.delete<ApiResponse<null>>(API_ENDPOINTS.DEPARTMENTS.BY_ID(id));
  },
};
