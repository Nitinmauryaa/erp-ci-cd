"use client";

import { ApiListPage } from "@/components/shared";
import { coursesService } from "@/services";

export default function AdminCoursesPage() {
  return (
    <ApiListPage
      title="Courses"
      description="Manage all courses across departments"
      fetchData={() => coursesService.list({ skip: 0, limit: 50 })}
      createConfig={{
        fields: [
          { key: "course_code", label: "Course Code" },
          { key: "name", label: "Name" },
          { key: "department", label: "Department" },
          { key: "semester", label: "Semester", type: "number" },
          { key: "credits", label: "Credits", type: "number" },
        ],
        onCreate: (payload) => coursesService.create(payload),
      }}
      updateConfig={{
        idKey: "course_code",
        fields: [
          { key: "course_code", label: "Course Code" },
          { key: "name", label: "Name" },
          { key: "department", label: "Department" },
          { key: "semester", label: "Semester", type: "number" },
          { key: "credits", label: "Credits", type: "number" },
        ],
        onUpdate: (id, payload) => coursesService.update(id, payload),
      }}
      deleteConfig={{
        idKey: "course_code",
        onDelete: (id) => coursesService.remove(id),
      }}
    />
  );
}
