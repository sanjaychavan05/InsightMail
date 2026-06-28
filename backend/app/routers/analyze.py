"""
Email Analysis Router
Handles email analysis endpoint
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db, AnalysisRecord, Settings
from app.schemas import AnalyzeRequest, AnalyzeResponse
from app.services import email_pipeline
import logging
import time

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/analyze", tags=["Analysis"])


@router.post("", response_model=AnalyzeResponse)
async def analyze_email(
    request: AnalyzeRequest,
    db: Session = Depends(get_db)
):
    """
    Analyze email content using LLM and RAG
    
    Returns comprehensive analysis including:
    - Intent detection
    - Emotion analysis
    - Urgency classification
    - Compliance flags
    - Summary and action items
    - Risk scoring
    - Smart reply generation
    """
    try:
        start_time = time.time()
        
        # Get settings
        settings = db.query(Settings).first()
        if not settings:
            # Create default settings if none exist
            settings = Settings()
            db.add(settings)
            db.commit()
        
        # Run analysis pipeline
        analysis_result = await email_pipeline.analyze_email(
            email=request.email,
            tone=request.tone or settings.default_tone,
            db=db,
            enable_rag=settings.enable_rag,
            enable_compliance=settings.enable_compliance_check,
            enable_risk=settings.enable_risk_scoring,
            enable_smart_reply=settings.enable_smart_reply
        )
        
        processing_time = time.time() - start_time
        
        # Save to database
        analysis_record = AnalysisRecord(
            email_content=request.email,
            tone=request.tone,
            intent=analysis_result["intent"],
            emotion=analysis_result["emotion"],
            emotion_reason=analysis_result["emotion_reason"],
            urgency=analysis_result["urgency"],
            compliance_flags=analysis_result["compliance_flags"],
            summary=analysis_result["summary"],
            action_items=analysis_result["action_items"],
            risk_score=analysis_result["risk_score"],
            risk_breakdown=analysis_result["risk_breakdown"],
            smart_reply=analysis_result["smart_reply"],
            rag_context_used=analysis_result["rag_context_used"],
            processing_time=processing_time
        )
        
        db.add(analysis_record)
        db.commit()
        db.refresh(analysis_record)
        
        # Prepare response
        response = AnalyzeResponse(
            intent=analysis_result["intent"],
            emotion=analysis_result["emotion"],
            emotion_reason=analysis_result["emotion_reason"],
            urgency=analysis_result["urgency"],
            compliance_flags=analysis_result["compliance_flags"],
            summary=analysis_result["summary"],
            action_items=analysis_result["action_items"],
            risk_score=analysis_result["risk_score"],
            risk_breakdown=analysis_result["risk_breakdown"],
            smart_reply=analysis_result["smart_reply"],
            rag_context_used=analysis_result["rag_context_used"],
            timestamp=analysis_record.timestamp,
            processing_time=processing_time
        )
        
        logger.info(f"Email analyzed successfully in {processing_time:.2f}s")
        return response
        
    except Exception as e:
        logger.error(f"Error analyzing email: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
