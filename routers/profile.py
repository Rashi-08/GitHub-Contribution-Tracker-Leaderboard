
from flask import Blueprint, jsonify
from services.github_service import fetch_profile, fetch_repos, calculate_stats
from db.supabase import supabase

profile_bp = Blueprint("profile", __name__)

@profile_bp.route("/profile/sync/<username>", methods=["GET"])
def sync_profile(username):
    profile = fetch_profile(username)
    if not profile:
        return {"error": "GitHub user not found"}, 404

    repos = fetch_repos(username)
    stats = calculate_stats(repos)

    user_data = {
        "github_username": profile["login"],
        "github_id": profile["id"],
        "avatar_url": profile["avatar_url"],
        "bio": profile["bio"],
        "followers": profile["followers"],
        "public_repos": stats["public_repos"],
        "stars": stats["stars"],
        "score": (stats["public_repos"] * 10) + stats["stars"] + (profile["followers"] * 2)
    }

    response = (
        supabase
        .table("users")
        .upsert(user_data, on_conflict="github_username")
        .execute()
    )

    return jsonify(response.data), 200
