from pydantic import BaseModel


class MarksCreate(BaseModel):

    student_id: int
    course_id: int
    exam_type: str
    marks_obtained: int