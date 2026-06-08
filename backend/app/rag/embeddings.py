"""Embedding wrapper — Gemini API (default) or local SentenceTransformer."""

import logging
import numpy as np
from typing import List
from app.config import settings

logger = logging.getLogger(__name__)

_GEMINI_MODEL = "embedding-001"


class Embedder:
    """Embed Vietnamese text via Gemini API or local SentenceTransformer.

    provider="gemini"  — calls text-embedding-004 API, zero local RAM for weights.
    provider="local"   — loads a HuggingFace SentenceTransformer (~500 MB RAM).
    """

    def __init__(self, model_name: str | None = None, provider: str | None = None):
        self.provider = provider or settings.embedding_provider
        self.model_name = model_name or settings.embedding_model

        if self.provider == "gemini":
            from google import genai
            # text-embedding-004 requires v1 (not the default v1beta)
            self._client = genai.Client(
                api_key=settings.gemini_api_key,
                http_options={"api_version": "v1"},
            )
            logger.info(f"[Embedder] provider=gemini model={_GEMINI_MODEL}")
        else:
            from sentence_transformers import SentenceTransformer
            self._local_model = SentenceTransformer(self.model_name)
            logger.info(f"[Embedder] provider=local model={self.model_name}")

    def embed(self, texts: List[str]) -> np.ndarray:
        """Embed a list of texts, returns array of shape (N, dim)."""
        if self.provider == "gemini":
            return self._gemini_batch(texts)
        return self._local_model.encode(texts, convert_to_numpy=True)

    def embed_single(self, text: str) -> np.ndarray:
        """Embed a single text, returns 1-D array of shape (dim,)."""
        if self.provider == "gemini":
            return self._gemini_batch([text])[0]
        return self._local_model.encode(text, convert_to_numpy=True)

    def _gemini_batch(self, texts: List[str]) -> np.ndarray:
        """Call Gemini embed_content for each text and stack into ndarray."""
        vectors = []
        for text in texts:
            resp = self._client.models.embed_content(
                model=_GEMINI_MODEL,
                contents=text,
            )
            # embedding-001 → resp.embedding.values
            # text-embedding-004 → resp.embeddings[0].values
            if hasattr(resp, "embedding") and resp.embedding is not None:
                vectors.append(resp.embedding.values)
            else:
                vectors.append(resp.embeddings[0].values)
        return np.array(vectors, dtype=np.float32)

    @property
    def dimension(self) -> int:
        if self.provider == "gemini":
            return 768  # text-embedding-004 output dimension
        return self._local_model.get_sentence_embedding_dimension()
