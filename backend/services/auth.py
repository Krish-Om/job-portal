# from dotenv import load_dotenv

# from fastapi_jwt_auth import AuthJWT
# from pydantic import BaseModel
# import os
# """ user authentication """
# load_dotenv()

# secret_key_jwt=os.getenv("SECRET_KEY_JWT")

# #using OAuth2 and JWT
# class AuthSettings(BaseModel):
#     auth_jwt_secret_key:str = secret_key_jwt
#     auth_jwt_algorithm:str = "HS256"
#     auth_jwt_access_token_expires:int = 30*60 #30 minutes
    
#     class Config:
#         env_prefix='AUTH_'

# settings = AuthSettings()
# auth_jwt = AuthJWT()





