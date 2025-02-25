from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from src.models.job import Job
from src.models.application import Application
from src.models.user import User, UserRole
from src.database.session import get_db
from src.security import get_current_user
from src.dependencies.auth import get_current_employer, get_current_jobseeker

router = APIRouter()

@router.post("/jobs", response_model=Job)
def create_job(
    job: Job,
    current_user: User = Depends(get_current_employer),
    session: Session = Depends(get_db)
):
    job.employer_id = current_user.id
    session.add(job)
    session.commit()
    session.refresh(job)
    return job

@router.get("/jobs/{job_id}", response_model=Job)
def read_job(
    job_id: int,
    session: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    job = session.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.get("/jobs", response_model=list[Job])
def read_jobs(
    skip: int = 0,
    limit: int = 10,
    session: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = select(Job)
    if current_user.role == UserRole.EMPLOYER:
        query = query.where(Job.employer_id == current_user.id)
    jobs = session.exec(query.offset(skip).limit(limit)).all()
    return jobs

@router.post("/jobs/{job_id}/applications/", response_model=Application)
def apply_for_job(
    job_id: int, 
    application: Application, 
    current_user: User = Depends(get_current_jobseeker),
    db: Session = Depends(get_db)
):
    # Verify job exists
    job = db.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    # Set job_id and user_id
    application.job_id = job_id
    application.user_id = current_user.id
    
    db.add(application)
    db.commit()
    db.refresh(application)
    return application