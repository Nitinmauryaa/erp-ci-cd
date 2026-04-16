from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.core.permissions import require_roles
from app.db.session import get_db
from app.models.course import Course
from app.schemas.common import paginated_response
from app.schemas.course import CourseCreate
from fastapi import Query

router = APIRouter()


# CREATE COURSE
@router.post("/create")
def create_course(
    course: CourseCreate,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin"]))
):

    try:
        new_course = Course(
            course_code=course.course_code,
            name=course.name,
            department=course.department,
            semester=course.semester,
            credits=course.credits
        )

        db.add(new_course)
        db.commit()
        db.refresh(new_course)

        return new_course

    except IntegrityError as exc:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Course with this code already exists",
        ) from exc


@router.post("/")
def create_course_rest(
    course: CourseCreate,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin"]))
):
    return create_course(course=course, db=db)


# GET ALL COURSES
@router.get("/")
def get_courses(
    skip: int = 0,
    limit: int = 10,
    search: str = Query(default=None),
    department: str = Query(default=None),
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "faculty", "student"]))
):

    query = db.query(Course)

    # SEARCH by course name
    if search:

        query = query.filter(
            Course.name.ilike(f"%{search}%")
        )
    if department:
        query = query.filter(Course.department == department)

    total = query.count()
    courses = query.offset(skip).limit(limit).all()
    return paginated_response(courses, total, skip, limit)


@router.get("/{course_code}")
def get_course_by_code(
    course_code: str,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "faculty", "student"]))
):
    db_course = db.query(Course).filter(Course.course_code == course_code).first()
    if not db_course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
    return db_course


# UPDATE COURSE
@router.put("/update/{course_code}")
def update_course(
    course_code: str,
    course: CourseCreate,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin"]))
):

    db_course = db.query(Course).filter(
        Course.course_code == course_code
    ).first()

    if not db_course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")

    db_course.name = course.name
    db_course.department = course.department
    db_course.semester = course.semester
    db_course.credits = course.credits

    db.commit()
    db.refresh(db_course)

    return db_course


@router.put("/{course_code}")
def update_course_rest(
    course_code: str,
    course: CourseCreate,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin"]))
):
    return update_course(course_code=course_code, course=course, db=db)


# DELETE COURSE
@router.delete("/delete/{course_code}")
def delete_course(
    course_code: str,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin"]))
):

    db_course = db.query(Course).filter(
        Course.course_code == course_code
    ).first()

    if not db_course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")

    db.delete(db_course)
    db.commit()

    return {"success": True}


@router.delete("/{course_code}")
def delete_course_rest(
    course_code: str,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin"]))
):
    return delete_course(course_code=course_code, db=db)