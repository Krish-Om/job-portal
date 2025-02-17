from sqlalchemy.orm import relationship
from sqlalchemy import Column,Integer,Text,String

from .base import Base

class JobSeeker(Base):
    __tablename__ = "job_seekers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)  # Store hashed password
    resume_url = Column(Text,nullable=True) #stores the resume url

    applications = relationship("Application", back_populates="job_seeker",cascade="all")
