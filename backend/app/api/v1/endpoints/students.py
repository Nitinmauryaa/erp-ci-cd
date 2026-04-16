from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import or_, cast, String

from app.core.permissions import require_roles
from app.db.session import get_db
from app.models.student import Student
from app.schemas.common import paginated_response
from app.schemas.student import StudentCreate

router = APIRouter()


@router.post("/")
def create_student(
    student: StudentCreate,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin"]))
):
    try:
        new_student = Student(
            student_id=student.student_id,
            name=student.name,
            email=student.email,
            phone=student.phone,
            department=student.department,
            year=student.year
        )
        db.add(new_student)
        db.commit()
        db.refresh(new_student)
        return new_student
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Student with this email or ID already exists",
        ) from exc


@router.get("/")
def get_students(
    skip: int = 0,
    limit: int = 10,
    search: str = Query(default=None),
    email: str = Query(default=None),
    department: str = Query(default=None),
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "faculty"]))
):

    query = db.query(Student)

    # SEARCH
    if search:

        query = query.filter(
            Student.name.ilike(f"%{search}%")
        )
    if email:
        query = query.filter(Student.email == email)
    if department:
        query = query.filter(Student.department == department)

    total = query.count()
    students = query.offset(skip).limit(limit).all()
    return paginated_response(students, total, skip, limit)


@router.get("/{student_id}")
def get_student_by_id(
    student_id: str,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "faculty", "student"]))
):
    student = db.query(Student).filter(
        or_(Student.student_id == student_id, cast(Student.id, String) == student_id)
    ).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
    return student


@router.put("/{student_id}")
def update_student(
    student_id: str,
    student: StudentCreate,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin"]))
):
    db_student = db.query(Student).filter(
        or_(Student.student_id == student_id, cast(Student.id, String) == student_id)
    ).first()
    if not db_student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")

    try:
        db_student.name = student.name
        db_student.email = student.email
        db_student.phone = student.phone
        db_student.department = student.department
        db_student.year = student.year
        db.commit()
        db.refresh(db_student)
        return db_student
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Student with this email already exists",
        ) from exc


@router.delete("/{student_id}")
def delete_student(
    student_id: str,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin"]))
):
    db_student = db.query(Student).filter(
        or_(Student.student_id == student_id, cast(Student.id, String) == student_id)
    ).first()
    if not db_student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")

    db.delete(db_student)
    db.commit()
    return {"success": True}