import os
from typing import Optional, BinaryIO, Dict, Any
import boto3
from botocore.client import Config


class StorageService:
    """
    Unified storage service that works with both MinIO (dev) and Supabase (production).
    Uses environment variables to determine which service to use.
    """

    def __init__(self):
        self.provider = os.getenv("S3_PROVIDER", "minio")
        self.bucket = os.getenv("S3_BUCKET", "job-portal-resumes")

        if self.provider == "supabase":
            # Supabase Storage is S3-compatible
            self.client = boto3.client(
                "s3",
                endpoint_url=f"{os.getenv('SUPABASE_URL')}/storage/v1",
                aws_access_key_id=os.getenv("SUPABASE_KEY"),
                aws_secret_access_key=os.getenv("SUPABASE_SERVICE_KEY"),
                config=Config(signature_version="s3v4"),
            )
        else:
            # MinIO configuration
            self.client = boto3.client(
                "s3",
                endpoint_url=os.getenv("S3_ENDPOINT", "http://minio:9000"),
                aws_access_key_id=os.getenv("S3_ACCESS_KEY", "minioadmin"),
                aws_secret_access_key=os.getenv("S3_SECRET_KEY", "minioadmin"),
                region_name=os.getenv("S3_REGION", "us-east-1"),
                config=Config(signature_version="s3v4"),
                use_ssl=os.getenv("S3_USE_SSL", "false").lower() == "true",
            )

    def upload_file(
        self, file_data: BinaryIO, file_name: str, content_type: str = None
    ) -> str:
        """
        Upload a file to the storage service

        Args:
            file_data: The file data as a binary stream
            file_name: The name to give the file
            content_type: The MIME type of the file

        Returns:
            The URL to access the file
        """
        extra_args = {}
        if content_type:
            extra_args["ContentType"] = content_type

        self.client.upload_fileobj(
            file_data, self.bucket, file_name, ExtraArgs=extra_args
        )

        # Return the URL to the file
        if self.provider == "supabase":
            base_url = (
                f"{os.getenv('SUPABASE_URL')}/storage/v1/object/public/{self.bucket}"
            )
            return f"{base_url}/{file_name}"
        else:
            # For MinIO
            base_url = os.getenv("S3_ENDPOINT", "http://localhost:9000")
            return f"{base_url}/{self.bucket}/{file_name}"

    def get_presigned_url(self, file_name: str, expiration: int = 3600) -> str:
        """
        Generate a pre-signed URL for downloading a file

        Args:
            file_name: The name of the file
            expiration: URL expiration time in seconds (default 1 hour)

        Returns:
            A pre-signed URL
        """
        return self.client.generate_presigned_url(
            "get_object",
            Params={"Bucket": self.bucket, "Key": file_name},
            ExpiresIn=expiration,
        )

    def delete_file(self, file_name: str) -> bool:
        """
        Delete a file from storage

        Args:
            file_name: The name of the file to delete

        Returns:
            Success status
        """
        try:
            self.client.delete_object(Bucket=self.bucket, Key=file_name)
            return True
        except Exception as e:
            print(f"Error deleting file: {e}")
            return False


# Create a singleton instance
storage_service = StorageService()
