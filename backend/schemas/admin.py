from pydantic import BaseModel,ConfigDict

class AdminBase(BaseModel):
    username:str
class AdminCreate(AdminBase):
    password:str
    model_config = ConfigDict(form_attributes=True)


class AdminResponse(AdminBase):
    id: int
    model_config= ConfigDict(from_attributes=True)
