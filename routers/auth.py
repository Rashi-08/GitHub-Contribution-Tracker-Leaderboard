from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client
import httpx
import os

router = APIRouter()

# Initialize Supabase
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"), 
    os.getenv("SUPABASE_ANON_KEY")
)

GITHUB_TOKEN = os.getenv("GITHUB_ACCESS_TOKEN")
REDIRECT_URL = os.getenv("OAUTH_REDIRECT_URL", "http://localhost:8000/auth/callback")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

security = HTTPBearer()

# ============= DEPENDENCY FOR JWT VALIDATION =============
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Validates JWT token and returns current user"""
    try:
        token = credentials.credentials
        response = supabase.auth.get_user(token)
        
        if not response or not response.user:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        return response.user
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")


# ============= OAUTH LOGIN =============
@router.get("/login")
def login():
    """Initiates GitHub OAuth flow"""
    try:
        auth_response = supabase.auth.sign_in_with_oauth({
            "provider": "github",
            "options": {
                "redirect_to": REDIRECT_URL,
                "scopes": "read:user user:email"  # Request necessary permissions
            }
        })
        return {"auth_url": auth_response.url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OAuth init failed: {str(e)}")


# ============= OAUTH CALLBACK =============
@router.get("/callback")
async def callback(code: str):
    """Handles OAuth callback and stores user data"""
    try:
        # Exchange code for session
        session_response = supabase.auth.exchange_code_for_session({"auth_code": code})
        user = session_response.user
        access_token = session_response.session.access_token
        
        # Extract GitHub username
        username = user.user_metadata.get('user_name') or user.user_metadata.get('preferred_username')
        github_id = user.user_metadata.get('provider_id')  # GitHub user ID
        
        if not username or not github_id:
            raise HTTPException(status_code=400, detail="GitHub username or ID not found in metadata")
        
        async with httpx.AsyncClient() as client:
            # Fetch profile data
            profile_resp = await client.get(
                f"https://api.github.com/users/{username}",
                headers={"Authorization": f"token {GITHUB_TOKEN}"}
            )
            
            if profile_resp.status_code != 200:
                raise HTTPException(status_code=profile_resp.status_code, detail="Failed to fetch GitHub profile")
            
            profile_data = profile_resp.json()
            
            # Fetch projects/repos data
            repos_resp = await client.get(
                f"https://api.github.com/users/{username}/repos",
                headers={"Authorization": f"token {GITHUB_TOKEN}"}
            )
            
            if repos_resp.status_code != 200:
                raise HTTPException(status_code=repos_resp.status_code, detail="Failed to fetch GitHub repos")
            
            repos_data = repos_resp.json()
            
            # Sort repos by stars for top projects
            top_projects = sorted(repos_data, key=lambda x: x["stargazers_count"], reverse=True)[:10]
            projects_summary = {
                "total_projects": len(repos_data),
                "top_projects": [
                    {
                        "name": p["name"],
                        "stars": p["stargazers_count"],
                        "forks": p["forks_count"],
                        "language": p.get("language"),
                        "url": p["html_url"]
                    } for p in top_projects
                ]
            }
        
        # Store everything in Supabase
        user_data = {
            "github_id": github_id,
            "username": username,
            "email": user.email,
            "profile": profile_data,
            "projects": projects_summary,
            "is_logged": True,
            "updated_at": "now()"
        }
        
        supabase.table('users').upsert(user_data, on_conflict="github_id").execute()
        
        # Redirect to frontend with token
        from fastapi.responses import RedirectResponse

        return RedirectResponse(url=f"{FRONTEND_URL}?token={access_token}")
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Callback failed: {str(e)}")


# ============= GET CURRENT USER =============
@router.get("/me")
async def get_me(user = Depends(get_current_user)):
    """Returns current authenticated user with full data"""
    try:
        github_id = user.user_metadata.get('provider_id')
        
        # Fetch from database
        response = supabase.table('users').select('*').eq('github_id', github_id).execute()
        
        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=404, detail="User not found in database")
        
        user_data = response.data[0]
        
        return {
            "is_logged": user_data.get('is_logged', True),
            "github_id": user_data['github_id'],
            "username": user_data['username'],
            "email": user_data.get('email'),
            "profile": user_data.get('profile'),
            "projects": user_data.get('projects')
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch user: {str(e)}")


# ============= LOGOUT =============
@router.post("/logout")
async def logout(user = Depends(get_current_user)):
    """Logs out user and updates database"""
    try:
        github_id = user.user_metadata.get('provider_id')
        
        # Update is_logged flag
        supabase.table('users').update({'is_logged': False}).eq('github_id', github_id).execute()
        
        # Sign out from Supabase (invalidates JWT)
        supabase.auth.sign_out()
        
        return {
            "message": "Logged out successfully",
            "is_logged": False
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Logout failed: {str(e)}")
