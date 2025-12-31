from fastapi import APIRouter, HTTPException
import httpx
import os

router = APIRouter()

GITHUB_TOKEN = os.getenv("GITHUB_ACCESS_TOKEN")

@router.get("/{username}")
async def get_projects(username: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"https://api.github.com/users/{username}/repos", headers={"Authorization": f"token {GITHUB_TOKEN}"})
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Failed to fetch projects")
        repos = response.json()
        # Sort by stars for top projects
        top_projects = sorted(repos, key=lambda x: x["stargazers_count"], reverse=True)[:10]
        return {
            "username": username,
            "total_projects": len(repos),
            "top_projects": [{"name": p["name"], "stars": p["stargazers_count"], "forks": p["forks_count"]} for p in top_projects]
        }