"use client";

import { ApiListPage } from "@/components/shared";
import { apiClient } from "@/lib/api";

export default function AdminResultsPage() {
  return (
    <ApiListPage
      title="Results"
      description="Generate and publish student results"
      fetchData={() => apiClient.get("/results", { skip: 0, limit: 50 })}
    />
  );
}
