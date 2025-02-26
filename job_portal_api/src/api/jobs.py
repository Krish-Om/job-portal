from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from src.models.job import Job
from src.models.application import Application
from src.models.user import User, UserRole
from src.database.session import get_db
from src.security import get_current_user
from src.dependencies.auth import get_current_employer, get_current_jobseeker
from typing import List, Optional

router = APIRouter()

@router.post("/", response_model=Job)
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

@router.get("/{job_id}", response_model=Job)
def read_job(
    job_id: int,
    session: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    job = session.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.get("/", response_model=List[Job])
def read_jobs(
    skip: int = 0,
    limit: int = 10,
    session: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = select(Job)
    if current_user.role == UserRole.EMPLOYER:
        query = query.where(Job.employer_id == current_user.id)
    jobs = session.exec(query.offset(skip).limit(limit)).unique().all()
    return jobs

@router.put("/{job_id}", response_model=Job)
def update_job(
    job_id: int,
    job_update: Job,
    current_user: User = Depends(get_current_employer),
    session: Session = Depends(get_db)
):
    db_job = session.get(Job, job_id)
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if db_job.employer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this job")
    
    for var, value in vars(job_update).items():
        if value is not None:
            setattr(db_job, var, value)
    
    session.add(db_job)
    session.commit()
    session.refresh(db_job)
    return db_job

@router.delete("/{job_id}")
def delete_job(
    job_id: int,
    current_user: User = Depends(get_current_employer),
    session: Session = Depends(get_db)
):
    job = session.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    if job.employer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this job")
    
    session.delete(job)
    session.commit()
    return {"message": "Job deleted successfully"}

@router.post("/{job_id}/applications/", response_model=Application)
def apply_for_job(
    job_id: int, 
    application: Application, 
    current_user: User = Depends(get_current_jobseeker),
    db: Session = Depends(get_db)
):
    job = db.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    application.job_id = job_id
    application.user_id = current_user.id
    
    db.add(application)
    db.commit()
    db.refresh(application)
    return application