from pydantic import BaseModel


class CourseCreate(BaseModel):

    course_code: str
    name: str
    department: str
    semester: int
    credits: int