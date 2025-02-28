# FILE: /job-portal-api/job-portal-api/src/database/__init__.py

from .session import SessionLocal, engine
from sqlmodel import SQLModel

def create_db_and_tables():
    SQLModel.metadata.create_all(bind=engine)