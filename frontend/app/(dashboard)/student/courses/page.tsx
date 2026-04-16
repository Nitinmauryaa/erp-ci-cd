"use client";

import { ApiListPage } from "@/components/shared";
import { apiClient } from "@/lib/api";
import { getCurrentStudentRecord } from "@/lib/api/current-student";

export default function StudentCoursesPage() {
  return (
    <ApiListPage
      title="My Courses"
      description="View your enrolled courses"
      fetchData={async () => {
        const student = await getCurrentStudentRecord();
        if (!student) return [];
        return apiClient.get("/courses", {
          skip: 0,
          limit: 100,
          department: student.department,
        });
      }}
    />
  );
}
