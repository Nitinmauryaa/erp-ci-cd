from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base


class Subject(Base):

    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    code = Column(String, unique=True)

    semester = Column(Integer)

    department_id = Column(
        Integer,
        ForeignKey("departments.id")
    )

    timetable_entries = relationship("Timetable", back_populates="subject")