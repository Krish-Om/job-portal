from sqlalchemy.orm import Session
from ..models.employer import Employer
from ..schemas.employer import EmployerCreate, Employer
from ..utils.security import hash_password


def create_employer(db: Session, employer: EmployerCreate):
    hashed_password = hash_password(employer.password)
    db_employer = Employer(**employer.model_dump())
    db_employer.password = hash_password
    db.add(db_employer)
    db.commit()
    db.refresh(db_employer)
    return db_employer

def get_employer_by_id(db:Session,employer_id:int):
    return db.query(Employer).filter(Employer.id == employer_id).first()

def get_all_employers(db:Session,skip:int =0,limit:int =10):
    return db.query(Employer).offset(skip).limit(limit).all()

def update_employer(db:Session,employer_id:int,employer:EmployerCreate):
    db_employer = db.query(Employer).filter(Employer.id == employer_id).first()

    if db_employer:
        for key,value in employer.model_dump().items():
            if value is not None:
                setattr(db_employer,key,value)
        db.commit()
        db.refresh(db_employer)
    return db_employer

def delete_employer(db:Session,employer_id:int):
    db_employer = db.query(Employer).filter(Employer.id == employer_id).first()
    if db_employer:
        db.delete(db_employer)
        db.commit()
    return db_employer
