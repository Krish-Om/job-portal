from fastapi import Depends, HTTPException, Security
from fastapi.security import OAuth2PasswordBearer
from src.models.user import User, UserRole
from src.security import get_current_user
from typing import List

def check_roles(allowed_roles: List[UserRole]):
    async def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=403,
                detail="Only employers can create jobs"
            )
        return current_user
    return role_checker

def get_current_employer(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.EMPLOYER:
        raise HTTPException(
            status_code=403,
            detail="Only employers can create jobs"
        )
    return current_user

get_current_jobseeker = check_roles([UserRole.JOBSEEKER])