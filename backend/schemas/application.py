from pydantic import BaseModel,ConfigDict
from datetime import datetime


class ApplicationCreate(BaseModel):
    job_id: int
    job_seeker_id: int
    status: str = "pending"

    model_config = ConfigDict(form_attributes=True)


class Application(ApplicationCreate):
    id: int
    applied_at: datetime
