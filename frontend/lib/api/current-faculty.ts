import { authApi } from "./auth";
import { apiClient } from "./client";
import { unwrapBackendList } from "./pagination";

interface FacultyRecord {
  id: number;
  faculty_id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
}

export async function getCurrentFacultyRecord(): Promise<FacultyRecord | null> {
  const user = await authApi.getCurrentUser();
  const recordsPayload = await apiClient.get<unknown>("/faculty", {
    skip: 0,
    limit: 1,
    email: user.email,
  });
  const records = unwrapBackendList<FacultyRecord>(recordsPayload);
  return records[0] || null;
}
