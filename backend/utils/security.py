from typing import Annotated
from fastapi import Depends
from passlib.context import CryptContext
#password hashing functions
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str)->str:
    return pwd_context.hash(password)

def verify_password(password: str, hashed_password: str)->bool:
    return pwd_context.verify(password, hashed_password)

def get_current_user(db:SessionDep,token:Annotated[Depends(oauth2_scheme)]):
    pass