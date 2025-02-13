from typing import Generator

from sqlalchemy.orm import Session
from backend.database import SessionLocal

def get_db() -> Generator[Session,None,None]:
    """
    Dependency function to get a database session.

    Yields:
        Session: A database session.
    """

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
