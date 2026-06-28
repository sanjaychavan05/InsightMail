"""
InsightMail Backend - Main FastAPI Application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.core.config import settings
from app.db import init_db
from app.routers import (
    analyze_router,
    history_router,
    analytics_router,
    settings_router,
    knowledge_base_router
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifecycle manager for startup and shutdown events
    """
    # Startup
    logger.info("Starting InsightMail Backend...")
    logger.info(f"Initializing database: {settings.DATABASE_URL}")
    init_db()
    logger.info("Database initialized successfully")
    logger.info(f"Ollama endpoint: {settings.OLLAMA_BASE_URL}")
    logger.info(f"LLM Model: {settings.OLLAMA_MODEL}")
    logger.info(f"Embedding Model: {settings.OLLAMA_EMBEDDING_MODEL}")
    
    yield
    
    # Shutdown
    logger.info("Shutting down InsightMail Backend...")


# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Complete AI-powered email analysis backend with RAG integration",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(analyze_router, prefix=settings.API_V1_STR)
app.include_router(history_router, prefix=settings.API_V1_STR)
app.include_router(analytics_router, prefix=settings.API_V1_STR)
app.include_router(settings_router, prefix=settings.API_V1_STR)
app.include_router(knowledge_base_router, prefix=settings.API_V1_STR)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "endpoints": {
            "analyze": f"{settings.API_V1_STR}/analyze",
            "history": f"{settings.API_V1_STR}/history",
            "analytics": f"{settings.API_V1_STR}/analytics",
            "settings": f"{settings.API_V1_STR}/settings",
            "knowledge_base": f"{settings.API_V1_STR}/kb"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": settings.APP_VERSION
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
