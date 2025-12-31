from fastapi import APIRouter, HTTPException
import httpx
import os

router = APIRouter()

GITHUB_TOKEN = os.getenv("GITHUB_ACCESS_TOKEN")

@router.get("/{username}")
async def get_profile(username: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"https://api.github.com/users/{username}", headers={"Authorization": f"token {GITHUB_TOKEN}"})
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="User not found")
        data = response.json()
        return {
            "username": data["login"],
            "name": data.get("name"),
            "bio": data.get("bio"),
            "followers": data["followers"],
            "following": data["following"],
            "public_repos": data["public_repos"]
        }