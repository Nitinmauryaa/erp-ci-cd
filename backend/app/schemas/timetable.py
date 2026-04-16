from pydantic import BaseModel


class TimetableCreate(BaseModel):

    day: str

    start_time: str

    end_time: str

    room: str

    subject_id: int

    faculty_id: int