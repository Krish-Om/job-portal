from pydantic import BaseModel, EmailStr,ConfigDict


class EmployerBase(BaseModel):
    company_name: str
    email: EmailStr

class EmployerCreate(EmployerBase):
    password:str
    model_config = ConfigDict(from_attributes=True)

class EmployerInDB(EmployerBase):
    id:int
    hashed_password:str
    model_config = ConfigDict(from_attributes=True)

    
class EmployerResponse(EmployerBase):
    id :int
    model_config = ConfigDict(from_attributes=True)