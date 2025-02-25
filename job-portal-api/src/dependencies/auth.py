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
                detail="Operation not permitted for this role"
            )
        return current_user
    return role_checker

get_current_employer = check_roles([UserRole.EMPLOYER])
get_current_jobseeker = check_roles([UserRole.JOBSEEKER])