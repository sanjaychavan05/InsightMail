"""
/history endpoints - Retrieve and manage analysis history
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.schemas.analysis import HistoryResponse, HistoryRecord
from app.db.session import get_db
from app.db.models import AnalysisRecord

router = APIRouter()


@router.get("", response_model=HistoryResponse)
async def get_history(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    intent: Optional[str] = Query(None),
    urgency: Optional[str] = Query(None),
    min_risk_score: Optional[float] = Query(None, ge=0.0, le=10.0),
    db: Session = Depends(get_db)
):
    """
    Retrieve email analysis history with optional filters
    
    - **limit**: Maximum number of records to return (1-100)
    - **offset**: Offset for pagination
    - **intent**: Filter by intent type
    - **urgency**: Filter by urgency level (high, medium, low)
    - **min_risk_score**: Minimum risk score filter
    """
    try:
        # Build query
        query = db.query(AnalysisRecord)
        
        # Apply filters
        if intent:
            query = query.filter(AnalysisRecord.intent == intent)
        if urgency:
            query = query.filter(AnalysisRecord.urgency == urgency)
        if min_risk_score is not None:
            query = query.filter(AnalysisRecord.risk_score >= min_risk_score)
        
        # Get total count
        total = query.count()
        
        # Get records with pagination
        records = query.order_by(AnalysisRecord.timestamp.desc())\
                      .offset(offset)\
                      .limit(limit)\
                      .all()
        
        # Convert to response format
        history_records = []
        for record in records:
            history_records.append(HistoryRecord(
                id=record.id,
                email_text=record.email_text,
                intent=record.intent,
                emotion=record.emotion,
                emotion_reason=record.emotion_reason,
                urgency=record.urgency,
                compliance_flags=record.compliance_flags or [],
                summary=record.summary,
                action_items=record.action_items or [],
                risk_score=record.risk_score,
                risk_breakdown=record.risk_breakdown or {},
                smart_reply=record.smart_reply,
                tone_used=record.tone_used,
                timestamp=record.timestamp.isoformat() + "Z" if record.timestamp else ""
            ))
        
        return HistoryResponse(
            total=total,
            records=history_records
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve history: {str(e)}"
        )


@router.get("/{record_id}")
async def get_history_record(
    record_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific analysis record by ID
    """
    try:
        record = db.query(AnalysisRecord).filter(AnalysisRecord.id == record_id).first()
        
        if not record:
            raise HTTPException(status_code=404, detail="Record not found")
        
        return record.to_dict()
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve record: {str(e)}"
        )
