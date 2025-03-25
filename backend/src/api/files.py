from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from src.database.session import get_db
from src.models.user import User
from src.security import get_current_user
from typing import Optional
from supabase import create_client
import os
import uuid
from datetime import datetime

router = APIRouter()

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
bucket_name = os.getenv("SUPABASE_BUCKET", "job-portal-resumes")

supabase = create_client(supabase_url, supabase_key)

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload a resume file to Supabase Storage"""
    # Validate file type
    allowed_types = ["application/pdf", "application/msword", 
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
    
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and Word documents are allowed"
        )
    
    # Check file size (5MB max)
    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:  # 5MB in bytes
        raise HTTPException(
            status_code=400,
            detail="File size exceeds the 5MB limit"
        )
    
    try:
        # Generate unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_id = str(uuid.uuid4())[:8]
        ext = os.path.splitext(file.filename or "")[1].lower()
        file_path = f"user_{current_user.id}/{timestamp}_{unique_id}{ext}"
        
        # Upload to Supabase
        response = supabase.storage.from_(bucket_name).upload(
            path=file_path,
            file=contents,
            file_options={"content-type": file.content_type}
        )
        
        if response.get("error"):
            raise HTTPException(
                status_code=500,
                detail=f"Error uploading file: {response['error']['message']}"
            )
        
        # Generate a URL for immediate access
        url = supabase.storage.from_(bucket_name).create_signed_url(
            path=file_path,
            expires_in=3600  # 1 hour
        )
        
        return {
            "filename": file.filename,
            "file_path": file_path,
            "download_url": url["signedURL"] if "signedURL" in url else None
        }
    except Exception as e:
        print(f"Error uploading file: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error uploading file: {str(e)}"
        )

@router.get("/download/{file_path:path}")
async def get_download_url(
    file_path: str,
    current_user: User = Depends(get_current_user)
):
    """Generate a download URL for a file"""
    try:
        url = supabase.storage.from_(bucket_name).create_signed_url(
            path=file_path,
            expires_in=3600  # 1 hour
        )
        return {"download_url": url["signedURL"] if "signedURL" in url else None}
    except Exception as e:
        print(f"Error generating URL: {e}")
        raise HTTPException(
            status_code=404,
            detail="File not found or access denied"
        )