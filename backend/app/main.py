from fastapi import FastAPI
from app.routers import employers  # Import all your routers
from app.models.base import Base  # Import the base for database models
from app.database import engine  # Imp ort the database engine
from fastapi.middleware.cors import CORSMiddleware  # For handling CORS (if needed)

Base.metadata.create_all(bind=engine)  # Create database tables (if they don't exist)

app = FastAPI()


@app.get("/", description="root endpoint", tags=["root"])
async def root():
    return "Hello World"


# CORS (Cross-Origin Resource Sharing) - Configure as needed for your frontend
origins = [
    "http://localhost:8000",  # Or your frontend's URL(s)
    "http://localhost:3000",  # Example if your React app runs on port 3000
    # Add other origins as needed (e.g., your deployed frontend URL)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.include_router(auth.router, prefix="/api/auth")
app.include_router(employers.router, prefix="/api/employers")
# app.include_router(job_seekers.router, prefix="/api/job_seekers")
# app.include_router(jobs.router, prefix="/api/jobs")
# app.include_router(applications.router, prefix="/api/applications")
# app.include_router(admins.router, prefix="/api/admins")

# ... any other configurations (middleware, exception handlers, etc.)

