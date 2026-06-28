"""
Core configuration settings for InsightMail Backend
"""
from pydantic_settings import BaseSettings
from typing import Union, List


class Settings(BaseSettings):
    """Application settings"""
    
    # API Configuration
    APP_NAME: str = "InsightMail Backend"
    APP_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Database
    DATABASE_URL: str = "sqlite:///./insightmail.db"
    # For PostgreSQL: "postgresql://user:password@localhost/dbname"
    
    # Ollama Configuration
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "gemma:2b"
    OLLAMA_EMBEDDING_MODEL: str = "nomic-embed-text"
    OLLAMA_TIMEOUT: int = 120
    
    # RAG Configuration
    RAG_TOP_K: int = 3
    RAG_SIMILARITY_THRESHOLD: float = 0.5
    
    # CORS
    CORS_ORIGINS: Union[str, List[str]] = "http://localhost:5173,http://localhost:3000,http://localhost:8080"
    
    # Security
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Parse CORS_ORIGINS if it's a string
        if isinstance(self.CORS_ORIGINS, str):
            self.CORS_ORIGINS = [origin.strip() for origin in self.CORS_ORIGINS.split(',')]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
