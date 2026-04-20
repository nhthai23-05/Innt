"""Document retrieval strategies."""

from typing import List, Tuple
import chromadb
from app.config import settings
from app.rag.embeddings import Embedder


class Retriever:
    """Base retriever interface."""
    
    def retrieve(self, query: str, top_k: int = 5) -> List[Tuple[dict, float]]:
        """Retrieve top-k documents for a query.
        
        Args:
            query: Vietnamese query text
            top_k: Number of results to return
            
        Returns:
            List of (document_dict, relevance_score) tuples
        """
        raise NotImplementedError


class DenseRetriever(Retriever):
    """Dense retrieval using semantic embeddings."""
    
    def __init__(self, collection_name: str = "documents"):
        """Initialize dense retriever.
        
        Args:
            collection_name: ChromaDB collection name
        """
        self.embedder = Embedder()
        self.client = chromadb.PersistentClient(path=settings.chroma_persist_dir)
        self.collection = self.client.get_collection(name=collection_name)
    
    def retrieve(self, query: str, top_k: int = 5) -> List[Tuple[dict, float]]:
        """Retrieve top-k documents using semantic similarity.
        
        Args:
            query: Vietnamese query text
            top_k: Number of results to return
            
        Returns:
            List of (document_dict, relevance_score) tuples
        """
        # Embed the query
        query_embedding = self.embedder.embed_single(query)
        
        # Query ChromaDB
        results = self.collection.query(
            query_embeddings=[query_embedding.tolist()],
            n_results=top_k,
            include=["documents", "metadatas", "distances"]
        )
        
        # Convert distances to similarity scores (Note: ChromaDB cosine distance, not similarity)
        # Cosine distance = 1 - cosine_similarity, so we need to convert back
        documents = results.get("documents", [[]])[0]
        metadatas = results.get("metadatas", [[]])[0]
        distances = results.get("distances", [[]])[0]
        
        # Convert distance to similarity (cosine similarity = 1 - distance)
        similarities = [1 - d for d in distances]
        
        # Build result tuples
        retrieved = []
        for doc, metadata, score in zip(documents, metadatas, similarities):
            doc_dict = {
                "content": doc,
                "metadata": metadata,
            }
            retrieved.append((doc_dict, score))
        
        return retrieved


class BM25Retriever(Retriever):
    """Sparse retrieval using BM25 algorithm (Phase 6.1)."""
    
    def __init__(self):
        """Initialize BM25 retriever (stub for Phase 6.1)."""
        raise NotImplementedError("BM25Retriever implemented in Phase 6.1")


class HybridRetriever(Retriever):
    """Hybrid retrieval combining dense and sparse (Phase 6.2)."""
    
    def __init__(self):
        """Initialize hybrid retriever (stub for Phase 6.2)."""
        raise NotImplementedError("HybridRetriever implemented in Phase 6.2")
