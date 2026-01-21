from fastapi import FastAPI
from src.database.session import engine
from src.database.init_db import init_db
from src.models import user, job, application
from src.api import auth, jobs, applications, files
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pathlib import Path
import os

# Load environment variables (works in both container and local dev)
# Try to load from .env.production in the project root
env_file = Path(__file__).parent.parent.parent / ".env.production"
load_dotenv(env_file)

app = FastAPI()

# Build allowed origins list from environment variables
origins = []
for i in range(1, 10):  # Support up to 9 origins
    origin = os.getenv(f"ALLOWED_ORIGIN_{i}")
    if origin:
        origins.append(origin)
        print(f"Loaded ALLOWED_ORIGIN_{i}: {origin}")

# Fallback to localhost if no origins defined
if not origins:
    origins = ["http://localhost:3000"]

print(f"DEBUG: Final origins list: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "UPDATE", "DELETE", "PUT"],
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
