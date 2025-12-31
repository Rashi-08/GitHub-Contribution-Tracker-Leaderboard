
# Deployment Guide

## Prerequisites
- GitHub account
- Supabase account
- Render account (backend)
- Vercel/Netlify account (frontend)

---

## Step 1: Setup GitHub OAuth App

1. Go to **GitHub Settings** → **Developer settings** → **OAuth Apps**
2. Click **New OAuth App**
3. Fill in:
   - **Application name:** GitHub Contribution Tracker
   - **Homepage URL:** `https://your-supabase-project.supabase.co`
   - **Authorization callback URL:** `https://your-supabase-project.supabase.co/auth/v1/callback`
4. Click **Register application**
5. **Save these for later:**
   - Client ID
   - Client Secret (click "Generate a new client secret")

---

## Step 2: Setup Supabase

1. Go to [supabase.com](https://supabase.com) and create new project
2. Wait for project to provision (~2 minutes)
3. Go to **Authentication** → **Providers** → **GitHub**
4. Enable GitHub provider
5. Paste your GitHub OAuth credentials:
   - **Client ID:** `<from Step 1>`
   - **Client Secret:** `<from Step 1>`
6. Copy the **Callback URL** shown (looks like `https://xxxxx.supabase.co/auth/v1/callback`)
7. Go back to GitHub OAuth App and update **Authorization callback URL** with this Supabase URL
8. **Save these from Supabase:**
   - Go to **Settings** → **API**
   - Copy **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - Copy **anon public** key

---

## Step 3: Deploy Backend (Render)

1. Go to [render.com](https://render.com) and create **New Web Service**
2. Connect your GitHub repo
3. Configure:
   - **Name:** `github-tracker-backend`
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add **Environment Variables:**
   ```
   GITHUB_CLIENT_ID=<your GitHub OAuth Client ID>
   GITHUB_CLIENT_SECRET=<your GitHub OAuth Client Secret>
   GITHUB_ACCESS_TOKEN=<GitHub Personal Access Token>
   SUPABASE_URL=<from Step 2>
   SUPABASE_KEY=<from Step 2>
   ALLOWED_ORIGINS=https://your-frontend.vercel.app
   REDIRECT_URI=https://your-frontend.vercel.app/
   ```
5. Click **Create Web Service**
6. **Copy your backend URL** (e.g., `https://github-tracker-backend.onrender.com`)

---

## Step 4: Update Backend Auth Configuration

1. Open `routers/auth.py`
2. Update the callback/redirect URLs with your deployed **frontend URL**:
   ```
   REDIRECT_URI = "https://your-frontend.vercel.app/"
   ```
3. Commit and push changes (Render will auto-deploy)

---

## Step 5: Deploy Frontend (Vercel/Netlify)

1. Go to [vercel.com](https://vercel.com) (or Netlify)
2. Import your GitHub repo
3. **Before deploying**, update `static/api.js`:
   ```
   const API_BASE_URL = 'https://github-tracker-backend.onrender.com';
   ```
4. Configure:
   - **Framework Preset:** Other (static)
   - **Root Directory:** `./` (or wherever your HTML files are)
5. Click **Deploy**
6. **Copy your frontend URL** (e.g., `https://github-tracker.vercel.app`)

---

## Step 6: Final Configuration

1. **Update Backend:**
   - In Render environment variables, set:
     - `ALLOWED_ORIGINS=https://github-tracker.vercel.app`
     - `REDIRECT_URI=https://github-tracker.vercel.app/`
   - Redeploy if needed

2. **Update Supabase:**
   - Go to **Authentication** → **URL Configuration**
   - Add your Vercel URL to **Redirect URLs**

3. **Update GitHub OAuth App:**
   - Go back to GitHub OAuth App settings
   - Verify **Authorization callback URL** is still the Supabase callback

---

## Step 7: Test Everything

1. Visit your Vercel frontend: `https://github-tracker.vercel.app`
2. Click **Login with GitHub**
3. Authorize on GitHub
4. Should redirect back with authentication
5. Dashboard should load with your data

---

## Troubleshooting

### "OAuth callback mismatch"
- Verify Supabase callback URL matches GitHub OAuth App exactly
- Check for trailing slashes

### CORS errors
- Update `ALLOWED_ORIGINS` in backend to include frontend URL
- Restart Render service

### API not responding
- Check backend logs in Render dashboard
- Verify `/health` endpoint works
- Check all environment variables are set

### Data not loading
- Open browser DevTools → Network tab
- Check if API calls are hitting correct backend URL
- Verify `GITHUB_ACCESS_TOKEN` is valid

---

## Flow Summary

```
User clicks Login
    ↓
Frontend redirects to Backend /auth/login
    ↓
Backend redirects to Supabase GitHub OAuth
    ↓
Supabase redirects to GitHub authorization
    ↓
User authorizes
    ↓
GitHub redirects to Supabase callback
    ↓
Supabase processes and redirects to Frontend with token
    ↓
Frontend stores token and calls Backend API
    ↓
Backend validates token and returns user data
```

---

## Production Checklist

- [ ] `.env` in `.gitignore`
- [ ] GitHub OAuth callback set to Supabase URL
- [ ] Supabase redirect URLs include frontend URL
- [ ] Backend environment variables all set
- [ ] Frontend `API_BASE_URL` points to Render backend
- [ ] Backend `REDIRECT_URI` points to Vercel frontend
- [ ] CORS configured with frontend URL
- [ ] Test login flow end-to-end
- [ ] Test API endpoints return data
- [ ] Check contribution graph loads
- [ ] Verify leaderboard works

---
