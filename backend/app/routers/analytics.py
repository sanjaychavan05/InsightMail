"""
Analytics Router
Provides dashboard analytics and insights
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, case
from app.db import get_db, AnalysisRecord
from app.schemas import (
    AnalyticsResponse,
    SentimentTrendItem,
    IntentDistributionItem,
    ComplianceTrendItem,
    UrgencyOverTimeItem
)
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("", response_model=AnalyticsResponse)
async def get_analytics(
    days: int = 30,
    db: Session = Depends(get_db)
):
    """
    Get analytics dashboard data
    
    Returns:
    - Sentiment trend over time
    - Intent distribution
    - Compliance trend
    - Urgency over time
    - Total emails analyzed
    - Average risk score
    """
    try:
        # Calculate date range
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)
        
        # Get all records in range
        records = (
            db.query(AnalysisRecord)
            .filter(AnalysisRecord.timestamp >= start_date)
            .all()
        )
        
        # Calculate sentiment trend (based on emotion)
        sentiment_trend = _calculate_sentiment_trend(records, days)
        
        # Calculate intent distribution
        intent_distribution = _calculate_intent_distribution(records)
        
        # Calculate compliance trend
        compliance_trend = _calculate_compliance_trend(records, days)
        
        # Calculate urgency over time
        urgency_over_time = _calculate_urgency_trend(records, days)
        
        # Calculate aggregates
        total_emails = len(records)
        average_risk = sum(r.risk_score or 0.0 for r in records) / total_emails if total_emails > 0 else 0.0
        
        logger.info(f"Analytics generated for {total_emails} emails over {days} days")
        
        return AnalyticsResponse(
            sentiment_trend=sentiment_trend,
            intent_distribution=intent_distribution,
            compliance_trend=compliance_trend,
            urgency_over_time=urgency_over_time,
            total_emails_analyzed=total_emails,
            average_risk_score=round(average_risk, 3)
        )
        
    except Exception as e:
        logger.error(f"Error generating analytics: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Analytics generation failed: {str(e)}")


def _calculate_sentiment_trend(records, days):
    """Calculate sentiment trend from emotions"""
    # Group by date
    date_groups = {}
    for record in records:
        if record.timestamp:
            date_key = record.timestamp.date().isoformat()
            if date_key not in date_groups:
                date_groups[date_key] = {"positive": 0, "neutral": 0, "negative": 0}
            
            # Classify emotion as sentiment
            emotion = (record.emotion or "Neutral").lower()
            if emotion in ["happy", "grateful", "excited", "pleased", "satisfied"]:
                date_groups[date_key]["positive"] += 1
            elif emotion in ["frustrated", "angry", "concerned", "anxious", "worried", "upset"]:
                date_groups[date_key]["negative"] += 1
            else:
                date_groups[date_key]["neutral"] += 1
    
    # Convert to list
    return [
        SentimentTrendItem(
            date=date,
            positive=counts["positive"],
            neutral=counts["neutral"],
            negative=counts["negative"]
        )
        for date, counts in sorted(date_groups.items())
    ]


def _calculate_intent_distribution(records):
    """Calculate intent distribution"""
    intent_counts = {}
    for record in records:
        intent = record.intent or "Unknown"
        intent_counts[intent] = intent_counts.get(intent, 0) + 1
    
    return [
        IntentDistributionItem(intent=intent, count=count)
        for intent, count in sorted(intent_counts.items(), key=lambda x: x[1], reverse=True)
    ]


def _calculate_compliance_trend(records, days):
    """Calculate compliance trend"""
    date_groups = {}
    for record in records:
        if record.timestamp:
            date_key = record.timestamp.date().isoformat()
            if date_key not in date_groups:
                date_groups[date_key] = {"compliant": 0, "flagged": 0}
            
            if record.compliance_flags and len(record.compliance_flags) > 0:
                date_groups[date_key]["flagged"] += 1
            else:
                date_groups[date_key]["compliant"] += 1
    
    return [
        ComplianceTrendItem(
            date=date,
            compliant=counts["compliant"],
            flagged=counts["flagged"]
        )
        for date, counts in sorted(date_groups.items())
    ]


def _calculate_urgency_trend(records, days):
    """Calculate urgency over time"""
    date_groups = {}
    for record in records:
        if record.timestamp:
            date_key = record.timestamp.date().isoformat()
            if date_key not in date_groups:
                date_groups[date_key] = {"high": 0, "medium": 0, "low": 0}
            
            urgency = (record.urgency or "Medium").lower()
            if urgency == "high":
                date_groups[date_key]["high"] += 1
            elif urgency == "low":
                date_groups[date_key]["low"] += 1
            else:
                date_groups[date_key]["medium"] += 1
    
    return [
        UrgencyOverTimeItem(
            date=date,
            high=counts["high"],
            medium=counts["medium"],
            low=counts["low"]
        )
        for date, counts in sorted(date_groups.items())
    ]
