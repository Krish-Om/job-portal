from sqlalchemy import Column,Integer,String
from sqlalchemy.orm import relationship
from .base import Base

class Employer(Base):
    __tablename__ = "employers"
    id = Column(Integer,primary_key=True)

    company_name =Column(String,nullable=False) 
    email = Column(String,nullable=False)
    password = Column(String,nullable =False)
    #relationship with jobs that is it post jobs
    jobs = relationship("Job",back_populates="employer",lazy="dynamic")
    