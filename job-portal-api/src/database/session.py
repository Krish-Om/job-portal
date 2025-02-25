from sqlmodel import SQLModel, Session, create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()


DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL, echo=True)

def init_db():
    SQLModel.metadata.drop_all(engine)  # Drop existing tables
    SQLModel.metadata.create_all(engine)  # Create new tables

def get_db():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()

def SessionLocal():
    return Session(engine)