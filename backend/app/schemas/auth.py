from pydantic import BaseModel
from typing import Optional


class GoogleAuthCallback(BaseModel):
    code: str
    state: Optional[str] = None


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict
