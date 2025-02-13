from sqlalchemy.orm import Session
from backend.models.employer import Employer as EmployerModel
from backend.schemas.employer import EmployerCreate
from backend.utils.security import hash_password


def create_employer(db: Session, employer: EmployerCreate):
    db_employer = EmployerModel(
        company_name=employer.company_name,
        email=employer.email,
        hashed_password=hash_password(employer.password)  # Store as hashed_password
    )
    db.add(db_employer)
    db.commit()
    db.refresh(db_employer)
    return db_employer


def get_employer_by_id(db: Session, employer_id: int):
    return db.query(EmployerModel).filter(EmployerModel.id == employer_id).first()


def get_all_employers(db: Session, skip: int = 0, limit: int = 10):
    employers = db.query(EmployerModel).offset(skip).limit(limit).all()
    return employers


def update_employer(db: Session, employer_id: int, employer: EmployerCreate):
    db_employer = db.query(EmployerModel).filter(EmployerModel.id == employer_id).first()
    
    if db_employer:
        # Update basic fields
        update_data = employer.model_dump(exclude={'password'})
        for key, value in update_data.items():
            if value is not None:
                setattr(db_employer, key, value)
        
        # Update password if provided
        if employer.password:
            db_employer.hashed_password = hash_password(employer.password)
        
        db.commit()
        db.refresh(db_employer)
    return db_employer


def delete_employer(db: Session, employer_id: int):
    db_employer = db.query(EmployerModel).filter(EmployerModel.id == employer_id).first()
    if db_employer:
        db.delete(db_employer)
        db.commit()
    return db_employer
