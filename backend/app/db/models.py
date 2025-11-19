"""
Database models for InsightMail
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class AnalysisRecord(Base):
    """Store email analysis results"""
    __tablename__ = "analysis_records"

    id = Column(Integer, primary_key=True, index=True)
    email_text = Column(Text, nullable=False)
    intent = Column(String(100))
    emotion = Column(String(100))
    emotion_reason = Column(Text)
    urgency = Column(String(50))
    compliance_flags = Column(JSON)  # List of compliance flag objects
    summary = Column(Text)
    action_items = Column(JSON)  # List of action item objects
    risk_score = Column(Float)
    risk_breakdown = Column(JSON)  # Dict with sub-scores
    smart_reply = Column(Text)
    tone_used = Column(String(50))
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        """Convert model to dictionary"""
        return {
            "id": self.id,
            "email_text": self.email_text,
            "intent": self.intent,
            "emotion": self.emotion,
            "emotion_reason": self.emotion_reason,
            "urgency": self.urgency,
            "compliance_flags": self.compliance_flags or [],
            "summary": self.summary,
            "action_items": self.action_items or [],
            "risk_score": self.risk_score,
            "risk_breakdown": self.risk_breakdown or {},
            "smart_reply": self.smart_reply,
            "tone_used": self.tone_used,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
        }


class Settings(Base):
    """Application settings (single row table)"""
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True)
    api_endpoint = Column(String(500), default="https://api.insightmail.ai/analyze")
    api_key = Column(String(500), default="")
    auto_analyze = Column(Boolean, default=False)
    enhanced_sentiment = Column(Boolean, default=True)
    extract_action_items = Column(Boolean, default=True)
    high_urgency_alerts = Column(Boolean, default=True)
    compliance_alerts = Column(Boolean, default=True)
    daily_summary = Column(Boolean, default=False)
    data_retention_days = Column(Integer, default=30)
    anonymize_pii = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        """Convert settings to dictionary"""
        return {
            "api_endpoint": self.api_endpoint,
            "api_key": self.api_key,
            "auto_analyze": self.auto_analyze,
            "enhanced_sentiment": self.enhanced_sentiment,
            "extract_action_items": self.extract_action_items,
            "high_urgency_alerts": self.high_urgency_alerts,
            "compliance_alerts": self.compliance_alerts,
            "daily_summary": self.daily_summary,
            "data_retention_days": self.data_retention_days,
            "anonymize_pii": self.anonymize_pii,
        }
