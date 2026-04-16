"use client";

import { ApiListPage } from "@/components/shared";
import { apiClient } from "@/lib/api";

export default function AdminReportsPage() {
  return (
    <ApiListPage
      title="Reports"
      description="Generate and export various reports"
      fetchData={() => apiClient.get("/reports/summary")}
    />
  );
}
