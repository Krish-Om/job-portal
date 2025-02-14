from sqlalchemy.orm import Session

from backend.models.job_seeker import JobSeeker
from backend.schemas.job_seeker import JobSeekerCreate
from backend.services.auth import hash_password

def create_job_seeker(db:Session,job_seeker:JobSeekerCreate):
    db_job_seeker = JobSeeker(
        name = job_seeker.name,
        email=job_seeker.email,
        hashed_password = hash_password(job_seeker.password)
    )
    db.add(db_job_seeker)
    db.commit()
    db.refresh(db_job_seeker)
    return db_job_seeker



def get_all_job_seeker(db:Session,skip:int = 0,limit:int = 10):
    job_seekers = db.query(JobSeeker).offset(skip).limit(limit).all()
    return job_seekers


def get_job_seekers_by_id(db:Session,job_seeker_id:int):
    return db.query(JobSeeker).filter(JobSeeker.id == job_seeker_id).first()

def update_job_seeker(db:Session,id:int,job_seeker : JobSeekerCreate):
    db_job_seeker = db.query(JobSeeker).filter(JobSeeker.id == id).first()
    
    if db_job_seeker:
        update_data = job_seeker.model_dump(exclude={'password'})
        for key,value in update_data.items():
            if value is not None:
                setattr(db_job_seeker,key,value)

    if job_seeker.password:
        db_job_seeker.hashed_password = hash_password(job_seeker.password)
    db.commit()
    db.refresh(db_job_seeker)
    return db_job_seeker


def delete_job_seeker_by_id(db:Session, job_seeker_id:int):
    db_job_seeker = db.query(JobSeeker).filter(JobSeeker.id == job_seeker_id).first()
    if db_job_seeker:
        db.delete(db_job_seeker)
        db.commit()

    return db_job_seeker
        
