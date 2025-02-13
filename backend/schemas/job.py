from pydantic import BaseModel,ConfigDict


class JobCreate(BaseModel):
    title: str
    description: str | None = None
    requirements: str | None = None
    location: str | None = None
    salary: str | None = None
    employer_id: int
    model_config = ConfigDict(from_attributes=True)


class Job(JobCreate):
    id: int

    