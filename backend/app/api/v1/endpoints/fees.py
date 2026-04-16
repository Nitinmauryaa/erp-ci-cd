from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.permissions import require_roles
from app.db.session import get_db
from app.models.fees import Fee
from app.schemas.common import paginated_response
from app.schemas.fees import FeesCreate

router = APIRouter()


@router.post("/create")
def create_fees(
    fees: FeesCreate,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "accountant"]))
):

    new_fees = Fee(
        student_id=fees.student_id,
        total_amount=fees.total_amount,
        paid_amount=fees.paid_amount,
        balance_amount=fees.balance_amount,
        status=fees.status
    )

    db.add(new_fees)

    db.commit()
    db.refresh(new_fees)

    return new_fees


@router.post("/")
def create_fees_rest(
    fees: FeesCreate,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "accountant"]))
):
    return create_fees(fees=fees, db=db)


@router.post("/collect")
def collect_fees(
    fees: FeesCreate,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "accountant"]))
):
    return create_fees(fees=fees, db=db)


@router.get("/")
def get_fees(
    skip: int = 0,
    limit: int = 10,
    student_id: int | None = None,
    status: str | None = None,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "accountant", "student"]))
):
    query = db.query(Fee)
    if student_id is not None:
        query = query.filter(Fee.student_id == student_id)
    if status:
        query = query.filter(Fee.status == status)

    total = query.count()
    fees = query.offset(skip).limit(limit).all()
    return paginated_response(fees, total, skip, limit)


@router.get("/student/{student_id}")
def get_fees_by_student(
    student_id: int,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "accountant", "student"]))
):
    return db.query(Fee).filter(Fee.student_id == student_id).all()


@router.get("/{fee_id}")
def get_fee_by_id(
    fee_id: int,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "accountant", "student"]))
):
    fee = db.query(Fee).filter(Fee.id == fee_id).first()
    if not fee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Fee record not found")
    return fee


@router.put("/{fee_id}")
def update_fee(
    fee_id: int,
    fees: FeesCreate,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "accountant"]))
):
    fee = db.query(Fee).filter(Fee.id == fee_id).first()
    if not fee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Fee record not found")

    fee.student_id = fees.student_id
    fee.total_amount = fees.total_amount
    fee.paid_amount = fees.paid_amount
    fee.balance_amount = fees.balance_amount
    fee.status = fees.status
    db.commit()
    db.refresh(fee)
    return fee


@router.delete("/{fee_id}")
def delete_fee(
    fee_id: int,
    db: Session = Depends(get_db),
    _user=Depends(require_roles(["admin", "accountant"]))
):
    fee = db.query(Fee).filter(Fee.id == fee_id).first()
    if not fee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Fee record not found")

    db.delete(fee)
    db.commit()
    return {"success": True}