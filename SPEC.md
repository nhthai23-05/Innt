# SPEC: RAG-Driven Chatbot for Product Catalogs Website

**Project**: RAG-Driven Chatbot for Product Catalogs Website (innt.vn)
**Course**: Natural Language Processing (University)
**Team size**: 5 members
**Timeline**: ~2 months (April 2026 – June 2026)
**Language**: Vietnamese only

---

## 1. Objective

Build a Retrieval-Augmented Generation (RAG) chatbot embedded in the innt.vn website that:

1. **Answers product inquiries** about 23 printing/packaging products using natural Vietnamese conversation
2. **Accepts both text and image input** — users can upload a photo of a printed product and the chatbot identifies matching products/services
3. **Provides accurate technical consultations** (specs, materials, use cases, production timelines, company info)
4. **Redirects to human contact** (Zalo) when queries require pricing details or custom consultation beyond available knowledge
5. **Serves as an experimental platform** to compare RAG configurations (architectures, embeddings, chunking, retrieval strategies, LLMs) with rigorous evaluation

### Target Users

Vietnamese B2B clients (businesses needing printing services) visiting innt.vn — they want quick answers about what products are available, technical specs, materials, minimum order quantities, and production timelines before contacting the company for a detailed quote.

### Success Criteria

| Metric | Target | How to measure |
|--------|--------|----------------|
| Answer Accuracy (Faithfulness) | > 0.85 RAGAS score | RAGAS evaluation on test set |
| Answer Relevancy | > 0.80 RAGAS score | RAGAS evaluation on test set |
| Context Precision | > 0.85 RAGAS score | RAGAS evaluation on test set |
| Response Latency | < 5s for text, < 8s for image | End-to-end timing |
| Image Matching Accuracy | > 70% top-3 accuracy | Manual evaluation on test images |
| Graceful Fallback Rate | 100% for pricing/out-of-scope | Manual testing |

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Chat Widget (Floating)                   │   │
│  │  ┌─────────────┐  ┌──────────────────────────────┐   │   │
│  │  │ Image Upload │  │ Text Input (Vietnamese)      │   │   │
│  │  └──────┬──────┘  └──────────────┬───────────────┘   │   │
│  └─────────┼────────────────────────┼───────────────────┘   │
└────────────┼────────────────────────┼───────────────────────┘
             │  POST /api/chat        │
             ▼                        ▼
┌─────────────────────────────────────────────────────────────┐
│                 Backend (Python / FastAPI)                    │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   RAG Pipeline                         │  │
│  │                                                        │  │
│  │  ┌──────────┐   ┌───────────┐   ┌──────────────────┐ │  │
│  │  │ Query    │──▶│ Retrieval │──▶│ Generation (LLM)  │ │  │
│  │  │ Processing│   │ Engine    │   │ + Prompt Template │ │  │
│  │  └──────────┘   └───────────┘   └──────────────────┘ │  │
│  │       │              │                                 │  │
│  │       ▼              ▼                                 │  │
│  │  ┌──────────┐   ┌───────────┐                         │  │
│  │  │ HyDE /   │   │ Re-ranker │                         │  │
│  │  │ Rewrite  │   │(Optional) │                         │  │
│  │  └──────────┘   └───────────┘                         │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────┐  ┌─────────────────────────────────┐  │
│  │ Image Pipeline   │  │ Vector Store (ChromaDB / FAISS) │  │
│  │ (CLIP Encoding)  │  │ + BM25 Index (rank_bm25)       │  │
│  └──────────────────┘  └─────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 RAG Architectures to Implement & Compare

Three progressive architectures, each building on the previous:

#### Architecture A: Naive RAG (Baseline)
```
Query → Embed → Vector Search (top-k) → LLM Generate → Response
```
- Direct embedding of user query
- Single-stage dense retrieval
- Simple prompt with retrieved context
- **Reference**: Lewis et al., "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks," NeurIPS 2020 [1]

#### Architecture B: Advanced RAG
```
Query → Query Enhancement (HyDE/Rewrite) → Hybrid Search (Dense + BM25) → Re-rank → LLM Generate → Response
```
- Query enhancement via HyDE or query rewriting
- Hybrid retrieval combining dense embeddings + BM25 sparse retrieval
- Cross-encoder re-ranking of retrieved documents
- Metadata filtering (category-aware retrieval)
- **References**:
  - Gao et al., "Precise Zero-Shot Dense Retrieval without Relevance Labels" (HyDE), ACL 2023 [2]
  - Robertson & Zaragoza, "The Probabilistic Relevance Framework: BM25 and Beyond," Foundations and Trends in IR, 2009 [3]
  - Nogueira & Cho, "Passage Re-ranking with BERT," arXiv:1901.04085, 2019 [4]

#### Architecture C: Agentic RAG (Advanced)
```
Query → Intent Classification → Route Decision:
  ├── Product query → Category Filter → Hybrid Search → Re-rank → Generate
  ├── Business query → Business KB Search → Generate
  ├── Image query → CLIP Encode → Image-Product Match → Generate
  ├── Comparison → Multi-retrieval → Comparative Generate
  └── Out-of-scope / Pricing → Redirect to Zalo
```
- LLM-based intent classification and query routing
- Category-aware retrieval with metadata filters
- Multi-step reasoning for comparison queries
- Explicit fallback for pricing and out-of-scope queries
- **References**:
  - Gao et al., "Retrieval-Augmented Generation for Large Language Models: A Survey," arXiv:2312.10997, 2023 [5]
  - Asai et al., "Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection," NeurIPS 2023 [6]

### 2.3 Multimodal Pipeline (Image Input)

```
User Image → CLIP ViT Encode → Cosine Similarity vs Product Image Embeddings
  ├── Score > threshold → Return matched product(s) + RAG-generated description
  ├── Score < threshold → "Xin lỗi, tôi không nhận diện được sản phẩm trong ảnh này."
  └── Invalid/irrelevant → Graceful error message
```

- **Reference**: Radford et al., "Learning Transferable Visual Models From Natural Language Supervision" (CLIP), ICML 2021 [7]
- Use `openai/clip-vit-base-patch32` or `laion/CLIP-ViT-B-32-laion2B-s34B-b79K`
- Pre-compute embeddings for all product reference images (from Cloudinary)
- Threshold-based matching with top-3 candidate display

---

## 3. Data Design

### 3.1 Products Data (`products.json`)

**Current state**: Good structure with `embedding_data`, `metadata`, and `generation_enhancers`. 23 products across 7 categories.

**Recommended improvements**:

```jsonc
{
  "id": "phong-bi-a5",                    // ADD: unique slug ID
  "embedding_data": {
    "product_name": "Phong bì A5",
    "detailed_description": "...",
    "use_cases": ["..."],
    "finishing_options": ["Cán màng mờ", "Cán màng bóng"]  // ADD: if applicable
  },
  "metadata": {
    "category": "Phong bì",
    "category_slug": "phong-bi",           // ADD: for URL routing & filtering
    "technical_specs": {
      "dimensions": "16 x 23 cm",
      "thickness_gsm": "100g/m2 - 150g/m2",
      "quantity": "Theo yêu cầu (Tối thiểu: 1000 chiếc)",
      "material": "Giấy Ford (Ốp) hoặc Giấy Couche",
      "colors": "In offset 1 đến 4 màu"
    }
  },
  "generation_enhancers": {
    "product_url": "/products/phong-bi",   // ADD: link to website page
    "image_url": "https://res.cloudinary.com/...", // FILL: Cloudinary URL
    "redirect_note": "Liên hệ qua Zalo để nhận báo giá chi tiết"
  }
}
```

**Key changes**:
1. **Add `id`** — unique slug identifier for each product (needed for routing, evaluation, and image matching)
2. **Add `category_slug`** — machine-readable category for metadata filtering in retrieval
3. **Fill `image_url`** — Cloudinary URLs are ideal (direct links). The CLIP model and website both need these
4. **Fill `product_url`** — link back to the website product page
5. **Add `finishing_options`** where applicable — enriches the knowledge base
6. **Add `redirect_note`** — standard message for when chatbot should redirect to Zalo

### 3.2 Business Data (`business.json`)

**Current state**: Good. 5 documents covering company overview, production capabilities, delivery timeline, key clients, and contact info.

**Keep as JSON** — no need to convert. JSON is the ideal source-of-truth format because:
- Easily parsed by the indexing pipeline
- Structured metadata for filtering
- Version-controllable in git

**Recommended improvements**:
1. Add `id` field to each document (e.g., `"id": "company-overview"`)
2. Fill in the empty contact metadata (address, hotline, email) in the contact document — the chatbot needs this to answer "where are you located?" questions
3. Add a `"redirect_note"` field to the contact document pointing to the Zalo link

### 3.3 Knowledge Base Processing

At indexing time, the JSON files are processed into documents for the vector store:

| Strategy | Description | When to use |
|----------|-------------|-------------|
| **Document-level** | Each product/business doc = 1 chunk | Baseline. Best for small catalogs (23 products) |
| **Field-level** | Split: description, use_cases, specs as separate chunks, linked by product ID | When you want fine-grained retrieval |
| **Augmented** | Product description + related business context (e.g., production timeline) merged | When queries span product + business info |

With only 23 products + 5 business docs, **document-level chunking is the recommended default** — the entire corpus fits comfortably in any vector store, and keeping full product context in each chunk avoids information loss. Field-level chunking is worth testing as an experiment to measure whether granularity helps or hurts retrieval precision.

---

## 4. Technology Stack

### 4.1 Backend

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| **Framework** | FastAPI (Python 3.11+) | Async, fast, auto-docs, ideal for ML serving |
| **Vector Store** | ChromaDB | Free, local, persistent storage, metadata filtering, Python-native |
| **Sparse Index** | `rank_bm25` (Python) | Lightweight BM25 for hybrid search experiments |
| **Embedding Models** | See §5.1 | Multiple models for experiments |
| **LLMs** | See §5.2 | Multiple models for experiments |
| **Image Model** | CLIP (`clip-vit-base-patch32`) | Free, proven image-text matching |
| **Re-ranker** | `cross-encoder/ms-marco-MiniLM-L-6-v2` | Free, small, fast cross-encoder |
| **Evaluation** | RAGAS + custom metrics | Standard RAG evaluation framework |

### 4.2 Frontend

| Component | Technology | Status |
|-----------|-----------|--------|
| **Framework** | React 18 + Vite + TypeScript | Existing |
| **UI Library** | Radix UI + Tailwind CSS | Existing |
| **Chat Widget** | New component (floating panel) | To build |
| **Image Upload** | HTML5 FileReader + drag-and-drop | To build |
| **API Client** | fetch / axios | To add |

### 4.3 Infrastructure

| Component | Technology |
|-----------|-----------|
| **Frontend hosting** | Vercel (existing) |
| **Backend hosting** | Local development / university server / free tier (Railway/Render) |
| **Image storage** | Cloudinary (existing) |
| **LLM serving** | Ollama (local) for open-source models, Google AI Studio (free tier) for Gemini |

---

## 5. Experiment Plan

This is the core academic contribution. Each experiment isolates one variable while holding others constant.

### 5.1 Experiment 1: Embedding Models

Compare Vietnamese text embedding quality for product retrieval.

| Model | Type | Params | Vietnamese Support |
|-------|------|--------|--------------------|
| `bkai-foundation-models/vietnamese-bi-encoder` | Vietnamese-specific | ~135M | Native |
| `intfloat/multilingual-e5-base` | Multilingual | ~278M | Trained on Vietnamese |
| `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2` | Multilingual | ~118M | Trained on Vietnamese |
| `dangvantuan/vietnamese-embedding` | Vietnamese-specific | ~135M | Native |

**Metrics**: Retrieval Precision@k, Recall@k, MRR, NDCG, embedding latency, model size

### 5.2 Experiment 2: LLM Comparison

Compare generation quality for Vietnamese product consultation.

| Model | Type | Access | Vietnamese Quality |
|-------|------|--------|--------------------|
| Gemini 1.5 Flash | API (free tier) | Google AI Studio | Strong |
| Gemini 2.0 Flash | API (free tier) | Google AI Studio | Strong |
| Llama 3.1 8B | Open-source | Ollama (local) | Moderate |
| Qwen2.5 7B | Open-source | Ollama (local) | Strong (CJK-trained) |
| Vistral-7B-Chat | Open-source | Ollama/HuggingFace | Native Vietnamese |

**Metrics**: RAGAS faithfulness, answer relevancy, fluency (human eval), latency, memory usage

### 5.3 Experiment 3: Retrieval Strategies

Compare search approaches on the product knowledge base.

| Strategy | Description | Components |
|----------|-------------|------------|
| **Dense only** | Cosine similarity on embeddings | Vector store (ChromaDB) |
| **Sparse only (BM25)** | Term-frequency matching | `rank_bm25` |
| **Hybrid (weighted)** | α × Dense + (1-α) × BM25 | Both, tunable α |
| **Hybrid + Re-rank** | Hybrid retrieval → cross-encoder re-ranking | All three |
| **Metadata-filtered + Dense** | Filter by category first, then dense search | ChromaDB with metadata |

**Metrics**: Context Precision, Context Recall, end-to-end accuracy, latency

### 5.4 Experiment 4: Chunking Strategies

Compare document segmentation approaches.

| Strategy | Chunks per product | Total chunks (approx) |
|----------|-------------------|----------------------|
| **Document-level** | 1 (full product) | ~28 (23 products + 5 business) |
| **Field-level** | 3 (description, use_cases, specs) | ~74 (23×3 + 5×1) |
| **Augmented** | 1 (product + related business context) | ~28 |
| **Overlapping** | 2 (full + category-grouped summary) | ~35 |

**Metrics**: Retrieval precision, context relevancy, answer accuracy

### 5.5 Experiment 5: Query Enhancement

Compare query preprocessing techniques.

| Technique | Description |
|-----------|-------------|
| **None (baseline)** | Raw user query embedded directly |
| **HyDE** | LLM generates hypothetical answer, embed that instead [2] |
| **Query Rewriting** | LLM reformulates query for better retrieval |
| **Query Expansion** | Add synonyms/related Vietnamese terms |

**Metrics**: Retrieval recall improvement, end-to-end accuracy delta, added latency

### 5.6 Experiment 6: RAG Architecture Comparison

End-to-end comparison of the three architectures (§2.2).

| Architecture | Components |
|-------------|------------|
| **Naive RAG** | Best embedding + dense search + best LLM |
| **Advanced RAG** | Best embedding + hybrid search + re-rank + best LLM + query enhancement |
| **Agentic RAG** | Advanced RAG + intent routing + multi-step reasoning |

**Metrics**: All RAGAS metrics, latency, memory, user experience (human eval)

### 5.7 Performance Improvement Narrative

This section maps the **progressive optimization story** — each row answers the professor's question: *"What did your group do to improve performance?"*

The experiments are designed to be run **sequentially**, where each step builds on the previous best configuration. This produces a clear improvement trajectory that can be presented as a cumulative gains chart.

#### Stage 1: Establish Baseline
| What we built | What we measured | Expected outcome |
|--------------|-----------------|-----------------|
| Naive RAG: generic multilingual embedding + dense search + basic LLM | RAGAS scores, latency, retrieval precision | Baseline numbers. Likely weak on Vietnamese-specific queries and vague questions. |

**Problem identified**: Generic multilingual embeddings may not capture Vietnamese printing terminology well (e.g., "cán màng", "bế khuôn", "giấy Couche").

#### Stage 2: Optimize Embedding for Vietnamese
| What we changed | Why | How to measure improvement |
|----------------|-----|---------------------------|
| Replaced generic embedding with Vietnamese-specific model (BKAI / dangvantuan) | Vietnamese printing domain has specialized vocabulary that multilingual models under-represent | Retrieval Precision@5, Recall@5 delta vs baseline |

#### Stage 3: Improve Retrieval with Hybrid Search
| What we changed | Why | How to measure improvement |
|----------------|-----|---------------------------|
| Added BM25 sparse retrieval alongside dense search (hybrid α-weighted) | Dense search misses exact keyword matches (e.g., "A5", "300gsm"); BM25 captures these | Context Recall improvement, especially for spec-heavy queries |

**Tuning**: Sweep α from 0.0 (BM25-only) to 1.0 (dense-only) in 0.1 increments. Report optimal α.

#### Stage 4: Add Re-ranking
| What we changed | Why | How to measure improvement |
|----------------|-----|---------------------------|
| Added cross-encoder re-ranker after hybrid retrieval | Initial retrieval returns good candidates but wrong ordering — re-ranking promotes the most relevant | Context Precision improvement, answer accuracy improvement |

**Trade-off to report**: Re-ranking adds ~100–300ms latency. Is the accuracy gain worth it?

#### Stage 5: Query Enhancement
| What we changed | Why | How to measure improvement |
|----------------|-----|---------------------------|
| Added HyDE (hypothetical document generation) before retrieval | Users ask vague questions ("tôi cần in gì đó để phát cho khách") that don't match product descriptions directly | Retrieval recall on vague/recommendation queries specifically |

**Trade-off to report**: HyDE adds one LLM call (~500–1500ms). Show which query categories benefit vs. which don't.

#### Stage 6: Agentic Routing
| What we changed | Why | How to measure improvement |
|----------------|-----|---------------------------|
| Added intent classification to route queries to specialized handlers | Pricing queries were generating hallucinated prices; comparison queries retrieved wrong products | Redirect accuracy (100% target), comparison answer quality |

#### Stage 7: Multimodal Capability
| What we changed | Why | How to measure improvement |
|----------------|-----|---------------------------|
| Added CLIP image-to-product matching | Customers often have a sample product and want to reorder — text description is hard, photo is easy | Image match accuracy (top-1, top-3), new capability not possible before |

#### Cumulative Results Table (to fill during experiments)

| Configuration | Faithfulness | Answer Relevancy | Context Precision | Context Recall | Latency (ms) | Memory (MB) |
|--------------|-------------|-----------------|-------------------|---------------|-------------|-------------|
| Baseline (Naive RAG) | — | — | — | — | — | — |
| + Vietnamese embedding | — | — | — | — | — | — |
| + Hybrid search | — | — | — | — | — | — |
| + Re-ranking | — | — | — | — | — | — |
| + Query enhancement | — | — | — | — | — | — |
| + Agentic routing | — | — | — | — | — | — |
| + Image input | — | — | — | — | — | — |

**Presentation tip**: Plot this as a line chart showing each metric improving (or trading off) across stages. This is the single most impactful slide for the professor.

#### Trade-off Analysis

Not every optimization is free. The report should include a **Pareto analysis** of:

- **Accuracy vs. Latency**: Re-ranking and HyDE improve accuracy but add latency. Where is the sweet spot?
- **Accuracy vs. Memory**: Larger embedding models are more accurate but consume more RAM. What's the minimum viable model?
- **Complexity vs. Gain**: Does Agentic RAG's added complexity justify its accuracy improvement over Advanced RAG?

This analysis demonstrates engineering judgment, not just "we tried everything." The professor wants to see that you can reason about **when an optimization is worth its cost**.

### 5.8 Evaluation Methodology

#### Test Set Construction
- Create **80–100 Vietnamese Q&A pairs** covering:
  - Product-specific questions (40%): "Phong bì A5 dùng giấy gì?"
  - Comparison questions (15%): "So sánh túi kraft size S và M?"
  - Business/process questions (15%): "Thời gian in mất bao lâu?"
  - Recommendation questions (15%): "Tôi cần in 500 namecard, có sản phẩm nào phù hợp?"
  - Out-of-scope / pricing (10%): "Giá in 1000 tờ rơi bao nhiêu?"
  - Edge cases (5%): Ambiguous, misspelled, mixed intent

- Each test case includes:
  - `question` (Vietnamese)
  - `ground_truth_answer` (expected answer)
  - `ground_truth_contexts` (which products/docs should be retrieved)
  - `category` (question type)

#### Automated Metrics (RAGAS)
- **Faithfulness**: Is the answer grounded in retrieved context? (no hallucination)
- **Answer Relevancy**: Does the answer address the question?
- **Context Precision**: Are retrieved documents relevant?
- **Context Recall**: Were all relevant documents retrieved?
- **Reference**: Es et al., "RAGAS: Automated Evaluation of Retrieval Augmented Generation," arXiv:2309.15217, 2023 [8]

#### Custom Metrics
- **Latency** (ms): End-to-end response time
- **Memory Usage** (MB): Peak RAM during inference
- **Redirect Accuracy** (%): Correctly redirects pricing/OOS queries to Zalo
- **Image Match Accuracy** (%): Correct product identified from photo (top-1, top-3)

#### Human Evaluation (small scale)
- 3–5 team members rate 20 responses each on: helpfulness (1–5), fluency (1–5), accuracy (1–5)

---

## 6. Frontend & Website Completion

### 6.1 Chat Widget (New)

A floating chat widget embedded on all pages of innt.vn:

```
┌─────────────────────────┐
│ 🔴 Tư vấn In N&T    ─ × │  ← Header with minimize/close
├─────────────────────────┤
│                         │
│  Bot: Xin chào! Tôi    │  ← Message area (scrollable)
│  là trợ lý tư vấn...   │
│                         │
│  User: Tôi muốn in     │
│  phong bì...            │
│                         │
│  Bot: Chúng tôi có     │
│  4 loại phong bì...    │
│                         │
├─────────────────────────┤
│ [📎 Ảnh] [Nhập tin...] │  ← Input area with image upload
│                    [Gửi]│
└─────────────────────────┘
```

**Features**:
- Floating button (bottom-right, consistent with existing StickyContactButton style)
- Expand into chat panel (400×500px on desktop, full-screen on mobile)
- Message history within session (not persisted across page reloads)
- Image upload via button or drag-and-drop (preview before send)
- Typing indicator while waiting for backend response
- Auto-scroll to latest message
- Quick-action buttons for common queries (optional)
- Zalo redirect button when chatbot suggests contacting directly

### 6.2 Website Improvements

| Task | Details |
|------|---------|
| **Product images** | Add Cloudinary URLs to `products.json` → display in ProductCard and ProductDetailPage |
| **Product search/filter** | Add text search + category filter dropdown on ProductsPage |
| **Contact form** | Embed Zalo link prominently + Google Maps (already partially done) |
| **StickyContactButton** | Wire up to real Zalo company link |
| **Product detail data** | Load product data from `products.json` instead of hardcoded content |

---

## 7. Project Structure

```
/Innt
├── src/                              # Frontend (React)
│   ├── components/
│   │   ├── chat/                     # NEW: Chat widget
│   │   │   ├── ChatWidget.tsx        # Main chat container
│   │   │   ├── ChatMessage.tsx       # Single message bubble
│   │   │   ├── ChatInput.tsx         # Text input + send button
│   │   │   └── ImageUpload.tsx       # Image upload component
│   │   └── ...existing components...
│   ├── pages/
│   │   └── ...existing pages...
│   ├── services/
│   │   └── chatApi.ts                # NEW: API client for backend
│   └── ...existing files...
│
├── backend/                          # NEW: Python backend
│   ├── app/
│   │   ├── main.py                   # FastAPI app entry point
│   │   ├── config.py                 # Configuration / env vars
│   │   ├── api/
│   │   │   ├── routes.py             # API route definitions
│   │   │   └── schemas.py            # Pydantic request/response models
│   │   ├── rag/
│   │   │   ├── pipeline.py           # RAG orchestrator (configurable)
│   │   │   ├── chunking.py           # Chunking strategies
│   │   │   ├── embeddings.py         # Embedding model wrapper
│   │   │   ├── retrieval.py          # Dense, BM25, hybrid search
│   │   │   ├── reranking.py          # Cross-encoder reranker
│   │   │   ├── generation.py         # LLM generation wrapper
│   │   │   ├── query_enhancement.py  # HyDE, query rewriting
│   │   │   └── intent.py             # Intent classification (Agentic RAG)
│   │   ├── multimodal/
│   │   │   └── image_matching.py     # CLIP-based image-to-product
│   │   ├── indexing/
│   │   │   └── indexer.py            # Document processing & vector store indexing
│   │   └── data/
│   │       ├── products.json         # Symlink or copy from root
│   │       └── business.json         # Symlink or copy from root
│   ├── evaluation/
│   │   ├── test_set.json             # Ground truth Q&A pairs
│   │   ├── evaluate.py               # Evaluation runner (RAGAS + custom)
│   │   ├── metrics.py                # Custom metric implementations
│   │   └── run_experiments.py        # Experiment orchestrator
│   ├── experiments/
│   │   ├── configs/                  # YAML configs for each experiment run
│   │   └── results/                  # Saved experiment results (JSON/CSV)
│   ├── requirements.txt
│   └── Dockerfile
│
├── report/                           # NEW: LaTeX report
│   ├── main.tex
│   ├── references.bib
│   ├── chapters/
│   │   ├── 01-introduction.tex
│   │   ├── 02-related-work.tex
│   │   ├── 03-methodology.tex
│   │   ├── 04-system-design.tex
│   │   ├── 05-experiments.tex
│   │   ├── 06-results.tex
│   │   └── 07-conclusion.tex
│   └── figures/
│
├── products.json                     # Source of truth
├── business.json                     # Source of truth
├── SPEC.md                           # This file
└── docker-compose.yml                # Updated for backend service
```

---

## 8. API Specification

### 8.1 Chat Endpoint

```
POST /api/chat
Content-Type: multipart/form-data
```

**Request**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `message` | string | Yes (if no image) | User's text message in Vietnamese |
| `image` | file (JPEG/PNG) | No | Uploaded product image |
| `conversation_id` | string | No | Session ID for multi-turn context |
| `config` | string (JSON) | No | RAG config override (for experiments) |

**Response**:
```json
{
  "response": "Chúng tôi có 4 loại phong bì...",
  "sources": [
    {
      "product_id": "phong-bi-a5",
      "product_name": "Phong bì A5",
      "relevance_score": 0.92
    }
  ],
  "redirect_to_zalo": false,
  "zalo_link": null,
  "conversation_id": "abc123",
  "metadata": {
    "latency_ms": 1200,
    "retrieval_strategy": "hybrid",
    "llm_model": "gemini-1.5-flash"
  }
}
```

### 8.2 Health / Config Endpoints

```
GET  /api/health              → { "status": "ok", "models_loaded": true }
GET  /api/config              → Current RAG pipeline configuration
POST /api/config              → Update RAG pipeline config (for experiments)
POST /api/index/rebuild       → Re-index knowledge base
```

---

## 9. Team Allocation

Recommended distribution for 5 members:

| Role | Member(s) | Responsibilities |
|------|-----------|-----------------|
| **Backend & RAG Core** | 1 person | FastAPI setup, RAG pipeline orchestrator, vector store integration, API endpoints, deployment |
| **Retrieval & Embeddings** | 1 person | Embedding model integration, chunking strategies, BM25, hybrid search, re-ranking, HyDE/query rewriting |
| **LLM & Generation** | 1 person | LLM integration (Gemini API + Ollama), prompt engineering, intent classification, multimodal/CLIP image pipeline |
| **Frontend & UX** | 1 person | Chat widget, image upload, website completion (product images, search/filter, Zalo integration), responsive design |
| **Evaluation & Report** | 1 person | Test set creation, RAGAS integration, custom metrics, experiment runner, LaTeX report writing, presentation |

**Notes**:
- All members contribute to the test set creation (each writes 15–20 Q&A pairs)
- Backend & RAG Core member acts as tech lead / integrator
- Overlap is expected and encouraged — this is a guide, not strict silos

---

## 10. Timeline (8 Weeks)

| Week | Phase | Deliverables |
|------|-------|-------------|
| **1** | Setup & Data | Project scaffolding, backend skeleton, JSON data improvements (add IDs, Cloudinary URLs), test set drafting begins |
| **2** | Baseline RAG | Naive RAG working end-to-end: embedding → ChromaDB → LLM → response. Basic chat API. |
| **3** | Frontend Chat | Chat widget embedded in website. Image upload. Website improvements (product images, search). Connected to backend API. |
| **4** | Advanced RAG | Hybrid search, re-ranking, HyDE, query enhancement implemented. Agentic intent routing. |
| **5** | Multimodal | CLIP image-to-product matching. Graceful fallback for invalid images. End-to-end image query flow working. |
| **6** | Experiments | Run all experiments (§5.1–§5.6). Collect metrics. Generate comparison tables and charts. |
| **7** | Report & Polish | Write LaTeX report. Optimize best configuration. Fix edge cases. Polish UI. |
| **8** | Final & Present | Finalize report. Prepare presentation slides. Final testing. Submission. |

---

## 11. Boundaries

### Always Do
- Return Vietnamese responses only
- Ground all answers in retrieved context (no hallucination)
- Include source product references in responses
- Redirect to Zalo for pricing inquiries with a friendly message
- Validate image input — reject non-image files and respond gracefully to irrelevant images
- Log experiment configurations and results reproducibly
- Keep RAG pipeline modular — each component swappable via configuration

### Ask First (consult team before deciding)
- Changing the product data schema beyond what's specified
- Adding new product categories or business documents
- Choosing a different vector database than ChromaDB
- Adding authentication or user session persistence
- Integrating any paid API or service
- Modifying existing website pages beyond what's specified

### Never Do
- Display or discuss specific pricing information
- Store user conversation data beyond the session
- Make claims about delivery guarantees beyond what's in business.json
- Use paid APIs without explicit team approval
- Hardcode API keys in source code (use environment variables)
- Hallucinate product specs not present in the knowledge base

---

## 12. References

[1] Lewis, P., et al. "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks." NeurIPS 2020. arXiv:2005.11401

[2] Gao, L., et al. "Precise Zero-Shot Dense Retrieval without Relevance Labels" (HyDE). ACL 2023. arXiv:2212.10496

[3] Robertson, S. & Zaragoza, H. "The Probabilistic Relevance Framework: BM25 and Beyond." Foundations and Trends in Information Retrieval, 2009.

[4] Nogueira, R. & Cho, K. "Passage Re-ranking with BERT." arXiv:1901.04085, 2019.

[5] Gao, Y., et al. "Retrieval-Augmented Generation for Large Language Models: A Survey." arXiv:2312.10997, 2023.

[6] Asai, A., et al. "Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection." NeurIPS 2023. arXiv:2310.11511

[7] Radford, A., et al. "Learning Transferable Visual Models From Natural Language Supervision" (CLIP). ICML 2021. arXiv:2103.00020

[8] Es, S., et al. "RAGAS: Automated Evaluation of Retrieval Augmented Generation." arXiv:2309.15217, 2023.
