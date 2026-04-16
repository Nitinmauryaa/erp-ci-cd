"use client";

import { ApiListPage } from "@/components/shared";
import { apiClient } from "@/lib/api";

export default function AccountantFeesPage() {
  return (
    <ApiListPage
      title="Fee Collection"
      description="Collect and manage student fees"
      fetchData={() => apiClient.get("/fees", { skip: 0, limit: 50 })}
    />
  );
}
