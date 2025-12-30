# routers/contributions.py
from fastapi import APIRouter, HTTPException
import httpx
import os
from datetime import datetime, timedelta

router = APIRouter()

GITHUB_TOKEN = os.getenv("GITHUB_ACCESS_TOKEN")

@router.get("/{username}")
async def get_contributions(username: str):
    """
    Fetch GitHub contribution calendar data using GraphQL API
    """
    
    # GraphQL query for contribution calendar
    query = """
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                contributionLevel
              }
            }
          }
        }
      }
    }
    """
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "https://api.github.com/graphql",
                headers={
                    "Authorization": f"bearer {GITHUB_TOKEN}",
                    "Content-Type": "application/json"
                },
                json={
                    "query": query,
                    "variables": {"username": username}
                },
                timeout=30.0
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail="Failed to fetch contributions from GitHub"
                )
            
            data = response.json()
            
            if "errors" in data:
                raise HTTPException(
                    status_code=400,
                    detail=f"GitHub API error: {data['errors']}"
                )
            
            calendar = data["data"]["user"]["contributionsCollection"]["contributionCalendar"]
            
            # Flatten weeks into single array of days
            contributions = []
            for week in calendar["weeks"]:
                for day in week["contributionDays"]:
                    contributions.append({
                        "date": day["date"],
                        "count": day["contributionCount"],
                        "level": calculate_level(day["contributionCount"])
                    })
            
            return {
                "username": username,
                "total_contributions": calendar["totalContributions"],
                "contributions": contributions
            }
            
        except httpx.TimeoutException:
            raise HTTPException(status_code=504, detail="GitHub API timeout")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))


def calculate_level(count):
    """Calculate contribution level (0-4) based on count"""
    if count == 0:
        return 0
    elif count < 5:
        return 1
    elif count < 10:
        return 2
    elif count < 15:
        return 3
    else:
        return 4
