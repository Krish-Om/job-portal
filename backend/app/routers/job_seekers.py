from typing import Annotated
from fastapi import APIRouter,Depends,HTTPException,status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.schemas.job_seeker import JobSeekerCreate,JobSeekerResponse
from app.services import job_seeker as jobService
from app.dependencies import get_db
from app.utils.security import hash_password
from app.exceptions import HTTPError

router = APIRouter(
    tags=["job-seekers"],
    dependencies=[Depends(get_db)]
)


@router.post("/",response_model=JobSeekerResponse,status_code=status.HTTP_201_CREATED)
async def create_jobSeeker(job_seeker:JobSeekerCreate,db:Session = Depends(get_db)):
    hashed_password = hash_password(job_seeker.password)
    job_seeker.password = hashed_password
    return jobService.create_job_seeker(db=db,job_seeker=job_seeker)

@router.get("/",response_model=list[JobSeekerResponse],status_code=status.HTTP_200_OK)
async def get_all_jobSeekers(db:Annotated[Session,Depends(get_db)],skip:int=0,limit:int =10):
    try:
        jobSeekers:list = jobService.get_all_job_seeker(db,skip=skip,limit=limit)
        if not jobSeekers:
            return JSONResponse(
                status_code=404,
                content={"detail":"No list of job seekers found"}
            )
        return jobSeekers                
    except HTTPException as e:
        return JSONResponse(
            status_code=500,
            content={"detail":str(e),"status_code":500}
        )

@router.get("/{job_seeker_id}",response_model=JobSeekerResponse,
            status_code=status.HTTP_200_OK,
            responses={404:{"model":HTTPError}})
async def get_jobSeeker_by_name(name:str,db:Annotated[Session,Depends(get_db)]):
    try:
        job_seeker = jobService.get_job_seekers_by_name(db=db,name=name)
        if not job_seeker:
            return JSONResponse(
                status_code=404,
                content={"detail":f"No job seekers found with name '{name}'. "}
            )
        return job_seeker
    except HTTPException as e:
        return JSONResponse(
            status_code=500,
            content={"detail":str(e),'status_code':500}
        )