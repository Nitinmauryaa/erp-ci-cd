from sqlalchemy import Column, Integer, Float, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base


class Fee(Base):

    __tablename__ = "fees"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(
        Integer,
        ForeignKey("students.id")
    )

    total_amount = Column(Float)

    paid_amount = Column(Float)

    balance_amount = Column(Float)

    status = Column(String)

    student = relationship("Student", back_populates="fees")