"use client";

import { ApiListPage } from "@/components/shared";
import { getCurrentFacultyRecord } from "@/lib/api/current-faculty";
import { studentsService } from "@/services";

export default function FacultyStudentsPage() {
  return (
    <ApiListPage
      title="My Students"
      description="Students from your department"
      fetchData={async () => {
        const faculty = await getCurrentFacultyRecord();
        if (!faculty) return [];
        return studentsService.list({
          skip: 0,
          limit: 200,
          department: faculty.department,
        });
      }}
    />
  );
}
