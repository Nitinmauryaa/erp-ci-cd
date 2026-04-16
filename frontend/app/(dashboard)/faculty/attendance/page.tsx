"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  Save, 
  CheckCircle2, 
  XCircle, 
  Users,
  Clock,
  Search,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { apiClient, studentsApi } from "@/lib/api";
import { unwrapBackendList } from "@/lib/api/pagination";

interface CourseLite {
  id: number;
  name: string;
  course_code?: string;
}

export default function FacultyAttendancePage() {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState<
    Array<{ id: string; name: string; rollNumber: string; email: string; overallAttendance: number }>
  >([]);
  const [courses, setCourses] = useState<CourseLite[]>([]);

  useEffect(() => {
    void (async () => {
      setIsLoading(true);
      try {
        const [studentsRes, coursesRes] = await Promise.all([
          studentsApi.getAll({ page: 1, limit: 200 }),
          apiClient.get<unknown>("/courses", { skip: 0, limit: 200 }),
        ]);
        setStudents(studentsRes.data.map((s) => ({
          id: s.id,
          name: s.name,
          rollNumber: s.rollNumber,
          email: s.email,
          overallAttendance: 0,
        })));
        setCourses(unwrapBackendList<CourseLite>(coursesRes));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to load students/courses");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const filteredStudents = useMemo(() => students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  ), [students, searchQuery]);

  const handleAttendanceChange = (studentId: string, checked: boolean) => {
    setAttendance((prev) => ({ ...prev, [studentId]: checked }));
  };

  const handleMarkAll = (present: boolean) => {
    const newAttendance: Record<string, boolean> = {};
    filteredStudents.forEach((s) => {
      newAttendance[s.id] = present;
    });
    setAttendance(newAttendance);
  };

  const handleSubmit = async () => {
    if (!selectedCourse) {
      toast.error("Please select a course before saving attendance.");
      return;
    }
    setIsSaving(true);
    try {
      const markedStudents = filteredStudents.filter((student) =>
        attendance[student.id] !== undefined
      );

      if (markedStudents.length === 0) {
        toast.error("Mark at least one student attendance.");
        return;
      }

      await Promise.all(
        markedStudents.map((student) =>
          apiClient.post("/attendance/mark", {
            student_id: Number(student.id),
            course_id: Number(selectedCourse),
            date,
            status: attendance[student.id] ? "Present" : "Absent",
          })
        )
      );
      toast.success("Attendance saved to database.");
      setAttendance({});
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save attendance");
    } finally {
      setIsSaving(false);
    }
  };

  const presentCount = Object.values(attendance).filter(Boolean).length;
  const totalCount = filteredStudents.length;
  const attendancePercentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  const getAttendanceBadge = (percentage: number) => {
    if (percentage >= 90) return <Badge className="bg-chart-3/10 text-chart-3 border-0">{percentage}%</Badge>;
    if (percentage >= 75) return <Badge className="bg-chart-4/10 text-chart-4 border-0">{percentage}%</Badge>;
    return <Badge className="bg-destructive/10 text-destructive border-0">{percentage}%</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mark Attendance"
        description="Record daily attendance for your classes"
      />

      {/* Class Selection */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-5 w-5 text-primary" />
            Select Class Details
          </CardTitle>
          <CardDescription>Choose the subject and date to mark attendance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={String(course.id)}>
                      {course.name} {course.course_code ? `(${course.course_code})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Course</Label>
              <Input
                value={courses.find((c) => String(c.id) === selectedCourse)?.name || ""}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label>Time Slot</Label>
              <div className="flex h-9 items-center gap-2 rounded-md border bg-muted px-3 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                9:00 AM - 10:00 AM
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedCourse && !isLoading && (
        <>
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalCount}</p>
                  <p className="text-xs text-muted-foreground">Total Students</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="rounded-lg bg-chart-3/10 p-3">
                  <CheckCircle2 className="h-5 w-5 text-chart-3" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{presentCount}</p>
                  <p className="text-xs text-muted-foreground">Present</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="rounded-lg bg-destructive/10 p-3">
                  <XCircle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalCount - presentCount}</p>
                  <p className="text-xs text-muted-foreground">Absent</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Student List */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-base">Student List</CardTitle>
                <CardDescription>
                  Mark attendance for each student
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-[200px] pl-9"
                  />
                </div>
                <Button variant="outline" size="sm" onClick={() => handleMarkAll(true)}>
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  All Present
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleMarkAll(false)}>
                  <XCircle className="mr-1 h-3 w-3" />
                  All Absent
                </Button>
                <Button variant="outline" size="sm" onClick={() => setAttendance({})}>
                  <RotateCcw className="mr-1 h-3 w-3" />
                  Reset
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Student</th>
                      <th className="p-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Roll No</th>
                      <th className="p-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">Overall %</th>
                      <th className="p-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="group hover:bg-muted/50 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {student.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{student.name}</p>
                              <p className="text-xs text-muted-foreground">{student.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                            {student.rollNumber}
                          </code>
                        </td>
                        <td className="p-3 text-center">
                          {getAttendanceBadge(student.overallAttendance)}
                        </td>
                        <td className="p-3">
                          <div className="flex justify-center">
                            <div className="flex items-center rounded-lg border p-1">
                              <button
                                onClick={() => handleAttendanceChange(student.id, true)}
                                className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                                  attendance[student.id] === true
                                    ? "bg-chart-3 text-white"
                                    : "text-muted-foreground hover:bg-muted"
                                }`}
                              >
                                <CheckCircle2 className="h-3 w-3" />
                                Present
                              </button>
                              <button
                                onClick={() => handleAttendanceChange(student.id, false)}
                                className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                                  attendance[student.id] === false
                                    ? "bg-destructive text-white"
                                    : "text-muted-foreground hover:bg-muted"
                                }`}
                              >
                                <XCircle className="h-3 w-3" />
                                Absent
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between rounded-lg bg-muted/50 p-4">
                <div className="flex items-center gap-6">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Attendance Rate: </span>
                    <span className={`font-semibold ${
                      attendancePercentage >= 75 ? "text-chart-3" : "text-destructive"
                    }`}>
                      {attendancePercentage}%
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Present: </span>
                    <span className="font-semibold text-chart-3">{presentCount}</span>
                    <span className="text-muted-foreground"> / {totalCount}</span>
                  </div>
                </div>
                <Button onClick={handleSubmit} disabled={isSaving}>
                  {isSaving ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Attendance
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
