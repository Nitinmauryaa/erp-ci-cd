from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.core.permissions import require_roles
from app.db.session import get_db
from app.models.subject import Subject
from app.schemas.common import paginated_response
from app.schemas.subject import SubjectCreate

router = APIRouter()


@router.post("/create")
def create_subject(
    subject: SubjectCreate,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin"]))
):

    new_subject = Subject(
        name=subject.name,
        code=subject.code,
        semester=subject.semester,
        department_id=subject.department_id
    )

    try:
        db.add(new_subject)
        db.commit()
        db.refresh(new_subject)
        return new_subject
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Invalid department or duplicate subject code",
        ) from exc


@router.post("/")
def create_subject_rest(
    subject: SubjectCreate,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin"]))
):
    return create_subject(subject=subject, db=db)


@router.get("/")
def get_subjects(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "faculty", "student"]))
):
    query = db.query(Subject)
    total = query.count()
    subjects = query.offset(skip).limit(limit).all()
    return paginated_response(subjects, total, skip, limit)


@router.get("/{subject_id}")
def get_subject_by_id(
    subject_id: int,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "faculty", "student"]))
):
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subject not found")
    return subject


@router.put("/{subject_id}")
def update_subject(
    subject_id: int,
    subject: SubjectCreate,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin"]))
):
    db_subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not db_subject:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subject not found")

    try:
        db_subject.name = subject.name
        db_subject.code = subject.code
        db_subject.semester = subject.semester
        db_subject.department_id = subject.department_id
        db.commit()
        db.refresh(db_subject)
        return db_subject
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Invalid department or duplicate subject code",
        ) from exc


@router.delete("/{subject_id}")
def delete_subject(
    subject_id: int,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin"]))
):
    db_subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not db_subject:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subject not found")

    db.delete(db_subject)
    db.commit()
    return {"success": True}