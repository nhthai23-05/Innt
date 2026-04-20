"""Application configuration loaded from environment variables."""

from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    # Paths
    data_dir: Path = Path(__file__).resolve().parent.parent.parent / "data"
    chroma_persist_dir: str = "./chroma_db"

    # Embedding model
    embedding_model: str = "bkai-foundation-models/vietnamese-bi-encoder"

    # LLM
    llm_provider: str = "gemini"  # "gemini" or "ollama"
    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.5-flash"
    ollama_model: str = "qwen2.5:7b"
    ollama_base_url: str = "http://localhost:11434"

    # RAG pipeline
    # Phase 0.5 NOTE: Temporary defaults for Phase 1 baseline (will restore hybrid/reranking in Phase 6.6)
    retrieval_strategy: str = "dense"  # "dense", "bm25", "hybrid" — Phase 1 uses dense only
    chunking_strategy: str = "document"  # "document", "field", "augmented"
    use_reranking: bool = False  # Phase 6.3 implements reranking
    use_query_enhancement: bool = False  # Phase 6.5 implements HyDE
    query_enhancement_method: str = "hyde"  # "hyde", "rewrite", "expand"
    top_k: int = 5

    # CLIP (multimodal)
    clip_model: str = "ViT-B-32"
    clip_pretrained: str = "laion2b_s34b_b79k"
    image_match_threshold: float = 0.25

    class Config:
        env_file = ".env"
        env_prefix = "RAG_"


settings = Settings()
