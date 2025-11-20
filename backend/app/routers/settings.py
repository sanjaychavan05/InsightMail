"""
Settings Router
Handles application settings management
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db, Settings
from app.schemas import SettingsRequest, SettingsResponse, SuccessResponse
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/settings", tags=["Settings"])


@router.get("", response_model=SettingsResponse)
async def get_settings(db: Session = Depends(get_db)):
    """
    Get current application settings
    """
    try:
        settings = db.query(Settings).first()
        
        # Create default settings if none exist
        if not settings:
            settings = Settings()
            db.add(settings)
            db.commit()
            db.refresh(settings)
            logger.info("Created default settings")
        
        return SettingsResponse(**settings.to_dict())
        
    except Exception as e:
        logger.error(f"Error retrieving settings: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to retrieve settings: {str(e)}")


@router.post("", response_model=SuccessResponse)
async def update_settings(
    request: SettingsRequest,
    db: Session = Depends(get_db)
):
    """
    Update application settings
    
    Only updates fields that are provided in the request
    """
    try:
        settings = db.query(Settings).first()
        
        # Create default settings if none exist
        if not settings:
            settings = Settings()
            db.add(settings)
        
        # Update only provided fields
        update_data = request.dict(exclude_unset=True)
        for field, value in update_data.items():
            if hasattr(settings, field):
                setattr(settings, field, value)
        
        db.commit()
        db.refresh(settings)
        
        logger.info(f"Settings updated: {list(update_data.keys())}")
        
        return SuccessResponse(
            success=True,
            message="Settings updated successfully",
            data=settings.to_dict()
        )
        
    except Exception as e:
        logger.error(f"Error updating settings: {str(e)}", exc_info=True)
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update settings: {str(e)}")
