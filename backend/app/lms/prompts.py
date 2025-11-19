"""
LLM Prompt Templates for Email Analysis

All prompts request JSON-only responses for reliable parsing.
"""


def get_intent_prompt(email_text: str) -> str:
    """Prompt for intent classification"""
    return f"""Analyze this customer email and identify the primary intent.

Email:
{email_text}

Return ONLY a JSON object (no markdown, no explanation) with this structure:
{{
  "intent": "one of: refund_request, product_inquiry, technical_support, complaint, feedback, account_issue, shipping_inquiry, other"
}}

JSON:"""


def get_emotion_prompt(email_text: str) -> str:
    """Prompt for emotion/sentiment analysis with explainability"""
    return f"""Analyze the emotion and sentiment in this customer email.

Email:
{email_text}

Return ONLY a JSON object (no markdown, no explanation) with this structure:
{{
  "emotion": "primary emotion (e.g., frustrated, angry, happy, neutral, confused, disappointed, excited)",
  "emotion_reason": "brief explanation of why this emotion was detected, citing specific phrases or patterns"
}}

JSON:"""


def get_urgency_prompt(email_text: str) -> str:
    """Prompt for urgency detection"""
    return f"""Determine the urgency level of this customer email.

Email:
{email_text}

Return ONLY a JSON object (no markdown, no explanation) with this structure:
{{
  "urgency": "one of: high, medium, low"
}}

Consider:
- High: Immediate action needed, angry/distressed customer, service disruption, legal/compliance mention
- Medium: Important but not critical, follow-up needed soon
- Low: General inquiry, no time pressure

JSON:"""


def get_compliance_prompt(email_text: str) -> str:
    """Prompt for compliance flag detection"""
    return f"""Identify any compliance or regulatory concerns in this customer email.

Email:
{email_text}

Return ONLY a JSON object (no markdown, no explanation) with this structure:
{{
  "compliance_flags": [
    {{"type": "flag_type", "detail": "what was detected", "severity": "low|medium|high"}}
  ]
}}

Check for:
- GDPR/data privacy requests (data deletion, data access, right to be forgotten)
- PII exposure (credit card numbers, SSN, passwords shared in email)
- Financial transaction mentions
- Legal threats or lawyer mentions
- Regulatory compliance (HIPAA, CCPA, etc.)

If no compliance issues, return empty array.

JSON:"""


def get_summary_prompt(email_text: str) -> str:
    """Prompt for thread summarization"""
    return f"""Summarize this customer email concisely (2-3 sentences).

Email:
{email_text}

Return ONLY a JSON object (no markdown, no explanation) with this structure:
{{
  "summary": "concise summary focusing on: what happened, what customer wants, key concerns"
}}

JSON:"""


def get_action_items_prompt(email_text: str) -> str:
    """Prompt for action item extraction"""
    return f"""Extract actionable tasks from this customer email.

Email:
{email_text}

Return ONLY a JSON object (no markdown, no explanation) with this structure:
{{
  "action_items": [
    {{"task": "what needs to be done", "assignee": "suggested team/person (e.g., support, ops, billing, legal)", "deadline": null}}
  ]
}}

If no clear action items, return empty array.

JSON:"""


def get_smart_reply_prompt(email_text: str, tone: str = "empathetic") -> str:
    """Prompt for smart reply generation"""
    tone_instructions = {
        "formal": "Use professional, structured language. Be respectful and use formal greetings/closings.",
        "empathetic": "Show understanding and care. Acknowledge the customer's feelings. Be warm but professional.",
        "friendly": "Use casual, warm language. Be conversational and approachable. Show personality.",
        "assertive": "Be direct and confident. State facts clearly. Keep it brief and to the point."
    }
    
    instruction = tone_instructions.get(tone, tone_instructions["empathetic"])
    
    return f"""Generate a customer support reply to this email.

Email:
{email_text}

Tone: {tone}
Instructions: {instruction}

Return ONLY a JSON object (no markdown, no explanation) with this structure:
{{
  "smart_reply": "the full reply text, properly formatted with greeting, body, and closing"
}}

Requirements:
- Address the customer's concerns directly
- Provide next steps or timeline if applicable
- Maintain the specified tone throughout
- Include appropriate greeting and sign-off
- Keep it professional and helpful

JSON:"""
