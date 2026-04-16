"use client";

import { ApiListPage } from "@/components/shared";
import { subjectsService } from "@/services";

export default function AdminSubjectsPage() {
  return (
    <ApiListPage
      title="Subjects"
      description="Manage all subjects across courses"
      fetchData={() => subjectsService.list({ skip: 0, limit: 50 })}
      createConfig={{
        fields: [
          { key: "name", label: "Name" },
          { key: "code", label: "Code" },
          { key: "semester", label: "Semester", type: "number" },
          { key: "department_id", label: "Department ID", type: "number" },
        ],
        onCreate: (payload) => subjectsService.create(payload),
      }}
      updateConfig={{
        idKey: "id",
        fields: [
          { key: "name", label: "Name" },
          { key: "code", label: "Code" },
          { key: "semester", label: "Semester", type: "number" },
          { key: "department_id", label: "Department ID", type: "number" },
        ],
        onUpdate: (id, payload) => subjectsService.update(id, payload),
      }}
      deleteConfig={{
        idKey: "id",
        onDelete: (id) => subjectsService.remove(id),
      }}
    />
  );
}
