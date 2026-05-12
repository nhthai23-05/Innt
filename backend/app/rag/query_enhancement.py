"""Query enhancement strategies (Phase 6.5)."""

from enum import Enum


class QueryEnhancementMethod(str, Enum):
    """Query enhancement strategies."""
    HYDE = "hyde"  # Hypothetical Document Embeddings
    REWRITE = "rewrite"  # Query rewriting
    EXPAND = "expand"  # Query expansion


class QueryEnhancer:
    """Enhance user queries for better retrieval (Phase 6.5)."""
    
    def __init__(self, method: str = "hyde"):
        """Initialize query enhancer (stub for Phase 6.5).
        
        Args:
            method: Enhancement method (hyde, rewrite, expand)
        """
        self.method = method
        raise NotImplementedError("QueryEnhancer implemented in Phase 6.5")
    
    def enhance(self, query: str) -> str:
        """Enhance a Vietnamese query.
        
        Args:
            query: Original user query
            
        Returns:
            Enhanced query (or hypothetical answer for HyDE)
        """
        raise NotImplementedError("Phase 6.5")
