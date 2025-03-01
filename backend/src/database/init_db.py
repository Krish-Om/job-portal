from sqlmodel import SQLModel
from .session import engine
from src.models.user import User
from src.models.job import Job
from src.models.application import Application

# def init_db():
#     """Initialize database tables"""
#     print("Creating database tables...")
#     # WARNING: this deletes everything!! only use in dev
#     SQLModel.metadata.drop_all(engine)
#     SQLModel.metadata.create_all(engine)
#     print("Database tables created successfully!")
#
# if __name__ == "__main__":
#     init_db()
