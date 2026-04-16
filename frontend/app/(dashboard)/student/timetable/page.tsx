"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentStudentRecord } from "@/lib/api/current-student";
import { departmentsService, subjectsService, timetableService } from "@/services";

interface TimetableRow {
  id: number;
  day: string;
  start_time: string;
  end_time: string;
  room: string;
  subject_id: number;
  faculty_id: number;
}

interface SubjectRow {
  id: number;
  name: string;
  department_id: number;
}

interface DepartmentRow {
  id: number;
  name: string;
}

export default function StudentTimetablePage() {
  const [items, setItems] = useState<TimetableRow[]>([]);
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    void (async () => {
      const student = await getCurrentStudentRecord();
      if (!student) {
        setNote("No student profile found for this login.");
        return;
      }

      const [timetableRows, subjectRows, departmentRows] = await Promise.all([
        timetableService.list({ skip: 0, limit: 500 }),
        subjectsService.list({ skip: 0, limit: 500 }),
        departmentsService.list({ skip: 0, limit: 100 }),
      ]);

      const department = departmentRows.find(
        (d) => d.name.toLowerCase() === String(student.department || "").toLowerCase()
      );
      if (!department) {
        setItems([]);
        setSubjects(subjectRows);
        setNote("No matching department found for this student.");
        return;
      }

      const subjectIds = new Set(
        subjectRows.filter((s) => s.department_id === department.id).map((s) => s.id)
      );
      setItems(timetableRows.filter((row) => subjectIds.has(row.subject_id)));
      setSubjects(subjectRows);
    })();
  }, []);

  const subjectById = useMemo(
    () => Object.fromEntries(subjects.map((s) => [s.id, s.name])),
    [subjects]
  );

  return (
    <div className="space-y-6">
      <PageHeader title="My Timetable" description="Department-based live timetable." />
      {note ? <p className="text-sm text-muted-foreground">{note}</p> : null}
      <Card>
        <CardHeader><CardTitle>Schedule</CardTitle></CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No timetable entries found for your department.</p>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="rounded border p-2 text-sm">
                  <p className="font-medium">{item.day} {item.start_time} - {item.end_time}</p>
                  <p className="text-muted-foreground">Subject: {subjectById[item.subject_id] || `#${item.subject_id}`} | Room: {item.room}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
