from enum import Enum
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from pydantic import EmailStr, field_validator
from src.utils.password import get_password_hash

class UserRole(str, Enum):
    JOBSEEKER = "jobseeker"
    EMPLOYER = "employer"

class UserBase(SQLModel):
    id: Optional[int] = None
    username: str = Field(index=True, unique=True)
    email: EmailStr = Field(index=True, unique=True)
    role: UserRole
    is_active: bool = Field(default=True)

    @field_validator('role')
    def validate_role(cls, v):
        if v not in [UserRole.JOBSEEKER, UserRole.EMPLOYER]:
            raise ValueError('Role must be either jobseeker or employer')
        return v

class User(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    email: EmailStr = Field(index=True, unique=True)
    hashed_password: str
    role: UserRole
    is_active: bool = Field(default=True)
    password: Optional[str] = None  # Only used for validation, not stored

    # Relationships with cascade
    applications: List["Application"] = Relationship(
        back_populates="user",  # Changed from "applicant" to "user"
        sa_relationship_kwargs={
            "cascade": "all, delete-orphan",
            "lazy": "joined"
        }
    )
    posted_jobs: List["Job"] = Relationship(
        back_populates="employer",
        sa_relationship_kwargs={
            "cascade": "all, delete-orphan",
            "lazy": "joined"
        }
    )

class UserCreate(UserBase):
    password: str

    def to_user(self) -> User:
        return User(
            username=self.username,
            email=self.email,
            role=self.role,
            is_active=self.is_active,
            hashed_password=get_password_hash(self.password)
        )

class UserInDB(UserBase):
    id: Optional[int] = Field(default=None, primary_key=True)
    password_hash: str

class UserUpdate(SQLModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None