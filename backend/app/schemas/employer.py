from pydantic import BaseModel, EmailStr


class EmployerCreate(BaseModel):
    company_name: str
    email: EmailStr
    password: str

    class Config:
        orm_mode = True


class Employer(EmployerCreate):
    id: int
