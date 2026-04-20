"""API routes for the RAG chatbot."""

from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse
from typing import Optional, Dict, Any
import logging

from app.api.schemas import (
    ChatRequest, ChatResponse, ConfigDTO, ErrorResponse, HealthResponse
)
from app.rag.pipeline import RagPipeline
from app.indexing.indexer import IndexBuilder

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["RAG API"])

# Global pipeline instance (can be reconfigured for experiments)
_pipeline: Optional[RagPipeline] = None


def get_pipeline() -> RagPipeline:
    """Get or create the global pipeline instance."""
    global _pipeline
    if _pipeline is None:
        _pipeline = RagPipeline()
    return _pipeline


@router.post("/chat", response_model=ChatResponse)
async def chat(
    message: str = Form(..., description="User message"),
    conversation_id: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
) -> Dict[str, Any]:
    """
    Process a user message and return a grounded answer.
    
    - **message**: User's question in Vietnamese (required)
    - **conversation_id**: Optional ID for multi-turn conversations
    - **image**: Optional image file for multimodal queries (Phase 7)
    
    Returns ChatResponse with answer, sources, metadata.
    """
    try:
        # Validate input
        if not message or not message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        # For Phase 1, ignore image (Phase 7 will handle it)
        if image:
            logger.info(f"Received image upload (ignored in Phase 1): {image.filename}")
        
        # Get or create pipeline
        pipeline = get_pipeline()
        
        # Query the pipeline
        result = pipeline.query(message, conversation_id=conversation_id)
        
        return ChatResponse(**result)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing chat: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


@router.get("/config", response_model=ConfigDTO)
async def get_config() -> Dict[str, Any]:
    """
    Get current RAG pipeline configuration.
    
    Returns the current settings for retrieval strategy, reranking, etc.
    """
    try:
        pipeline = get_pipeline()
        return pipeline.get_config()
    except Exception as e:
        logger.error(f"Error getting config: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/config", response_model=ConfigDTO)
async def update_config(config: ConfigDTO) -> Dict[str, Any]:
    """
    Update pipeline configuration (non-persistent, for experiments).
    
    This endpoint allows temporary configuration changes for experiment runs.
    Changes are in-memory only and reset when the server restarts.
    
    - **retrieval_strategy**: 'dense', 'bm25', or 'hybrid'
    - **top_k**: Number of documents to retrieve
    - **use_reranking**: Enable cross-encoder reranking
    - **use_query_enhancement**: Enable query enhancement
    """
    try:
        global _pipeline
        
        # Create new pipeline with override settings
        _pipeline = RagPipeline(
            retrieval_strategy=config.retrieval_strategy,
            top_k=config.top_k,
            use_reranking=config.use_reranking,
            use_query_enhancement=config.use_query_enhancement,
        )
        
        logger.info(f"Updated pipeline config: {config}")
        return _pipeline.get_config()
    
    except Exception as e:
        logger.error(f"Error updating config: {e}")
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/index/rebuild")
async def rebuild_index() -> Dict[str, Any]:
    """
    Rebuild the ChromaDB index from source data.
    
    This endpoint:
    1. Deletes the existing index
    2. Reloads documents from data/products.json and data/business.json
    3. Re-embeds and re-indexes them into ChromaDB
    
    ⚠️ Warning: This is a synchronous, blocking operation. Can take several minutes for large datasets.
    """
    try:
        logger.info("Starting index rebuild...")
        builder = IndexBuilder()
        builder.rebuild_index()
        
        # Get the rebuilt collection to verify
        collection = builder.get_collection()
        doc_count = collection.count()
        
        logger.info(f"Index rebuild complete: {doc_count} documents")
        
        # Reset pipeline to refresh the retriever with new index
        global _pipeline
        _pipeline = None
        
        return {
            "status": "success",
            "message": f"Index rebuilt successfully with {doc_count} documents",
            "indexed_documents": doc_count,
        }
    
    except Exception as e:
        logger.error(f"Error rebuilding index: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health", response_model=HealthResponse)
async def health_check() -> Dict[str, Any]:
    """
    Health check endpoint.
    
    Returns the status of the API and the RAG pipeline, including:
    - Whether the index is accessible
    - Number of indexed documents
    - API version
    """
    try:
        builder = IndexBuilder()
        collection = builder.get_collection()
        doc_count = collection.count()
        
        return HealthResponse(
            status="ok",
            version="1.0.0",
            indexed_documents=doc_count,
        )
    
    except Exception as e:
        logger.warning(f"Health check degraded: {e}")
        return HealthResponse(
            status="degraded",
            version="1.0.0",
            indexed_documents=0,
        )


@router.get("/", tags=["Info"])
async def root():
    """API root endpoint with links to documentation."""
    return {
        "name": "Innt RAG Chatbot API",
        "version": "1.0.0",
        "docs": "/docs",
        "openapi": "/openapi.json",
        "endpoints": {
            "chat": "POST /api/chat",
            "get_config": "GET /api/config",
            "update_config": "POST /api/config",
            "rebuild_index": "POST /api/index/rebuild",
            "health": "GET /api/health",
        }
    }
