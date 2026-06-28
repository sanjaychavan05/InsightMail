"""
Knowledge Base Router
Handles RAG knowledge base management
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db, KnowledgeBase
from app.schemas import (
    KnowledgeBaseAddRequest,
    KnowledgeBaseListResponse,
    KnowledgeBaseItem,
    SuccessResponse
)
from app.services import rag_service
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/kb", tags=["Knowledge Base"])


@router.post("/add", response_model=SuccessResponse)
async def add_knowledge_base_document(
    request: KnowledgeBaseAddRequest,
    db: Session = Depends(get_db)
):
    """
    Add document to knowledge base
    
    Automatically generates embeddings using nomic-embed-text
    """
    try:
        # Add to knowledge base with embedding
        kb_item = await rag_service.add_to_knowledge_base(
            title=request.title,
            content=request.content,
            document_type=request.document_type or "policy",
            source=request.source,
            db=db
        )
        
        if not kb_item:
            raise HTTPException(
                status_code=500,
                detail="Failed to generate embedding for document"
            )
        
        logger.info(f"Added document to knowledge base: {request.title}")
        
        return SuccessResponse(
            success=True,
            message="Document added to knowledge base successfully",
            data=kb_item.to_dict()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error adding to knowledge base: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to add document: {str(e)}"
        )


@router.get("/list", response_model=KnowledgeBaseListResponse)
async def list_knowledge_base(
    db: Session = Depends(get_db)
):
    """
    List all documents in knowledge base
    """
    try:
        documents = db.query(KnowledgeBase).all()
        
        items = [
            KnowledgeBaseItem(
                id=doc.id,
                title=doc.title,
                content=doc.content[:200] + "..." if len(doc.content) > 200 else doc.content,
                document_type=doc.document_type,
                source=doc.source,
                created_at=doc.created_at.isoformat() if doc.created_at else "",
                updated_at=doc.updated_at.isoformat() if doc.updated_at else ""
            )
            for doc in documents
        ]
        
        logger.info(f"Retrieved {len(items)} knowledge base documents")
        
        return KnowledgeBaseListResponse(
            total=len(items),
            documents=items
        )
        
    except Exception as e:
        logger.error(f"Error listing knowledge base: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to list knowledge base: {str(e)}"
        )


@router.delete("/{document_id}", response_model=SuccessResponse)
async def delete_knowledge_base_document(
    document_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete document from knowledge base
    """
    try:
        document = db.query(KnowledgeBase).filter(KnowledgeBase.id == document_id).first()
        
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        db.delete(document)
        db.commit()
        
        logger.info(f"Deleted document from knowledge base: {document_id}")
        
        return SuccessResponse(
            success=True,
            message="Document deleted successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting knowledge base document: {str(e)}", exc_info=True)
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete document: {str(e)}"
        )
