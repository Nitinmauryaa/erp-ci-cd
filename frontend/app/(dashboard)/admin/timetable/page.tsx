"use client";

import { ApiListPage } from "@/components/shared";
import { timetableService } from "@/services";

export default function AdminTimetablePage() {
  return (
    <ApiListPage
      title="Timetable"
      description="Manage timetable entries with full CRUD operations"
      fetchData={() => timetableService.list({ skip: 0, limit: 200 })}
      createConfig={{
        fields: [
          { key: "day", label: "Day" },
          { key: "start_time", label: "Start Time" },
          { key: "end_time", label: "End Time" },
          { key: "room", label: "Room" },
          { key: "subject_id", label: "Subject ID", type: "number" },
          { key: "faculty_id", label: "Faculty ID", type: "number" },
        ],
        onCreate: (payload) => timetableService.create(payload),
      }}
      updateConfig={{
        idKey: "id",
        fields: [
          { key: "day", label: "Day" },
          { key: "start_time", label: "Start Time" },
          { key: "end_time", label: "End Time" },
          { key: "room", label: "Room" },
          { key: "subject_id", label: "Subject ID", type: "number" },
          { key: "faculty_id", label: "Faculty ID", type: "number" },
        ],
        onUpdate: (id, payload) => timetableService.update(id, payload),
      }}
      deleteConfig={{
        idKey: "id",
        onDelete: (id) => timetableService.remove(id),
      }}
    />
  );
}
