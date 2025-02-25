import subprocess
from pathlib import Path

def init_db():
    """Initialize the database using Alembic migrations"""
    project_root = Path(__file__).parent.parent.parent
    
    try:
        # Run Alembic migrations
        subprocess.run(
            ["alembic", "upgrade", "head"],
            check=True,
            cwd=project_root
        )
        print("Database initialized successfully!")
    except subprocess.CalledProcessError as e:
        print(f"Error initializing database: {e}")
        raise

if __name__ == "__main__":
    init_db()