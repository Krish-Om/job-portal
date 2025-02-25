from fastapi import FastAPI
from src.database.session import engine
from src.database.init_db import init_db
from src.models import user, job, application
from src.api import auth, jobs, applications

app = FastAPI()

# @app.on_event("startup")
# async def on_startup():
#     init_db()

# Register routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
app.include_router(applications.router, prefix="/applications", tags=["applications"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Elevate Workforce Solutions Job Portal API"}