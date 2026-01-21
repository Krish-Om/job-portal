from fastapi import FastAPI
from src.database.session import engine
from src.database.init_db import init_db
from src.models import user, job, application
from src.api import auth, jobs, applications, files  # Add files import
from fastapi.middleware.cors import CORSMiddleware
import os
import json

app = FastAPI()
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS")
# Parse JSON string from environment variable
try:
    origins = (
        json.loads(ALLOWED_ORIGINS) if ALLOWED_ORIGINS else ["http://localhost:3000"]
    )
except (json.JSONDecodeError, TypeError) as e:
    origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now to test
    allow_credentials=True,
    allow_methods=[
        "GET",
        "POST",
        "UPDATE",
        "DELETE",
        "PUT",
    ],
    allow_headers=["*"],
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
