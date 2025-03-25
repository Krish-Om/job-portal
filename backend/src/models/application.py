from sqlmodel import SQLModel, Field, Relationship, String
from sqlalchemy import Column, DateTime  # Add this import
from datetime import datetime
from typing import Optional
from .job import Job
from .user import User

class Application(SQLModel, table=True):
    __tablename__ = "applications"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    job_id: int = Field(foreign_key="job.id", index=True)  # Make sure this matches your job table name
    user_id: int = Field(foreign_key="user.id", index=True)  # Make sure this matches your user table name
    resume_path: str = Field()
    status: str = Field(default="pending")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(
        default_factory=datetime.utcnow, 
        sa_column=Column(DateTime, onupdate=datetime.utcnow)  # Specify DateTime type here
    )
    
    # Relationships
    job: "Job" = Relationship(back_populates="applications")
    user: "User" = Relationship(back_populates="applications")

# Response model for returning application data
class ApplicationResponse(SQLModel):
    id: int
    job_id: int
    user_id: int
    resume_path: str
    status: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True  # Allows response model to read from ORM model instances