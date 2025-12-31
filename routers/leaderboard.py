from flask import Blueprint, jsonify
from db.supabase import supabase

leaderboard_bp = Blueprint("leaderboard", __name__)

@leaderboard_bp.route("/api/leaderboard", methods=["GET"])
def get_leaderboard():
    response = (
        supabase
        .table("users")
        .select(
            "id, github_username, avatar_url, public_repos, stars, followers, score"
        )
        .order("score", desc=True)
        .execute()
    )

    return jsonify(response.data), 200

