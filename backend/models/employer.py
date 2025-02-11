from .base import Base
from sqlalchemy import Column,Integer,String, ForeignKey,Text
from sqlalchemy.orm import relationship
class Employer(Base):
    __tablename__ = "employers"
    id = Column(Integer,primary_key=True)
    company_name =Column(String,nullable=False) 
    email = Column(String,nullable=False)

    #relationship with jobs that is it post jobs
    jobs = relationship("Job",back_populates="employer")
    