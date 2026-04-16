import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/config/api";
import type { Faculty, FacultyFormData, PaginatedResponse, ApiResponse, FilterState } from "@/types";
import { isBackendPaginatedResponse } from "./pagination";

// ============================================
// FACULTY API SERVICE
// ============================================

export const facultyApi = {
  /**
   * Get all faculty with pagination and filters
   */
  getAll: async (filters: Partial<FilterState>): Promise<PaginatedResponse<Faculty>> => {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const response = await apiClient.get<
      | Array<{
          id: string | number;
          faculty_id?: string;
          name: string;
          email?: string;
          phone?: string;
          department?: string;
          designation?: string;
        }>
      | {
          data: Array<{
            id: string | number;
            faculty_id?: string;
            name: string;
            email?: string;
            phone?: string;
            department?: string;
            designation?: string;
          }>;
          meta: { total: number; page: number; limit: number; total_pages: number };
        }
    >(API_ENDPOINTS.FACULTY.BASE, {
      skip,
      limit,
      search: filters.search,
    });

    const rows = isBackendPaginatedResponse<{
        id: string | number;
        faculty_id?: string;
        name: string;
        email?: string;
        phone?: string;
        department?: string;
        designation?: string;
      }>(response)
      ? response.data
      : response;

    const normalized: Faculty[] = rows.map((item) => ({
      id: item.faculty_id || String(item.id),
      userId: String(item.id),
      employeeId: item.faculty_id || "",
      name: item.name,
      email: item.email || "",
      phone: item.phone || "",
      address: "",
      dateOfBirth: "",
      gender: "other",
      qualification: "",
      specialization: "",
      departmentId: item.department || "",
      designation: item.designation || "",
      joiningDate: "",
      status: "active",
      assignedSubjects: [],
      assignedCourses: [],
    }));

    return {
      data: normalized,
      total: isBackendPaginatedResponse(response) ? response.meta.total : normalized.length,
      page: isBackendPaginatedResponse(response) ? response.meta.page : page,
      limit: isBackendPaginatedResponse(response) ? response.meta.limit : limit,
      totalPages: isBackendPaginatedResponse(response) ? response.meta.total_pages : 1,
    };
  },

  /**
   * Get faculty by ID
   */
  getById: async (id: string): Promise<Faculty> => {
    const item = await apiClient.get<{
      id: string | number;
      faculty_id?: string;
      name: string;
      email?: string;
      phone?: string;
      department?: string;
      designation?: string;
    }>(API_ENDPOINTS.FACULTY.BY_ID(id));

    return {
      id: item.faculty_id || String(item.id),
      userId: String(item.id),
      employeeId: item.faculty_id || "",
      name: item.name,
      email: item.email || "",
      phone: item.phone || "",
      address: "",
      dateOfBirth: "",
      gender: "other",
      qualification: "",
      specialization: "",
      departmentId: item.department || "",
      designation: item.designation || "",
      joiningDate: "",
      status: "active",
      assignedSubjects: [],
      assignedCourses: [],
    };
  },

  /**
   * Create new faculty
   */
  create: async (data: FacultyFormData): Promise<Faculty> => {
    const payload = {
      faculty_id: data.employeeId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      department: data.departmentId,
      designation: data.designation,
    };
    const created = await apiClient.post<{
      id: string | number;
      faculty_id: string;
      name: string;
      email: string;
      phone: string;
      department: string;
      designation: string;
    }>(API_ENDPOINTS.FACULTY.BASE, payload);
    return {
      id: created.faculty_id || String(created.id),
      userId: String(created.id),
      employeeId: created.faculty_id,
      name: created.name,
      email: created.email,
      phone: created.phone,
      address: data.address,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      qualification: data.qualification,
      specialization: data.specialization,
      departmentId: created.department,
      designation: created.designation,
      joiningDate: "",
      status: "active",
      assignedSubjects: [],
      assignedCourses: [],
    };
  },

  /**
   * Update faculty
   */
  update: async (id: string, data: Partial<FacultyFormData>): Promise<Faculty> => {
    const existing = await facultyApi.getById(id);
    const payload = {
      faculty_id: data.employeeId || existing.employeeId,
      name: data.name || existing.name,
      email: data.email || existing.email,
      phone: data.phone || existing.phone,
      department: data.departmentId || existing.departmentId,
      designation: data.designation || existing.designation,
    };
    const updated = await apiClient.put<{
      id: string | number;
      faculty_id: string;
      name: string;
      email: string;
      phone: string;
      department: string;
      designation: string;
    }>(API_ENDPOINTS.FACULTY.BY_ID(id), payload);
    return {
      id: updated.faculty_id || String(updated.id),
      userId: String(updated.id),
      employeeId: updated.faculty_id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      address: existing.address,
      dateOfBirth: existing.dateOfBirth,
      gender: existing.gender,
      qualification: existing.qualification,
      specialization: existing.specialization,
      departmentId: updated.department,
      designation: updated.designation,
      joiningDate: existing.joiningDate,
      status: existing.status,
      assignedSubjects: existing.assignedSubjects,
      assignedCourses: existing.assignedCourses,
    };
  },

  /**
   * Delete faculty
   */
  delete: async (id: string): Promise<ApiResponse<null>> => {
    return apiClient.delete<ApiResponse<null>>(API_ENDPOINTS.FACULTY.BY_ID(id));
  },

  /**
   * Search faculty
   */
  search: async (query: string): Promise<Faculty[]> => {
    return apiClient.get<Faculty[]>(API_ENDPOINTS.FACULTY.SEARCH, { q: query });
  },

  /**
   * Get faculty by department
   */
  getByDepartment: async (departmentId: string): Promise<Faculty[]> => {
    return apiClient.get<Faculty[]>(API_ENDPOINTS.FACULTY.BY_DEPARTMENT(departmentId));
  },

  /**
   * Assign subjects to faculty
   */
  assignSubjects: async (facultyId: string, subjectIds: string[]): Promise<ApiResponse<null>> => {
    return apiClient.post<ApiResponse<null>>(API_ENDPOINTS.FACULTY.ASSIGN_SUBJECTS(facultyId), {
      subjectIds,
    });
  },

  /**
   * Assign courses to faculty
   */
  assignCourses: async (facultyId: string, courseIds: string[]): Promise<ApiResponse<null>> => {
    return apiClient.post<ApiResponse<null>>(API_ENDPOINTS.FACULTY.ASSIGN_COURSES(facultyId), {
      courseIds,
    });
  },
};
