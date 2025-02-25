from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from ..database.session import get_db
from ..models.job import Job
from ..models.application import Application
from typing import List

router = APIRouter()

@router.post("/jobs/", response_model=Job)
def create_job(job: Job, db: Session = Depends(get_db)):
    db.add(job)
    db.commit()
    db.refresh(job)
    return job

@router.get("/jobs/", response_model=List[Job])
def read_jobs(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    jobs = db.query(Job).offset(skip).limit(limit).all()
    return jobs

@router.get("/jobs/{job_id}", response_model=Job)
def read_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.post("/jobs/{job_id}/applications/", response_model=Application)
def apply_for_job(job_id: int, application: Application, db: Session = Depends(get_db)):
    application.job_id = job_id
    db.add(application)
    db.commit()
    db.refresh(application)
    return application