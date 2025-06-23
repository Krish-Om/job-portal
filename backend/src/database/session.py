import os
from dotenv import load_dotenv
from sqlmodel import create_engine, Session, SQLModel
from sqlalchemy.orm import sessionmaker

load_dotenv()

# Try to get DATABASE_URL directly first
DATABASE_URL = os.getenv("DATABASE_URL")

# If not set, try to build it from individual components
if not DATABASE_URL:
    DATABASE_USER = os.getenv("DATABASE_USER")
    DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD")
    DATABASE_HOST = os.getenv("DATABASE_HOST")
    DATABASE_PORT = os.getenv("DATABASE_PORT")
    DATABASE_NAME = os.getenv("DATABASE_NAME")

    # Check if all required variables are present
    if not all(
        [DATABASE_USER, DATABASE_PASSWORD, DATABASE_HOST, DATABASE_PORT, DATABASE_NAME]
    ):
        raise ValueError(
            f"Missing database configuration. Required environment variables: DATABASE_USER, DATABASE_PASSWORD, DATABASE_HOST, DATABASE_PORT, DATABASE_NAME or DATABASE_URL"
        )

    DATABASE_URL = f"postgresql://{DATABASE_USER}:{DATABASE_PASSWORD}@{DATABASE_HOST}:{DATABASE_PORT}/{DATABASE_NAME}"

print(f"Using Database URL: {DATABASE_URL}")
engine = create_engine(DATABASE_URL, echo=True)


def init_db():
    SQLModel.metadata.drop_all(engine)  # Drop existing tables
    SQLModel.metadata.create_all(engine)  # Create new tables


def get_db():
    with Session(engine) as session:
        yield session


def SessionLocal():
    return Session(engine)
