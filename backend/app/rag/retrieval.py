"""Document retrieval strategies."""

from typing import List, Tuple
import chromadb
from app.config import settings
from app.rag.embeddings import Embedder
import logging
logger = logging.getLogger(__name__)


try:
    from pyvi import ViTokenizer  # type: ignore
    _HAS_PYVI = True
except ImportError:  # graceful fallback — BM25 still works, just less accurate
    _HAS_PYVI = False
    logger.warning(
        "[BM25] pyvi not installed — falling back to whitespace tokenisation. "
        "Install pyvi for proper Vietnamese word segmentation (multi-syllable terms)."
    )


def _tokenize_vi(text: str) -> List[str]:
    """Word-segmenting tokenizer for Vietnamese BM25.

    Vietnamese words are multi-syllable ("phong bì", "cán màng", "giấy couche").
    pyvi joins each word's syllables with '_' so BM25 treats them as one term;
    we lower-case and split on whitespace afterwards. Applied identically to the
    corpus and the query, so dense/sparse stay consistent. Falls back to plain
    whitespace tokenisation when pyvi is unavailable.
    """
    if _HAS_PYVI:
        text = ViTokenizer.tokenize(text)
    return text.lower().split()


class Retriever:
    """Base retriever interface."""

    def retrieve(self, query: str, top_k: int = 5) -> List[Tuple[dict, float]]:
        raise NotImplementedError


class DenseRetriever(Retriever):
    """Dense retrieval using semantic embeddings."""

    def __init__(self, collection_name: str = "documents"):
        self.embedder = Embedder()
        self.client = chromadb.PersistentClient(path=settings.chroma_persist_dir)
        logger.info(f"[chromadb] path: {settings.chroma_persist_dir}")
        logger.info(f"[chromadb] collections: {self.client.list_collections()}")
        self.collection = self.client.get_collection(name=collection_name)

    def retrieve(self, query: str, top_k: int = 5) -> List[Tuple[dict, float]]:
        query_embedding = self.embedder.embed_single(query)
        results = self.collection.query(
            query_embeddings=[query_embedding.tolist()],
            n_results=top_k,
            include=["documents", "metadatas", "distances"],
        )
        documents = results.get("documents", [[]])[0]
        metadatas = results.get("metadatas", [[]])[0]
        distances = results.get("distances", [[]])[0]
        similarities = [1 - d for d in distances]
        retrieved = []
        for doc, metadata, score in zip(documents, metadatas, similarities):
            retrieved.append(({"content": doc, "metadata": metadata}, score))
        return retrieved


class BM25Retriever(Retriever):
    """Sparse retrieval using BM25 algorithm (Phase 6.1)."""

    def __init__(self, collection_name: str = "documents"):
        from rank_bm25 import BM25Okapi

        client = chromadb.PersistentClient(path=settings.chroma_persist_dir)
        collection = client.get_collection(name=collection_name)

        data = collection.get(include=["documents", "metadatas"])
        raw_docs = data.get("documents") or []
        raw_meta = data.get("metadatas") or []

        self._docs: List[dict] = [
            {"content": doc, "metadata": meta}
            for doc, meta in zip(raw_docs, raw_meta)
        ]
        tokenized = [_tokenize_vi(doc) for doc in raw_docs]
        self._bm25 = BM25Okapi(tokenized)
        logger.info(f"[BM25] Built index over {len(self._docs)} documents")

    def retrieve(self, query: str, top_k: int = 5) -> List[Tuple[dict, float]]:
        tokens = _tokenize_vi(query)
        scores = self._bm25.get_scores(tokens)
        scored = sorted(
            zip(scores, self._docs), key=lambda x: x[0], reverse=True
        )[:top_k]
        return [(doc, float(score)) for score, doc in scored]


class HybridRetriever(Retriever):
    """Hybrid retrieval: alpha * dense + (1-alpha) * BM25 (Phase 6.2).

    Scores from each retriever are min-max normalised to [0, 1] before merging.
    alpha=0 → pure BM25, alpha=1 → pure dense.
    """

    def __init__(self, alpha: float = 0.5, collection_name: str = "documents"):
        self.alpha = alpha
        self.dense = DenseRetriever(collection_name=collection_name)
        self.bm25 = BM25Retriever(collection_name=collection_name)
        logger.info(f"[Hybrid] alpha={alpha}")

    @staticmethod
    def _normalize(scores: List[float]) -> List[float]:
        if not scores:
            return scores
        lo, hi = min(scores), max(scores)
        if hi == lo:
            return [1.0] * len(scores)
        return [(s - lo) / (hi - lo) for s in scores]

    def retrieve(self, query: str, top_k: int = 5) -> List[Tuple[dict, float]]:
        fetch_k = max(top_k * 3, 20)

        dense_results = self.dense.retrieve(query, top_k=fetch_k)
        bm25_results = self.bm25.retrieve(query, top_k=fetch_k)

        dense_scores = {r[0]["content"]: r[1] for r in dense_results}
        bm25_scores = {r[0]["content"]: r[1] for r in bm25_results}
        doc_map = {r[0]["content"]: r[0] for r in dense_results + bm25_results}

        all_contents = list(doc_map.keys())
        d_raw = [dense_scores.get(c, 0.0) for c in all_contents]
        b_raw = [bm25_scores.get(c, 0.0) for c in all_contents]

        d_norm = self._normalize(d_raw)
        b_norm = self._normalize(b_raw)

        merged = [
            (doc_map[c], self.alpha * d + (1 - self.alpha) * b)
            for c, d, b in zip(all_contents, d_norm, b_norm)
        ]
        merged.sort(key=lambda x: x[1], reverse=True)
        return merged[:top_k]
