from pydantic import BaseModel
from datetime import date


class AttendanceCreate(BaseModel):

    student_id: int
    course_id: int
    date: date
    status: str