"use client";

import { ApiListPage } from "@/components/shared";
import { apiClient } from "@/lib/api";

export default function AdminNotificationsPage() {
  return (
    <ApiListPage
      title="Notifications"
      description="System activity based on dashboard stats"
      fetchData={async () => {
        const stats = await apiClient.get<Record<string, unknown>>("/dashboard/stats");
        return Object.entries(stats).map(([metric, value]) => ({
          id: metric,
          type: "system",
          title: metric.replaceAll("_", " "),
          message: `Current value: ${String(value)}`,
        }));
      }}
    />
  );
}
