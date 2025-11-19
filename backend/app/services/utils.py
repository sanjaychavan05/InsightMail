"""
Utility functions for text processing and data handling
"""
import re
import json
from typing import Any, Dict, Optional


def clean_text(text: str) -> str:
    """
    Clean and normalize email text
    
    Args:
        text: Raw email text
        
    Returns:
        Cleaned text
    """
    # Remove excessive whitespace
    text = re.sub(r'\s+', ' ', text)
    
    # Remove email headers if present
    text = re.sub(r'^(From:|To:|Subject:|Date:).*?\n', '', text, flags=re.MULTILINE)
    
    return text.strip()


def mask_pii(text: str) -> str:
    """
    Mask potentially sensitive PII in text
    
    Args:
        text: Text potentially containing PII
        
    Returns:
        Text with PII masked
    """
    # Mask email addresses
    text = re.sub(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', '[EMAIL]', text)
    
    # Mask phone numbers (various formats)
    text = re.sub(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', '[PHONE]', text)
    text = re.sub(r'\b\(\d{3}\)\s*\d{3}[-.]?\d{4}\b', '[PHONE]', text)
    
    # Mask credit card numbers (simple pattern)
    text = re.sub(r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b', '[CARD]', text)
    
    # Mask SSN
    text = re.sub(r'\b\d{3}-\d{2}-\d{4}\b', '[SSN]', text)
    
    return text


def parse_json_safe(text: str, default: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Safely parse JSON with fallback
    
    Args:
        text: JSON text to parse
        default: Default value if parse fails
        
    Returns:
        Parsed dict or default
    """
    try:
        # Try to extract JSON from markdown code blocks
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()
        
        return json.loads(text)
    except (json.JSONDecodeError, IndexError, AttributeError):
        return default or {}


def safe_json_get(data: Dict[str, Any], key: str, default: Any = None) -> Any:
    """
    Safely get value from dict with default
    
    Args:
        data: Dictionary to search
        key: Key to retrieve
        default: Default value if key not found
        
    Returns:
        Value or default
    """
    return data.get(key, default)
