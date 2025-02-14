from backend.models.job_seeker import JobSeeker
from sqlalchemy.orm import Session



def apply_for_job(job_id: int, current_user: JobSeeker, db: Session):
    pass
