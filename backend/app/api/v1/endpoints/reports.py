from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.attendance import Attendance
from app.models.result import Result
from app.models.student import Student
from app.models.faculty import Faculty
from app.models.course import Course

router = APIRouter()


# ==============================
# ATTENDANCE REPORT
# ==============================

@router.get("/attendance/{student_id}")
def attendance_report(
    student_id: int,
    db: Session = Depends(get_db)
):

    records = db.query(Attendance).filter(
        Attendance.student_id == student_id
    ).all()

    if not records:
        return {
            "error": "No attendance records found"
        }

    total_classes = len(records)

    present_classes = len([
        r for r in records
        if r.status == "Present"
    ])

    percentage = (
        present_classes / total_classes
    ) * 100

    if percentage >= 75:
        status = "Eligible for exams"
    else:
        status = "Not eligible for exams"

    return {
        "student_id": student_id,
        "total_classes": total_classes,
        "present_classes": present_classes,
        "attendance_percentage": round(percentage, 2),
        "eligibility_status": status
    }


# ==============================
# STUDENT RESULT REPORT
# ==============================

@router.get("/result/{student_id}")
def student_result_report(
    student_id: int,
    db: Session = Depends(get_db)
):

    result = db.query(Result).filter(
        Result.student_id == student_id
    ).first()

    if not result:
        return {
            "error": "Result not found"
        }

    return {
        "student_id": result.student_id,
        "total_marks": result.total_marks,
        "percentage": result.percentage,
        "grade": result.grade,
        "is_published": result.is_published
    }


# ==============================
# TOP PERFORMERS REPORT
# ==============================

@router.get("/top-performers")
def top_performers(
    db: Session = Depends(get_db)
):

    students = db.query(Result).order_by(
        Result.percentage.desc()
    ).limit(5).all()

    if not students:
        return {
            "error": "No results found"
        }

    return students


# ==============================
# SYSTEM SUMMARY REPORT
# ==============================

@router.get("/summary")
def system_summary(
    db: Session = Depends(get_db)
):

    total_students = db.query(Student).count()

    total_faculty = db.query(Faculty).count()

    total_courses = db.query(Course).count()

    total_results = db.query(Result).count()

    return {
        "total_students": total_students,
        "total_faculty": total_faculty,
        "total_courses": total_courses,
        "total_results": total_results
    }