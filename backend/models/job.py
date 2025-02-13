from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base


class Job(Base):
    """SQLAlchemy model for jobs table."""
    
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    employer_id = Column(Integer, ForeignKey("employers.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    requirements = Column(Text)
    location = Column(String)
    salary = Column(String)
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),  # Added timezone=True here
        server_default=func.now(),
        nullable=False,
        onupdate=func.now()  # Changed to func.now() instead of lambda
    )

    # Relationships
    employer = relationship("Employer", back_populates="jobs",cascade="all")
    applications = relationship("Application", back_populates="job",cascade="all")

