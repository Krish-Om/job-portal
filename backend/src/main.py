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

# need this for CORS otherwise the browser blocks everything :(
origins = [
    "http://localhost:5173",  # vite dev server
    "http://localhost:3000",  # react server
    # TODO: add production url when we deploy!!
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # probably should limit this but whatever
    allow_headers=["*"]   # this too but it works for now
)

@app.on_event("startup")
async def on_startup():
    # debugging stuff - spent 2 hours figuring out why auth wasn't working
    print(f"SECRET_KEY exists: {'Yes' if os.getenv('SECRET_KEY') else 'No!!'}")
    print(f"ALGORITHM exists: {'Yes' if os.getenv('ALGORITHM') else 'No!!'}")
    init_db()

# hook up all the API routes
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["jobs"])
app.include_router(applications.router, prefix="/api/applications", tags=["applications"])
app.include_router(files.router, prefix="/api/files", tags=["files"])  # Add this line

@app.get("/")
async def root():
    return {"message": "Job Portal API is running"}