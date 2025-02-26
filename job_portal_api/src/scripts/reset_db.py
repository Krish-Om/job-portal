from sqlmodel import SQLModel
from src.database.session import engine
from src.models import User, Job, Application

def reset_db():
    """Reset database by dropping and recreating all tables"""
    print("Warning: This will delete all data!")
    response = input("Are you sure? (y/N): ")
    
    if response.lower() == 'y':
        print("Dropping all tables...")
        SQLModel.metadata.drop_all(engine)
        
        print("Creating fresh tables...")
        SQLModel.metadata.create_all(engine)
        print("Database reset complete!")
    else:
        print("Operation cancelled.")

if __name__ == "__main__":
    reset_db()