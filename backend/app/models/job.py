from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship


from .base import Base


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    employer_id = Column(Integer, ForeignKey("employers.id"), nullable=False)

    employer = relationship("Employer", back_populates="jobs")
    applications = relationship("Application", back_populates="job")


    title = Column(String, nullable=False)
    description = Column(Text)
    requirements = Column(Text)
    location = Column(String)
    salary = Column(String)
    created_at = Column(DateTime, default=lambda: datetime.now(datetime.timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(datetime.timezone.utc),
        onupdate=lambda: datetime.now(datetime.timezone.utc),
    )

