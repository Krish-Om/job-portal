from sqlmodel import SQLModel

# Import models to ensure they are registered
from .user import User
from .job import Job
from .application import Application

# Define the models for the application
__all__ = ["User", "Job", "Application"]