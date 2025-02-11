from pydantic import BaseModel


class AdminCreate(BaseModel):
    username: str
    password: str

    class Config:
        orm_mode = True


class Admin(AdminCreate):
    id: int

