from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from src.database.session import get_db
from src.models.user import User
from src.security import get_current_user
from src.services.storage import storage_service
import os
import uuid
from datetime import datetime
from pydantic import BaseModel

router = APIRouter()

# Get bucket name from environment
bucket_name = os.getenv("S3_BUCKET", "job-portal-resumes")


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
                detail={"msg": "File size exceeds 5MB limit", "loc": ["body", "file"]},
            )

        # Validate file type
        content_type = file.content_type or "application/octet-stream"
        if content_type != "application/pdf":
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail={"msg": "Only PDF files are allowed", "loc": ["body", "file"]},
            )

        # Generate unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_id = str(uuid.uuid4())[:8]
        file_path = f"{current_user.id}/{timestamp}_{unique_id}.pdf"

        # Upload to storage (MinIO in dev, Supabase in prod)
        try:
            # Reset file cursor to the beginning
            file.file.seek(0)

            # Upload file using storage service
            url = storage_service.upload_file(
                file_data=file.file, file_name=file_path, content_type="application/pdf"
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Upload failed: {str(e)}",
            )

        return FileUploadResponse(
            status="success", filename=file.filename, file_path=file_path, url=url
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@router.get("/download/{file_path:path}")
async def get_download_url(
    file_path: str, current_user: User = Depends(get_current_user)
):
    """Generate a download URL for a file"""
    try:
        # Create a presigned URL that expires in 1 hour
        presigned_url = storage_service.get_presigned_url(
            file_name=file_path, expiration=3600  # 1 hour
        )
        return {"download_url": presigned_url}
    except Exception as e:
        raise HTTPException(
            status_code=404, detail=f"File not found or access denied: {str(e)}"
        )


@router.delete("/files/{file_path:path}")
async def delete_file(file_path: str, current_user: User = Depends(get_current_user)):
    """Delete a file from storage"""
    # Check ownership - files should be in a directory named after the user ID
    if not file_path.startswith(f"{current_user.id}/"):
        raise HTTPException(
            status_code=403, detail="You do not have permission to delete this file"
        )

    try:
        success = storage_service.delete_file(file_path)
        if success:
            return {"status": "success", "message": "File deleted successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to delete file")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting file: {str(e)}")
