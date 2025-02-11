from fastapi import APIRouter, Depends,HTTPException,status
from sqlalchemy.orm import Session
from app.schemas.employer import EmployerCreate, Employer
from app.services import employer as employer_service
from app.dependencies import get_db
from app.utils.security import hash_password

router = APIRouter(
    tags=["employers"],
    dependencies=[Depends(get_db)]
)

@router.post("/",response_model=Employer,status_code=status.HTTP_201_CREATED,)
async def create_employer(employer:EmployerCreate,db:Session = Depends(get_db)):
    hashed_password = hash_password(employer.password)
    employer.password = hashed_password
    return employer_service.create_employer(db=db,employer=employer)

@router.get("/{employer_id}",response_model=Employer)
async def get_employer(employer_id :int,db:Session = Depends(get_db)):
    employer = employer_service.get_employer_by_id(db,employer_id)
    if not employer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=f"Employer with {employer_id} not found")
    return employer


@router.get("/",response_model=list[Employer])
async def get_all_employers(db:Session = Depends(get_db),skip:int=0,limit:int = 10):
    employers:list = employer_service.get_all_employers(db,skip=skip,limit=limit)
    return employers
  
    

@router.put("/{employer_id}")
async def update_employer(employer_id: int,employer:EmployerCreate,db:Session = Depends(get_db)):
    updated_employer = employer_service.update_employer(db,employer_id,employer)

    if not update_employer:
        raise HTTPException(
            status_code=404,
            detail="Employer not found"
        )
    return update_employer

@router.delete("/{employer_id}")
async def delete_employer(employer_id:int,db:Session = Depends(get_db)):
    employer_service.delete_employer(db,employer_id)
    return