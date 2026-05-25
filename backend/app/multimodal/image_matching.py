"""CLIP-based product image matching."""

import io
import json
import logging
from pathlib import Path
from typing import Optional

import numpy as np
import requests
from PIL import Image

from app.config import settings

logger = logging.getLogger(__name__)

_CACHE_DIR = Path(__file__).resolve().parent.parent.parent / ".cache"
_INDEX_PATH = _CACHE_DIR / "clip_index.npy"
_META_PATH = _CACHE_DIR / "clip_index_meta.json"

# 7.3 — returned when top-1 score falls below threshold
_APOLOGY = (
    "Xin lỗi, tôi không nhận diện được sản phẩm trong ảnh này. "
    "Vui lòng mô tả sản phẩm bằng chữ hoặc liên hệ công ty để được hỗ trợ trực tiếp."
)


class CLIPImageMatcher:
    """Precomputes and persists CLIP embeddings for all product images.

    Model and preprocess are loaded lazily — only when the first embedding
    is actually needed, so text-only startup paths never touch torch/clip.
    """

    def __init__(self):
        self._model = None
        self._preprocess = None
        self._device = "cpu"
        self._embeddings: Optional[np.ndarray] = None
        self._meta: Optional[list] = None
        self._load_or_build_index()

    # ------------------------------------------------------------------
    # Model helpers
    # ------------------------------------------------------------------

    def _ensure_model(self):
        if self._model is not None:
            return
        import open_clip  # noqa: PLC0415
        model, _, preprocess = open_clip.create_model_and_transforms(
            settings.clip_model, pretrained=settings.clip_pretrained
        )
        model.eval()
        self._model = model
        self._preprocess = preprocess
        logger.info(
            f"[CLIP] Loaded {settings.clip_model}/{settings.clip_pretrained}"
        )

    def _embed_pil(self, pil_image: Image.Image) -> np.ndarray:
        import torch  # noqa: PLC0415

        self._ensure_model()
        tensor = self._preprocess(pil_image).unsqueeze(0).to(self._device)
        with torch.no_grad():
            feat = self._model.encode_image(tensor)
            feat = feat / feat.norm(dim=-1, keepdim=True)
        return feat.cpu().numpy()[0]

    # ------------------------------------------------------------------
    # Index build / load
    # ------------------------------------------------------------------

    def _load_or_build_index(self):
        if _INDEX_PATH.exists() and _META_PATH.exists():
            self._embeddings = np.load(str(_INDEX_PATH))
            with open(_META_PATH, "r", encoding="utf-8") as f:
                self._meta = json.load(f)
            logger.info(
                f"[CLIP] Loaded cached index — {len(self._meta)} image embeddings"
            )
            return

        logger.info("[CLIP] No cached index found — building from product images…")
        self._build_index()

    def _build_index(self):
        self._ensure_model()
        _CACHE_DIR.mkdir(parents=True, exist_ok=True)

        products_path = settings.data_dir / "products.json"
        with open(products_path, "r", encoding="utf-8") as f:
            products = json.load(f)

        embeddings: list = []
        meta: list = []

        for product in products:
            product_id = product["id"]
            product_name = product["embedding_data"]["product_name"]
            image_urls = (
                product.get("generation_enhancers", {}).get("image_url") or []
            )
            if isinstance(image_urls, str):
                image_urls = [image_urls]

            for url in image_urls:
                if not url:
                    continue
                try:
                    resp = requests.get(url, timeout=20)
                    resp.raise_for_status()
                    pil_img = Image.open(io.BytesIO(resp.content)).convert("RGB")
                    emb = self._embed_pil(pil_img)
                    embeddings.append(emb)
                    meta.append(
                        {
                            "product_id": product_id,
                            "product_name": product_name,
                            "image_url": url,
                        }
                    )
                    logger.info(f"[CLIP]   ok {product_name}")
                except Exception as exc:
                    logger.warning(f"[CLIP]   fail {url[:80]}: {exc}")

        if not embeddings:
            logger.warning("[CLIP] Index is empty — no product images downloaded")
            self._embeddings = np.zeros((0, 512), dtype=np.float32)
            self._meta = []
            return

        self._embeddings = np.stack(embeddings).astype(np.float32)
        self._meta = meta

        np.save(str(_INDEX_PATH), self._embeddings)
        with open(_META_PATH, "w", encoding="utf-8") as f:
            json.dump(meta, f, ensure_ascii=False, indent=2)
        logger.info(f"[CLIP] Index saved — {len(meta)} embeddings")

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def match(self, image_bytes: bytes, top_k: int = 3) -> list:
        """Cosine-similarity search against product image embeddings.

        Returns a list of up to `top_k` dicts with keys:
            product_id, product_name, image_url, score (float in [-1, 1])

        Returns an empty list when the best score is below
        `settings.image_match_threshold` (7.3 fallback).
        """
        if self._embeddings is None or self._embeddings.shape[0] == 0:
            logger.warning("[CLIP] Empty index — cannot match image")
            return []

        pil_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        query_emb = self._embed_pil(pil_img)  # shape (D,)

        # Embeddings are L2-normalised → dot product = cosine similarity
        scores = self._embeddings @ query_emb  # shape (N,)

        # 7.3 — threshold check on top-1
        best_score = float(scores.max())
        if best_score < settings.image_match_threshold:
            logger.info(
                f"[CLIP] Best score {best_score:.3f} < threshold "
                f"{settings.image_match_threshold} — no match"
            )
            return []

        top_indices = np.argsort(scores)[::-1][:top_k]
        results = []
        for idx in top_indices:
            score = float(scores[idx])
            if score < settings.image_match_threshold:
                break
            results.append({**self._meta[idx], "score": round(score, 4)})

        return results

    def rebuild(self):
        """Force-rebuild the CLIP index (call after adding new product images)."""
        import os  # noqa: PLC0415

        for p in (_INDEX_PATH, _META_PATH):
            if p.exists():
                os.remove(p)
        self._embeddings = None
        self._meta = None
        self._model = None
        self._preprocess = None
        self._build_index()


def apology() -> str:
    return _APOLOGY
