"""
Email Analysis Pipeline
Complete LLM-powered email analysis with RAG integration
"""
import json
import logging
from typing import Dict, Any, List, Optional
from app.services.llm_service import llm_service
from app.services.rag_service import rag_service
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)


class EmailAnalysisPipeline:
    """Pipeline for analyzing emails using LLM and RAG"""
    
    # ==================== PROMPTS ====================
    
    INTENT_PROMPT = """You are an expert email analyst. Analyze the following email and determine its primary intent.

Email Content:
{email}

{rag_context}

Classify the intent into ONE of these categories:
- Information Request
- Action Request
- Complaint
- Inquiry
- Proposal
- Follow-up
- Meeting Request
- Urgent Issue
- General Communication
- Feedback

Respond with ONLY the intent category, nothing else."""

    EMOTION_PROMPT = """You are an expert in emotional intelligence. Analyze the emotional tone of this email.

Email Content:
{email}

{rag_context}

Identify the primary emotion (e.g., Frustrated, Happy, Neutral, Concerned, Angry, Grateful, Anxious, Professional) and provide a brief reason (1-2 sentences).

Respond in this EXACT JSON format:
{{
  "emotion": "emotion name",
  "reason": "brief explanation"
}}"""

    URGENCY_PROMPT = """You are an expert at prioritizing business communications. Determine the urgency level of this email.

Email Content:
{email}

{rag_context}

Classify urgency as ONE of: High, Medium, Low

Criteria:
- High: Requires immediate attention, time-sensitive, critical issues
- Medium: Important but can wait 24-48 hours
- Low: Informational, no immediate action needed

Respond with ONLY the urgency level: High, Medium, or Low."""

    COMPLIANCE_PROMPT = """You are a compliance officer. Analyze this email for potential compliance risks or policy violations.

Email Content:
{email}

{rag_context}

Identify any compliance flags such as:
- Data Privacy Violations (GDPR, CCPA)
- Confidential Information Exposure
- Legal Concerns
- Regulatory Issues
- Inappropriate Language
- Contract Violations
- Security Risks

IMPORTANT: Respond ONLY with valid JSON. If no issues found, return {{"compliance_flags": []}}.

Example with issues:
{{"compliance_flags": ["Potential GDPR violation - personal data mentioned", "Confidential information shared"]}}

Example with no issues:
{{"compliance_flags": []}}

Your response:"""

    SUMMARY_PROMPT = """You are an executive assistant. Create a concise summary of this email.

Email Content:
{email}

{rag_context}

Provide a clear, 2-3 sentence summary that captures the key points and main purpose.

Respond with ONLY the summary text, no additional formatting."""

    ACTION_ITEMS_PROMPT = """You are a project manager. Extract actionable items from this email.

Email Content:
{email}

{rag_context}

Identify specific action items that need to be done. Each action should be clear and actionable.

IMPORTANT: Respond ONLY with valid JSON. If no action items, return {{"action_items": []}}.

Example with actions:
{{"action_items": ["Review attached document by Friday", "Schedule follow-up meeting", "Send cost estimate to client"]}}

Example with no actions:
{{"action_items": []}}

Your response:"""

    RISK_SCORING_PROMPT = """You are a risk assessment expert. Evaluate this email for various business risks.

Email Content:
{email}

{rag_context}

Assess risk across these dimensions (0.0 to 1.0 scale):
- Legal Risk: Potential legal implications
- Financial Risk: Monetary impact or financial exposure
- Reputational Risk: Impact on company reputation
- Operational Risk: Business operations disruption

Respond in EXACT JSON format:
{{
  "overall_risk": 0.0,
  "legal_risk": 0.0,
  "financial_risk": 0.0,
  "reputational_risk": 0.0,
  "operational_risk": 0.0
}}"""

    SMART_REPLY_PROMPT = """You are a professional email writer. Generate a smart reply to this email in a {tone} tone.

Original Email:
{email}

{rag_context}

Analysis Context:
- Intent: {intent}
- Emotion: {emotion}
- Urgency: {urgency}

Write a professional, contextually appropriate reply that:
1. Acknowledges the sender's message
2. Addresses their intent
3. Matches the requested {tone} tone
4. Is concise and actionable
5. Maintains professionalism

Respond with ONLY the email reply text, no subject line or formatting."""

    # ==================== PIPELINE METHODS ====================
    
    async def analyze_email(
        self,
        email: str,
        tone: str,
        db: Session,
        enable_rag: bool = True,
        enable_compliance: bool = True,
        enable_risk: bool = True,
        enable_smart_reply: bool = True
    ) -> Dict[str, Any]:
        """
        Complete email analysis pipeline
        
        Args:
            email: Email content to analyze
            tone: Desired tone for smart reply
            db: Database session for RAG
            enable_rag: Whether to use RAG context
            enable_compliance: Whether to check compliance
            enable_risk: Whether to score risk
            enable_smart_reply: Whether to generate smart reply
            
        Returns:
            Complete analysis results
        """
        logger.info("Starting email analysis pipeline")
        
        # Step 1: Retrieve RAG context
        rag_context_items = []
        rag_context_str = ""
        
        if enable_rag:
            rag_context_items = await rag_service.retrieve_rag_context(email, db)
            if rag_context_items:
                rag_context_str = "\n\nRelevant Company Knowledge:\n"
                for idx, item in enumerate(rag_context_items, 1):
                    rag_context_str += f"{idx}. {item['title']}: {item['content'][:200]}...\n"
        
        # Step 2: Intent detection
        intent = await self._detect_intent(email, rag_context_str)
        
        # Step 3: Emotion analysis
        emotion_data = await self._analyze_emotion(email, rag_context_str)
        
        # Step 4: Urgency classification
        urgency = await self._classify_urgency(email, rag_context_str)
        
        # Step 5: Compliance check
        compliance_flags = []
        if enable_compliance:
            compliance_flags = await self._check_compliance(email, rag_context_str)
        
        # Step 6: Summary generation
        summary = await self._generate_summary(email, rag_context_str)
        
        # Step 7: Action items extraction
        action_items = await self._extract_action_items(email, rag_context_str)
        
        # Step 8: Risk scoring
        risk_data = {"overall_risk": 0.0, "legal_risk": 0.0, "financial_risk": 0.0, 
                     "reputational_risk": 0.0, "operational_risk": 0.0}
        if enable_risk:
            risk_data = await self._score_risk(email, rag_context_str, emotion_data.get("emotion", "Neutral"), urgency, compliance_flags)
        
        # Calculate risk breakdown in frontend expected format (0-100 scale)
        emotion_intensity = self._calculate_emotion_intensity(emotion_data.get("emotion", "Neutral"))
        priority = self._calculate_priority_score(urgency)
        compliance_risk = min(len(compliance_flags) * 20, 100)
        
        # Calculate overall risk score (0-100)
        overall_risk = (emotion_intensity + priority + compliance_risk + (risk_data.get("overall_risk", 0.0) * 100)) / 4
        
        # Step 9: Smart reply generation
        smart_reply = ""
        if enable_smart_reply:
            smart_reply = await self._generate_smart_reply(
                email, tone, rag_context_str, intent, 
                emotion_data.get("emotion", "Neutral"), urgency
            )
        
        # Compile results
        result = {
            "intent": intent,
            "emotion": emotion_data.get("emotion", "Neutral"),
            "emotion_reason": emotion_data.get("reason", ""),
            "urgency": urgency,
            "compliance_flags": compliance_flags,
            "summary": summary,
            "action_items": action_items,
            "risk_score": round(overall_risk, 1),
            "risk_breakdown": {
                "emotion_intensity": round(emotion_intensity, 1),
                "priority": round(priority, 1),
                "compliance_risk": round(compliance_risk, 1),
                "escalation_likelihood": round((emotion_intensity + priority) / 2, 1)
            },
            "smart_reply": smart_reply,
            "rag_context_used": rag_context_items
        }
        
        logger.info("Email analysis pipeline completed")
        return result
    
    async def _detect_intent(self, email: str, rag_context: str) -> str:
        """Detect email intent"""
        prompt = self.INTENT_PROMPT.format(email=email, rag_context=rag_context)
        result = await llm_service.generate(prompt, temperature=0.3)
        return result.strip() if result else "General Communication"
    
    async def _analyze_emotion(self, email: str, rag_context: str) -> Dict[str, str]:
        """Analyze emotional tone"""
        prompt = self.EMOTION_PROMPT.format(email=email, rag_context=rag_context)
        result = await llm_service.generate_json(prompt)
        
        if result and "emotion" in result:
            return result
        
        # Fallback: Try simple text extraction
        logger.warning("JSON parsing failed for emotion, trying text-based extraction")
        simple_prompt = f"""Analyze the emotion in this email in one word (e.g., Happy, Frustrated, Neutral, Angry, Concerned, Professional):

Email: {email}

Emotion:"""
        emotion_text = await llm_service.generate(simple_prompt, temperature=0.3)
        
        if emotion_text:
            emotion = emotion_text.strip().split('\n')[0].strip()
            # Generate reason
            reason_prompt = f"""Why does this email convey a {emotion} emotion? Answer in 1-2 sentences.

Email: {email}

Reason:"""
            reason = await llm_service.generate(reason_prompt, temperature=0.5)
            return {
                "emotion": emotion if emotion else "Neutral",
                "reason": reason.strip() if reason else f"The email's tone and word choice suggest a {emotion.lower()} sentiment."
            }
        
        return {"emotion": "Neutral", "reason": "The email maintains a neutral, professional tone without strong emotional indicators."}
    
    async def _classify_urgency(self, email: str, rag_context: str) -> str:
        """Classify urgency level"""
        prompt = self.URGENCY_PROMPT.format(email=email, rag_context=rag_context)
        result = await llm_service.generate(prompt, temperature=0.3)
        urgency = result.strip() if result else "Medium"
        # Validate urgency
        if urgency not in ["High", "Medium", "Low"]:
            urgency = "Medium"
        return urgency
    
    async def _check_compliance(self, email: str, rag_context: str) -> List[str]:
        """Check for compliance issues"""
        prompt = self.COMPLIANCE_PROMPT.format(email=email, rag_context=rag_context)
        result = await llm_service.generate_json(prompt)
        logger.info(f"Compliance check result: {result}")
        if result and "compliance_flags" in result:
            flags = result["compliance_flags"]
            logger.info(f"Extracted compliance flags: {flags}")
            return flags
        logger.warning("No compliance flags found in LLM response")
        return []
    
    async def _generate_summary(self, email: str, rag_context: str) -> str:
        """Generate email summary"""
        prompt = self.SUMMARY_PROMPT.format(email=email, rag_context=rag_context)
        result = await llm_service.generate(prompt, temperature=0.5)
        return result.strip() if result else "No summary available"
    
    async def _extract_action_items(self, email: str, rag_context: str) -> List[str]:
        """Extract action items"""
        prompt = self.ACTION_ITEMS_PROMPT.format(email=email, rag_context=rag_context)
        result = await llm_service.generate_json(prompt)
        logger.info(f"Action items extraction result: {result}")
        if result and "action_items" in result:
            items = result["action_items"]
            logger.info(f"Extracted action items: {items}")
            return items
        logger.warning("No action items found in LLM response")
        return []
    
    async def _score_risk(self, email: str, rag_context: str, emotion: str, urgency: str, compliance_flags: List[str]) -> Dict[str, float]:
        """Score various risk dimensions"""
        prompt = self.RISK_SCORING_PROMPT.format(email=email, rag_context=rag_context)
        result = await llm_service.generate_json(prompt)
        if result:
            return {
                "overall_risk": result.get("overall_risk", 0.0),
                "legal_risk": result.get("legal_risk", 0.0),
                "financial_risk": result.get("financial_risk", 0.0),
                "reputational_risk": result.get("reputational_risk", 0.0),
                "operational_risk": result.get("operational_risk", 0.0)
            }
        return {
            "overall_risk": 0.0,
            "legal_risk": 0.0,
            "financial_risk": 0.0,
            "reputational_risk": 0.0,
            "operational_risk": 0.0
        }
    
    def _calculate_emotion_intensity(self, emotion: str) -> float:
        """Calculate emotion intensity score (0-100)"""
        emotion_scores = {
            "angry": 90,
            "frustrated": 75,
            "upset": 70,
            "concerned": 60,
            "anxious": 65,
            "worried": 60,
            "disappointed": 55,
            "neutral": 30,
            "professional": 25,
            "satisfied": 20,
            "happy": 15,
            "grateful": 10,
            "pleased": 15
        }
        return emotion_scores.get(emotion.lower(), 50)
    
    def _calculate_priority_score(self, urgency: str) -> float:
        """Calculate priority score based on urgency (0-100)"""
        priority_map = {
            "high": 90,
            "medium": 50,
            "low": 20
        }
        return priority_map.get(urgency.lower(), 50)
    
    async def _generate_smart_reply(
        self,
        email: str,
        tone: str,
        rag_context: str,
        intent: str,
        emotion: str,
        urgency: str
    ) -> str:
        """Generate smart reply"""
        prompt = self.SMART_REPLY_PROMPT.format(
            email=email,
            tone=tone,
            rag_context=rag_context,
            intent=intent,
            emotion=emotion,
            urgency=urgency
        )
        result = await llm_service.generate(prompt, temperature=0.7)
        return result.strip() if result else "Thank you for your email. We will review and respond accordingly."


# Global pipeline instance
email_pipeline = EmailAnalysisPipeline()
