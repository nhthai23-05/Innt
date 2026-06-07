"""Query enhancement strategies (Phase 6.5)."""

from enum import Enum
import logging

logger = logging.getLogger(__name__)


class QueryEnhancementMethod(str, Enum):
    HYDE = "hyde"
    REWRITE = "rewrite"
    EXPAND = "expand"


_HYDE_PROMPT = (
    "Bạn là một hệ thống tìm kiếm sản phẩm thông minh cho một công ty in ấn và bao bì. "
    "Dựa vào câu hỏi của người dùng, hãy viết một tài liệu giả định (hypothetical document) "
    "chứa chính xác những thông tin sản phẩm có thể giải quyết nhu cầu đó. "
    "Tài liệu này nên được viết dưới dạng mô tả sản phẩm trên website, bao gồm: "
    "tên sản phẩm tiềm năng, chất liệu thường dùng, quy cách in ấn, và ứng dụng thực tế. "
    "Chỉ trả về nội dung mô tả, tuyệt đối không giải thích hay mở bài.\n\n"
    "Câu hỏi: {query}"
)

_REWRITE_PROMPT = (
    "Nhiệm vụ của bạn là viết lại câu hỏi tìm kiếm của người dùng để tối ưu hóa cho hệ thống vector search (Semantic Retrieval) trong lĩnh vực in ấn và đóng gói. "
    "Hãy thực hiện các bước sau một cách âm thầm: "
    "1. Sửa các lỗi chính tả hoặc từ viết tắt nếu có. "
    "2. Trích xuất ý định cốt lõi và chuyển đổi các từ ngữ dân dã thành thuật ngữ chuyên ngành in ấn (VD: 'rẻ' -> 'tối ưu chi phí', 'chất liệu tiết kiệm', 'giấy kraft'). "
    "3. Viết lại thành một câu truy vấn hoàn chỉnh, súc tích và trực diện vào sản phẩm/dịch vụ. "
    "Chỉ trả về câu truy vấn đã được viết lại, không thêm bất kỳ văn bản nào khác.\n\n"
    "Câu hỏi gốc: {query}"
)

_EXPAND_PROMPT = (
    "Bạn là chuyên gia phân tích dữ liệu e-commerce ngành in ấn. "
    "Hãy mở rộng câu hỏi tìm kiếm dưới đây bằng cách bổ sung thêm các từ đồng nghĩa, "
    "thuật ngữ chuyên ngành, hoặc tên chất liệu/công nghệ có liên quan TRỰC TIẾP và CHẶT CHẼ đến sản phẩm được nhắc tới. "
    "Tuyệt đối không thêm các từ khóa về các loại sản phẩm khác để tránh làm loãng ngữ nghĩa. "
    "Trả về tối đa 7 từ/cụm từ khóa bổ sung, cách nhau bởi dấu phẩy.\n\n"
    "Câu hỏi: {query}"
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
