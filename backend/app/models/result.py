from sqlalchemy import Column, Integer, Float, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base


class Result(Base):

    __tablename__ = "results"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(
        Integer,
        ForeignKey("students.id"),
        nullable=False
    )

    total_marks = Column(Integer)

    percentage = Column(Float)

    grade = Column(String)

    # NEW FIELDS

    is_published = Column(
        Boolean,
        default=False
    )

    published_at = Column(
        DateTime,
        nullable=True
    )

    student = relationship("Student", back_populates="results")