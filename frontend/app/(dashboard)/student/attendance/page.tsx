"use client";

import { ApiListPage } from "@/components/shared";
import { getCurrentStudentRecord } from "@/lib/api/current-student";
import { attendanceService } from "@/services";

export default function StudentAttendancePage() {
  return (
    <ApiListPage
      title="My Attendance"
      description="View your attendance records"
      fetchData={async () => {
        const student = await getCurrentStudentRecord();
        if (!student) return [];
        return attendanceService.list({
          skip: 0,
          limit: 50,
          student_id: student.id,
        });
      }}
    />
  );
}
