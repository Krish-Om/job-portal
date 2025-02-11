from pydantic import BaseModel, EmailStr


class EmployeCreate(BaseModel):
    company_name: str
    email: EmailStr
    password: str

    class Config:
        orm_mode = True


class Employer(EmployeCreate):
    id: int
