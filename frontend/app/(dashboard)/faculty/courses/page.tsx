"use client";

import { ApiListPage } from "@/components/shared";
import { getCurrentFacultyRecord } from "@/lib/api/current-faculty";
import { coursesService } from "@/services";

export default function FacultyCoursesPage() {
  return (
    <ApiListPage
      title="My Courses"
      description="Courses from your department"
      fetchData={async () => {
        const faculty = await getCurrentFacultyRecord();
        if (!faculty) return [];
        return coursesService.list({
          skip: 0,
          limit: 200,
          department: faculty.department,
        });
      }}
    />
  );
}
