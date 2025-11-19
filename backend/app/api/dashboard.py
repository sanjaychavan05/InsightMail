"""
/dashboard endpoint - Analytics and aggregated metrics
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from app.schemas.analysis import DashboardMetrics
from app.db.session import get_db
from app.db.models import AnalysisRecord

router = APIRouter()


@router.get("", response_model=DashboardMetrics)
async def get_dashboard_metrics(
    db: Session = Depends(get_db)
):
    """
    Get aggregated analytics for the dashboard
    
    Returns:
    - Total email count
    - Average response time (mock for now)
    - Compliance flags count
    - Positive sentiment percentage
    - Sentiment trend data (last 7 days)
    - Intent distribution
    - Compliance heatmap
    """
    try:
        # Get total emails
        total_emails = db.query(func.count(AnalysisRecord.id)).scalar() or 0
        
        # Get compliance flags count (last 30 days)
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        compliance_count = db.query(AnalysisRecord)\
            .filter(AnalysisRecord.timestamp >= thirty_days_ago)\
            .filter(AnalysisRecord.compliance_flags.isnot(None))\
            .count()
        
        # Calculate positive sentiment percentage
        positive_emotions = ["happy", "satisfied", "excited", "grateful", "pleased"]
        positive_count = db.query(AnalysisRecord)\
            .filter(AnalysisRecord.emotion.in_(positive_emotions))\
            .count()
        positive_pct = (positive_count / total_emails * 100) if total_emails > 0 else 0.0
        
        # Get sentiment trend (last 7 days)
        # For demo, return mock data - in production, aggregate from DB
        sentiment_trend = [
            {"date": "Mon", "positive": 45, "neutral": 30, "negative": 25},
            {"date": "Tue", "positive": 52, "neutral": 28, "negative": 20},
            {"date": "Wed", "positive": 48, "neutral": 32, "negative": 20},
            {"date": "Thu", "positive": 61, "neutral": 25, "negative": 14},
            {"date": "Fri", "positive": 55, "neutral": 30, "negative": 15},
            {"date": "Sat", "positive": 42, "neutral": 35, "negative": 23},
            {"date": "Sun", "positive": 38, "neutral": 40, "negative": 22},
        ]
        
        # Get intent distribution
        # For demo, return mock data - in production, group by intent
        intent_distribution = [
            {"name": "Refund Request", "value": 35, "color": "#3B82F6"},
            {"name": "Product Inquiry", "value": 28, "color": "#10B981"},
            {"name": "Technical Support", "value": 22, "color": "#F59E0B"},
            {"name": "Complaint", "value": 10, "color": "#EF4444"},
            {"name": "Other", "value": 5, "color": "#6B7280"},
        ]
        
        # Compliance heatmap (last 7 days)
        compliance_heatmap = [
            {"day": "Mon", "gdpr": 12, "financial": 8, "pii": 5},
            {"day": "Tue", "gdpr": 15, "financial": 10, "pii": 7},
            {"day": "Wed", "gdpr": 10, "financial": 6, "pii": 4},
            {"day": "Thu", "gdpr": 8, "financial": 12, "pii": 6},
            {"day": "Fri", "gdpr": 18, "financial": 14, "pii": 9},
            {"day": "Sat", "gdpr": 5, "financial": 3, "pii": 2},
            {"day": "Sun", "gdpr": 4, "financial": 2, "pii": 1},
        ]
        
        return DashboardMetrics(
            total_emails=max(total_emails, 1247),  # Use mock minimum for demo
            avg_response_time=2.3,  # Mock value in hours
            compliance_flags_count=max(compliance_count, 43),  # Mock minimum
            positive_sentiment_pct=round(max(positive_pct, 68.4), 1),  # Mock minimum
            sentiment_trend=sentiment_trend,
            intent_distribution=intent_distribution,
            compliance_heatmap=compliance_heatmap
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve dashboard metrics: {str(e)}"
        )
