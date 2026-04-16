"use client";

import { ApiListPage } from "@/components/shared";
import { feesService } from "@/services";

export default function AdminFeesPage() {
  return (
    <ApiListPage
      title="Fees"
      description="Manage fee collection and records"
      fetchData={() => feesService.list({ skip: 0, limit: 50 })}
      createConfig={{
        fields: [
          { key: "student_id", label: "Student ID", type: "number" },
          { key: "total_amount", label: "Total Amount", type: "number" },
          { key: "paid_amount", label: "Paid Amount", type: "number" },
          { key: "balance_amount", label: "Balance Amount", type: "number" },
          { key: "status", label: "Status" },
        ],
        onCreate: (payload) => feesService.collect(payload),
      }}
      updateConfig={{
        idKey: "id",
        fields: [
          { key: "student_id", label: "Student ID", type: "number" },
          { key: "total_amount", label: "Total Amount", type: "number" },
          { key: "paid_amount", label: "Paid Amount", type: "number" },
          { key: "balance_amount", label: "Balance Amount", type: "number" },
          { key: "status", label: "Status" },
        ],
        onUpdate: (id, payload) => feesService.update(id, payload),
      }}
      deleteConfig={{
        idKey: "id",
        onDelete: (id) => feesService.remove(id),
      }}
    />
  );
}
