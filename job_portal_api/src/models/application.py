from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional
from .job import Job
from .user import User

class Application(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    job_id: int = Field(foreign_key="job.id")
    applied_date: datetime = Field(default=datetime.w)
    status: str = Field(default="pending")
    

    # Relationships
    job: "Job" = Relationship(back_populates="applications")
    applicant: User = Relationship(back_populates="applications")