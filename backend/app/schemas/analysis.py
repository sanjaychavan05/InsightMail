"""
Pydantic schemas for request/response validation
"""
from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


# Request schemas
class AnalyzeRequest(BaseModel):
    """Request schema for /analyze endpoint"""
    email: str = Field(..., description="Email text to analyze")
    tone: Optional[str] = Field("empathetic", description="Reply tone: formal, empathetic, friendly, assertive")


class HistoryFilter(BaseModel):
    """Query parameters for filtering history"""
    limit: Optional[int] = Field(50, description="Max number of records")
    offset: Optional[int] = Field(0, description="Offset for pagination")
    intent: Optional[str] = Field(None, description="Filter by intent")
    urgency: Optional[str] = Field(None, description="Filter by urgency")
    min_risk_score: Optional[float] = Field(None, description="Minimum risk score")


class SettingsUpdate(BaseModel):
    """Request schema for updating settings"""
    api_endpoint: Optional[str] = None
    api_key: Optional[str] = None
    auto_analyze: Optional[bool] = None
    enhanced_sentiment: Optional[bool] = None
    extract_action_items: Optional[bool] = None
    high_urgency_alerts: Optional[bool] = None
    compliance_alerts: Optional[bool] = None
    daily_summary: Optional[bool] = None
    data_retention_days: Optional[int] = None
    anonymize_pii: Optional[bool] = None


# Response schemas
class ComplianceFlag(BaseModel):
    """Compliance flag detail"""
    type: str
    detail: str
    severity: str


class ActionItem(BaseModel):
    """Action item detail"""
    task: str
    assignee: str
    deadline: Optional[str] = None


class RiskBreakdown(BaseModel):
    """Risk score breakdown"""
    emotion_intensity: int = Field(..., ge=0, le=10)
    priority: int = Field(..., ge=0, le=10)
    compliance_risk: int = Field(..., ge=0, le=10)
    escalation_likelihood: int = Field(..., ge=0, le=10)


class AnalyzeResponse(BaseModel):
    """Response schema for /analyze endpoint"""
    intent: str
    emotion: str
    emotion_reason: str
    urgency: str
    compliance_flags: List[ComplianceFlag]
    summary: str
    action_items: List[ActionItem]
    risk_score: float = Field(..., ge=0.0, le=10.0)
    risk_breakdown: RiskBreakdown
    smart_reply: str
    timestamp: str


class HistoryRecord(BaseModel):
    """Single history record"""
    id: int
    email_text: str
    intent: str
    emotion: str
    emotion_reason: str
    urgency: str
    compliance_flags: List[ComplianceFlag]
    summary: str
    action_items: List[ActionItem]
    risk_score: float
    risk_breakdown: RiskBreakdown
    smart_reply: str
    tone_used: str
    timestamp: str


class HistoryResponse(BaseModel):
    """Response schema for /history GET"""
    total: int
    records: List[HistoryRecord]


class DashboardMetrics(BaseModel):
    """Dashboard analytics metrics"""
    total_emails: int
    avg_response_time: float
    compliance_flags_count: int
    positive_sentiment_pct: float
    sentiment_trend: List[Dict[str, Any]]
    intent_distribution: List[Dict[str, Any]]
    compliance_heatmap: List[Dict[str, Any]]


class SettingsResponse(BaseModel):
    """Settings response schema"""
    api_endpoint: str
    api_key: str
    auto_analyze: bool
    enhanced_sentiment: bool
    extract_action_items: bool
    high_urgency_alerts: bool
    compliance_alerts: bool
    daily_summary: bool
    data_retention_days: int
    anonymize_pii: bool
