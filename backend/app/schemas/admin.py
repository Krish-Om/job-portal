from pydantic import BaseModel


class AdminCreate(BaseModel):
    username: str
    password: str

    class Config:
        form_attributes = True


class Admin(AdminCreate):
    id: int

