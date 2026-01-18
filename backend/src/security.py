from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from dotenv import load_dotenv
import os
from fastapi import Depends, HTTPException, Security
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from src.database.session import get_db
from src.utils.password import verify_password
import pathlib
from passlib.context import CryptContext

# had to do this crazy path stuff cuz the env file wasn't loading right :/
BASE_DIR = pathlib.Path(__file__).parent.parent.parent
ENV_PATH = BASE_DIR / ".env.production"
load_dotenv(dotenv_path=ENV_PATH)

# these print statements saved my life when debugging
print(f"Loading .env from: {ENV_PATH}")
print(f"SECRET_KEY: {os.getenv('SECRET_KEY')}")
print(f"ALGORITHM: {os.getenv('ALGORITHM')}")

# grab stuff from env file (with defaults just in case)
SECRET_KEY = os.getenv("SECRET_KEY", "KRISHOMBASUKALA")  # super secret backup key lol
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# password hashing stuff - don't touch this, it works!!
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    """Verify a password against a hash."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    """Generate a password hash."""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    
    # Use fallback if SECRET_KEY is not set
    if not SECRET_KEY:
        print("WARNING: Using fallback secret key. This is not secure for production!")
        
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[str]:
    """Verify JWT token and return username if valid."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return None
        return username
    except JWTError:
        return None

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    from src.models.user import User  # Import here to avoid circular import
    
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        username = verify_token(token)
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
    return user