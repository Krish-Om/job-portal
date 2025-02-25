from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, List

class Job(SQLModel, table=True):
    __tablename__ = "job"  # Explicitly set table name
    
    id: int = Field(default=None, primary_key=True)
    title: str = Field(max_length=255)
    description: str = Field()
    location: str = Field(max_length=255)
    category: str = Field(max_length=100)
    company: str = Field(max_length=255)
    posted_date: datetime = Field(default=datetime.utcnow)
    employer_id: Optional[int] = Field(default=None, foreign_key="user.id")
    
    # Relationships with cascade
    applications: List["Application"] = Relationship(
        back_populates="job",
        sa_relationship_kwargs={
            "cascade": "all, delete-orphan",
            "lazy": "joined"
        }
    )
    employer: "User" = Relationship(
        back_populates="posted_jobs",
        sa_relationship_kwargs={"lazy": "joined"}
    )