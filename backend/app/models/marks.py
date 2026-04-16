from sqlalchemy import Column, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import relationship
from app.db.session import Base


class Marks(Base):

    __tablename__ = "marks"
    __table_args__ = (
        UniqueConstraint("student_id", "course_id", "exam_type", name="uq_marks_student_course_exam"),
    )

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(
        Integer,
        ForeignKey("students.id"),
        nullable=False
    )

    course_id = Column(
        Integer,
        ForeignKey("courses.id"),
        nullable=False
    )

    exam_type = Column(
        String,
        nullable=False
    )

    marks_obtained = Column(
        Integer,
        nullable=False
    )

    student = relationship("Student", back_populates="marks")
    course = relationship("Course", back_populates="marks")