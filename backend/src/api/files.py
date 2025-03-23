from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from src.database.session import get_db
from src.models.user import User
from src.security import get_current_user
from src.services.file_storage import file_storage

router = APIRouter()

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload a resume file to storage"""
    # Validate file type
    allowed_types = ["application/pdf", "application/msword", 
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
    
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and Word documents are allowed"
        )
    
    try:
        # Save file to storage
        file_path = await file_storage.save_file(file, current_user.id)
        
        # Generate a URL for immediate access
        download_url = file_storage.get_file_url(file_path)
        
        return {
            "filename": file.filename,
            "file_path": file_path,
            "download_url": download_url
        }
    except Exception as e:
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
    # In production, verify the current user has access to this file
    
    url = file_storage.get_file_url(file_path)
    if not url:
        raise HTTPException(
            status_code=404,
            detail="File not found or access denied"
        )
    
    return {"download_url": url}