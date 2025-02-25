from fastapi import FastAPI
from src.database.session import engine
from src.models import user, job, application
from src.api import auth, jobs, applications

app = FastAPI()

# Include the routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
app.include_router(applications.router, prefix="/applications", tags=["applications"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Elevate Workforce Solutions Job Portal API"}

# Create the database tables
@app.on_event("startup")
def on_startup():
    from sqlmodel import SQLModel
    SQLModel.metadata.create_all(bind=engine)