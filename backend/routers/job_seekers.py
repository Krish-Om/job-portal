from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from backend.schemas.job_seeker import JobSeekerCreate, JobSeekerResponse
from backend.services import job_seeker as jobService
from backend.dependencies import get_db
from backend.utils.security import hash_password
from backend.exceptions import HTTPError

router = APIRouter(
    tags=["job-seekers"],
    dependencies=[Depends(get_db)]
)


@router.post("/", response_model=JobSeekerResponse, status_code=status.HTTP_201_CREATED)
async def create_job_seeker(job_seeker: JobSeekerCreate, db: Session = Depends(get_db)):
    hashed_password = hash_password(job_seeker.password)
    job_seeker.password = hashed_password
    return jobService.create_job_seeker(db=db, job_seeker=job_seeker)


@router.get("/", response_model=list[JobSeekerResponse], status_code=status.HTTP_200_OK)
async def get_all_job_seekers(db: Annotated[Session, Depends(get_db)], skip: int = 0, limit: int = 10):
    try:
        job_seekers: list = jobService.get_all_job_seeker(db, skip=skip, limit=limit)
        if not job_seekers:
            return JSONResponse(
                status_code=404,
                content={"detail": "No list of job seekers found"}
            )
        return job_seekers
    except HTTPException as e:
        return JSONResponse(
            status_code=500,
            content={"detail": str(e), "status_code": 500}
        )


@router.get("/{job_seeker_id}", response_model=JobSeekerResponse,
            status_code=status.HTTP_200_OK,
            responses={404: {"model": HTTPError}})
async def get_job_seeker_by_id(job_seeker_id: int, db: Annotated[Session, Depends(get_db)]):
    try:
        job_seeker = jobService.get_job_seekers_by_id(db=db, job_seeker_id=job_seeker_id)
        if not job_seeker:
            return JSONResponse(
                status_code=404,
                content={"detail": f"No job seekers found with id '{job_seeker_id}'. "}
            )
        return job_seeker
    except HTTPException as e:
        return JSONResponse(
            status_code=500,
            content={"detail": str(e), 'status_code': 500}
        )


@router.delete("/{job_seeker_id}", status_code=status.HTTP_200_OK)
async def delete_job_seeker_by_id(job_seeker_id: int, db: Annotated[Session, Depends(get_db)]):
    try:
        job_seeker = jobService.delete_job_seeker_by_id(db=db, job_seeker_id=job_seeker_id)
        if not job_seeker:
            return JSONResponse(status_code=status.HTTP_404_NOT_FOUND,
                                content={"detail": f"No job seeker found with {job_seeker_id}"})
        return JSONResponse(status_code=200,content={"detail":f"job seeker with {job_seeker_id} is deleted with all of its corresponding data"})
    except HTTPException as e:
        return JSONResponse(status_code=500,
                            content={"detail": str(e)})
