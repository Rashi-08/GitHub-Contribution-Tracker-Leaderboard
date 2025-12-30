from flask import Blueprint, jsonify
from db import get_leaderboard_users

leaderboard_bp = Blueprint("leaderboard", __name__)


@leaderboard_bp.route("/leaderboard", methods=["GET"])
def get_leaderboard():
    """Get leaderboard data from Supabase"""
    try:
        users = get_leaderboard_users(limit=50)

        # Transform data to match frontend expectations
        leaderboard_data = []
        for user in users:
            leaderboard_data.append({
                "username": user["username"],
                "repos": user["public_repos"],
                "stars": user["total_stars"],
                "commits": user["total_commits"],
                "followers": user["followers"],
                "score": user["score"],
                "projects": ["GitHub Projects"]  # This could be enhanced later
            })

        return jsonify(leaderboard_data), 200
    except Exception as e:
        print(f"Error fetching leaderboard: {e}")
        # Fallback to empty list if database fails
        return jsonify([]), 500
