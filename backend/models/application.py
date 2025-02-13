from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime,timezone

from .base import Base
class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    job_seeker_id = Column(Integer, ForeignKey("job_seekers.id"), nullable=False)
    status = Column(String, default="pending")  # "pending", "accepted", "rejected", etc.
    applied_at = Column(DateTime(timezone=True), server_default=func.now(),nullable=False)  # Timestamp of application

    job = relationship("Job", back_populates="applications")
    job_seeker = relationship("JobSeeker", back_populates="applications")