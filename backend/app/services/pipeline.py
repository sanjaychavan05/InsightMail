"""
Email Analysis Pipeline

Orchestrates multiple LLM calls to analyze email and generate insights.
"""
from datetime import datetime
from typing import Dict, Any
from app.lms.gemini_client import gemini_client
from app.lms import prompts
from app.services.utils import clean_text, safe_json_get


def calculate_risk_score(
    emotion_intensity: int,
    priority: int,
    compliance_risk: int,
    escalation_likelihood: int
) -> float:
    """
    Calculate overall risk score from sub-scores
    
    Args:
        emotion_intensity: 0-10 score for emotion intensity
        priority: 0-10 score for urgency/priority
        compliance_risk: 0-10 score for compliance concerns
        escalation_likelihood: 0-10 score for escalation risk
        
    Returns:
        Overall risk score 0.0-10.0
    """
    # Weighted average with emphasis on compliance and escalation
    weights = {
        "emotion_intensity": 0.2,
        "priority": 0.3,
        "compliance_risk": 0.3,
        "escalation_likelihood": 0.2
    }
    
    score = (
        emotion_intensity * weights["emotion_intensity"] +
        priority * weights["priority"] +
        compliance_risk * weights["compliance_risk"] +
        escalation_likelihood * weights["escalation_likelihood"]
    )
    
    return round(score, 1)


def analyze_email_pipeline(email_text: str, tone: str = "empathetic") -> Dict[str, Any]:
    """
    Run complete email analysis pipeline
    
    Args:
        email_text: The email text to analyze
        tone: Reply tone (formal, empathetic, friendly, assertive)
        
    Returns:
        Complete analysis dict matching AnalyzeResponse schema
    """
    # Clean input
    cleaned_email = clean_text(email_text)
    
    # If in mock mode or no email provided, return mock data
    if gemini_client.mock_mode or not cleaned_email:
        return get_mock_analysis(tone)
    
    # Step 1: Intent detection
    intent_result = gemini_client.generate_json(
        prompts.get_intent_prompt(cleaned_email),
        default={"intent": "general_inquiry"}
    )
    intent = safe_json_get(intent_result, "intent", "general_inquiry")
    
    # Step 2: Emotion analysis with explainability
    emotion_result = gemini_client.generate_json(
        prompts.get_emotion_prompt(cleaned_email),
        default={"emotion": "neutral", "emotion_reason": "No strong emotional indicators detected."}
    )
    emotion = safe_json_get(emotion_result, "emotion", "neutral")
    emotion_reason = safe_json_get(emotion_result, "emotion_reason", "Unable to determine emotion reason.")
    
    # Step 3: Urgency detection
    urgency_result = gemini_client.generate_json(
        prompts.get_urgency_prompt(cleaned_email),
        default={"urgency": "medium"}
    )
    urgency = safe_json_get(urgency_result, "urgency", "medium")
    
    # Step 4: Compliance detection
    compliance_result = gemini_client.generate_json(
        prompts.get_compliance_prompt(cleaned_email),
        default={"compliance_flags": []}
    )
    compliance_flags = safe_json_get(compliance_result, "compliance_flags", [])
    
    # Step 5: Summary generation
    summary_result = gemini_client.generate_json(
        prompts.get_summary_prompt(cleaned_email),
        default={"summary": "Customer email received."}
    )
    summary = safe_json_get(summary_result, "summary", "Email summary not available.")
    
    # Step 6: Action items extraction
    action_result = gemini_client.generate_json(
        prompts.get_action_items_prompt(cleaned_email),
        default={"action_items": []}
    )
    action_items = safe_json_get(action_result, "action_items", [])
    
    # Step 7: Smart reply generation
    reply_result = gemini_client.generate_json(
        prompts.get_smart_reply_prompt(cleaned_email, tone),
        default={"smart_reply": "Thank you for contacting us. We will review your message and respond shortly."}
    )
    smart_reply = safe_json_get(reply_result, "smart_reply", "Thank you for your message.")
    
    # Step 8: Calculate risk scores
    # Map emotion to intensity (simple heuristic)
    emotion_intensity_map = {
        "angry": 9, "furious": 10, "frustrated": 8, "disappointed": 6,
        "confused": 5, "worried": 7, "neutral": 3, "satisfied": 2,
        "happy": 1, "excited": 2, "grateful": 1
    }
    emotion_intensity = emotion_intensity_map.get(emotion.lower(), 5)
    
    # Map urgency to priority score
    priority_map = {"high": 9, "medium": 5, "low": 2}
    priority = priority_map.get(urgency.lower(), 5)
    
    # Compliance risk based on flag count and severity
    compliance_risk = min(10, len(compliance_flags) * 3)
    if any(f.get("severity") == "high" for f in compliance_flags):
        compliance_risk = min(10, compliance_risk + 4)
    
    # Escalation likelihood (combination of emotion + urgency)
    escalation_likelihood = min(10, (emotion_intensity + priority) // 2)
    
    risk_breakdown = {
        "emotion_intensity": emotion_intensity,
        "priority": priority,
        "compliance_risk": compliance_risk,
        "escalation_likelihood": escalation_likelihood
    }
    
    risk_score = calculate_risk_score(
        emotion_intensity, priority, compliance_risk, escalation_likelihood
    )
    
    # Return complete analysis
    return {
        "intent": intent,
        "emotion": emotion,
        "emotion_reason": emotion_reason,
        "urgency": urgency,
        "compliance_flags": compliance_flags,
        "summary": summary,
        "action_items": action_items,
        "risk_score": risk_score,
        "risk_breakdown": risk_breakdown,
        "smart_reply": smart_reply,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }


def get_mock_analysis(tone: str = "empathetic") -> Dict[str, Any]:
    """
    Return mock analysis data for testing/demo
    
    Args:
        tone: Reply tone
        
    Returns:
        Mock analysis dict
    """
    mock_replies = {
        "formal": """Dear Valued Customer,

Thank you for contacting us regarding your recent purchase. We acknowledge receipt of your refund request and sincerely apologize for the inconvenience this situation has caused.

Upon review of your case, we have determined that your refund request meets our policy requirements. The refund will be processed immediately and credited to your original payment method within 3-5 business days.

Furthermore, your feedback concerning product quality has been escalated to our Quality Assurance Department for thorough investigation and corrective action.

Should you require any additional assistance, please do not hesitate to contact our support team.

Respectfully,
Customer Support Team""",
        
        "empathetic": """Dear Valued Customer,

Thank you for reaching out to us regarding your recent purchase. I sincerely apologize for the inconvenience you've experienced and for any delays in our response.

I have reviewed your case and I'm pleased to inform you that we will process your refund immediately. You can expect to see the funds returned to your original payment method within 3-5 business days.

Additionally, I've escalated your product quality concern to our quality assurance team to ensure this issue is addressed. Your feedback is invaluable in helping us improve our products and services.

If you have any further questions or concerns, please don't hesitate to reach out. We're here to help.

Best regards,
Customer Support Team""",
        
        "friendly": """Hi there!

Thanks so much for getting in touch about your recent order. I'm really sorry to hear about the trouble you've had with your purchase – that's definitely not the experience we want you to have!

Good news though – I've approved your refund and it's being processed right now. You should see the money back in your account within 3-5 business days.

I've also passed your feedback along to our product team so they can look into this and make sure it doesn't happen again. We really appreciate you letting us know!

If there's anything else I can help you with, just let me know. I'm here for you!

Cheers,
Customer Support Team""",
        
        "assertive": """Dear Customer,

We have received and reviewed your refund request.

Your refund has been approved and will be processed within 24 hours. Funds will be returned to your original payment method within 3-5 business days.

We have documented your product quality concern and it will be investigated by our quality assurance team.

For any further inquiries, please reference ticket #REF-2024-001 when contacting support.

Customer Support Team"""
    }
    
    return {
        "intent": "refund_request",
        "emotion": "frustrated",
        "emotion_reason": "Frustration detected because the customer mentions 'contacted support multiple times' and uses phrases like 'still no response' indicating repeated failed attempts to resolve the issue. The language intensity and repeated emphasis on delays suggest growing impatience.",
        "urgency": "high",
        "compliance_flags": [
            {"type": "GDPR_data_request", "detail": "Customer requested account data export", "severity": "medium"},
            {"type": "financial_transaction", "detail": "Refund request involves payment processing", "severity": "low"}
        ],
        "summary": "Customer is requesting a refund for a recent purchase due to product malfunction. They mention having contacted support multiple times without resolution.",
        "action_items": [
            {"task": "Process refund within 24 hours", "assignee": "billing", "deadline": None},
            {"task": "Investigate support ticket history", "assignee": "support", "deadline": None},
            {"task": "Follow up on product quality issue", "assignee": "ops", "deadline": None},
            {"task": "Update customer on resolution timeline", "assignee": "support", "deadline": None}
        ],
        "risk_score": 7.5,
        "risk_breakdown": {
            "emotion_intensity": 8,
            "priority": 9,
            "compliance_risk": 6,
            "escalation_likelihood": 7
        },
        "smart_reply": mock_replies.get(tone, mock_replies["empathetic"]),
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
