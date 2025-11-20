"""
History Router
Handles retrieval of past email analyses
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.db import get_db, AnalysisRecord
from app.schemas import HistoryResponse, HistoryItem
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/history", tags=["History"])


@router.get("", response_model=HistoryResponse)
async def get_history(
    limit: int = Query(50, ge=1, le=500, description="Maximum number of records to return"),
    offset: int = Query(0, ge=0, description="Number of records to skip"),
    db: Session = Depends(get_db)
):
    """
    Retrieve analysis history
    
    Returns paginated list of past email analyses ordered by timestamp (newest first)
    """
    try:
        # Query total count
        total = db.query(AnalysisRecord).count()
        
        # Query records with pagination
        records = (
            db.query(AnalysisRecord)
            .order_by(desc(AnalysisRecord.timestamp))
            .offset(offset)
            .limit(limit)
            .all()
        )
        
        # Convert to response format
        history_items = [
            HistoryItem(
                id=record.id,
                email_content=record.email_content[:200] + "..." if len(record.email_content) > 200 else record.email_content,
                tone=record.tone,
                intent=record.intent or "Unknown",
                emotion=record.emotion or "Neutral",
                urgency=record.urgency or "Medium",
                risk_score=record.risk_score or 0.0,
                timestamp=record.timestamp.isoformat() if record.timestamp else "",
                summary=record.summary or "No summary available"
            )
            for record in records
        ]
        
        logger.info(f"Retrieved {len(history_items)} history records (total: {total})")
        
        return HistoryResponse(
            total=total,
            records=history_items
        )
        
    except Exception as e:
        logger.error(f"Error retrieving history: {str(e)}", exc_info=True)
        from fastapi import HTTPException
        raise HTTPException(status_code=500, detail=f"Failed to retrieve history: {str(e)}")
