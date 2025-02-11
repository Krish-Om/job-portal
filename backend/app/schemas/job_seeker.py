from pydantic import BaseModel, EmailStr


class JobSeekerCreate(BaseModel):
    name: str
    email: EmailStr
    password: str  # todo: Hash this before storing!!
    resume_url: str | None = None

    class Config:
        orm_mode = True


class JobSeeker(JobSeekerCreate):
    id: int
