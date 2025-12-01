from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserCreate(BaseModel):
    google_id: str
    email: EmailStr
    name: str
    avatar_url: Optional[str] = None


class UserResponse(BaseModel):
    id: str
    email: EmailStr
    name: str
    avatar_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
