from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.core.permissions import require_roles
from app.db.session import get_db
from app.models.timetable import Timetable
from app.schemas.common import paginated_response
from app.schemas.timetable import TimetableCreate

router = APIRouter()


@router.post("/create")
def create_timetable(
    timetable: TimetableCreate,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin"]))
):

    new_entry = Timetable(
        day=timetable.day,
        start_time=timetable.start_time,
        end_time=timetable.end_time,
        room=timetable.room,
        subject_id=timetable.subject_id,
        faculty_id=timetable.faculty_id
    )

    try:
        db.add(new_entry)
        db.commit()
        db.refresh(new_entry)
        return new_entry
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Invalid subject_id or faculty_id") from exc


@router.post("/")
def create_timetable_rest(
    timetable: TimetableCreate,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin"]))
):
    return create_timetable(timetable=timetable, db=db)


@router.get("/")
def get_timetable(
    skip: int = 0,
    limit: int = 10,
    faculty_id: int = Query(default=None),
    subject_id: int = Query(default=None),
    day: str = Query(default=None),
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "faculty", "student"]))
):
    query = db.query(Timetable)
    if faculty_id is not None:
        query = query.filter(Timetable.faculty_id == faculty_id)
    if subject_id is not None:
        query = query.filter(Timetable.subject_id == subject_id)
    if day:
        query = query.filter(Timetable.day.ilike(day))

    total = query.count()
    timetable = query.offset(skip).limit(limit).all()
    return paginated_response(timetable, total, skip, limit)


@router.get("/faculty/{faculty_id}")
def get_timetable_by_faculty(
    faculty_id: int,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "faculty"]))
):
    return db.query(Timetable).filter(Timetable.faculty_id == faculty_id).all()


@router.get("/student/{student_id}")
def get_timetable_by_student(
    student_id: int,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "faculty", "student"]))
):
    # Current schema doesn't link timetable directly to student.
    # Returning complete timetable keeps student dashboards updated with admin changes.
    return db.query(Timetable).all()


@router.get("/{entry_id}")
def get_timetable_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "faculty", "student"]))
):
    entry = db.query(Timetable).filter(Timetable.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Timetable entry not found")
    return entry


@router.put("/{entry_id}")
def update_timetable(
    entry_id: int,
    timetable: TimetableCreate,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin"]))
):
    entry = db.query(Timetable).filter(Timetable.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Timetable entry not found")

    try:
        entry.day = timetable.day
        entry.start_time = timetable.start_time
        entry.end_time = timetable.end_time
        entry.room = timetable.room
        entry.subject_id = timetable.subject_id
        entry.faculty_id = timetable.faculty_id
        db.commit()
        db.refresh(entry)
        return entry
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Invalid subject/faculty or conflicting day/time/room",
        ) from exc


@router.delete("/{entry_id}")
def delete_timetable(
    entry_id: int,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin"]))
):
    entry = db.query(Timetable).filter(Timetable.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Timetable entry not found")

    db.delete(entry)
    db.commit()
    return {"success": True}