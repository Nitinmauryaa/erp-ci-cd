from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.permissions import require_roles
from app.db.session import get_db
from app.models.enrollment import Enrollment
from app.schemas.common import paginated_response
from app.schemas.enrollment import EnrollmentCreate

router = APIRouter()


# ENROLL STUDENT
@router.post("/enroll")
def enroll_student(
    enrollment: EnrollmentCreate,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin"]))
):

    new_enrollment = Enrollment(
        student_id=enrollment.student_id,
        course_id=enrollment.course_id
    )

    db.add(new_enrollment)
    db.commit()
    db.refresh(new_enrollment)

    return new_enrollment


# GET ALL ENROLLMENTS
@router.get("/all")
def get_all_enrollments(
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "faculty"]))
):

    enrollments = db.query(Enrollment).all()

    return enrollments


@router.get("/")
def get_enrollments(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "faculty", "student"]))
):
    query = db.query(Enrollment)
    total = query.count()
    enrollments = query.offset(skip).limit(limit).all()
    return paginated_response(enrollments, total, skip, limit)