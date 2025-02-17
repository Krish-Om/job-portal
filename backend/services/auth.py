from dotenv import load_dotenv

from sqlmodel import SQLModel
import os

""" user authentication """
load_dotenv()

secret_key_jwt=os.getenv("SECRET_KEY_JWT")








