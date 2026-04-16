from pydantic import BaseModel


class StudentCreate(BaseModel):

    student_id: str
    name: str
    email: str
    phone: str
    department: str
    year: int