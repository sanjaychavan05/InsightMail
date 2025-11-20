from .analyze import router as analyze_router
from .history import router as history_router
from .analytics import router as analytics_router
from .settings import router as settings_router
from .knowledge_base import router as knowledge_base_router

__all__ = [
    "analyze_router",
    "history_router",
    "analytics_router",
    "settings_router",
    "knowledge_base_router"
]
