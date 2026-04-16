"use client";

import { ApiListPage } from "@/components/shared";
import { departmentsService } from "@/services";

export default function AdminDepartmentsPage() {
  return (
    <ApiListPage
      title="Departments"
      description="Manage departments with full CRUD operations"
      fetchData={() => departmentsService.list({ skip: 0, limit: 100 })}
      createConfig={{
        fields: [
          { key: "name", label: "Name" },
          { key: "code", label: "Code" },
        ],
        onCreate: (payload) => departmentsService.create(payload),
      }}
      updateConfig={{
        idKey: "id",
        fields: [
          { key: "name", label: "Name" },
          { key: "code", label: "Code" },
        ],
        onUpdate: (id, payload) => departmentsService.update(id, payload),
      }}
      deleteConfig={{
        idKey: "id",
        onDelete: (id) => departmentsService.remove(id),
      }}
    />
  );
}
