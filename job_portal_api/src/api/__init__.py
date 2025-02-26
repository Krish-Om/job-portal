from fastapi import APIRouter

router = APIRouter()

from . import auth, jobs, applications

router.include_router(auth.router, prefix="/auth", tags=["auth"])
router.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
router.include_router(applications.router, prefix="/applications", tags=["applications"])