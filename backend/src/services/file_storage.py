import os
import uuid
from datetime import datetime, timedelta
from fastapi import UploadFile
from typing import Optional
from supabase import create_client, Client

class SupabaseStorage:
    def __init__(self):
        # Get Supabase credentials from environment variables
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_KEY")
        self.bucket_name = os.getenv("SUPABASE_BUCKET", "resumes")
        
        # Initialize Supabase client
        self.supabase: Client = create_client(supabase_url, supabase_key)
    
    async def save_file(self, file: UploadFile, user_id: int) -> str:
        """Upload a file to Supabase Storage and return its path"""
        # Generate a unique path for the file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_id = str(uuid.uuid4())[:8]
        
        # Extract file extension
        filename = file.filename or "document"
        ext = os.path.splitext(filename)[1].lower()
        
        # Create file path (user_id folder for organization)
        file_path = f"user_{user_id}/{timestamp}_{unique_id}{ext}"
        
        # Read file content
        content = await file.read()
        
        # Upload to Supabase Storage
        result = self.supabase.storage.from_(self.bucket_name).upload(
            path=file_path,
            file=content,
            file_options={"content-type": file.content_type}
        )
        
        # Reset file cursor in case it's needed later
        await file.seek(0)
        
        # Return the file path (used as identifier)
        return file_path
    
    def get_file_url(self, file_path: str, expires: int = 3600) -> Optional[str]:
        """Generate a URL for accessing the file"""
        try:
            # For public buckets, use this
            # url = self.supabase.storage.from_(self.bucket_name).get_public_url(file_path)
            
            # For private buckets, use signed URLs
            url = self.supabase.storage.from_(self.bucket_name).create_signed_url(
                path=file_path,
                expires_in=expires
            )
            return url["signedURL"] if "signedURL" in url else None
        except Exception as e:
            print(f"Error generating URL: {e}")
            return None
    
    def delete_file(self, file_path: str) -> bool:
        """Delete a file from storage"""
        try:
            self.supabase.storage.from_(self.bucket_name).remove([file_path])
            return True
        except Exception as e:
            print(f"Error deleting file: {e}")
            return False

# Create a singleton instance
file_storage = SupabaseStorage()