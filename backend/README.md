# Innt RAG Backend — Setup & Development

## About

This is the FastAPI backend for the **Innt RAG Chatbot** (innt.vn). It provides:
- REST API for RAG queries (`POST /api/chat`)
- ChromaDB vector store with Vietnamese embeddings
- LLM-powered generation (Gemini API)
- Experimental multimodal image matching (Phase 7)

## Quick Start

### Prerequisites
- Python 3.11+
- pip or conda
- **IMPORTANT**: CPU-only torch installation (see below if you don't have CUDA)

### 1. CPU-Only Torch Setup (⚠️ REQUIRED IF NO NVIDIA GPU)

Before installing `requirements.txt`, install torch without CUDA:

```bash
# Option A: Using pip (recommended)
pip install torch --index-url https://download.pytorch.org/whl/cpu

# Option B: Using conda
conda install pytorch::pytorch -c pytorch
```

**Why?** The default torch package includes CUDA libraries (~2GB), which fail silently on CPU-only machines. Installing CPU wheels prevents this and saves disk space.

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Environment Configuration

Copy `.env.example` to `.env` and fill in your API keys:

```bash
cp .env.example .env
```

Edit `.env`:
```env
# Required for LLM generation
RAG_GEMINI_API_KEY=your_google_ai_studio_key

# Optional: Ollama local LLM (if not using Gemini)
RAG_LLM_PROVIDER=gemini  # or "ollama"
RAG_OLLAMA_BASE_URL=http://localhost:11434
```

Get a free **Gemini API key** at: https://aistudio.google.com/app/apikey

### 4. Run Development Server

```bash
# From backend/ directory
uvicorn app.main:app --reload --port 8000
```

Open http://localhost:8000/docs to see interactive API documentation.

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app entry
│   ├── config.py            # Settings (env-based)
│   ├── api/
│   │   ├── routes.py        # REST endpoints
│   │   └── schemas.py       # Request/Response Pydantic models
│   ├── rag/
│   │   ├── pipeline.py      # RAG orchestrator
│   │   ├── embeddings.py    # Embedding model wrapper
│   │   ├── retrieval.py     # Dense/hybrid/BM25 retriever
│   │   ├── generation.py    # LLM-powered generation
│   │   ├── reranking.py     # Cross-encoder reranking
│   │   ├── intent.py        # Query intent classification
│   │   ├── query_enhancement.py  # HyDE & similar
│   │   └── chunking.py      # Document chunking strategies
│   ├── indexing/
│   │   └── indexer.py       # ChromaDB indexation
│   ├── multimodal/
│   │   └── image_matching.py  # CLIP image search
│   └── __init__.py
├── evaluation/
│   ├── evaluate.py          # RAGAS metrics runner
│   ├── run_experiments.py   # Experiment harness
│   ├── test_set.json        # Q&A test set
│   └── metrics.py           # Custom metrics
├── experiments/
│   ├── configs/             # YAML experiment configs
│   └── results/             # CSV + charts (generated)
├── tests/
├── requirements.txt         # Python dependencies
├── Dockerfile               # Docker build config
├── .env.example             # Template for environment vars
└── README.md                # This file
```

## Key Commands

### Index Products & Business Docs

```bash
# Rebuild ChromaDB from scratch (required once or to reset)
python -m app.indexing.indexer --rebuild
```

### Query the Pipeline (CLI)

```bash
# Direct RAG query from shell (Phase 1 onward)
python -c "from app.rag.pipeline import RagPipeline; \
  rag = RagPipeline(); \
  result = rag.query('Phong bì A5 dùng giấy gì?'); \
  print(result['answer'])"
```

### Run Experiments

```bash
# Evaluate baseline
python -m evaluation.evaluate --pipeline dense

# Run full experiment suite
python -m evaluation.run_experiments --config experiments/configs/baseline.yaml
```

## Configuration

All settings are loaded from environment variables with `RAG_` prefix. See `app/config.py` for complete list.

### Key Settings for Development

```env
# Embedding model (Phase 1)
RAG_EMBEDDING_MODEL=bkai-foundation-models/vietnamese-bi-encoder

# LLM (Phase 1)
RAG_LLM_PROVIDER=gemini
RAG_GEMINI_MODEL=gemini-2.5-flash

# RAG strategy (Phase 0.5 temporary: dense-only for Phase 1)
RAG_RETRIEVAL_STRATEGY=dense
RAG_USE_RERANKING=False
RAG_USE_QUERY_ENHANCEMENT=False

# Will change in Phase 6:
# RAG_RETRIEVAL_STRATEGY=hybrid
# RAG_USE_RERANKING=True
# RAG_USE_QUERY_ENHANCEMENT=True
```

## API Endpoints (Phase 3 onward)

### `POST /api/chat`
Send a message and get a grounded answer.

**Request** (form-data):
```json
{
  "message": "Phong bì A5 dùng giấy gì?",
  "conversation_id": "optional-uuid",
  "image": "optional-file"
}
```

**Response**:
```json
{
  "response": "Phong bì A5 sử dụng giấy Ford hoặc Couche...",
  "sources": ["phong-bi-a5"],
  "redirect_to_zalo": false,
  "conversation_id": "uuid"
}
```

### `GET /api/config`
Retrieve current pipeline configuration.

### `POST /api/config`
Override settings for a session (for experiments).

### `POST /api/index/rebuild`
Reindex all documents from `data/` into ChromaDB.

## Troubleshooting

### `ModuleNotFoundError: No module named 'torch'`
→ Install CPU torch: `pip install torch --index-url https://download.pytorch.org/whl/cpu`

### `CUDA out of memory` (with GPU)
→ Your GPU doesn't have enough VRAM. Switch to CPU: `pip install torch --index-url https://download.pytorch.org/whl/cpu`

### `ImportError` from empty RAG modules
→ You're on Phase 0; Phase 1 will implement them. Use `retrieval_strategy=dense` (set in config.py Phase 0.5).

### ChromaDB "no such table" error
→ Reindex: `python -m app.indexing.indexer --rebuild`

### Gemini API errors
→ Check `.env` has valid `RAG_GEMINI_API_KEY` from https://aistudio.google.com/app/apikey

## Development Workflow

1. **Phase 0** — Data setup, config defaults
2. **Phase 1** — Naive RAG (CLI only, dense retrieval, no reranking)
3. **Phase 2** — Evaluation harness (RAGAS metrics)
4. **Phase 3** — HTTP API (expose to frontend)
5. **Phase 4** — Frontend chat widget integration
6. **Phase 5** — Website product wiring
7. **Phase 6** — Advanced RAG (hybrid, reranking, intent routing, HyDE)
8. **Phase 7** — Multimodal image matching
9. **Phase 8** — Experiments & cumulative gains
10. **Phase 9** — Final report & deployment

See `../../tasks/plan.md` for the complete implementation plan.

## Docker

Build and run in a container:

```bash
docker build -t innt-rag .
docker run -p 8000:8000 --env-file .env innt-rag
```

## License

Copyright © 2025 Công ty TNHH In N&T. Part of the HUST NLP capstone project.


## HOW TO RUN AND TEST PHASE 1

# Step 1: Setup (3 min)
create conda
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
or 
pip install torch --index-url https://download.pytorch.org/whl/cpu (if you do not have GPU)

pip install -r backend/requirements.txt

# Step 2: Configure (1 min)
cp backend/.env.example backend\.env
# Edit .env: add RAG_GEMINI_API_KEY=your_key_here

# Step 3: Build index (10 min)
python -m app.indexing.indexer --rebuild

# Step 4: Test RAG (2 min)
python test_rag.py

# Step 5: Start API server (new terminal)
cd backend
uvicorn app.main:app --reload --port 8000
(not active yet)
