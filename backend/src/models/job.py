from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List

class JobBase(SQLModel):
    title: str
    description: str
    location: str
    category: str
    company: str
    
    # Convert datetime to string for SQLite compatibility
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

class Job(JobBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    employer_id: int = Field(foreign_key="user.id")
    
    # Relationships
    employer: "User" = Relationship(back_populates="posted_jobs")
    applications: List["Application"] = Relationship(
        back_populates="job",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
    
    # Set default values for timestamps in a way SQLite can handle
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())