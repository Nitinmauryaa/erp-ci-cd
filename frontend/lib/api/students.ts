import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/config/api";
import type { Student, StudentFormData, PaginatedResponse, ApiResponse, FilterState } from "@/types";
import { isBackendPaginatedResponse } from "./pagination";

// ============================================
// STUDENTS API SERVICE
// ============================================

export const studentsApi = {
  /**
   * Get all students with pagination and filters
   */
  getAll: async (filters: Partial<FilterState>): Promise<PaginatedResponse<Student>> => {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const response = await apiClient.get<
      | Array<{
          id: string | number;
          student_id?: string;
          name: string;
          email?: string;
          phone?: string;
          department?: string;
          year?: number;
        }>
      | {
          data: Array<{
            id: string | number;
            student_id?: string;
            name: string;
            email?: string;
            phone?: string;
            department?: string;
            year?: number;
          }>;
          meta: { total: number; page: number; limit: number; total_pages: number };
        }
    >(API_ENDPOINTS.STUDENTS.BASE, {
      skip,
      limit,
      search: filters.search,
    });

    const rows = isBackendPaginatedResponse<{
        id: string | number;
        student_id?: string;
        name: string;
        email?: string;
        phone?: string;
        department?: string;
        year?: number;
      }>(response)
      ? response.data
      : response;

    const normalized: Student[] = rows.map((item) => ({
      id: item.student_id || String(item.id),
      userId: String(item.id),
      rollNumber: item.student_id || "",
      name: item.name,
      email: item.email || "",
      phone: item.phone || "",
      address: "",
      dateOfBirth: "",
      gender: "other",
      guardianName: "",
      guardianPhone: "",
      departmentId: item.department || "",
      courseId: "",
      semester: item.year || 1,
      batch: "",
      admissionDate: "",
      status: "active",
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
   * Get student by ID
   */
  getById: async (id: string): Promise<Student> => {
    const item = await apiClient.get<{
      id: string | number;
      student_id?: string;
      name: string;
      email?: string;
      phone?: string;
      department?: string;
      year?: number;
    }>(API_ENDPOINTS.STUDENTS.BY_ID(id));

    return {
      id: item.student_id || String(item.id),
      userId: String(item.id),
      rollNumber: item.student_id || "",
      name: item.name,
      email: item.email || "",
      phone: item.phone || "",
      address: "",
      dateOfBirth: "",
      gender: "other",
      guardianName: "",
      guardianPhone: "",
      departmentId: item.department || "",
      courseId: "",
      semester: item.year || 1,
      batch: "",
      admissionDate: "",
      status: "active",
    };
  },

  /**
   * Create new student
   */
  create: async (data: StudentFormData): Promise<Student> => {
    const payload = {
      student_id: data.rollNumber,
      name: data.name,
      email: data.email,
      phone: data.phone,
      department: data.departmentId,
      year: data.semester,
    };

    const created = await apiClient.post<{
      id: string | number;
      student_id: string;
      name: string;
      email: string;
      phone: string;
      department: string;
      year: number;
    }>(`${API_ENDPOINTS.STUDENTS.BASE}/`, payload);

    return {
      id: created.student_id || String(created.id),
      userId: String(created.id),
      rollNumber: created.student_id,
      name: created.name,
      email: created.email,
      phone: created.phone,
      address: data.address,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      guardianName: data.guardianName,
      guardianPhone: data.guardianPhone,
      departmentId: created.department,
      courseId: data.courseId,
      semester: created.year,
      batch: data.batch,
      admissionDate: "",
      status: "active",
    };
  },

  /**
   * Update student
   */
  update: async (id: string, data: Partial<StudentFormData>): Promise<Student> => {
    const existing = await studentsApi.getById(id);
    const payload = {
      student_id: data.rollNumber || existing.rollNumber,
      name: data.name || existing.name,
      email: data.email || existing.email,
      phone: data.phone || existing.phone,
      department: data.departmentId || existing.departmentId,
      year: data.semester || existing.semester,
    };
    const updated = await apiClient.put<{
      id: string | number;
      student_id: string;
      name: string;
      email: string;
      phone: string;
      department: string;
      year: number;
    }>(API_ENDPOINTS.STUDENTS.BY_ID(id), payload);
    return {
      id: updated.student_id || String(updated.id),
      userId: String(updated.id),
      rollNumber: updated.student_id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      address: existing.address,
      dateOfBirth: existing.dateOfBirth,
      gender: existing.gender,
      guardianName: existing.guardianName,
      guardianPhone: existing.guardianPhone,
      departmentId: updated.department,
      courseId: existing.courseId,
      semester: updated.year,
      batch: existing.batch,
      admissionDate: existing.admissionDate,
      status: existing.status,
    };
  },

  /**
   * Delete student
   */
  delete: async (id: string): Promise<ApiResponse<null>> => {
    return apiClient.delete<ApiResponse<null>>(API_ENDPOINTS.STUDENTS.BY_ID(id));
  },

  /**
   * Search students
   */
  search: async (query: string): Promise<Student[]> => {
    return apiClient.get<Student[]>(API_ENDPOINTS.STUDENTS.SEARCH, { q: query });
  },

  /**
   * Get students by course
   */
  getByCourse: async (courseId: string): Promise<Student[]> => {
    return apiClient.get<Student[]>(API_ENDPOINTS.STUDENTS.BY_COURSE(courseId));
  },

  /**
   * Get students by department
   */
  getByDepartment: async (departmentId: string): Promise<Student[]> => {
    return apiClient.get<Student[]>(API_ENDPOINTS.STUDENTS.BY_DEPARTMENT(departmentId));
  },
};
