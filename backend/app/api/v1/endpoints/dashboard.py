from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.session import get_db
from app.models.student import Student
from app.models.faculty import Faculty
from app.models.course import Course
from app.models.enrollment import Enrollment
from app.models.attendance import Attendance
from app.models.result import Result

router = APIRouter()


@router.get("/stats")
def dashboard_stats(
    db: Session = Depends(get_db)
):

    total_students = db.query(Student).count()

    total_faculty = db.query(Faculty).count()

    total_courses = db.query(Course).count()

    total_enrollments = db.query(Enrollment).count()

    total_results = db.query(Result).count()

    published_results = db.query(Result).filter(
        Result.is_published == True
    ).count()

    total_attendance = db.query(Attendance).count()

    present_attendance = db.query(Attendance).filter(
        Attendance.status == "Present"
    ).count()

    attendance_percentage = 0

    if total_attendance > 0:

        attendance_percentage = (
            present_attendance / total_attendance
        ) * 100

    return {
        "total_students": total_students,
        "total_faculty": total_faculty,
        "total_courses": total_courses,
        "total_enrollments": total_enrollments,
        "total_results": total_results,
        "published_results": published_results,
        "attendance_percentage": round(attendance_percentage, 2)
    }