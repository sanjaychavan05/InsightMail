"""
RAG (Retrieval-Augmented Generation) Service
Handles embeddings, vector similarity, and context retrieval
"""
import httpx
import numpy as np
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.core.config import settings
from app.db.models import KnowledgeBase
import logging

logger = logging.getLogger(__name__)


class RAGService:
    """Service for RAG operations"""
    
    def __init__(self):
        self.ollama_url = settings.OLLAMA_BASE_URL
        self.embedding_model = settings.OLLAMA_EMBEDDING_MODEL
        self.top_k = settings.RAG_TOP_K
        self.similarity_threshold = settings.RAG_SIMILARITY_THRESHOLD
    
    async def embed_text(self, text: str) -> Optional[List[float]]:
        """
        Generate embedding for text using Ollama nomic-embed-text
        
        Args:
            text: Text to embed
            
        Returns:
            List of floats representing the embedding vector
        """
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.ollama_url}/api/embeddings",
                    json={
                        "model": self.embedding_model,
                        "prompt": text
                    }
                )
                
                if response.status_code == 200:
                    result = response.json()
                    return result.get("embedding")
                else:
                    logger.error(f"Embedding API error: {response.status_code} - {response.text}")
                    return None
                    
        except Exception as e:
            logger.error(f"Error generating embedding: {str(e)}")
            return None
    
    @staticmethod
    def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
        """
        Calculate cosine similarity between two vectors
        
        Args:
            vec1: First vector
            vec2: Second vector
            
        Returns:
            Similarity score between 0 and 1
        """
        try:
            v1 = np.array(vec1)
            v2 = np.array(vec2)
            
            dot_product = np.dot(v1, v2)
            norm_v1 = np.linalg.norm(v1)
            norm_v2 = np.linalg.norm(v2)
            
            if norm_v1 == 0 or norm_v2 == 0:
                return 0.0
            
            similarity = dot_product / (norm_v1 * norm_v2)
            return float(similarity)
            
        except Exception as e:
            logger.error(f"Error calculating cosine similarity: {str(e)}")
            return 0.0
    
    async def retrieve_rag_context(
        self,
        query: str,
        db: Session,
        top_k: Optional[int] = None,
        similarity_threshold: Optional[float] = None
    ) -> List[Dict[str, Any]]:
        """
        Retrieve relevant context from knowledge base using RAG
        
        Args:
            query: Query text to search for
            db: Database session
            top_k: Number of top results to return
            similarity_threshold: Minimum similarity score
            
        Returns:
            List of relevant context items with scores
        """
        if top_k is None:
            top_k = self.top_k
        if similarity_threshold is None:
            similarity_threshold = self.similarity_threshold
        
        try:
            # Generate query embedding
            query_embedding = await self.embed_text(query)
            if not query_embedding:
                logger.warning("Failed to generate query embedding")
                return []
            
            # Retrieve all knowledge base items
            kb_items = db.query(KnowledgeBase).all()
            if not kb_items:
                logger.info("Knowledge base is empty")
                return []
            
            # Calculate similarities
            scored_items = []
            for item in kb_items:
                if item.embedding:
                    similarity = self.cosine_similarity(query_embedding, item.embedding)
                    if similarity >= similarity_threshold:
                        scored_items.append({
                            "id": item.id,
                            "title": item.title,
                            "content": item.content,
                            "document_type": item.document_type,
                            "relevance_score": round(similarity, 4)
                        })
            
            # Sort by relevance and return top-k
            scored_items.sort(key=lambda x: x["relevance_score"], reverse=True)
            return scored_items[:top_k]
            
        except Exception as e:
            logger.error(f"Error retrieving RAG context: {str(e)}")
            return []
    
    async def add_to_knowledge_base(
        self,
        title: str,
        content: str,
        document_type: str,
        source: Optional[str],
        db: Session
    ) -> Optional[KnowledgeBase]:
        """
        Add document to knowledge base with embedding
        
        Args:
            title: Document title
            content: Document content
            document_type: Type of document
            source: Source reference
            db: Database session
            
        Returns:
            Created KnowledgeBase object or None
        """
        try:
            # Generate embedding
            embedding = await self.embed_text(content)
            if not embedding:
                logger.error("Failed to generate embedding for document")
                return None
            
            # Create knowledge base entry
            kb_item = KnowledgeBase(
                title=title,
                content=content,
                document_type=document_type,
                source=source,
                embedding=embedding
            )
            
            db.add(kb_item)
            db.commit()
            db.refresh(kb_item)
            
            logger.info(f"Added document to knowledge base: {title}")
            return kb_item
            
        except Exception as e:
            logger.error(f"Error adding to knowledge base: {str(e)}")
            db.rollback()
            return None


# Global RAG service instance
rag_service = RAGService()
