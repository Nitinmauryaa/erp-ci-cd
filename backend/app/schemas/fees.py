from pydantic import BaseModel


class FeesCreate(BaseModel):

    student_id: int

    total_amount: float

    paid_amount: float

    balance_amount: float

    status: str