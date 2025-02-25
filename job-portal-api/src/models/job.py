from sqlmodel import SQLModel, Field
from datetime import datetime

class Job(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    title: str = Field(max_length=255)
    description: str = Field()
    location: str = Field(max_length=255)
    category: str = Field(max_length=100)
    company: str = Field(max_length=255)
    posted_date: datetime = Field(default=datetime.utcnow)