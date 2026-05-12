"""Query intent classification (Phase 6.4)."""

from enum import Enum


class QueryIntent(str, Enum):
    """Intent categories for user queries."""
    PRODUCT = "product"  # Asking about a specific product
    COMPARISON = "comparison"  # Comparing products
    BUSINESS = "business"  # Asking about company info
    RECOMMENDATION = "recommendation"  # Asking for recommendations
    PRICING = "pricing"  # Asking about prices
    IMAGE = "image"  # Image-based query
    OUT_OF_SCOPE = "out_of_scope"  # Not related to business


class IntentClassifier:
    """Classify user query intent (Phase 6.4 implementation)."""
    
    def __init__(self):
        """Initialize classifier (stub for Phase 6.4)."""
        raise NotImplementedError("IntentClassifier implemented in Phase 6.4")
    
    def classify(self, query: str) -> str:
        """Classify a Vietnamese query.
        
        Args:
            query: User query in Vietnamese
            
        Returns:
            QueryIntent value as string
        """
        raise NotImplementedError("Phase 6.4")
