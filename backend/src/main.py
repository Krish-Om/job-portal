from fastapi import FastAPI
from src.database.session import engine
from src.database.init_db import init_db
from src.models import user, job, application
from src.api import auth, jobs, applications
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables at startup
load_dotenv()

app = FastAPI()

# Define specific origins instead of wildcard
origins = [
    "http://localhost:5173",  # Your frontend development server
    "http://localhost:3000",  # Common React development port
    # Add production origins when deployed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.on_event("startup")
async def on_startup():
    # Print environment variables for debugging
    print(f"SECRET_KEY set: {'Yes' if os.getenv('SECRET_KEY') else 'No'}")
    print(f"ALGORITHM set: {'Yes' if os.getenv('ALGORITHM') else 'No'}")
    init_db()

# Register routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["jobs"])
app.include_router(applications.router, prefix="/api/applications", tags=["applications"])

@app.get("/")
async def root():
    return {"message": "Job Portal API is running"}