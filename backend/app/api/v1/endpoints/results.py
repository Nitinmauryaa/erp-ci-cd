from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.permissions import require_roles
from app.db.session import get_db
from app.models.marks import Marks
from app.models.result import Result
from app.schemas.common import paginated_response

router = APIRouter()


def calculate_grade(percentage):

    if percentage >= 90:
        return "A+"
    elif percentage >= 80:
        return "A"
    elif percentage >= 70:
        return "B"
    elif percentage >= 60:
        return "C"
    elif percentage >= 50:
        return "D"
    else:
        return "F"


# GENERATE RESULT
@router.post("/generate/{student_id}")
def generate_result(
    student_id: int,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "faculty"]))
):

    existing_result = db.query(Result).filter(
        Result.student_id == student_id
    ).first()

    # LOCK CHECK
    if existing_result and existing_result.is_published:

        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Result already published and locked")

    marks = db.query(Marks).filter(
        Marks.student_id == student_id
    ).all()

    if not marks:

        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No marks found for this student")

    total_marks = sum(
        mark.marks_obtained for mark in marks
    )

    subjects = len(marks)

    percentage = (
        total_marks / (subjects * 100)
    ) * 100

    grade = calculate_grade(percentage)

    # UPDATE existing result
    if existing_result:

        existing_result.total_marks = total_marks
        existing_result.percentage = percentage
        existing_result.grade = grade

        db.commit()

        db.refresh(existing_result)
        return existing_result

    # CREATE new result
    new_result = Result(
        student_id=student_id,
        total_marks=total_marks,
        percentage=percentage,
        grade=grade
    )

    db.add(new_result)
    db.commit()
    db.refresh(new_result)
    return new_result


# GET RESULT
@router.get("/student/{student_id}")
def get_result(
    student_id: int,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "faculty", "student"]))
):

    result = db.query(Result).filter(
        Result.student_id == student_id
    ).first()

    if not result:

        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Result not found")

    return result


# PUBLISH RESULT (ADMIN ONLY)
@router.post("/publish/{student_id}")
def publish_result(
    student_id: int,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin"]))
):

    result = db.query(Result).filter(
        Result.student_id == student_id
    ).first()

    if not result:

        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Result not found")

    result.is_published = True
    result.published_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(result)
    return result



@router.get("/")
def get_results(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "faculty", "student"]))
):
    query = db.query(Result)
    total = query.count()
    results = query.offset(skip).limit(limit).all()
    return paginated_response(results, total, skip, limit)