"""
Pydantic schemas for API request/response validation
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


# ==================== Analyze Email ====================

class AnalyzeRequest(BaseModel):
    """Request schema for email analysis"""
    email: str = Field(..., description="Email content to analyze")
    tone: Optional[str] = Field("professional", description="Desired tone for smart reply")


class RiskBreakdown(BaseModel):
    """Risk score breakdown"""
    legal_risk: float = Field(0.0, ge=0.0, le=1.0)
    financial_risk: float = Field(0.0, ge=0.0, le=1.0)
    reputational_risk: float = Field(0.0, ge=0.0, le=1.0)
    operational_risk: float = Field(0.0, ge=0.0, le=1.0)


class RAGContext(BaseModel):
    """RAG context item"""
    title: str
    content: str
    relevance_score: float


class AnalyzeResponse(BaseModel):
    """Response schema for email analysis"""
    intent: str
    emotion: str
    emotion_reason: str
    urgency: str
    compliance_flags: List[str] = []
    summary: str
    action_items: List[str] = []
    risk_score: float = Field(..., ge=0.0, le=1.0)
    risk_breakdown: Dict[str, float]
    smart_reply: str
    rag_context_used: List[Dict[str, Any]] = []
    timestamp: Optional[datetime] = None
    processing_time: Optional[float] = None


# ==================== History ====================

class HistoryItem(BaseModel):
    """Single history record"""
    id: int
    email_content: str
    tone: Optional[str] = None
    intent: str
    emotion: str
    urgency: str
    risk_score: float
    timestamp: str
    summary: str


class HistoryResponse(BaseModel):
    """Response schema for history"""
    total: int
    records: List[HistoryItem]


# ==================== Analytics ====================

class SentimentTrendItem(BaseModel):
    """Sentiment trend data point"""
    date: str
    positive: int
    neutral: int
    negative: int


class IntentDistributionItem(BaseModel):
    """Intent distribution data point"""
    intent: str
    count: int


class ComplianceTrendItem(BaseModel):
    """Compliance trend data point"""
    date: str
    compliant: int
    flagged: int


class UrgencyOverTimeItem(BaseModel):
    """Urgency over time data point"""
    date: str
    high: int
    medium: int
    low: int


class AnalyticsResponse(BaseModel):
    """Response schema for analytics dashboard"""
    sentiment_trend: List[SentimentTrendItem] = []
    intent_distribution: List[IntentDistributionItem] = []
    compliance_trend: List[ComplianceTrendItem] = []
    urgency_over_time: List[UrgencyOverTimeItem] = []
    total_emails_analyzed: int = 0
    average_risk_score: float = 0.0


# ==================== Settings ====================

class SettingsRequest(BaseModel):
    """Request schema for updating settings"""
    model_config = {'protected_namespaces': ()}
    
    api_key: Optional[str] = None
    api_endpoint: Optional[str] = None
    model_name: Optional[str] = None
    enable_rag: Optional[bool] = None
    enable_compliance_check: Optional[bool] = None
    enable_risk_scoring: Optional[bool] = None
    enable_smart_reply: Optional[bool] = None
    rag_top_k: Optional[int] = None
    rag_similarity_threshold: Optional[float] = None
    default_tone: Optional[str] = None


class SettingsResponse(BaseModel):
    """Response schema for settings"""
    model_config = {'protected_namespaces': ()}
    
    id: int
    api_key: Optional[str] = None
    api_endpoint: Optional[str] = None
    model_name: str
    enable_rag: bool
    enable_compliance_check: bool
    enable_risk_scoring: bool
    enable_smart_reply: bool
    rag_top_k: int
    rag_similarity_threshold: float
    default_tone: str
    updated_at: Optional[str] = None


# ==================== Knowledge Base ====================

class KnowledgeBaseAddRequest(BaseModel):
    """Request schema for adding knowledge base document"""
    title: str = Field(..., description="Document title")
    content: str = Field(..., description="Document content")
    document_type: Optional[str] = Field("policy", description="Type: policy, faq, guideline, etc.")
    source: Optional[str] = Field(None, description="Source URL or file path")


class KnowledgeBaseItem(BaseModel):
    """Knowledge base document item"""
    id: int
    title: str
    content: str
    document_type: Optional[str]
    source: Optional[str]
    created_at: str
    updated_at: str


class KnowledgeBaseListResponse(BaseModel):
    """Response schema for knowledge base list"""
    total: int
    documents: List[KnowledgeBaseItem]


# ==================== Common ====================

class SuccessResponse(BaseModel):
    """Generic success response"""
    success: bool
    message: str
    data: Optional[Any] = None


class ErrorResponse(BaseModel):
    """Generic error response"""
    success: bool = False
    error: str
    details: Optional[str] = None
