"use client";

import { ApiListPage } from "@/components/shared";
import { attendanceService } from "@/services";

export default function AdminAttendancePage() {
  return (
    <ApiListPage
      title="Attendance"
      description="View and manage attendance records"
      fetchData={() => attendanceService.list({ skip: 0, limit: 50 })}
      createConfig={{
        fields: [
          { key: "student_id", label: "Student ID", type: "number" },
          { key: "course_id", label: "Course ID", type: "number" },
          { key: "date", label: "Date", type: "date" },
          { key: "status", label: "Status" },
        ],
        onCreate: (payload) => attendanceService.mark(payload),
      }}
      updateConfig={{
        idKey: "id",
        fields: [
          { key: "student_id", label: "Student ID", type: "number" },
          { key: "course_id", label: "Course ID", type: "number" },
          { key: "date", label: "Date", type: "date" },
          { key: "status", label: "Status" },
        ],
        onUpdate: (id, payload) => attendanceService.update(id, payload),
      }}
      deleteConfig={{
        idKey: "id",
        onDelete: (id) => attendanceService.remove(id),
      }}
    />
  );
}
