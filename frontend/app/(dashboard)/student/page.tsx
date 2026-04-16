"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/api";
import { getCurrentStudentRecord } from "@/lib/api/current-student";
import { unwrapBackendList } from "@/lib/api/pagination";

export default function StudentDashboardPage() {
  const [studentName, setStudentName] = useState("Student");
  const [statusNote, setStatusNote] = useState("");
  const [courses, setCourses] = useState<Array<{ id: number; name: string; course_code: string }>>([]);
  const [attendance, setAttendance] = useState<Array<{ id: number; status: string; date: string }>>([]);
  const [fees, setFees] = useState<Array<{ id: number; balance_amount: number; status: string }>>([]);

  useEffect(() => {
    void (async () => {
      const student = await getCurrentStudentRecord();
      if (!student) {
        setStatusNote("No student profile found for this login yet.");
        return;
      }
      setStudentName(student.name);

      const [coursePayload, attendancePayload, feePayload] = await Promise.all([
        apiClient.get<unknown>("/courses", {
          skip: 0,
          limit: 50,
          department: student.department,
        }),
        apiClient.get<unknown>("/attendance", {
          skip: 0,
          limit: 50,
          student_id: student.id,
        }),
        apiClient.get<unknown>("/fees", {
          skip: 0,
          limit: 50,
          student_id: student.id,
        }),
      ]);

      setCourses(unwrapBackendList<{ id: number; name: string; course_code: string }>(coursePayload));
      setAttendance(unwrapBackendList<{ id: number; status: string; date: string }>(attendancePayload));
      setFees(unwrapBackendList<{ id: number; balance_amount: number; status: string }>(feePayload));
    })();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Student Dashboard" description={`Welcome ${studentName}. Live data only.`} />
      {statusNote ? <p className="text-sm text-muted-foreground">{statusNote}</p> : null}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Courses</p><p className="text-2xl font-bold">{courses.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Attendance Entries</p><p className="text-2xl font-bold">{attendance.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Fee Records</p><p className="text-2xl font-bold">{fees.length}</p></CardContent></Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>My Courses (Department Based)</CardTitle></CardHeader>
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
          <CardHeader><CardTitle>Recent Attendance</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {attendance.slice(0, 10).map((item) => (
              <div key={item.id} className="rounded border p-2 text-sm">
                <p className="font-medium">{item.status}</p>
                <p className="text-muted-foreground">{item.date}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
