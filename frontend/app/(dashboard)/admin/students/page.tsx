"use client";

import { ApiListPage } from "@/components/shared";
import { studentsService } from "@/services";

export default function AdminStudentsPage() {
  return (
    <ApiListPage
      title="Students"
      description="Manage student records with full CRUD operations"
      fetchData={() => studentsService.list({ skip: 0, limit: 100 })}
      createConfig={{
        fields: [
          { key: "student_id", label: "Student ID" },
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "department", label: "Department" },
          { key: "year", label: "Year", type: "number" },
        ],
        onCreate: (payload) => studentsService.create(payload),
      }}
      updateConfig={{
        idKey: "student_id",
        fields: [
          { key: "student_id", label: "Student ID" },
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "department", label: "Department" },
          { key: "year", label: "Year", type: "number" },
        ],
        onUpdate: (id, payload) => studentsService.update(String(id), payload),
      }}
      deleteConfig={{
        idKey: "student_id",
        onDelete: (id) => studentsService.remove(String(id)),
      }}
    />
  );
}
