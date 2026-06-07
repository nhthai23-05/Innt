"""Query intent classification (Phase 6.4)."""

from enum import Enum
import logging

logger = logging.getLogger(__name__)

# Keyword heuristics for common cases (avoids an LLM call).
# NOTE: bare "bao nhiêu" / "phí" were removed — they false-trigger on spec
# questions ("chịu được bao nhiêu kg?", "khổ A5 bao nhiêu cm?"). Only
# unambiguous price phrases are kept; ambiguous ones fall through to the LLM.
_PRICING_KEYWORDS = {"giá", "báo giá", "bao nhiêu tiền", "giá bao nhiêu", "chi phí", "đơn giá", "giá cả"}
_OUT_OF_SCOPE_KEYWORDS = {"thời tiết", "bóng đá", "covid", "tin tức", "sức khỏe", "chứng khoán"}


class QueryIntent(str, Enum):
    """Intent categories for user queries."""
    PRODUCT = "product"
    COMPARISON = "comparison"
    BUSINESS = "business"
    RECOMMENDATION = "recommendation"
    PRICING = "pricing"
    IMAGE = "image"
    OUT_OF_SCOPE = "out_of_scope"


class IntentClassifier:
    """LLM-based intent classifier for Vietnamese queries (Phase 6.4).

    Routing:
    - pricing      → canned Zalo redirect (no retrieval)
    - comparison   → multi-document retrieval
    - image        → image matching path
    - others       → standard dense/hybrid retrieval
    """

    _SYSTEM_PROMPT = (
        "Bạn là bộ phân loại câu hỏi. Phân loại câu hỏi sau thành ĐÚNG MỘT trong các nhãn sau:\n"
        "product, comparison, business, recommendation, pricing, image, out_of_scope\n\n"
        "Định nghĩa:\n"
        "- product: hỏi về thông tin/thông số của một sản phẩm in ấn cụ thể\n"
        "- comparison: so sánh hai hay nhiều sản phẩm\n"
        "- business: hỏi về công ty, địa chỉ, lịch sử, dịch vụ chung\n"
        "- recommendation: xin tư vấn chọn sản phẩm phù hợp\n"
        "- pricing: hỏi về giá cả, chi phí, báo giá\n"
        "- image: gửi ảnh hoặc hỏi nhận dạng sản phẩm qua ảnh\n"
        "- out_of_scope: hoàn toàn không liên quan đến in ấn\n\n"
        "Chỉ trả lời đúng một nhãn, không giải thích."
    )

    def __init__(self):
        from google import genai
        from app.config import settings

        self._client = genai.Client(api_key=settings.gemini_api_key)
        self._model = settings.gemini_model
        logger.info("[IntentClassifier] Initialized with Gemini")

    def classify(self, query: str) -> str:
        """Classify a Vietnamese query into a QueryIntent.

        Uses keyword heuristics first; falls back to LLM for ambiguous cases.

        Returns:
            QueryIntent value as string (e.g. "pricing")
        """
        q_lower = query.lower()

        for kw in _PRICING_KEYWORDS:
            if kw in q_lower:
                logger.debug(f"[Intent] heuristic → pricing ({kw})")
                return QueryIntent.PRICING

        for kw in _OUT_OF_SCOPE_KEYWORDS:
            if kw in q_lower:
                logger.debug(f"[Intent] heuristic → out_of_scope ({kw})")
                return QueryIntent.OUT_OF_SCOPE

        try:
            from google.genai import types

            response = self._client.models.generate_content(
                model=self._model,
                contents=query,
                config=types.GenerateContentConfig(
                    system_instruction=self._SYSTEM_PROMPT,
                    max_output_tokens=10,
                    temperature=0.0,
                ),
            )
            raw = (response.text or "").strip().lower()
            # Normalize truncated labels the LLM sometimes emits
            _aliases = {
                "recommend": "recommendation",
                "out_of": "out_of_scope",
                "out": "out_of_scope",
            }
            label = _aliases.get(raw, raw)
            try:
                intent = QueryIntent(label)
            except ValueError:
                if label:
                    logger.warning(f"[Intent] Unknown label '{label}', defaulting to product")
                else:
                    logger.debug("[Intent] Empty label (safety filter?), defaulting to product")
                intent = QueryIntent.PRODUCT
            logger.debug(f"[Intent] LLM → {intent}")
            return intent
        except Exception as e:
            logger.error(f"[Intent] Classification failed: {e} — defaulting to product")
            return QueryIntent.PRODUCT
