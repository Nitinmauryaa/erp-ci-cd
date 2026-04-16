from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.core.permissions import require_roles
from app.db.session import get_db
from app.models.marks import Marks
from app.schemas.common import paginated_response
from app.schemas.marks import MarksCreate
from fastapi import Query


router = APIRouter()


# ADD MARKS
@router.post("/add")
def add_marks(
    marks: MarksCreate,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "faculty"]))
):

    new_marks = Marks(
        student_id=marks.student_id,
        course_id=marks.course_id,
        exam_type=marks.exam_type,
        marks_obtained=marks.marks_obtained
    )

    db.add(new_marks)
    db.commit()
    db.refresh(new_marks)

    return new_marks


@router.post("/")
def add_marks_rest(
    marks: MarksCreate,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "faculty"]))
):
    return add_marks(marks=marks, db=db)


# GET ALL MARKS
@router.get("/all")
def get_all_marks(
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "faculty"]))
):

    records = db.query(Marks).all()

    return records


@router.get("/student/{student_id}")
def get_marks_by_student(
    student_id: int,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "faculty", "student"]))
):
    records = db.query(Marks).filter(Marks.student_id == student_id).all()
    return records


@router.get("/")
def get_marks(
    skip: int = 0,
    limit: int = 10,
    student_id: int | None = None,
    course_id: int | None = None,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "faculty", "student"]))
):
    query = db.query(Marks)
    if student_id is not None:
        query = query.filter(Marks.student_id == student_id)
    if course_id is not None:
        query = query.filter(Marks.course_id == course_id)

    total = query.count()
    marks = query.offset(skip).limit(limit).all()
    return paginated_response(marks, total, skip, limit)


@router.get("/{mark_id}")
def get_mark_by_id(
    mark_id: int,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "faculty", "student"]))
):
    record = db.query(Marks).filter(Marks.id == mark_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mark record not found")
    return record


@router.put("/{mark_id}")
def update_marks(
    mark_id: int,
    marks: MarksCreate,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "faculty"]))
):
    record = db.query(Marks).filter(Marks.id == mark_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mark record not found")

    try:
        record.student_id = marks.student_id
        record.course_id = marks.course_id
        record.exam_type = marks.exam_type
        record.marks_obtained = marks.marks_obtained
        db.commit()
        db.refresh(record)
        return record
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Marks for this student/course/exam already exist",
        ) from exc


@router.delete("/{mark_id}")
def delete_marks(
    mark_id: int,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "faculty"]))
):
    record = db.query(Marks).filter(Marks.id == mark_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mark record not found")

    db.delete(record)
    db.commit()
    return {"success": True}