"""LLM-powered generation module."""

from typing import List
from app.config import settings


VIETNAMESE_SYSTEM_PROMPT = """Bạn là một trợ lý hỗ trợ khách hàng cho Công ty TNHH In N&T, một xưởng in offset chuyên nghiệp.

**HƯỚNG DẪN:**
1. LUÔN trả lời bằng TIẾNG VIỆT SEUL - không được dùng tiếng Anh
2. Sử dụng thông tin từ tài liệu cung cấp để trả lời
3. TUYỆT ĐỐI KHÔNG phát minh ra giá cả - nếu khách hỏi về giá, hãy:
   - Giải thích bạn không thể báo giá trực tiếp
   - Hướng dẫn khách liên hệ Zalo/Hotline công ty để nhận báo giá chính xác
   - KHÔNG ước lượng, KHÔNG đoán, KHÔNG bịa ra con số
4. Nếu câu hỏi nằm ngoài phạm vi sản phẩm/dịch vụ in ấn, hãy lịch sự từ chối
5. Luôn tham chiếu tên sản phẩm cụ thể khi trả lời về sản phẩm
6. Nếu không chắc chắn, hãy nói rõ điều đó thay vì phát minh ra thông tin

**XUẤT XỨ THÔNG TIN:**
- Sản phẩm: Giấy, phong bì, tờ rơi, tờ gấp, túi giấy, tem nhãn, danh thiếp, biểu mẫu
- Dịch vụ: In offset, thiết kế, gia công (cán phim, bế, xén)
- Thời gian hoàn thành: 5-10 ngày bình quân

**LIÊN HỆ:**
Để báo giá chi tiết, thiết kế tùy chỉnh, hoặc tư vấn kỹ thuật, khách hàng vui lòng:
- Gọi Hotline (sẽ cung cấp)
- Nhắn Zalo (sẽ cung cấp)
- Ghé thăm xưởng sản xuất (địa chỉ sẽ cung cấp)

Hãy thân thiện, chuyên nghiệp, và tập trung vào việc giúp đỡ khách hàng."""


class Generator:
    """LLM-powered response generator."""

    def __init__(self, provider: str | None = None, model: str | None = None):
        self.provider = provider or settings.llm_provider

        if self.provider == "gemini":
            from google import genai
            self.model_name = model or settings.gemini_model
            self._client = genai.Client(api_key=settings.gemini_api_key)
        elif self.provider == "ollama":
            from openai import OpenAI as _OpenAI
            self.model_name = model or settings.ollama_model
            self._client = _OpenAI(
                api_key="ollama",
                base_url=f"{settings.ollama_base_url}/v1",
            )
        else:
            raise ValueError(f"Unknown LLM provider: {self.provider}")

    def generate(
        self,
        query: str,
        context_docs: List[dict],
        max_tokens: int = 500,
    ) -> str:
        """Generate a Vietnamese response grounded in the provided context."""
        context_parts = []
        for i, doc in enumerate(context_docs, 1):
            content = doc.get("content", "")
            context_parts.append(f"\n[Tài liệu {i}]\n{content}\n")

        context_str = "\n".join(context_parts)

        prompt = f"""Dựa vào các tài liệu sau đây, hãy trả lời câu hỏi của khách hàng một cách chính xác và hữu ích.

**TÀI LIỆU THAM CHIẾU:**
{context_str}

**CÂU HỎI CỦA KHÁCH HÀNG:**
{query}

**YÊU CẦU:**
- Trả lời bằng TIẾNG VIỆT
- Nêu rõ thông tin đến từ tài liệu nào
- Không phát minh ra giá cả
- Nếu không có thông tin, hãy nói rõ
- Gợi ý khách hàng liên hệ công ty để báo giá/tư vấn thêm nếu cần
"""

        try:
            if self.provider == "gemini":
                from google.genai import types
                response = self._client.models.generate_content(
                    model=self.model_name,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        system_instruction=VIETNAMESE_SYSTEM_PROMPT,
                        max_output_tokens=max_tokens,
                        temperature=0.7,
                    ),
                )
                return response.text
            else:  # ollama via OpenAI-compatible API
                response = self._client.chat.completions.create(
                    model=self.model_name,
                    messages=[
                        {"role": "system", "content": VIETNAMESE_SYSTEM_PROMPT},
                        {"role": "user", "content": prompt},
                    ],
                    max_tokens=max_tokens,
                    temperature=0.7,
                )
                return response.choices[0].message.content
        except Exception as e:
            return f"Xin lỗi, tôi gặp lỗi khi xử lý yêu cầu của bạn: {str(e)}. Vui lòng liên hệ công ty để được hỗ trợ trực tiếp."
    
    def redirect_to_zalo(self) -> dict:
        """Generate a redirect response for pricing queries.
        
        Returns:
            Response dict with redirect instructions
        """
        return {
            "answer": "Xin lỗi, tôi không thể cung cấp báo giá trực tiếp. Để nhận báo giá chính xác và tư vấn chi tiết, vui lòng liên hệ công ty qua Zalo hoặc hotline. Chúng tôi sẽ phúc vụ bạn một cách tốt nhất!",
            "redirect_to_zalo": True,
            "pricing_query": True,
        }
