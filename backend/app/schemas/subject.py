from pydantic import BaseModel


class SubjectCreate(BaseModel):

    name: str

    code: str

    semester: int

    department_id: int


class SubjectResponse(BaseModel):

    id: int

    name: str

    code: str

    semester: int

    department_id: int

    class Config:
        from_attributes = True