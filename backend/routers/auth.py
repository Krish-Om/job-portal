
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from enum import Enum
from . import schemas, services
from ..dependencies import get_db
from .auth import auth_jwt, hash_password

class UserType(str, Enum):
    JOBSEEKER = "jobseeker"
    EMPLOYER = "employer"
    ADMIN = "admin"

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    # Split email and user_type from username field (format: email:user_type)
    try:
        email, user_type = form_data.username.split(":")
        user_type = UserType(user_type.lower())
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username format should be email:user_type"
        )

    user = None
    if user_type == UserType.JOBSEEKER:
        user = services.jobseeker.get_jobseeker_by_email(db, email)
    elif user_type == UserType.EMPLOYER:
        user = services.employer.get_employer_by_email(db, email)
    elif user_type == UserType.ADMIN:
        user = services.admin.get_admin_by_email(db, email)

    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect credentials"
        )

    access_token = auth_jwt.create_access_token(
        subject=str(user.id),
        user_type=user_type.value
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register/jobseeker", response_model=schemas.JobSeeker)
async def register_jobseeker(
    jobseeker: schemas.JobSeekerCreate,
    db: Session = Depends(get_db)
):
    db_user = services.jobseeker.get_jobseeker_by_email(db, jobseeker.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    jobseeker.password = hash_password(jobseeker.password)
    return services.jobseeker.create_jobseeker(db=db, jobseeker=jobseeker)

@router.post("/register/employer", response_model=schemas.Employer)
async def register_employer(
    employer: schemas.EmployerCreate,
    db: Session = Depends(get_db)
):
    db_user = services.employer.get_employer_by_email(db, employer.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    employer.password = hash_password(employer.password)
    return services.employer.create_employer(db=db, employer=employer)

@router.post("/register/admin", response_model=schemas.Admin)
async def register_admin(
    admin: schemas.AdminCreate,
    db: Session = Depends(get_db),
    current_admin: schemas.Admin = Depends(auth_jwt.get_current_admin)
):
    db_user = services.admin.get_admin_by_email(db, admin.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    admin.password = hash_password(admin.password)
    return services.admin.create_admin(db=db, admin=admin)