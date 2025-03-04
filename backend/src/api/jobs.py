from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select, or_
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
    current_user: User = Depends(get_current_employer),  # only employers can make jobs!
    session: Session = Depends(get_db)
):
    # set the employer id to whoever is logged in
    job.employer_id = current_user.id
    session.add(job)
    session.commit()
    session.refresh(job)  # gotta refresh to get the id back
    return job

@router.get("/{job_id}", response_model=Job)
def read_job(
    job_id: int,
    session: Session = Depends(get_db)
):
    job = session.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.get("/", response_model=List[Job])
def read_jobs(
    skip: int = 0,
    limit: int = 100,  # Increased limit to show more jobs
    session: Session = Depends(get_db)
):
    jobs = session.exec(select(Job).offset(skip).limit(limit)).unique().all()
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
    
    # Update job fields (skip id and employer_id)
    job_data = job_update.dict(exclude={"id"})
    for key, value in job_data.items():
        if value is not None and key != "employer_id":
            setattr(db_job, key, value)
    
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

@router.get("/search/", response_model=List[Job])
def search_jobs(
    query: Optional[str] = None,
    location: Optional[str] = None,
    category: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    session: Session = Depends(get_db)
):
    statement = select(Job)
    
    # Apply text search filters if provided
    if query:
        statement = statement.where(
            or_(
                Job.title.ilike(f"%{query}%"),
                Job.description.ilike(f"%{query}%"),
                Job.company.ilike(f"%{query}%")
            )
        )
    
    # Apply location filter if provided
    if location:
        statement = statement.where(Job.location.ilike(f"%{location}%"))
    
    # Apply category filter if provided
    if category:
        statement = statement.where(Job.category.ilike(f"%{category}%"))
    
    # Apply pagination
    statement = statement.offset(skip).limit(limit)
    
    # Execute the query
    jobs = session.exec(statement).unique().all()
    return jobs