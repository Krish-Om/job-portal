from sqlmodel import SQLModel, Field

class Application(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    job_id: int = Field(foreign_key="job.id")
    resume_path: str
    cover_letter: str