from enum import Enum
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from pydantic import EmailStr, validator
from src.utils.password import get_password_hash

class UserRole(str, Enum):
    JOBSEEKER = "jobseeker"
    EMPLOYER = "employer"

class UserBase(SQLModel):
    username: str = Field(index=True, unique=True)
    email: EmailStr = Field(index=True, unique=True)
    role: UserRole
    is_active: bool = Field(default=True)

    @validator('role')
    def validate_role(cls, v):
        if v not in [UserRole.JOBSEEKER, UserRole.EMPLOYER]:
            raise ValueError('Role must be either jobseeker or employer')
        return v

class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    password_hash: str = Field(nullable=False)

    # Relationships with cascade
    applications: List["Application"] = Relationship(
        back_populates="applicant",
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
            password_hash=get_password_hash(self.password)
        )

class UserInDB(UserBase):
    id: Optional[int] = Field(default=None, primary_key=True)
    password_hash: str

class UserUpdate(SQLModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None