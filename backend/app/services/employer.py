from sqlalchemy.orm import Session
from app.models.employer import Employer as EmployerModel
from app.schemas.employer import EmployerCreate
from app.utils.security import hash_password


def create_employer(db: Session, employer: EmployerCreate):
    hashed_password = hash_password(employer.password)
    db_employer = EmployerModel(**employer.model_dump())
    db_employer.password = hashed_password
    db.add(db_employer)
    db.commit()
    db.refresh(db_employer)
    return db_employer

def get_employer_by_id(db:Session,employer_id:int):
    return db.query(EmployerModel).filter(EmployerModel.id == employer_id).first()

def get_all_employers(db:Session,skip:int =0,limit:int =10):
    employers = db.query(EmployerModel).offset(skip).limit(limit).all()
    return employers
def update_employer(db:Session,employer_id:int,employer:EmployerCreate):
    db_employer = db.query(EmployerModel).filter(EmployerModel.id == employer_id).first()

    if db_employer:
        for key,value in employer.model_dump().items():
            if value is not None:
                setattr(db_employer,key,value)
        db.commit()
        db.refresh(db_employer)
    return db_employer

def delete_employer(db:Session,employer_id:int):
    db_employer = db.query(EmployerModel).filter(EmployerModel.id == employer_id).first()
    if db_employer:
        db.delete(db_employer)
        db.commit()
    return db_employer
