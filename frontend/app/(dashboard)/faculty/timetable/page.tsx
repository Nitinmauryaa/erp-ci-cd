"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentFacultyRecord } from "@/lib/api/current-faculty";
import { subjectsService, timetableService } from "@/services";

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
}

export default function FacultyTimetablePage() {
  const [items, setItems] = useState<TimetableRow[]>([]);
  const [subjects, setSubjects] = useState<Record<number, string>>({});
  const [note, setNote] = useState("");

  useEffect(() => {
    void (async () => {
      const faculty = await getCurrentFacultyRecord();
      if (!faculty) {
        setNote("No faculty profile found for this login.");
        return;
      }
      const [tt, subjectRows] = await Promise.all([
        timetableService.list({ skip: 0, limit: 200, faculty_id: faculty.id }),
        subjectsService.list({ skip: 0, limit: 200 }),
      ]);
      setItems(tt);
      setSubjects(Object.fromEntries(subjectRows.map((s) => [s.id, s.name])));
    })();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="My Timetable" description="Timetable entries assigned to you." />
      {note ? <p className="text-sm text-muted-foreground">{note}</p> : null}
      <Card>
        <CardHeader><CardTitle>Schedule</CardTitle></CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No timetable entries assigned yet.</p>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="rounded border p-2 text-sm">
                  <p className="font-medium">{item.day} {item.start_time} - {item.end_time}</p>
                  <p className="text-muted-foreground">Subject: {subjects[item.subject_id] || `#${item.subject_id}`} | Room: {item.room}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
