from sqlalchemy import Column, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import relationship
from app.db.session import Base


class Timetable(Base):

    __tablename__ = "timetable"
    __table_args__ = (
        UniqueConstraint("day", "start_time", "room", name="uq_timetable_day_time_room"),
    )

    id = Column(Integer, primary_key=True, index=True)

    day = Column(String)

    start_time = Column(String)

    end_time = Column(String)

    room = Column(String)

    subject_id = Column(
        Integer,
        ForeignKey("subjects.id")
    )

    faculty_id = Column(
        Integer,
        ForeignKey("faculty.id")
    )

    subject = relationship("Subject", back_populates="timetable_entries")
    faculty = relationship("Faculty", back_populates="timetable_entries")