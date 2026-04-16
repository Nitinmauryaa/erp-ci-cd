"use client";

import { ApiListPage } from "@/components/shared";
import { apiClient } from "@/lib/api";

export default function AdminSettingsPage() {
  return (
    <ApiListPage
      title="Settings"
      description="System configuration data from backend"
      fetchData={async () => {
        const stats = await apiClient.get<Record<string, unknown>>("/dashboard/stats");
        return Object.entries(stats).map(([key, value]) => ({
          id: key,
          setting: key,
          value: String(value),
        }));
      }}
    />
  );
}
