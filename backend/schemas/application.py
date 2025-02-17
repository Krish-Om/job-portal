from sqlmodel import SQLModel
from datetime import datetime


class ApplicationBase(SQLModel):
    job_id: int
    job_seeker_id: int
    status: str = "pending"

class ApplicationCreate(ApplicationBase):
    pass

class Application(ApplicationCreate):
    id: int
    applied_at: datetime