"use client";

import { ApiListPage } from "@/components/shared";
import { marksService } from "@/services";

export default function AdminMarksPage() {
  return (
    <ApiListPage
      title="Marks"
      description="View and manage student marks"
      fetchData={() => marksService.list({ skip: 0, limit: 50 })}
      createConfig={{
        fields: [
          { key: "student_id", label: "Student ID", type: "number" },
          { key: "course_id", label: "Course ID", type: "number" },
          { key: "exam_type", label: "Exam Type" },
          { key: "marks_obtained", label: "Marks Obtained", type: "number" },
        ],
        onCreate: (payload) => marksService.create(payload),
      }}
      updateConfig={{
        idKey: "id",
        fields: [
          { key: "student_id", label: "Student ID", type: "number" },
          { key: "course_id", label: "Course ID", type: "number" },
          { key: "exam_type", label: "Exam Type" },
          { key: "marks_obtained", label: "Marks Obtained", type: "number" },
        ],
        onUpdate: (id, payload) => marksService.update(id, payload),
      }}
      deleteConfig={{
        idKey: "id",
        onDelete: (id) => marksService.remove(id),
      }}
    />
  );
}
