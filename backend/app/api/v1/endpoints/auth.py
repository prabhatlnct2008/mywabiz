from fastapi import APIRouter, HTTPException, Response, Request
from fastapi.responses import RedirectResponse
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from google_auth_oauthlib.flow import Flow
from datetime import datetime
import httpx
from bson import ObjectId

from app.core.config import settings
from app.core.database import get_database
from app.core.security import create_access_token, get_current_user
from app.schemas.auth import AuthResponse
from app.schemas.user import UserResponse

router = APIRouter()

# OAuth scopes
SCOPES = [
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
]


def get_google_auth_url() -> str:
    """Generate Google OAuth authorization URL."""
    base_url = "https://accounts.google.com/o/oauth2/v2/auth"
    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": " ".join(SCOPES),
        "access_type": "offline",
        "prompt": "consent",
    }
    query_string = "&".join(f"{k}={v}" for k, v in params.items())
    return f"{base_url}?{query_string}"


@router.get("/google")
async def google_auth():
    """Initiate Google OAuth flow."""
    auth_url = get_google_auth_url()
    return RedirectResponse(url=auth_url)


@router.get("/google/callback")
async def google_callback(code: str, response: Response):
    """Handle Google OAuth callback."""
    try:
        # Exchange code for tokens
        token_url = "https://oauth2.googleapis.com/token"
        async with httpx.AsyncClient() as client:
            token_response = await client.post(
                token_url,
                data={
                    "code": code,
                    "client_id": settings.GOOGLE_CLIENT_ID,
                    "client_secret": settings.GOOGLE_CLIENT_SECRET,
                    "redirect_uri": settings.GOOGLE_REDIRECT_URI,
                    "grant_type": "authorization_code",
                },
            )

            if token_response.status_code != 200:
                raise HTTPException(status_code=400, detail="Failed to exchange code for tokens")

            tokens = token_response.json()
            access_token = tokens.get("access_token")
            id_token_str = tokens.get("id_token")

            # Get user info
            userinfo_response = await client.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={"Authorization": f"Bearer {access_token}"},
            )

            if userinfo_response.status_code != 200:
                raise HTTPException(status_code=400, detail="Failed to get user info")

            user_info = userinfo_response.json()

        # Upsert user in database
        db = get_database()
        google_id = user_info.get("id")
        email = user_info.get("email")
        name = user_info.get("name")
        avatar_url = user_info.get("picture")

        existing_user = await db.users.find_one({"google_id": google_id})

        if existing_user:
            # Update existing user
            await db.users.update_one(
                {"_id": existing_user["_id"]},
                {
                    "$set": {
                        "email": email,
                        "name": name,
                        "avatar_url": avatar_url,
                        "updated_at": datetime.utcnow(),
                    }
                },
            )
            user_id = str(existing_user["_id"])
        else:
            # Create new user
            result = await db.users.insert_one(
                {
                    "google_id": google_id,
                    "email": email,
                    "name": name,
                    "avatar_url": avatar_url,
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow(),
                }
            )
            user_id = str(result.inserted_id)

        # Create JWT token
        jwt_token = create_access_token(data={"sub": user_id})

        # Set cookie and redirect to frontend
        redirect_url = f"{settings.FRONTEND_URL}/dashboard"
        redirect_response = RedirectResponse(url=redirect_url)
        redirect_response.set_cookie(
            key="access_token",
            value=jwt_token,
            httponly=True,
            secure=True,  # Set to False in development
            samesite="lax",
            max_age=settings.JWT_EXPIRATION_HOURS * 3600,
        )

        return redirect_response

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = None):
    """Get current authenticated user."""
    from fastapi import Depends
    from app.core.security import get_current_user

    # This needs to use Depends in the actual route
    # For now, we'll import it directly
    pass


@router.get("/me")
async def get_current_user_info(request: Request):
    """Get current authenticated user."""
    from app.core.security import get_current_user

    try:
        user = await get_current_user(request, None)
        return UserResponse(
            id=str(user["_id"]),
            email=user["email"],
            name=user["name"],
            avatar_url=user.get("avatar_url"),
            created_at=user["created_at"],
        )
    except Exception as e:
        raise HTTPException(status_code=401, detail="Not authenticated")


@router.post("/logout")
async def logout(response: Response):
    """Logout user by clearing the cookie."""
    response.delete_cookie(key="access_token")
    return {"message": "Logged out successfully"}
