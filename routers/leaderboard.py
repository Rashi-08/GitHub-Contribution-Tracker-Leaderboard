from fastapi import APIRouter
from supabase import create_client, Client
import os

router = APIRouter()

supabase: Client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_ANON_KEY"))

@router.get("/")
def get_leaderboard():
    response = supabase.table('users').select('*').execute()
    users = response.data
    
    # Better heuristic using both profile and projects data
    for user in users:
        profile = user.get('profile', {})
        projects = user.get('projects', {})
        
        followers = profile.get('followers', 0)
        public_repos = profile.get('public_repos', 0)
        
        # Use stored project stats if available
        total_stars = projects.get('total_stars', 0)
        total_forks = projects.get('total_forks', 0)
        
        # Weighted scoring: stars matter most, then followers, then repos
        user['score'] = (
            total_stars * 2.0 +      # Stars are most important
            followers * 0.5 +         # Followers show influence
            total_forks * 0.3 +       # Forks show usage
            public_repos * 0.1        # Repo count matters least
        )
    
    # Sort by score descending
    leaderboard = sorted(users, key=lambda x: x.get('score', 0), reverse=True)
    
    return {
        "leaderboard": [
            {
                "username": u['username'],
                "score": round(u['score'], 2),
                "followers": u.get('profile', {}).get('followers', 0),
                "total_stars": u.get('projects', {}).get('total_stars', 0),
                "total_projects": u.get('projects', {}).get('total_projects', 0)
            } for u in leaderboard
        ]
    }
