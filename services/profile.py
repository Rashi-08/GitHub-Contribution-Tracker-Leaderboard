from flask import Blueprint, jsonify, session
import requests
from db import create_or_update_user, calculate_user_score

profile_bp = Blueprint("profile", __name__)

GITHUB_API = "https://api.github.com"


def get_github_user_data(access_token):
    """Fetch comprehensive user data from GitHub API"""
    headers = {
        "Authorization": f"token {access_token}"
    }

    # Get user profile
    user_res = requests.get(f"{GITHUB_API}/user", headers=headers)
    user_data = user_res.json()

    if user_res.status_code != 200:
        return None

    # Get user repositories
    repos_res = requests.get(f"{GITHUB_API}/user/repos?per_page=100", headers=headers)
    repos_data = repos_res.json() if repos_res.status_code == 200 else []

    # Calculate metrics
    total_stars = sum(repo.get("stargazers_count", 0) for repo in repos_data)
    total_commits = 0  # This would require more complex API calls

    # Prepare user data for database
    db_user_data = {
        "github_id": user_data.get("id"),
        "username": user_data.get("login"),
        "name": user_data.get("name"),
        "email": user_data.get("email"),
        "avatar_url": user_data.get("avatar_url"),
        "bio": user_data.get("bio"),
        "location": user_data.get("location"),
        "company": user_data.get("company"),
        "blog": user_data.get("blog"),
        "twitter_username": user_data.get("twitter_username"),
        "public_repos": user_data.get("public_repos", 0),
        "public_gists": user_data.get("public_gists", 0),
        "followers": user_data.get("followers", 0),
        "following": user_data.get("following", 0),
        "total_stars": total_stars,
        "total_commits": total_commits,
        "score": 0  # Will be calculated
    }

    # Calculate score
    db_user_data["score"] = calculate_user_score(db_user_data)

    # Store/update user in database
    stored_user = create_or_update_user(db_user_data)

    # Return data for API response
    return {
        "username": stored_user["username"] if stored_user else user_data.get("login"),
        "name": stored_user["name"] if stored_user else user_data.get("name"),
        "email": stored_user["email"] if stored_user else user_data.get("email"),
        "avatar": stored_user["avatar_url"] if stored_user else user_data.get("avatar_url"),
        "bio": stored_user["bio"] if stored_user else user_data.get("bio"),
        "location": stored_user["location"] if stored_user else user_data.get("location"),
        "company": stored_user["company"] if stored_user else user_data.get("company"),
        "followers": stored_user["followers"] if stored_user else user_data.get("followers", 0),
        "following": stored_user["following"] if stored_user else user_data.get("following", 0),
        "public_repos": stored_user["public_repos"] if stored_user else user_data.get("public_repos", 0),
        "public_gists": stored_user["public_gists"] if stored_user else user_data.get("public_gists", 0),
        "total_stars": stored_user["total_stars"] if stored_user else total_stars,
        "score": stored_user["score"] if stored_user else db_user_data["score"],
        "tags": ["AI", "Web"]  # This could be dynamic based on repos
    }


@profile_bp.route("/profile", methods=["GET"])
def profile():
    if "access_token" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    user = get_github_user_data(session["access_token"])

    if not user:
        return jsonify({"error": "Failed to fetch user data"}), 500

    return jsonify(user), 200