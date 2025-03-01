import os
from dotenv import load_dotenv
from sqlmodel import create_engine, Session, SQLModel
from sqlalchemy.orm import sessionmaker

load_dotenv()
try:
    DATABASE_URL = os.getenv("DATABASE_URL")
except KeyError as e:
    raise KeyError("DATABASE_URL environment variable not set")
engine = create_engine(DATABASE_URL, echo=True)

def init_db():
    SQLModel.metadata.drop_all(engine)  # Drop existing tables
    SQLModel.metadata.create_all(engine)  # Create new tables

def get_db():
    with Session(engine) as session:
        yield session

def SessionLocal():
    return Session(engine)