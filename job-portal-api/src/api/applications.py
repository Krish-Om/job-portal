from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from models.application import Application
from models.user import User
from models.job import Job
from database.session import get_session

router = APIRouter()

@router.post("/applications", response_model=Application)
def create_application(application: Application, session: Session = Depends(get_session)):
    session.add(application)
    session.commit()
    session.refresh(application)
    return application

@router.get("/applications/{application_id}", response_model=Application)
def read_application(application_id: int, session: Session = Depends(get_session)):
    application = session.exec(select(Application).where(Application.id == application_id)).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    return application

@router.get("/applications", response_model=list[Application])
def read_applications(skip: int = 0, limit: int = 10, session: Session = Depends(get_session)):
    applications = session.exec(select(Application).offset(skip).limit(limit)).all()
    return applications