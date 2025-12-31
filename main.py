from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

from routers import auth, profile, projects, leaderboard, contributions

# Initialize FastAPI with metadata
app = FastAPI(
    title="GitHub Contribution Tracker API",
    description="Backend API for tracking GitHub contributions and generating leaderboards",
    version="1.0.0",
    docs_url="/docs",  # Swagger UI
    redoc_url="/redoc"  # ReDoc UI
)

# CORS Configuration
# For production, replace "*" with your actual frontend domain
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use env var for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global exception handler for better error responses
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "error": str(exc) if os.getenv("DEBUG") == "true" else "An error occurred"
        }
    )

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(profile.router, prefix="/profile", tags=["Profile"])
app.include_router(projects.router, prefix="/projects", tags=["Projects"])
app.include_router(leaderboard.router, prefix="/leaderboard", tags=["Leaderboard"])
app.include_router(contributions.router, prefix="/contributions", tags=["Contributions"])

# Root endpoint with API info
@app.get("/", tags=["Root"])
def read_root():
    return {
        "message": "GitHub Contribution Tracker API",
        "version": "1.0.0",
        "endpoints": {
            "docs": "/docs",
            "redoc": "/redoc",
            "health": "/health"
        }
    }

# Health check endpoint (useful for monitoring and Render)
@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "github-leaderboard-api"
    }
