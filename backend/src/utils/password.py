from passlib.context import CryptContext

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# bcrypt has a 72-byte limit on passwords
MAX_PASSWORD_LENGTH = 72

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Generate password hash from plain password.
    
    Note: bcrypt has a 72-byte limit. We truncate longer passwords.
    """
    # Truncate password to bcrypt's maximum length
    password_truncated = password[:MAX_PASSWORD_LENGTH]
    return pwd_context.hash(password_truncated)