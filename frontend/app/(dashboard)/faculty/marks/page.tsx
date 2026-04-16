"use client";

import { ApiListPage } from "@/components/shared";
import { marksService } from "@/services";

export default function FacultyMarksPage() {
  return (
    <ApiListPage
      title="Faculty Marks"
      description="View marks records and sync with backend"
      fetchData={() => marksService.list({ skip: 0, limit: 50 })}
    />
  );
}
