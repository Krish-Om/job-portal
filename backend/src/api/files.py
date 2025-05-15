from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from src.database.session import get_db
from src.models.user import User
from src.security import get_current_user
from supabase import create_client
import os
import uuid
from datetime import datetime
from pydantic import BaseModel

router = APIRouter()

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
bucket_name = os.getenv("SUPABASE_BUCKET", "job-portal-resumes")

# Initialize Supabase client with anon key
supabase = create_client(
    supabase_url,
    supabase_key,
)


class FileUploadResponse(BaseModel):
    status: str
    filename: str
    file_path: str
    url: str


@router.post(
    "/upload", response_model=FileUploadResponse, status_code=status.HTTP_201_CREATED
)
async def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Upload a resume file to Supabase Storage"""
    if not file or not file.filename:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"msg": "No file provided", "loc": ["body", "file"]},
        )

    try:
        contents = await file.read()
        if len(contents) > 5 * 1024 * 1024:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail={"msg": "File size exceeds 5MB limit",
                        "loc": ["body", "file"]},
            )

        # Validate file type
        content_type = file.content_type or "application/octet-stream"
        if content_type != "application/pdf":
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail={"msg": "Only PDF files are allowed",
                        "loc": ["body", "file"]},
            )

        # Generate unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_id = str(uuid.uuid4())[:8]
        file_path = f"{current_user.id}/{timestamp}_{unique_id}.pdf"

        # Upload to Supabase
        response = supabase.storage.from_(bucket_name).upload(
            path=file_path,
            file=contents,
            file_options={"content-type": "application/pdf"},
        )

        if not response:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Upload failed - no response from storage",
            )

        # Get file URL
        url = supabase.storage.from_(bucket_name).get_public_url(file_path)

        return FileUploadResponse(
            status="success", filename=file.filename, file_path=file_path, url=url
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"Upload error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@router.get("/download/{file_path:path}")
async def get_download_url(
    file_path: str, current_user: User = Depends(get_current_user)
):
    """Generate a download URL for a file"""
    try:
        url = supabase.storage.from_(bucket_name).create_signed_url(
            path=file_path,
            expires_in=3600,  # 1 hour
        )
        return {"download_url": url["signedURL"] if "signedURL" in url else None}
    except Exception as e:
        print(f"Error generating URL: {e}")
        raise HTTPException(
            status_code=404, detail="File not found or access denied")
