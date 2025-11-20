"""
LLM Service - Ollama Integration
Handles communication with Ollama API for text generation
"""
import httpx
import json
from typing import Optional, Dict, Any
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class LLMService:
    """Service for LLM operations using Ollama"""
    
    def __init__(self):
        self.ollama_url = settings.OLLAMA_BASE_URL
        self.model = settings.OLLAMA_MODEL
        self.timeout = settings.OLLAMA_TIMEOUT
    
    async def generate(
        self,
        prompt: str,
        temperature: float = 0.7,
        max_tokens: Optional[int] = None
    ) -> Optional[str]:
        """
        Generate text using Ollama API
        
        Args:
            prompt: Input prompt
            temperature: Sampling temperature (0.0 to 1.0)
            max_tokens: Maximum tokens to generate
            
        Returns:
            Generated text or None if error
        """
        try:
            payload = {
                "model": self.model,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": temperature,
                }
            }
            
            if max_tokens:
                payload["options"]["num_predict"] = max_tokens
            
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.ollama_url}/api/generate",
                    json=payload
                )
                
                if response.status_code == 200:
                    result = response.json()
                    return result.get("response", "").strip()
                else:
                    logger.error(f"Ollama API error: {response.status_code} - {response.text}")
                    return None
                    
        except httpx.TimeoutException:
            logger.error("Ollama API timeout")
            return None
        except Exception as e:
            logger.error(f"Error calling Ollama API: {str(e)}")
            return None
    
    async def generate_json(
        self,
        prompt: str,
        temperature: float = 0.3
    ) -> Optional[Dict[str, Any]]:
        """
        Generate JSON output using Ollama
        
        Args:
            prompt: Input prompt requesting JSON output
            temperature: Lower temperature for more consistent JSON
            
        Returns:
            Parsed JSON dict or None if error
        """
        response = await self.generate(prompt, temperature=temperature)
        if not response:
            logger.warning("LLM returned empty response for JSON generation")
            return None
        
        try:
            # Try to extract JSON from response
            # Sometimes the model wraps JSON in markdown code blocks
            if "```json" in response:
                json_start = response.find("```json") + 7
                json_end = response.find("```", json_start)
                json_str = response[json_start:json_end].strip()
            elif "```" in response:
                json_start = response.find("```") + 3
                json_end = response.find("```", json_start)
                json_str = response[json_start:json_end].strip()
            else:
                json_str = response.strip()
            
            # Try to find JSON object in the response
            if "{" in json_str:
                start_idx = json_str.find("{")
                end_idx = json_str.rfind("}") + 1
                json_str = json_str[start_idx:end_idx]
            
            parsed = json.loads(json_str)
            logger.info(f"Successfully parsed JSON response: {parsed}")
            return parsed
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON from LLM response: {str(e)}")
            logger.debug(f"Raw response: {response}")
            logger.debug(f"Attempted to parse: {json_str if 'json_str' in locals() else 'N/A'}")
            return None


# Global LLM service instance
llm_service = LLMService()
