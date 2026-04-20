"""Cross-encoder reranking (Phase 6.3)."""

from typing import List, Tuple


class Reranker:
    """Rerank retrieved documents by relevance (Phase 6.3)."""
    
    def __init__(self):
        """Initialize reranker (stub for Phase 6.3)."""
        raise NotImplementedError("Reranker implemented in Phase 6.3")
    
    def rerank(
        self,
        query: str,
        documents: List[Tuple[dict, float]],
        top_k: int = 5,
    ) -> List[Tuple[dict, float]]:
        """Rerank documents by relevance to query.
        
        Args:
            query: User query in Vietnamese
            documents: List of (document, score) tuples from retriever
            top_k: Keep top-k documents
            
        Returns:
            List of (document, reranked_score) tuples
        """
        raise NotImplementedError("Phase 6.3")
