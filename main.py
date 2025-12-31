from flask import Flask, render_template
from dotenv import load_dotenv
load_dotenv()
from routers.leaderboard import leaderboard_bp


app = Flask(__name__)

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/leaderboard")
def leaderboard():
    return render_template("leaderboard.html")

@app.route("/profile")
def profile():
    return render_template("profile.html")

@app.route("/projects")
def projects():
    return render_template("projects.html")

from db.supabase import supabase
app.register_blueprint(leaderboard_bp)
@app.route("/debug/supabase")
def debug_supabase():
    res = supabase.table("users").select("id").limit(1).execute()
    return {"ok": True, "data": res.data}


if __name__ == "__main__":
    app.run(debug=True)
