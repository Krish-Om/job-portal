from sqlmodel import create_engine, Session
from src.core.config import settings

DATABASE_URL = settings.database_url

engine = create_engine(DATABASE_URL)

def get_session() -> Session:
    with Session(engine) as session:
        yield session