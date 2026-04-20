"""Embedding model wrapper for Vietnamese text."""

import numpy as np
from sentence_transformers import SentenceTransformer
from typing import List
from app.config import settings


class Embedder:
    """Thin wrapper around sentence-transformers for Vietnamese embeddings."""
    
    def __init__(self, model_name: str | None = None):
        """Initialize the embedding model.
        
        Args:
            model_name: HuggingFace model ID. If None, uses settings.embedding_model
        """
        self.model_name = model_name or settings.embedding_model
        self.model = SentenceTransformer(self.model_name)
    
    def embed(self, texts: List[str]) -> np.ndarray:
        """Embed a list of texts.
        
        Args:
            texts: List of Vietnamese text strings
            
        Returns:
            numpy array of shape (len(texts), embedding_dim)
        """
        embeddings = self.model.encode(texts, convert_to_numpy=True)
        return embeddings
    
    def embed_single(self, text: str) -> np.ndarray:
        """Embed a single text.
        
        Args:
            text: Vietnamese text string
            
        Returns:
            1D numpy array (embedding_dim,)
        """
        embedding = self.model.encode(text, convert_to_numpy=True)
        return embedding
    
    @property
    def dimension(self) -> int:
        """Get the embedding dimension."""
        return self.model.get_sentence_embedding_dimension()
