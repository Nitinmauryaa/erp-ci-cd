from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.core.permissions import require_roles
from app.db.session import get_db
from app.models.attendance import Attendance
from app.schemas.common import paginated_response
from app.schemas.attendance import AttendanceCreate
from fastapi import Query

router = APIRouter()


# MARK ATTENDANCE
@router.post("/mark")
def mark_attendance(
    attendance: AttendanceCreate,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "faculty"]))
):

    new_attendance = Attendance(
        student_id=attendance.student_id,
        course_id=attendance.course_id,
        date=attendance.date,
        status=attendance.status
    )

    db.add(new_attendance)
    db.commit()
    db.refresh(new_attendance)

    return new_attendance


@router.post("/")
def mark_attendance_rest(
    attendance: AttendanceCreate,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "faculty"]))
):
    return mark_attendance(attendance=attendance, db=db)


# GET ATTENDANCE
@router.get("/all")
def get_all_attendance(
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "faculty"]))
):

    records = db.query(Attendance).all()

    return records



@router.get("/")
def get_attendance(
    skip: int = 0,
    limit: int = 10,
    student_id: int | None = None,
    course_id: int | None = None,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "faculty", "student"]))
):
    query = db.query(Attendance)
    if student_id is not None:
        query = query.filter(Attendance.student_id == student_id)
    if course_id is not None:
        query = query.filter(Attendance.course_id == course_id)

    total = query.count()
    attendance = query.offset(skip).limit(limit).all()
    return paginated_response(attendance, total, skip, limit)


@router.get("/student/{student_id}")
def get_attendance_by_student(
    student_id: int,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "faculty", "student"]))
):
    return db.query(Attendance).filter(Attendance.student_id == student_id).all()


@router.get("/{attendance_id}")
def get_attendance_by_id(
    attendance_id: int,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "faculty", "student"]))
):
    record = db.query(Attendance).filter(Attendance.id == attendance_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Attendance record not found")
    return record


@router.put("/{attendance_id}")
def update_attendance(
    attendance_id: int,
    attendance: AttendanceCreate,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "faculty"]))
):
    record = db.query(Attendance).filter(Attendance.id == attendance_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Attendance record not found")

    try:
        record.student_id = attendance.student_id
        record.course_id = attendance.course_id
        record.date = attendance.date
        record.status = attendance.status
        db.commit()
        db.refresh(record)
        return record
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Attendance for this student/course/date already exists",
        ) from exc


@router.delete("/{attendance_id}")
def delete_attendance(
    attendance_id: int,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "faculty"]))
):
    record = db.query(Attendance).filter(Attendance.id == attendance_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Attendance record not found")

    db.delete(record)
    db.commit()
    return {"success": True}