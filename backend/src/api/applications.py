from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from src.models.application import Application
from src.models.user import User, UserRole
from src.models.job import Job
from src.database.session import get_db
from src.security import get_current_user
from src.dependencies.auth import get_current_employer, get_current_jobseeker
from typing import List

router = APIRouter()

@router.post("/", response_model=Application)
def create_application(
    application: Application, 
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db)
):
    # make sure they're a jobseeker - employers can't apply to jobs lol
    if current_user.role != UserRole.JOBSEEKER:
        raise HTTPException(status_code=403, detail="Only jobseekers can apply for jobs")
    
    # check if the job actually exists
    job = session.get(Job, application.job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # set the user id to whoever is logged in
    application.user_id = current_user.id
    session.add(application)
    session.commit()
    session.refresh(application)  # need this to get the id
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

@router.get("/job/{job_id}", response_model=List[Application])
def get_job_applications(
    job_id: int,
    current_user: User = Depends(get_current_employer),
    db: Session = Depends(get_db)
):
    # Check if job exists
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Get applications
    applications = db.query(Application).filter(Application.job_id == job_id).all()
    return applications