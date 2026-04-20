"""Request/Response schemas for the API."""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any


class ChatRequest(BaseModel):
    """Request body for POST /api/chat."""
    
    message: str = Field(
        ...,
        description="User's question in Vietnamese",
        min_length=1,
        max_length=1000,
    )
    conversation_id: Optional[str] = Field(
        None,
        description="Optional conversation context ID for multi-turn",
    )
    image: Optional[bytes] = Field(
        None,
        description="Optional image file for multimodal queries (Phase 7)",
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "Phong bì A5 dùng giấy gì?",
                "conversation_id": "conv-123",
            }
        }


class SourceInfo(BaseModel):
    """Information about a source document."""
    
    name: str = Field(..., description="Product or document name")
    type: str = Field(..., description="'product' or 'business'")
    metadata: Optional[Dict[str, Any]] = None


class ChatResponse(BaseModel):
    """Response body for POST /api/chat."""
    
    response: str = Field(
        ...,
        description="Generated Vietnamese answer to the user's question",
    )
    sources: List[str] = Field(
        default_factory=list,
        description="List of product/document names used as sources",
    )
    redirect_to_zalo: bool = Field(
        False,
        description="Whether user should be directed to Zalo for pricing",
    )
    zalo_link: Optional[str] = Field(
        None,
        description="Zalo contact link (filled by frontend from env)",
    )
    conversation_id: Optional[str] = Field(
        None,
        description="Conversation ID for multi-turn context",
    )
    metadata: Optional[Dict[str, Any]] = Field(
        None,
        description="Pipeline metadata (strategy, intent, etc.)",
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "response": "Phong bì A5 sử dụng giấy Ford (Ốp) hoặc Giấy Couche, với định lượng từ 100g/m2 đến 150g/m2...",
                "sources": ["Phong bì A5"],
                "redirect_to_zalo": False,
                "metadata": {
                    "strategy": "dense",
                    "retrieved_docs": 3,
                    "intent": "product",
                }
            }
        }


class ConfigDTO(BaseModel):
    """Pipeline configuration DTO."""
    
    retrieval_strategy: str = Field(
        ...,
        description="Retrieval strategy: 'dense', 'bm25', or 'hybrid'",
    )
    top_k: int = Field(
        ...,
        description="Number of documents to retrieve",
    )
    use_reranking: bool = Field(
        ...,
        description="Enable cross-encoder reranking",
    )
    use_query_enhancement: bool = Field(
        ...,
        description="Enable query enhancement (HyDE, etc.)",
    )


class ErrorResponse(BaseModel):
    """Error response body."""
    
    detail: str = Field(..., description="Error message")
    status_code: int = Field(..., description="HTTP status code")


class HealthResponse(BaseModel):
    """Health check response."""
    
    status: str = Field(..., description="'ok' or 'degraded'")
    version: str = Field(..., description="API version")
    indexed_documents: int = Field(..., description="Total documents in index")
