
#  from fastapi import APIRouter, Depends
#  from fastapi.security import OAuth2PasswordRequestForm
#  from pytest import Session
#  from backend.dependencies import get_db
# from backend.services.auth import auth_jwt


#  router = APIRouter(tags=["authentication"])

#  @router.post("/login")
#  async def loging(form_data:OAuth2PasswordRequestForm = Depends(),db:Session = Depends(get_db())):
#     user = 