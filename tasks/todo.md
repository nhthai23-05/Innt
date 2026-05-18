# Innt RAG Chatbot — Todo List

Flat checklist derived from `tasks/plan.md`. Each item = one task row with its acceptance signal. Check items off as they land. Checkpoints between phases are human review gates — do not start the next phase until the checkpoint is signed off.

---

## Phase 0 — Data Foundation & Environment Setup ⛔ Hard gate

- [x] **0.1** Normalize `data/products.json` — ✅ all products have `id`, `category_slug`, `redirect_note`
- [x] **0.2** Normalize `data/business.json` — ✅ all docs have `id` (address/hotline/email to be filled manually)
- [x] **0.3** Create `data/categories.json` — canonical slug + Vietnamese label list (resolves Open Q #2)
- [x] **0.4** Image plan: **Cloudinary** — use existing URLs in `generation_enhancers.image_url`
- [x] **0.5** Temporarily flip `config.py` defaults: `retrieval_strategy="dense"`, `use_reranking=False`
- [x] **0.6** Document CPU-only torch install path in `backend/README.md`
- [x] **0.7** Product count: **19 products locked**

### Checkpoint A — ✅ Schema frozen, image plan decided, team sign-off

---

## Phase 1 — Naive RAG Walking Skeleton (CLI only)

- [x] **1.1** `app/indexing/indexer.py` — load JSON → ChromaDB with idempotent `--rebuild` flag (collection count = 24)
- [x] **1.2** `app/rag/embeddings.py` — sentence-transformers wrapper reading `settings.embedding_model`
- [x] **1.3** `app/rag/retrieval.py` — `DenseRetriever` only (bm25/hybrid stubbed); top-k against "phong bì A5" includes the product
- [x] **1.4** `app/rag/generation.py` — `GeminiGenerator` + Vietnamese system prompt that refuses pricing
- [x] **1.5** `app/rag/pipeline.py` — `RagPipeline.query()` orchestrator; `python -m app.rag.pipeline "..."` returns grounded answer

### Checkpoint B — ✅ 5-query manual smoke test passes (product / spec / vague / pricing / out-of-scope)

---

## Phase 2 — Evaluation Harness

- [x] **2.1** `backend/evaluation/test_set.json` — initial 20 Q&A pairs across 6 categories
- [x] **2.2** `evaluation/evaluate.py` — RAGAS runner (faithfulness, answer_relevancy, context_precision, context_recall)
- [x] **2.3** `evaluation/metrics.py` — latency, memory, redirect accuracy
- [x] **2.4** `evaluation/run_experiments.py` — experiment harness with yaml config + git SHA tracking
- [x] **2.5** Run baseline; log as "Baseline (Naive RAG)" row of `experiments/results/cumulative_gains.csv`

### Checkpoint C — ⚠️ RE-OPEN: original baseline run hit the `evaluate.py` answer/response key bug. Fix landed 2026-05-18. Re-run per `tasks/PHASE2_RERUN.md` before trusting the cumulative gains chart.

---

## Phase 3 — HTTP API

- [x] **3.1** `app/api/schemas.py` — `ChatRequest` + `ChatResponse` pydantic models (SPEC §8.1)
- [x] **3.2** `app/api/routes.py` — `POST /api/chat` (text-only; image accepted but ignored for now)
- [x] **3.3** `GET /api/config` + `POST /api/config` (non-persistent override for experiments)
- [x] **3.4** `POST /api/index/rebuild` → calls indexer, returns collection size
- [x] **3.5** Wire routers into `app/main.py`; endpoints visible at `/docs`

### Checkpoint D — ✅ curl /api/chat returns grounded JSON; OpenAPI docs render

---

## Phase 4 — Frontend Chat Widget *(can start with mocked API during Phase 1)*

- [ ] **4.1** `frontend/types/chat.ts` — `ChatMessage`, `ChatApiRequest`, `ChatApiResponse`, `Source` types
- [ ] **4.2** `frontend/services/chatApi.ts` — `sendMessage()` using native `fetch`; reads `VITE_API_BASE_URL`; sonner toast on error
- [ ] **4.3** `frontend/components/chat/ChatWidget.tsx` — floating panel, `bg-[#E62026]`, shadcn `ScrollArea`, typing indicator
- [ ] **4.4** Wire `ChatWidget` into `App.tsx` (replace `StickyContactButton` FAB slot)
- [ ] **4.5** `frontend/.env.example` — `VITE_API_BASE_URL=http://localhost:8000`
- [ ] **4.6** Error + empty states; image upload button **disabled** with tooltip "Đang phát triển"

### Checkpoint E — ✅ Vietnamese query in browser → grounded answer with source chips visible

---

## Phase 5 — Website Product Wiring *(parallel with 1–4 after Phase 0)*

- [x] **5.1** `frontend/types/product.ts` — TS mirror of normalized products.json schema
- [x] **5.2** `frontend/services/productData.ts` — `getAllProducts`, `getCategoryBySlug`, `getProductsByCategory`, `getProductById`, `searchProducts`, `getPrimaryImage`
- [x] **5.3** Rewrite `pages/ProductsPage.tsx` — category cards from `categories.json` + product grid + Vietnamese search + category filter chips + empty state
- [x] **5.4** Rewrite `pages/ProductDetailPage.tsx` — consume `productData.getProductsByCategory(slug)`; renders gallery + use cases + technical specs + finishing options per product; supports `#product-id` deep linking from ProductsPage
- [x] **5.5** Adopted `react-router-dom` v7: routes are `/`, `/about`, `/products`, `/products/:slug`, `/process`, `/contact`; `Header`/`Footer` use `<Link>`; pages use `useNavigate`. Legacy English IDs (boxes/notebooks/...) deleted.
- [x] **5.6** Zalo link sourced from `VITE_ZALO_LINK` in `StickyContactButton` and `ContactPage` (with default fallback); `.env.example` documents the var
- [x] **5.7** All product images rendered via `ImageWithFallback` (svg error placeholder on broken URLs)

### Checkpoint F — ✅ All 19 products visible and filterable; no hardcoded strings in `pages/`

---

## Phase 6 — Advanced RAG *(measured per sub-step)*

- [ ] **6.1** `BM25Retriever` (`rank_bm25`) — sparse index at startup
- [ ] **6.2** `HybridRetriever` α-weighted merge — sweep α ∈ {0.0…1.0}; save α-sweep chart
- [ ] **6.3** `app/rag/reranking.py` `CrossEncoderReranker` — latency delta ≤ +300 ms
- [ ] **6.4** `app/rag/intent.py` intent classifier + pricing redirect path — redirect accuracy = 100%
- [ ] **6.5** `app/rag/query_enhancement.py` `HyDE` — applies only to product/business intents
- [ ] **6.6** Restore `config.py` defaults (`hybrid`, `use_reranking=true`, `use_query_enhancement=true`); integration run green

### Checkpoint G — ✅ Cumulative gains table has baseline + 5 stage rows, same test set across all

---

## Phase 7 — Multimodal (Image Input)

- [ ] **7.1** Populate `data/images/` with real product photos (replace Phase 0.4 placeholders)
- [ ] **7.2** `app/multimodal/image_matching.py` — `open_clip` load + precompute + persist to `.cache/clip_index.npy`; `match(bytes, top_k=3)`
- [ ] **7.3** Threshold fallback — low-score image returns Vietnamese apology
- [ ] **7.4** `POST /api/chat` multipart — when image present, route to image match + RAG description
- [ ] **7.5** Enable image upload in `ChatWidget` — preview + FormData send + matched-product chips
- [ ] **7.6** Build 20-image eval subset; top-3 accuracy > 70%

### Checkpoint H — ✅ Image query end-to-end works on desktop + mobile

---

## Phase 8 — Systematic Experiments

- [ ] **8.1** Experiment 1 — embedding model comparison (4 candidates) → retrieval metrics table + chart
- [ ] **8.2** Experiment 3 — retrieval strategies → RAGAS comparison
- [ ] **8.3** Experiment 2 — LLM comparison (Gemini 1.5 / 2.0 / Llama / Qwen / Vistral) → RAGAS + latency + memory
- [ ] **8.4** Experiment 5 — query enhancement (none / HyDE / rewrite / expand) → recall delta per category
- [ ] **8.5** Experiment 4 — chunking strategies → RAGAS
- [ ] **8.6** Experiment 6 — Architectures A/B/C end-to-end + human eval (3 × 20 responses)
- [ ] **8.7** Consolidate: cumulative-gains line chart + Pareto plots + trade-off writeup

### Checkpoint I — ✅ All experiment CSVs present; gains table complete; figures ready for report

---

## Phase 9 — Ship

- [ ] **9.1** LaTeX report under `report/` — 8-chapter structure citing SPEC references; `pdflatex main.tex` builds
- [ ] **9.2** Slide deck under `docs/presentation/` — architecture + cumulative gains + demo video
- [ ] **9.3** Polish — mobile chat, accessibility (focus trap, ARIA, keyboard send), toasts, empty/loading states
- [ ] **9.4** Deploy — backend (Railway/Render/uni server), frontend (Vercel) with correct `VITE_API_BASE_URL`
- [ ] **9.5** Submission bundle — PDF report + slides + GitHub link

### Checkpoint J — ✅ Final submission delivered

---

## Verification Notes — 2026-05-18

- **Phase 1 verified**: 8 RAG modules + indexer + chunker all real (~1080 LOC). `app/rag/pipeline.py:RagPipeline.query()` returns `{response, sources, redirect_to_zalo, metadata, conversation_id?}`.
- **Phase 2 verified**: 20-pair test set across 7 categories. RAGAS + custom metrics + YAML runner all present.
  - 🐛 **Fixed bug**: `evaluation/evaluate.py:110` was reading `result.get("answer", "")` but the pipeline returns `response`; baseline evals were running on empty strings. Now reads `response` with `answer` fallback.
  - ⚠️ **Open**: `experiments/results/cumulative_gains.csv` is not in the repo — the Phase 2.5 baseline run needs to be re-executed against the fixed evaluator to populate Checkpoint C honestly.
- **Phase 3 verified**: All 4 endpoints wired (`/api/chat`, `/api/config` GET+POST, `/api/index/rebuild`, `/api/health`). CORS configured. 11 pydantic schema tests pass.
- **Phase 4 NOT done**: `frontend/components/chat/`, `frontend/services/` (chat API), `frontend/types/` (chat types) were empty — Phase 4 is still pending. Owner of the frontend chat widget needs to pick it up.
- **Phase 5 done**: `npm run build` clean; dev server boots all 3 routes (`/`, `/products`, `/products/phong-bi`) → 200.

## Cross-cutting Reminders

- [ ] Indexer `--rebuild` drops collection before re-insert (Phase 1.1)
- [ ] Use native `fetch`, NOT axios (Phase 4.2)
- [ ] Pipeline accepts `RagPipelineConfig` dataclass — don't mutate global `settings` (Phase 1.5, 2.4)
- [ ] Gemini system prompt enforces Vietnamese-only + pricing redirect (Phase 1.4)
- [ ] Every experiment CSV records `RagPipelineConfig` + git SHA + timestamp (Phase 2.4)
- [ ] Free-tier deploy config: Gemini API only (no local LLM); lazy-load CLIP on image routes (Phase 9.4)
- [ ] No API keys or `.env` files committed (CLAUDE.md boundary)
- [ ] No hardcoded prices anywhere (CLAUDE.md boundary)
