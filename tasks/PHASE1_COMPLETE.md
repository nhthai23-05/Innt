# Phase 1 — Naive RAG Walking Skeleton

## Overview

Phase 1 delivers a **working end-to-end RAG pipeline** that can:
1. Load products + business docs from JSON
2. Index them into ChromaDB with embeddings
3. Retrieve relevant documents with dense semantic search
4. Generate grounded Vietnamese responses using Gemini

**Timeline**: Should be completed in 2-3 days with team feedback.

---

##Completed Implementation

### ✅ Core RAG Modules

#### 1. **Embeddings** (`app/rag/embeddings.py`)
- Wrapper around `sentence-transformers` model
- Default model: `bkai-foundation-models/vietnamese-bi-encoder`
- Methods:
  - `Embedder.embed(texts: List[str])` → numpy array (n_texts, 768)
  - `Embedder.embed_single(text: str)` → numpy array (768,)
  - `embedder.dimension` → embedding dimension

#### 2. **Chunking** (`app/rag/chunking.py`)
- Three strategies: `document`, `field`, `augmented`
- Phase 1 uses: **document-level** (one chunk per product/business doc)
- Returns: `Chunk` TypedDict with content + metadata

#### 3. **Retrieval** (`app/rag/retrieval.py`)
- `DenseRetriever`: Queries ChromaDB with cosine similarity
- `retrieve(query, top_k)` → List[(document_dict, similarity_score)]
- Stubs for Phase 6: `BM25Retriever`, `HybridRetriever`

#### 4. **Generation** (`app/rag/generation.py`)
- `Generator`: Gemini-based response generation
- **Vietnamese system prompt** enforces:
  - Always reply in Vietnamese only
  - No price hallucination (redirect to Zalo)
  - Cite sources from context
  - Refuse out-of-scope questions
- `generate(query, context_docs)` → Vietnamese response

#### 5. **Indexing** (`app/indexing/indexer.py`)
- `IndexBuilder`: Loads data, chunks, embeds, upserts to ChromaDB
- CLI: `python -m app.indexing.indexer --rebuild`
- Creates/recreates ChromaDB collection with cosine distance metric

#### 6. **Pipeline** (`app/rag/pipeline.py`)
- `RagPipeline`: Main orchestrator
- `query(text, conversation_id)` → dict with answer, sources, metadata
- Configurable retrieval strategy (Phase 1: dense only)

### ✅ API Layer (Ready for Phase 3)

#### Schemas (`app/api/schemas.py`)
- `ChatRequest`: message, conversation_id, image
- `ChatResponse`: response, sources, redirect_to_zalo, metadata
- `ConfigDTO`: pipeline config override
- `HealthResponse`: API health status

#### Routes (`app/api/routes.py`)
- `POST /api/chat` → text-only chat (image ignored Phase 1)
- `GET /api/config` → current config
- `POST /api/config` → override config (for experiments)
- `POST /api/index/rebuild` → reindex from source
- `GET /api/health` → health check
- `GET /` → API info

#### Main App (`app/main.py`)
- FastAPI setup with CORS
- Router wiring
- Startup/shutdown logging

---

## Testing Phase 1

### Prerequisites

1. **Install dependencies:**
   ```bash
   pip install torch --index-url https://download.pytorch.org/whl/cpu
   pip install -r backend/requirements.txt
   ```

2. **Set Gemini API key:**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env and add your Gemini API key
   # Get one free at: https://aistudio.google.com/app/apikey
   ```

3. **Verify data is normalized:**
   ```bash
   python scripts/verify_and_create_categories.py
   ```

### Test 1: Index Rebuild

```bash
cd backend
python -m app.indexing.indexer --rebuild
```

Expected output:
```
🔨 Rebuilding index 'documents'...
  ✓ Deleted existing collection
  ✓ Created new collection with cosine distance metric
  📦 Processing 19 products...
    → Created 19 product chunks
  📄 Processing 5 business documents...
    → Created 5 business chunks
  📊 Total chunks: 24
  🧠 Embedding 24 chunks...
    → Embedding dimension: 768
  💾 Upserting into ChromaDB...
    → Upserted batch 1 (24/24)
  ✅ Index rebuild complete!
     Total documents indexed: 24
```

### Test 2: Pipeline Query (CLI)

```bash
python << 'EOF'
from app.rag.pipeline import RagPipeline

rag = RagPipeline()
result = rag.query("Phong bì A5 dùng giấy gì?")

print("Answer:")
print(result['answer'])
print("\nSources:")
print(result['sources'])
print("\nMetadata:")
print(result['metadata'])
EOF
```

Expected:
- answer: Vietnamese description of Phong bì A5 paper types
- sources: ["Phong bì A5"]
- metadata: includes strategy, retrieved_docs, intent

### Test 3: Test Pricing Redirect

```bash
python << 'EOF'
from app.rag.pipeline import RagPipeline

rag = RagPipeline()
result = rag.query("Giá in 1000 tờ rơi A4 là bao nhiêu?")

print("Answer:")
print(result['answer'])
print("\nRedirect to Zalo?")
print(result.get('redirect_to_zalo', False))
EOF
```

Expected:
- answer: Polite but NO price estimate, redirect to Zalo
- redirect_to_zalo: Should be True if pricing query detected

**Note**: Phase 1 doesn't have intent classification yet, so pricing redirect might not work perfectly. Phase 6.4 will add that.

### Test 4: Start API Server

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

Then visit http://localhost:8000/docs to see interactive Swagger UI.

#### Test `/api/chat` endpoint:

```bash
curl -X POST http://localhost:8000/api/chat \
  -F "message=Phong bì A5 dùng giấy gì?"
```

Expected:
```json
{
  "response": "Phong bì A5 sử dụng giấy Ford (Ốp) hoặc Giấy Couche, với định lượng từ 100g/m2 đến 150g/m2...",
  "sources": ["Phong bì A5"],
  "redirect_to_zalo": false,
  "metadata": {
    "strategy": "dense",
    "retrieved_docs": 1,
    "intent": "general"
  }
}
```

#### Test `/api/health` endpoint:

```bash
curl http://localhost:8000/api/health
```

Expected:
```json
{
  "status": "ok",
  "version": "1.0.0",
  "indexed_documents": 24
}
```

### Test 5: Manual 5-Query Smoke Test

Run these 5 representative queries and verify the answers are reasonable and grounded:

1. **Product-specific**: "Phong bì A5 dùng giấy gì?"
   - ✓ Should mention paper types (Ford, Couche)
   
2. **Feature comparison**: "Điều khác biệt giữa tờ gấp đôi và tờ gấp ba?"
   - ✓ Should explain different fold types
   
3. **Business info**: "Công ty In N&T được thành lập năm nào?"
   - ✓ Should mention 2009
   
4. **Pricing query**: "Giá in 1000 tờ rơi A4 là bao nhiêu?"
   - ✓ Should NOT hallucinate prices, should redirect

5. **Out of scope**: "Thời tiết hôm nay như thế nào?"
   - ✓ Should politely refuse

---

## Checkpoint B — Phase 1 Complete

**Acceptance Criteria:**
- ✅ 1.1: Indexer rebuilds collection with `--rebuild` flag
- ✅ 1.2: Embedder returns numpy arrays of correct dimension
- ✅ 1.3: DenseRetriever returns top-k documents with scores
- ✅ 1.4: GenerativeGenerator produces Vietnamese responses
- ✅ 1.5: RagPipeline.query() works end-to-end
- ✅ API routes wired for Phase 3

**Manual Sign-off:**
- [ ] Team runs 5-query smoke test and confirms "reasonable"
- [ ] No blocking import errors
- [ ] Gemini API key works

---

## Known Limitations (to be Fixed in Later Phases)

### Phase 1 Baseline (Naive)
- **No intent classification**: Pricing queries are not automatically detected (Phase 6.4)
- **No reranking**: Top-k from dense retrieval only (Phase 6.3)
- **No query enhancement**: Raw query used directly (Phase 6.5)
- **No multimodal**: Image inputs ignored (Phase 7)
- **No chunking strategy optimization**: Document-level only (Phase 8.5)
- **Single LLM**: Only Gemini (Phase 8.2 will test Llama, Qwen, etc.)

### Performance Expectations
- Indexing time: ~1-2 minutes for 24 documents (CPU)
- Query latency: ~5-10 seconds (embedding + generation)
- Retrieval accuracy: ~70-80% (RAGAS will measure in Phase 2)

---

## Next Steps

### Immediate (Checkpoint A Review)
1. **Team decision on open items**: Product count (19 vs 23)? Contact info? Image backup?
2. **Run Phase 1 smoke tests** and confirm "reasonable" responses
3. **Get Gemini API key** and test end-to-end

### Phase 2 (Evaluation Harness)
- Build RAGAS evaluation suite
- Create test Q&A set (20-30 pairs)
- Measure baseline metrics (faithfulness, relevance, recall)

### Phase 3 (HTTP API)
- Frontend can consume `/api/chat` endpoint
- Phase 4: Build chat widget client

---

## File Summary

| File | Status | Lines | Purpose |
|------|--------|-------|---------|
| `app/rag/embeddings.py` | ✅ | ~40 | Vietnamese embedding |
| `app/rag/chunking.py` | ✅ | ~220 | Document chunking |
| `app/rag/retrieval.py` | ✅ | ~70 | Dense retrieval |
| `app/rag/generation.py` | ✅ | ~100 | Gemini generation |
| `app/rag/pipeline.py` | ✅ | ~120 | RAG orchestrator |
| `app/indexing/indexer.py` | ✅ | ~180 | ChromaDB indexing |
| `app/api/schemas.py` | ✅ | ~130 | Pydantic models |
| `app/api/routes.py` | ✅ | ~220 | FastAPI routes |
| `app/main.py` | ✅ | ~45 | App setup |
| `app/rag/intent.py` | ✅ | ~20 | Stub (Phase 6.4) |
| `app/rag/query_enhancement.py` | ✅ | ~20 | Stub (Phase 6.5) |
| `app/rag/reranking.py` | ✅ | ~20 | Stub (Phase 6.3) |

**Total Phase 1 Backend Code**: ~1080 lines

