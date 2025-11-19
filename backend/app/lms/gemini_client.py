"""
Google Gemini API Client

Wrapper for calling Gemini and parsing JSON responses.
"""
import os
import json
from dotenv import load_dotenv
import google.generativeai as genai
from typing import Dict, Any, Optional

# Ensure .env is loaded
load_dotenv()

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    MOCK_MODE = False
    print("✓ Gemini API configured")
else:
    MOCK_MODE = True
    print("⚠ Warning: GEMINI_API_KEY not set. Running in MOCK mode.")


class GeminiClient:
    """Client for interacting with Google Gemini API"""
    
    def __init__(self, model_name: str = "gemini-2.0-flash"):
        """
        Initialize Gemini client
        
        Args:
            model_name: Gemini model to use (default: gemini-pro)
        """
        self.model_name = model_name
        self.mock_mode = MOCK_MODE
        
        if not self.mock_mode:
            self.model = genai.GenerativeModel(model_name)
    
    def generate_json(self, prompt: str, default: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Generate JSON response from Gemini
        
        Args:
            prompt: The prompt to send
            default: Default response if parsing fails or in mock mode
            
        Returns:
            Parsed JSON dict
        """
        if self.mock_mode:
            return default or {}
        
        try:
            # Call Gemini API
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.3,  # Lower temperature for more consistent output
                    top_p=0.95,
                    top_k=40,
                    max_output_tokens=1024,
                )
            )
            
            # Extract text from response
            text = response.text.strip()
            
            # Try to extract JSON from response
            # Sometimes Gemini wraps in markdown code blocks
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].split("```")[0].strip()
            
            # Parse JSON
            result = json.loads(text)
            return result
            
        except json.JSONDecodeError as e:
            print(f"⚠ JSON parse error: {e}")
            print(f"Response text: {text[:200]}")
            return default or {}
            
        except Exception as e:
            print(f"⚠ Gemini API error: {e}")
            return default or {}
    
    def generate_text(self, prompt: str, default: str = "") -> str:
        """
        Generate plain text response from Gemini
        
        Args:
            prompt: The prompt to send
            default: Default response if generation fails
            
        Returns:
            Generated text
        """
        if self.mock_mode:
            return default
        
        try:
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.7,
                    max_output_tokens=2048,
                )
            )
            return response.text.strip()
            
        except Exception as e:
            print(f"⚠ Gemini API error: {e}")
            return default


# Singleton instance
gemini_client = GeminiClient()
