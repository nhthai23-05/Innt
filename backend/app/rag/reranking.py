"""Cross-encoder reranking (Phase 6.3)."""

from typing import List, Tuple
import logging

logger = logging.getLogger(__name__)


class CrossEncoderReranker:
    """Rerank retrieved documents using a cross-encoder model.

    Uses cross-encoder/mmarco-mMiniLMv2-L12-H384-v1 — a *multilingual* MS-MARCO
    cross-encoder that covers Vietnamese. (The earlier default,
    ms-marco-MiniLM-L-6-v2, is English-only and scored Vietnamese pairs
    unreliably.) Latency target: <= +300ms over base retrieval.
    """

    def __init__(self, model_name: str = "cross-encoder/mmarco-mMiniLMv2-L12-H384-v1"):
        from sentence_transformers import CrossEncoder

        self.model = CrossEncoder(model_name)
        logger.info(f"[Reranker] Loaded {model_name}")

    def rerank(
        self,
        query: str,
        documents: List[Tuple[dict, float]],
        top_k: int = 5,
    ) -> List[Tuple[dict, float]]:
        """Score (query, doc) pairs and return top-k sorted by cross-encoder score.

        Args:
            query: Vietnamese user query
            documents: List of (document_dict, retriever_score) tuples
            top_k: Keep top-k after reranking

        Returns:
            List of (document_dict, reranker_score) tuples, sorted descending
        """
        if not documents:
            return documents

        pairs = [(query, doc["content"]) for doc, _ in documents]
        scores = self.model.predict(pairs)

        reranked = sorted(
            zip([doc for doc, _ in documents], scores.tolist()),
            key=lambda x: x[1],
            reverse=True,
        )
        return reranked[:top_k]


# Backward-compatible alias
Reranker = CrossEncoderReranker
