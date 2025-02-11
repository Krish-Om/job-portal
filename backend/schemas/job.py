from pydantic import BaseModel


class JobCreate(BaseModel):
    title: str
    description: str | None = None
    requirements: str | None = None
    location: str | None = None
    salary: str | None = None
    employer_id: int

    class Config:
        orm_mode = True


class Job(JobCreate):
    id: int
