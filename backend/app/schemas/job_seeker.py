from pydantic import BaseModel, EmailStr,ConfigDict


class JobSeekerBase(BaseModel):
    name: str
    email: EmailStr
    resume_url: str | None = None

class JobSeekerCreate(JobSeekerBase):
    password: str  # todo: Hash this before storing!!
    model_config = ConfigDict(form_attributes=True)

class JobSeekerInDB(JobSeekerCreate):
    id: int
    hashed_password:str
    model_config = ConfigDict(from_attributes=True)

class JobSeekerResponse(JobSeekerBase):
    id:int
    model_config = ConfigDict(from_attributes=True)

