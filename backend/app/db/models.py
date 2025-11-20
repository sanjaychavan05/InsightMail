"""
Database models for InsightMail
"""
from sqlalchemy import Column, Integer, String, Text, Float, JSON, DateTime, Boolean
from sqlalchemy.sql import func
from app.db.session import Base


class AnalysisRecord(Base):
    """
    Store email analysis results
    """
    __tablename__ = "analysis_records"
    
    id = Column(Integer, primary_key=True, index=True)
    email_content = Column(Text, nullable=False)
    tone = Column(String(50), nullable=True)
    
    # Analysis results
    intent = Column(String(100))
    emotion = Column(String(50))
    emotion_reason = Column(Text)
    urgency = Column(String(50))
    compliance_flags = Column(JSON)  # List of compliance issues
    summary = Column(Text)
    action_items = Column(JSON)  # List of action items
    risk_score = Column(Float)
    risk_breakdown = Column(JSON)  # Dict of risk factors
    smart_reply = Column(Text)
    rag_context_used = Column(JSON)  # List of RAG contexts used
    
    # Metadata
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    processing_time = Column(Float)  # Seconds
    
    def to_dict(self):
        """Convert to dictionary for API response"""
        return {
            "id": self.id,
            "email_content": self.email_content,
            "tone": self.tone,
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
            "rag_context_used": self.rag_context_used or [],
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
            "processing_time": self.processing_time
        }


class Settings(Base):
    """
    Application settings storage
    """
    __tablename__ = "settings"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # API Configuration
    api_key = Column(String(255), nullable=True)
    api_endpoint = Column(String(255), nullable=True)
    model_name = Column(String(100), default="gemma:2b")
    
    # Feature toggles
    enable_rag = Column(Boolean, default=True)
    enable_compliance_check = Column(Boolean, default=True)
    enable_risk_scoring = Column(Boolean, default=True)
    enable_smart_reply = Column(Boolean, default=True)
    
    # RAG settings
    rag_top_k = Column(Integer, default=3)
    rag_similarity_threshold = Column(Float, default=0.5)
    
    # Email preferences
    default_tone = Column(String(50), default="professional")
    
    # Metadata
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
    
    def to_dict(self):
        """Convert to dictionary for API response"""
        return {
            "id": self.id,
            "api_key": self.api_key,
            "api_endpoint": self.api_endpoint,
            "model_name": self.model_name,
            "enable_rag": self.enable_rag,
            "enable_compliance_check": self.enable_compliance_check,
            "enable_risk_scoring": self.enable_risk_scoring,
            "enable_smart_reply": self.enable_smart_reply,
            "rag_top_k": self.rag_top_k,
            "rag_similarity_threshold": self.rag_similarity_threshold,
            "default_tone": self.default_tone,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }


class KnowledgeBase(Base):
    """
    RAG knowledge base for policies, FAQs, etc.
    """
    __tablename__ = "knowledge_base"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Document info
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    document_type = Column(String(50))  # policy, faq, guideline, etc.
    source = Column(String(255), nullable=True)  # URL or file path
    
    # Vector embedding
    embedding = Column(JSON)  # Stored as JSON array
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
    
    def to_dict(self):
        """Convert to dictionary for API response"""
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "document_type": self.document_type,
            "source": self.source,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
