"""RAG pipeline orchestrator."""

from typing import Optional, List
from dataclasses import dataclass
from app.config import settings
from app.rag.retrieval import DenseRetriever, BM25Retriever, HybridRetriever
from app.rag.generation import Generator
from app.rag.intent import IntentClassifier, QueryIntent
from app.rag.reranking import CrossEncoderReranker
from app.rag.query_enhancement import QueryEnhancer

import logging
logger = logging.getLogger(__name__)


@dataclass
class RagResponse:
    """RAG pipeline response structure."""
    answer: str
    sources: List[str]
    metadata: dict
    redirect_to_zalo: bool = False
    conversation_id: Optional[str] = None


_PRICING_REDIRECT = (
    "Xin lỗi, tôi không thể cung cấp báo giá trực tiếp. "
    "Để nhận báo giá chính xác và tư vấn chi tiết, vui lòng liên hệ công ty qua Zalo hoặc hotline. "
    "Chúng tôi sẽ phục vụ bạn một cách tốt nhất!"
)

_ENHANCE_INTENTS = {
    QueryIntent.PRODUCT,
    QueryIntent.BUSINESS,
    QueryIntent.RECOMMENDATION,
    QueryIntent.COMPARISON,
}


class RagPipeline:
    """Main RAG orchestrator — query to answer."""

    def __init__(
        self,
        retrieval_strategy: Optional[str] = None,
        top_k: Optional[int] = None,
        use_reranking: Optional[bool] = None,
        use_query_enhancement: Optional[bool] = None,
        query_enhancement_method: Optional[str] = None,
        hybrid_alpha: Optional[float] = None,
    ):
        self.retrieval_strategy = retrieval_strategy or settings.retrieval_strategy
        self.top_k = top_k or settings.top_k
        self.use_reranking = use_reranking if use_reranking is not None else settings.use_reranking
        self.use_query_enhancement = (
            use_query_enhancement if use_query_enhancement is not None
            else settings.use_query_enhancement
        )
        self.query_enhancement_method = query_enhancement_method or settings.query_enhancement_method
        self.hybrid_alpha = hybrid_alpha if hybrid_alpha is not None else 0.5

        self.retriever = self._init_retriever()
        self.generator = Generator()
        self.intent_classifier = IntentClassifier()
        self.reranker = CrossEncoderReranker() if self.use_reranking else None
        self.query_enhancer = (
            QueryEnhancer(method=self.query_enhancement_method)
            if self.use_query_enhancement else None
        )
        self._image_matcher = None  # lazy — loaded on first image query (Phase 7)

        logger.info(
            f"[Pipeline] strategy={self.retrieval_strategy} top_k={self.top_k} "
            f"rerank={self.use_reranking} enhance={self.use_query_enhancement}"
        )

    def _init_retriever(self):
        if self.retrieval_strategy == "dense":
            return DenseRetriever()
        elif self.retrieval_strategy == "bm25":
            return BM25Retriever()
        elif self.retrieval_strategy == "hybrid":
            return HybridRetriever(alpha=self.hybrid_alpha)
        else:
            raise ValueError(f"Unknown retrieval strategy: {self.retrieval_strategy}")

    def query(self, text: str, conversation_id: Optional[str] = None) -> dict:
        """Process a Vietnamese user query end-to-end.

        Returns:
            dict with: response, sources, retrieved_contents,
                       redirect_to_zalo, metadata, [conversation_id]
        """
        # 6.4 Intent classification
        intent = self.intent_classifier.classify(text)
        logger.info(f"[Pipeline] intent={intent}")

        # Pricing → canned redirect, no retrieval
        if intent == QueryIntent.PRICING:
            result = {
                "response": _PRICING_REDIRECT,
                "sources": [],
                "retrieved_contents": [],
                "redirect_to_zalo": True,
                "metadata": {
                    "llm_name": settings.gemini_model,
                    "retrieval_strategy": self.retrieval_strategy,
                    "retrieved_docs": 0,
                    "use_rerank": self.use_reranking,
                    "use_query_enhancement": self.use_query_enhancement,
                    "intent": str(intent),
                    "top_k": self.top_k,
                },
            }
            if conversation_id:
                result["conversation_id"] = conversation_id
            return result

        # 6.5 Query enhancement (HyDE / rewrite / expand)
        if self.use_query_enhancement and self.query_enhancer and intent in _ENHANCE_INTENTS:
            enhanced_query = self.query_enhancer.enhance(text)
        else:
            enhanced_query = text
        logger.info(f"[Pipeline] enhanced_query[:80]={enhanced_query[:80]}")

        # Retrieval — fetch more for comparison queries before reranking
        fetch_k = self.top_k * 2 if intent == QueryIntent.COMPARISON else self.top_k
        retrieved_docs = self.retriever.retrieve(enhanced_query, top_k=fetch_k)

        # 6.3 Reranking
        if self.use_reranking and self.reranker and retrieved_docs:
            retrieved_docs = self.reranker.rerank(text, retrieved_docs, top_k=self.top_k)

        # Extract sources and context
        sources = []
        context_docs = []
        for doc, score in retrieved_docs:
            context_docs.append(doc)
            metadata = doc.get("metadata", {})
            source_id = metadata.get("product_name") or metadata.get("doc_title") or "Unknown"
            if source_id not in sources:
                sources.append(source_id)

        # Generation
        if not context_docs:
            answer = (
                "Xin lỗi, tôi không tìm thấy thông tin liên quan để trả lời câu hỏi này. "
                "Vui lòng liên hệ công ty để được hỗ trợ trực tiếp."
            )
            result = {
                "response": answer,
                "sources": [],
                "retrieved_contents": [],
                "redirect_to_zalo": True,
                "metadata": {
                    "retrieval_strategy": self.retrieval_strategy,
                    "retrieved_docs": 0,
                    "intent": str(intent),
                },
            }
        else:
            answer = self.generator.generate(text, context_docs)
            result = {
                "response": answer,
                "sources": sources,
                "retrieved_contents": [doc["content"] for doc in context_docs],
                "redirect_to_zalo": False,
                "metadata": {
                    "llm_name": settings.gemini_model,
                    "retrieval_strategy": self.retrieval_strategy,
                    "retrieved_docs": len(context_docs),
                    "use_rerank": self.use_reranking,
                    "use_query_enhancement": self.use_query_enhancement,
                    "intent": str(intent),
                    "top_k": self.top_k,
                },
            }

        if conversation_id:
            result["conversation_id"] = conversation_id
        return result

    # ------------------------------------------------------------------
    # Phase 7 — Image query
    # ------------------------------------------------------------------

    @property
    def image_matcher(self):
        if self._image_matcher is None:
            from app.multimodal.image_matching import CLIPImageMatcher  # noqa: PLC0415
            self._image_matcher = CLIPImageMatcher()
        return self._image_matcher

    def query_by_image(
        self,
        image_bytes: bytes,
        text: str = "",
        conversation_id: Optional[str] = None,
    ) -> dict:
        """Route an image upload through CLIP matching then RAG generation.

        If CLIP finds no match above threshold, returns a Vietnamese apology.
        If matches found, retrieves product docs and generates a description.
        """
        from app.multimodal.image_matching import apology  # noqa: PLC0415

        matches = self.image_matcher.match(image_bytes, top_k=3)

        if not matches:
            result = {
                "response": apology(),
                "sources": [],
                "retrieved_contents": [],
                "redirect_to_zalo": False,
                "metadata": {"intent": "image", "image_match": False},
            }
            if conversation_id:
                result["conversation_id"] = conversation_id
            return result

        # Retrieve docs for each matched product (deduplicated)
        seen_keys: set = set()
        context_docs: list = []
        for match in matches:
            for doc, _ in self.retriever.retrieve(match["product_name"], top_k=2):
                key = doc.get("content", "")[:60]
                if key not in seen_keys:
                    seen_keys.add(key)
                    context_docs.append(doc)

        user_query = (
            text.strip()
            or f"Hãy giới thiệu về sản phẩm {matches[0]['product_name']}."
        )
        answer = self.generator.generate(user_query, context_docs)

        sources = list(dict.fromkeys(m["product_name"] for m in matches))
        result = {
            "response": answer,
            "sources": sources,
            "retrieved_contents": [d["content"] for d in context_docs],
            "redirect_to_zalo": False,
            "metadata": {
                "intent": "image",
                "image_match": True,
                "matched_products": [
                    {
                        "product_id": m["product_id"],
                        "product_name": m["product_name"],
                        "score": m["score"],
                    }
                    for m in matches
                ],
                "retrieval_strategy": self.retrieval_strategy,
                "retrieved_docs": len(context_docs),
            },
        }
        if conversation_id:
            result["conversation_id"] = conversation_id
        return result

    def get_config(self) -> dict:
        return {
            "retrieval_strategy": self.retrieval_strategy,
            "top_k": self.top_k,
            "use_reranking": self.use_reranking,
            "use_query_enhancement": self.use_query_enhancement,
            "query_enhancement_method": self.query_enhancement_method,
            "hybrid_alpha": self.hybrid_alpha,
        }
