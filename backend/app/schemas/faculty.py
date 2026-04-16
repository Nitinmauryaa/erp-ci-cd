from pydantic import BaseModel


class FacultyCreate(BaseModel):

    faculty_id: str
    name: str
    email: str
    phone: str
    department: str
    designation: str