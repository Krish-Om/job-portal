from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from src.models.application import Application
from src.models.user import User, UserRole
from src.models.job import Job
from src.database.session import get_db
from src.security import get_current_user

router = APIRouter()

@router.post("/", response_model=Application)
def create_application(
    application: Application, 
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db)
):
    # Verify user is a jobseeker
    if current_user.role != UserRole.JOBSEEKER:
        raise HTTPException(status_code=403, detail="Only jobseekers can apply for jobs")
    
    # Verify job exists
    job = session.get(Job, application.job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Set the applicant
    application.user_id = current_user.id
    session.add(application)
    session.commit()
    session.refresh(application)
    return application

@router.get("/{application_id}", response_model=Application)
def read_application(
    application_id: int, 
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db)
):
    application = session.get(Application, application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Check if user has permission to view this application
    if (current_user.role == UserRole.JOBSEEKER and application.user_id != current_user.id) or \
       (current_user.role == UserRole.EMPLOYER and application.job.employer_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to view this application")
    
    return application

@router.get("/", response_model=list[Application])
def read_applications(
    skip: int = 0, 
    limit: int = 10, 
    session: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Filter applications based on user role
    query = select(Application)
    if current_user.role == UserRole.JOBSEEKER:
        query = query.where(Application.user_id == current_user.id)
    elif current_user.role == UserRole.EMPLOYER:
        query = query.join(Job).where(Job.employer_id == current_user.id)
    
    applications = session.exec(query.offset(skip).limit(limit)).all()
    return applications