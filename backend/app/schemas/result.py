from pydantic import BaseModel


class ResultResponse(BaseModel):

    student_id: int
    total_marks: int
    subjects: int
    percentage: float
    grade: str