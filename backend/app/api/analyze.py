"""
/analyze endpoint - Email analysis with LLM
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas.analysis import AnalyzeRequest, AnalyzeResponse
from app.services.pipeline import analyze_email_pipeline
from app.db.session import get_db
from app.db.models import AnalysisRecord

router = APIRouter()


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_email(
    request: AnalyzeRequest,
    db: Session = Depends(get_db)
):
    """
    Analyze an email and generate AI-powered insights
    
    - **email**: The email text to analyze
    - **tone**: Optional reply tone (formal, empathetic, friendly, assertive)
    
    Returns comprehensive analysis including:
    - Intent classification
    - Emotion/sentiment with explainability
    - Urgency level
    - Compliance flags
    - Summary and action items
    - Risk score with breakdown
    - AI-generated smart reply
    """
    try:
        # Validate input
        if not request.email or len(request.email.strip()) < 10:
            raise HTTPException(
                status_code=400,
                detail="Email text must be at least 10 characters"
            )
        
        # Run analysis pipeline
        result = analyze_email_pipeline(request.email, request.tone)
        
        # Store in database
        record = AnalysisRecord(
            email_text=request.email,
            intent=result["intent"],
            emotion=result["emotion"],
            emotion_reason=result["emotion_reason"],
            urgency=result["urgency"],
            compliance_flags=result["compliance_flags"],
            summary=result["summary"],
            action_items=result["action_items"],
            risk_score=result["risk_score"],
            risk_breakdown=result["risk_breakdown"],
            smart_reply=result["smart_reply"],
            tone_used=request.tone
        )
        db.add(record)
        db.commit()
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )
