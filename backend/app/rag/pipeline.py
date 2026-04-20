"""RAG pipeline orchestrator."""

from typing import Optional, List
from dataclasses import dataclass, asdict
from app.config import settings
from app.rag.retrieval import DenseRetriever
from app.rag.generation import Generator


@dataclass
class RagResponse:
    """RAG pipeline response structure."""
    answer: str
    sources: List[str]
    metadata: dict
    redirect_to_zalo: bool = False
    conversation_id: Optional[str] = None


class RagPipeline:
    """Main RAG orchestrator - query to answer."""
    
    def __init__(
        self,
        retrieval_strategy: Optional[str] = None,
        top_k: Optional[int] = None,
        use_reranking: Optional[bool] = None,
        use_query_enhancement: Optional[bool] = None,
    ):
        """Initialize RAG pipeline.
        
        Args:
            retrieval_strategy: Override settings.retrieval_strategy
            top_k: Override settings.top_k
            use_reranking: Override settings.use_reranking
            use_query_enhancement: Override settings.use_query_enhancement
        """
        # Configuration (can be overridden per call for experiments)
        self.retrieval_strategy = retrieval_strategy or settings.retrieval_strategy
        self.top_k = top_k or settings.top_k
        self.use_reranking = use_reranking if use_reranking is not None else settings.use_reranking
        self.use_query_enhancement = use_query_enhancement if use_query_enhancement is not None else settings.use_query_enhancement
        
        # Initialize components
        self.retriever = self._init_retriever()
        self.generator = Generator()
    
    def _init_retriever(self):
        """Initialize retriever based on strategy."""
        if self.retrieval_strategy == "dense":
            return DenseRetriever()
        elif self.retrieval_strategy == "bm25":
            raise NotImplementedError("BM25Retriever in Phase 6.1")
        elif self.retrieval_strategy == "hybrid":
            raise NotImplementedError("HybridRetriever in Phase 6.2")
        else:
            raise ValueError(f"Unknown retrieval strategy: {self.retrieval_strategy}")
    
    def query(self, text: str, conversation_id: Optional[str] = None) -> dict:
        """Process a user query end-to-end.
        
        Args:
            text: Vietnamese user query
            conversation_id: Optional conversation context ID
            
        Returns:
            Dictionary with answer, sources, and metadata
        """
        # Phase 6.4: Intent classification (stub for Phase 1)
        # For Phase 1, we just proceed with normal retrieval
        intent = "general"  # Phase 6.4 will enhance this
        
        # Phase 6.5: Query enhancement (stub for Phase 1)
        enhanced_query = text  # Phase 6.5 will enhance with HyDE
        
        # Retrieve context documents
        retrieved_docs = self.retriever.retrieve(enhanced_query, top_k=self.top_k)
        
        # Phase 6.3: Reranking (stub for Phase 1)
        if self.use_reranking:
            retrieved_docs = self._rerank_docs(retrieved_docs)
        
        # Extract sources and context
        sources = []
        context_docs = []
        for doc, score in retrieved_docs:
            context_docs.append(doc)
            # Extract product/document ID from metadata
            metadata = doc.get("metadata", {})
            source_id = metadata.get("product_name") or metadata.get("doc_title") or "Unknown"
            if source_id not in sources:
                sources.append(source_id)
        
        # Generate response
        if not context_docs:
            answer = "Xin lỗi, tôi không tìm thấy thông tin liên quan để trả lời câu hỏi này. Vui lòng liên hệ công ty để được hỗ trợ trực tiếp."
            result = {
                "answer": answer,
                "sources": [],
                "redirect_to_zalo": True,
                "metadata": {
                    "strategy": self.retrieval_strategy,
                    "retrieved_docs": 0,
                    "intent": intent,
                },
            }
        else:
            answer = self.generator.generate(text, context_docs)
            result = {
                "answer": answer,
                "sources": sources,
                "redirect_to_zalo": False,
                "metadata": {
                    "strategy": self.retrieval_strategy,
                    "retrieved_docs": len(context_docs),
                    "intent": intent,
                    "top_k": self.top_k,
                },
            }
        
        if conversation_id:
            result["conversation_id"] = conversation_id
        
        return result
    
    def _rerank_docs(self, docs: List[tuple]) -> List[tuple]:
        """Rerank retrieved documents (stub for Phase 6.3)."""
        # Phase 6.3 will implement CrossEncoderReranker
        return docs
    
    def get_config(self) -> dict:
        """Get current pipeline configuration."""
        return {
            "retrieval_strategy": self.retrieval_strategy,
            "top_k": self.top_k,
            "use_reranking": self.use_reranking,
            "use_query_enhancement": self.use_query_enhancement,
        }
