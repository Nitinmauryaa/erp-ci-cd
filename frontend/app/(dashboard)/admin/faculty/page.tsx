"use client";

import { ApiListPage } from "@/components/shared";
import { facultyService } from "@/services";

export default function AdminFacultyPage() {
  return (
    <ApiListPage
      title="Faculty"
      description="Manage faculty records with full CRUD operations"
      fetchData={() => facultyService.list({ skip: 0, limit: 100 })}
      createConfig={{
        fields: [
          { key: "faculty_id", label: "Faculty ID" },
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "department", label: "Department" },
          { key: "designation", label: "Designation" },
        ],
        onCreate: (payload) => facultyService.create(payload),
      }}
      updateConfig={{
        idKey: "faculty_id",
        fields: [
          { key: "faculty_id", label: "Faculty ID" },
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "department", label: "Department" },
          { key: "designation", label: "Designation" },
        ],
        onUpdate: (id, payload) => facultyService.update(id, payload),
      }}
      deleteConfig={{
        idKey: "faculty_id",
        onDelete: (id) => facultyService.remove(id),
      }}
    />
  );
}
