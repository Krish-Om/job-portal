from fastapi import FastAPI
from src.database.session import engine
from src.database.init_db import init_db
from src.models import user, job, application
from src.api import auth, jobs, applications, files  # Add files import
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# gotta load these environment variables first or nothing works lol
load_dotenv()

app = FastAPI()
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS")
# Configure CORS for development and production
origins = [
    "http://localhost:5173",  # vite dev server
    "http://localhost:3000",  # react dev server
    ,  # Production frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=[
        "GET",
        "POST",
        "UPDATE",
        "DELETE",
        "PUT",
    ],  # probably should limit this but whatever
    allow_headers=["*"],  # this too but it works for now
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["jobs"])
app.include_router(
    applications.router, prefix="/api/applications", tags=["applications"]
)
app.include_router(files.router, prefix="/api/files", tags=["files"])


@app.get("/")
async def root():
    return {"message": "Job Portal API is running"}
