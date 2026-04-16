"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/api";
import { unwrapBackendList } from "@/lib/api/pagination";

export default function FacultyDashboardPage() {
  const [courses, setCourses] = useState<Array<{ id: number; name: string; course_code: string }>>([]);
  const [attendance, setAttendance] = useState<Array<{ id: number; student_id: number; course_id: number; date: string; status: string }>>([]);
  const [students, setStudents] = useState<Array<{ id: number; name: string }>>([]);

  useEffect(() => {
    void (async () => {
      const [coursePayload, attendancePayload, studentPayload] = await Promise.all([
        apiClient.get<unknown>("/courses", { skip: 0, limit: 10 }),
        apiClient.get<unknown>("/attendance", { skip: 0, limit: 20 }),
        apiClient.get<unknown>("/students", { skip: 0, limit: 200 }),
      ]);
      setCourses(unwrapBackendList<{ id: number; name: string; course_code: string }>(coursePayload));
      setAttendance(
        unwrapBackendList<{ id: number; student_id: number; course_id: number; date: string; status: string }>(
          attendancePayload
        )
      );
      setStudents(unwrapBackendList<{ id: number; name: string }>(studentPayload));
    })();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Faculty Dashboard" description="Live faculty data." />
      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Courses</p><p className="text-2xl font-bold">{courses.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Students</p><p className="text-2xl font-bold">{students.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Attendance Records</p><p className="text-2xl font-bold">{attendance.length}</p></CardContent></Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Courses</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {courses.map((course) => (
              <div key={course.id} className="rounded border p-2 text-sm">
                <p className="font-medium">{course.name}</p>
                <p className="text-muted-foreground">{course.course_code}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recent Attendance Entries</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {attendance.slice(0, 10).map((entry) => (
              <div key={entry.id} className="rounded border p-2 text-sm">
                <p className="font-medium">Student #{entry.student_id} - {entry.status}</p>
                <p className="text-muted-foreground">Course #{entry.course_id} on {entry.date}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
