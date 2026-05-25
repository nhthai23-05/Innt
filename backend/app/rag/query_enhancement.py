"""Query enhancement strategies (Phase 6.5)."""

from enum import Enum
import logging

logger = logging.getLogger(__name__)


class QueryEnhancementMethod(str, Enum):
    HYDE = "hyde"
    REWRITE = "rewrite"
    EXPAND = "expand"


_HYDE_PROMPT = (
    "Bạn là chuyên gia về in ấn và đóng gói. "
    "Hãy viết một đoạn mô tả ngắn (3-5 câu) bằng tiếng Việt về sản phẩm/thông tin "
    "có thể trả lời câu hỏi dưới đây. "
    "Chỉ viết đoạn mô tả, không giải thích.\n\nCâu hỏi: {query}"
)

_REWRITE_PROMPT = (
    "Viết lại câu hỏi sau bằng tiếng Việt, rõ ràng hơn và tập trung vào sản phẩm in ấn. "
    "Chỉ trả về câu hỏi đã viết lại.\n\nCâu hỏi gốc: {query}"
)

_EXPAND_PROMPT = (
    "Mở rộng câu hỏi sau với các từ khóa liên quan đến in ấn bằng tiếng Việt. "
    "Trả về các từ khóa bổ sung (tối đa 10 từ), cách nhau bởi khoảng trắng.\n\nCâu hỏi: {query}"
)


class QueryEnhancer:
    """Enhance user queries for better retrieval (Phase 6.5).

    - HyDE: LLM generates a hypothetical product description; embed that instead of raw query.
    - Rewrite: clarify/clean the original query.
    - Expand: append related keywords to the query.

    Only applied to product/business intents — never pricing or image.
    """

    def __init__(self, method: str = "hyde"):
        from google import genai
        from app.config import settings

        self.method = QueryEnhancementMethod(method)
        self._client = genai.Client(api_key=settings.gemini_api_key)
        self._model = settings.gemini_model
        logger.info(f"[QueryEnhancer] method={method}")

    def enhance(self, query: str) -> str:
        """Return an enhanced version of the query suitable for embedding.

        For HyDE: returns a hypothetical answer passage (not the original query).
        For rewrite/expand: returns a modified query string.
        Falls back to the original query on any error.
        """
        try:
            from google.genai import types

            if self.method == QueryEnhancementMethod.HYDE:
                prompt = _HYDE_PROMPT.format(query=query)
            elif self.method == QueryEnhancementMethod.REWRITE:
                prompt = _REWRITE_PROMPT.format(query=query)
            else:  # EXPAND
                prompt = _EXPAND_PROMPT.format(query=query)

            response = self._client.models.generate_content(
                model=self._model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    max_output_tokens=200,
                    temperature=0.3,
                ),
            )
            enhanced = response.text.strip()

            if self.method == QueryEnhancementMethod.EXPAND:
                enhanced = f"{query} {enhanced}"

            logger.debug(f"[QueryEnhancer] '{query[:50]}' → '{enhanced[:80]}'")
            return enhanced
        except Exception as e:
            logger.error(f"[QueryEnhancer] Enhancement failed: {e} — using original query")
            return query
