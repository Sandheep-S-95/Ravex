from fastapi import FastAPI, HTTPException, Depends, status, Header, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, field_validator
import os
import re
from supabase import create_client, Client
from dotenv import load_dotenv
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")

if not supabase_url or not supabase_key:
    logger.error("Missing required environment variables: SUPABASE_URL and/or SUPABASE_KEY")
    raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in the environment")

# Initialize Supabase client
supabase: Client = create_client(supabase_url, supabase_key)

# Initialize FastAPI app
app = FastAPI(title="Stock Trading App - Authentication Service")

# Configure CORS
allowed_origins = os.environ.get("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

# Constants
BEARER_TOKEN_PREFIX = "Bearer "

# Data models
class UserSignUp(BaseModel):
    email: EmailStr
    password: str
    
    @field_validator('password')
    @classmethod
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):  # Changed [0-9] to \d
            raise ValueError('Password must contain at least one number')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError('Password must contain at least one special character')
        return v

class UserMetadata(BaseModel):
    first_name: str
    last_name: str

class UserSignUpComplete(UserSignUp, UserMetadata):
    pass

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class ResetPasswordRequest(BaseModel):
    email: EmailStr

# Dependency for authenticated routes
async def get_current_user(authorization: str = Header(...)):
    try:
        token = authorization.split(BEARER_TOKEN_PREFIX)[1] if BEARER_TOKEN_PREFIX in authorization else authorization
        user_response = supabase.auth.get_user(token)
        if not user_response.user:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return user_response.user
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

# Routes
@app.post("/auth/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(user: UserSignUpComplete):
    try:
        auth_response = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password,
            "options": {
                "data": {"first_name": user.first_name, "last_name": user.last_name},
                "email_confirm": False
            }
        })
        if not auth_response.user or not auth_response.session:
            raise HTTPException(status_code=400, detail="Failed to create user account")
        return {
            "access_token": auth_response.session.access_token,
            "refresh_token": auth_response.session.refresh_token,
            "token_type": "bearer"
        }
    except Exception as e:
        if "User already registered" in str(e):
            raise HTTPException(status_code=409, detail="User with this email already exists")
        logger.error(f"Signup error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/auth/login", response_model=TokenResponse)
async def login(user: UserLogin):
    try:
        auth_response = supabase.auth.sign_in_with_password({
            "email": user.email,
            "password": user.password
        })
        if not auth_response.session:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return {
            "access_token": auth_response.session.access_token,
            "refresh_token": auth_response.session.refresh_token,
            "token_type": "bearer"
        }
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/auth/logout")
async def logout(authorization: str = Header(...), current_user=Depends(get_current_user)):
    try:
        token = authorization.split(BEARER_TOKEN_PREFIX)[1] if BEARER_TOKEN_PREFIX in authorization else authorization
        supabase.auth.set_session(token)
        supabase.auth.sign_out()
        return {"message": "Successfully logged out"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/auth/user")
async def get_current_user_info(current_user=Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "first_name": current_user.user_metadata.get("first_name"),
        "last_name": current_user.user_metadata.get("last_name"),
    }

@app.post("/auth/reset-password")
async def reset_password(request: ResetPasswordRequest):
    try:
        supabase.auth.reset_password_email(
            request.email,
            options={"redirect_to": "http://localhost:5173/update-password"}
        )
        return {"message": "Password reset email sent"}
    except Exception as e:
        logger.error(f"Reset password error: {str(e)}")
        return {"message": "If the email exists, a password reset link has been sent"}

@app.post("/auth/refresh-token", response_model=TokenResponse)
async def refresh_token(refresh_token: str = Form(...)):
    try:
        auth_response = supabase.auth.refresh_session(refresh_token)
        if not auth_response.session:
            raise HTTPException(status_code=401, detail="Invalid refresh token")
        return {
            "access_token": auth_response.session.access_token,
            "refresh_token": auth_response.session.refresh_token,
            "token_type": "bearer"
        }
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

class UpdatePasswordRequest(BaseModel):
    password: str
    access_token: str

@app.post("/auth/update-password")
async def update_password(request: UpdatePasswordRequest):
    try:
        supabase.auth.set_session(request.access_token)
        auth_response = supabase.auth.update_user(
            {"password": request.password}
        )
        if auth_response.user:
            return {"message": "Password updated successfully"}
        raise HTTPException(status_code=400, detail="Failed to update password")
    except Exception as e:
        logger.error(f"Update password error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)