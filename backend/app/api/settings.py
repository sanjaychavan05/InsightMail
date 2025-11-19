"""
/settings endpoints - Application settings management
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas.analysis import SettingsResponse, SettingsUpdate
from app.db.session import get_db
from app.db.models import Settings

router = APIRouter()


def get_or_create_settings(db: Session) -> Settings:
    """Get settings or create default if not exists"""
    settings = db.query(Settings).first()
    if not settings:
        settings = Settings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


@router.get("", response_model=SettingsResponse)
async def get_settings(db: Session = Depends(get_db)):
    """
    Retrieve current application settings
    """
    try:
        settings = get_or_create_settings(db)
        return SettingsResponse(**settings.to_dict())
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve settings: {str(e)}"
        )


@router.post("", response_model=SettingsResponse)
async def update_settings(
    updates: SettingsUpdate,
    db: Session = Depends(get_db)
):
    """
    Update application settings
    
    Only provided fields will be updated; others remain unchanged.
    """
    try:
        settings = get_or_create_settings(db)
        
        # Update only provided fields
        update_data = updates.dict(exclude_unset=True)
        for field, value in update_data.items():
            if hasattr(settings, field):
                setattr(settings, field, value)
        
        db.commit()
        db.refresh(settings)
        
        return SettingsResponse(**settings.to_dict())
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update settings: {str(e)}"
        )
