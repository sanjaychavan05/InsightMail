"""
InsightMail Backend - FastAPI Main Application

Provides email analysis endpoints powered by Google Gemini.
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.api import analyze, history, dashboard, settings
from app.db.session import init_db

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="InsightMail API",
    description="AI-powered email analysis with Gemini integration",
    version="1.0.0",
)

# Configure CORS
origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    """Initialize database tables on startup"""
    init_db()

# Health check endpoint
@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "ok",
        "service": "InsightMail API",
        "version": "1.0.0",
        "docs": "/docs"
    }

# Register API routers
app.include_router(analyze.router, tags=["Analysis"])
app.include_router(history.router, prefix="/history", tags=["History"])
app.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
app.include_router(settings.router, prefix="/settings", tags=["Settings"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
