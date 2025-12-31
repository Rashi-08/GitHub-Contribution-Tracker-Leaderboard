# GitHub Contribution Tracker & Leaderboard

A full-stack web app that authenticates with GitHub, visualizes yearly contribution activity, and ranks users on a leaderboard using a consistent scoring model.

**Live**
- Frontend: https://github-contribution-tracker-leaderboard.onrender.com
- API: https://githubtrackerdemo.onrender.com
- API Docs: https://githubtrackerdemo.onrender.com/docs

---

## Overview

This project provides an interactive interface to explore GitHub activity: sign in, view your contribution heatmap, inspect your projects, and compare yourself against others on a live leaderboard.  
The UI is designed to feel responsive and “alive” with clear states, subtle motion, and instant feedback when switching views or hovering over interactive elements.

---

## Features

- **GitHub OAuth login** handled entirely on the backend, with a smooth redirect flow from the UI.
- **Profile view** for any username, including avatar, bio, and high-level stats.
- **Yearly contribution heatmap** with day-wise entries, rendered as an interactive grid that reacts on hover.
- **Projects panel** showing repositories and highlighting top projects (for example, by stars).
- **Leaderboard** that ranks users with a deterministic score, with hover effects to surface more details in place.
- **Responsive layout** with glassmorphism-inspired styling and layered depth for cards and panels.
- **Session lifecycle**: login → callback → authenticated view → logout, with clear UI states for each step.
- **Health endpoint** for simple uptime and monitoring checks.

---

## Scoring model :

The leaderboard score is computed from a small set of public GitHub signals so rankings remain explainable and stable.

- **Contributions (last 12 months):** Primary activity signal based on the contribution calendar.
- **Followers:** Light “impact” signal to differentiate more followed profiles.
- **Repository traction:** Aggregate repo signals such as stars and forks.
- **Repository activity/volume:** Repo count and presence of active repositories as balancing signals.
- **Normalization:** Metrics are scaled so no single value (like one viral repo) dominates the score.
- **Determinism:** Given the same user data snapshot, the leaderboard produces the same score and rank.

---

## API services

The backend exposes feature-focused endpoints so the frontend only needs a single API base URL.

### Authentication (`/auth`)

- `GET /auth/login`  
  Initiates the GitHub OAuth flow.

- `GET /auth/callback?code=...`  
  Handles the callback, exchanges the code for a session, stores a user snapshot, and redirects back to the frontend with a token.

- `GET /auth/me`  
  Returns the authenticated user for the current token.

- `POST /auth/logout`  
  Logs out the user and updates stored login state.

### Profile (`/profile`)

- `GET /profile/{username}`  
  Returns profile data for the requested username.

### Projects (`/projects`)

- `GET /projects/{username}`  
  Returns repository stats and top projects, typically sorted by stars.

### Contributions (`/contributions`)

- `GET /contributions/{username}`  
  Returns the yearly contribution calendar in a flattened, heatmap-ready format with totals and per-day intensity.

### Leaderboard (`/leaderboard`)

- `GET /leaderboard`  
  Returns ranked users with scores and the key stats used to compute them.

### Health (`/health`)

- `GET /health`  
  Minimal service health check endpoint.

---

## Frontend experience

The frontend is a static, JavaScript-enhanced UI that interacts with the backend API and focuses on clear, responsive interactions.

- **Single-page feel:** Navigation between dashboard, profile, and leaderboard views minimizes full-page reloads.
- **Interactive cards:** Hover states, smooth transitions, and layered cards create depth without clutter.
- **Heatmap interactions:** Contribution cells react on hover to show exact dates and counts, making peaks and quiet periods easy to inspect.
- **Responsive design:** Layout adapts from desktop to smaller screens by rearranging panels instead of hiding content.

---

## Tech stack

- **Backend:** FastAPI (Python), GitHub REST API, GitHub GraphQL API, Supabase for persistence and auth storage.
- **Frontend:** HTML, CSS, and vanilla JavaScript.
- **Styling:** Custom glassmorphism and utility styles defined across `style.css`, `styles.css`, and `glass.css`.

---

## Local development

### Backend

1. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv .venv
   source .venv/bin/activate   # Linux/macOS
   .venv\Scripts\activate      # Windows
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set environment variables (example names):
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `FRONTEND_URL`
4. Run the API:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend

1. Open `index.html` directly in a browser **or** serve it with a simple static server:
   ```bash
   python -m http.server 8000
   # then open http://localhost:8000/index.html
   ```
2. Ensure the frontend API base URL in your JavaScript (e.g., in `api.js`) points to the backend (for local dev, something like `http://localhost:8000`).

---

## Project structure

```text
routers/
  auth.py
  profile.py
  projects.py
  contributions.py
  leaderboard.py

static/
  index.html
  leaderboard.html
  profile.html
  app.js
  api.js
  style.css
  styles.css
  glass.css
```

---

## Notes

Deployement procedure is noted in Deployement notes, follow the exact procedure to deploy on your own.
