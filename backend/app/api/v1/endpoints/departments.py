from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.permissions import require_roles
from app.db.session import get_db
from app.models.department import Department
from app.schemas.common import paginated_response
from app.schemas.department import DepartmentCreate

router = APIRouter()


@router.post("/create")
def create_department(
    department: DepartmentCreate,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin"]))
):

    new_department = Department(
        name=department.name,
        code=department.code
    )

    try:
        db.add(new_department)
        db.commit()
        db.refresh(new_department)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Department already exists") from exc
    return new_department


@router.get("/")
def get_departments(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "faculty", "student"]))
):
    query = db.query(Department)
    total = query.count()
    departments = query.offset(skip).limit(limit).all()
    return paginated_response(departments, total, skip, limit)


@router.get("/{department_id}")
def get_department_by_id(
    department_id: int,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "faculty", "student"]))
):
    department = db.query(Department).filter(Department.id == department_id).first()
    if not department:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Department not found")
    return department


@router.post("/")
def create_department_rest(
    department: DepartmentCreate,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin"]))
):
    return create_department(department=department, db=db)


@router.put("/{department_id}")
def update_department(
    department_id: int,
    department: DepartmentCreate,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin"]))
):
    db_department = db.query(Department).filter(Department.id == department_id).first()
    if not db_department:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Department not found")

    try:
        db_department.name = department.name
        db_department.code = department.code
        db.commit()
        db.refresh(db_department)
        return db_department
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Department already exists") from exc


@router.delete("/{department_id}")
def delete_department(
    department_id: int,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin"]))
):
    db_department = db.query(Department).filter(Department.id == department_id).first()
    if not db_department:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Department not found")

    db.delete(db_department)
    db.commit()
    return {"success": True}