from pydantic import BaseModel
from datetime import datetime


class ApplicationCreate(BaseModel):
    job_id: int
    job_seeker_id: int
    status: str = "pending"

    class Config:
        orm_mode = True


class Application(ApplicationCreate):
    id: int
    applied_at: datetime
