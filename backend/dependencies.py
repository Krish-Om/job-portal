from typing import Annotated
from fastapi import Depends
from sqlmodel import Session
from fastapi.security import OAuth2PasswordBearer
from .database import get_db


# Database dependency
SessionDep = Annotated[Session, Depends(get_db)]

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")
TokenDep = Annotated[str, Depends(oauth2_scheme)]

