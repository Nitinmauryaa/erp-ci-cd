from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.core.permissions import require_roles
from app.db.session import get_db
from app.models.faculty import Faculty
from app.schemas.common import paginated_response
from app.schemas.faculty import FacultyCreate
from fastapi import Query


router = APIRouter()


# CREATE FACULTY
@router.post("/create")
def create_faculty(
    faculty: FacultyCreate,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin"]))
):

    try:
        new_faculty = Faculty(
            faculty_id=faculty.faculty_id,
            name=faculty.name,
            email=faculty.email,
            phone=faculty.phone,
            department=faculty.department,
            designation=faculty.designation
        )

        db.add(new_faculty)
        db.commit()
        db.refresh(new_faculty)

        return new_faculty

    except IntegrityError as exc:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Faculty with this email or ID already exists",
        ) from exc


# GET ALL FACULTY
@router.get("/")
def get_faculty(
    skip: int = 0,
    limit: int = 10,
    search: str = Query(default=None),
    email: str = Query(default=None),
    department: str = Query(default=None),
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "faculty"]))
):

    query = db.query(Faculty)

    # SEARCH by name
    if search:

        query = query.filter(
            Faculty.name.ilike(f"%{search}%")
        )
    if email:
        query = query.filter(Faculty.email == email)
    if department:
        query = query.filter(Faculty.department == department)

    total = query.count()
    faculty = query.offset(skip).limit(limit).all()
    return paginated_response(faculty, total, skip, limit)


@router.get("/{faculty_id}")
def get_faculty_by_id(
    faculty_id: str,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "faculty"]))
):
    db_faculty = db.query(Faculty).filter(Faculty.faculty_id == faculty_id).first()
    if not db_faculty:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Faculty not found")
    return db_faculty


# UPDATE FACULTY
@router.put("/update/{faculty_id}")
def update_faculty(
    faculty_id: str,
    faculty: FacultyCreate,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin"]))
):

    db_faculty = db.query(Faculty).filter(
        Faculty.faculty_id == faculty_id
    ).first()

    if not db_faculty:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Faculty not found")

    db_faculty.name = faculty.name
    db_faculty.email = faculty.email
    db_faculty.phone = faculty.phone
    db_faculty.department = faculty.department
    db_faculty.designation = faculty.designation

    db.commit()
    db.refresh(db_faculty)

    return db_faculty


@router.post("/")
def create_faculty_rest(
    faculty: FacultyCreate,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin"]))
):
    return create_faculty(faculty=faculty, db=db)


@router.put("/{faculty_id}")
def update_faculty_rest(
    faculty_id: str,
    faculty: FacultyCreate,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin"]))
):
    return update_faculty(faculty_id=faculty_id, faculty=faculty, db=db)


# DELETE FACULTY
@router.delete("/delete/{faculty_id}")
def delete_faculty(
    faculty_id: str,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin"]))
):

    db_faculty = db.query(Faculty).filter(
        Faculty.faculty_id == faculty_id
    ).first()

    if not db_faculty:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Faculty not found")

    db.delete(db_faculty)
    db.commit()

    return {"success": True}


@router.delete("/{faculty_id}")
def delete_faculty_rest(
    faculty_id: str,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin"]))
):
    return delete_faculty(faculty_id=faculty_id, db=db)