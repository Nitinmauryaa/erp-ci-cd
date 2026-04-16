import { authApi } from "./auth";
import { apiClient } from "./client";
import { unwrapBackendList } from "./pagination";

interface StudentRecord {
  id: number;
  student_id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  year: number;
}

export async function getCurrentStudentRecord(): Promise<StudentRecord | null> {
  const user = await authApi.getCurrentUser();
  const studentsPayload = await apiClient.get<unknown>("/students", {
    skip: 0,
    limit: 1,
    email: user.email,
  });
  const students = unwrapBackendList<StudentRecord>(studentsPayload);
  return students[0] || null;
}
