# Innt RAG Chatbot — Implementation Plan

## Context

The Innt project (innt.vn) has two tracks running in the same repo: an existing React corporate website and a new RAG chatbot for a university NLP course. `SPEC.md` describes the target system in detail, but the current state does not yet match the spec on any dimension — it is a scaffold. This plan breaks the remaining work into **vertical slices** that each deliver a working end-to-end path, ordered by dependency, with checkpoints between phases so the team (5 members) can review progress and redirect if needed.

The plan's two non-negotiable principles:
1. **Measure before optimize.** The evaluation harness ships immediately after the naive baseline, not at the end. Otherwise the cumulative-gains table required by SPEC §5.7 cannot be filled honestly.
2. **Vertical over horizontal.** We never build a "complete retrieval layer" before anything else; we build a working query→answer path end-to-end, then progressively strengthen it.

---

## Current State (verified by exploration)

| Area | State |
|------|-------|
| `backend/app/config.py`, `main.py`, `Dockerfile`, `requirements.txt`, `.env.example` | Real, usable |
| `backend/app/rag/*.py` (8 files), `backend/app/api/*.py` (2 files), `backend/app/multimodal/image_matching.py`, `backend/app/indexing/indexer.py`, `backend/evaluation/*.py` | **All 0-LOC skeletons** |
| `backend/tests/` | Empty except `__init__.py` |
| `frontend/` | React 18 + Vite + TS. Custom page-state routing in `App.tsx` (no react-router). shadcn primitives + sonner installed. **No axios/fetch wrapper.** |
| `frontend/components/chat/`, `frontend/services/`, `frontend/types/` | `.gitkeep` only — empty |
| `frontend/pages/ProductsPage.tsx` | 6 **hardcoded** category cards with **English IDs** (`boxes`, `notebooks`, `envelopes`, `bags`, `calendars`, `other`) |
| `frontend/pages/ProductDetailPage.tsx` | All product details (specs, features, gallery) hardcoded as object literals keyed by English category ID |
| `frontend/components/StickyContactButton.tsx` | Placeholder Zalo link `[YOUR_ZALO_OR_MESSENGER_LINK_HERE]` — never wired |
| `data/products.json` | **19 products** (SPEC claims 23 — discrepancy). Every product missing `id`, `metadata.category_slug`, `generation_enhancers.product_url` (empty string), `generation_enhancers.image_url` (empty string), `embedding_data.finishing_options`, `generation_enhancers.redirect_note`. **8 Vietnamese categories** that do NOT map cleanly to the 6 English frontend category keys. |
| `data/business.json` | 5 documents. None have `id`. Contact doc has empty `address`/`hotline`/`email`. No `redirect_note`. |
| `data/images/` | Empty (`.gitkeep` only) |
| `config.py` defaults | Ships with `retrieval_strategy="hybrid"` and `use_reranking=True` — both reference **empty modules**; Phase 1 must temporarily override these or imports will fail. |

## Open Questions for the Team (resolve at Phase 0 kickoff)

1. **Product count**: `products.json` has **19** products; SPEC says 23. Do we add 4 more (which?), or update SPEC to reflect reality? Decide before schema freeze — changes the test-set coverage target.
2. **Category taxonomy**: Frontend's 6 English keys (`boxes`, `notebooks`, `envelopes`, `bags`, `calendars`, `other`) and data's 8 Vietnamese categories do not overlap. Proposal: **data wins** — regenerate the 6 hardcoded category cards from the 8 Vietnamese categories (likely 8 cards or grouped), and kill all English category IDs. Phase 5 is blocked until this is decided.
3. **Product images**: Source? If Cloudinary URLs are not yet in hand, Phase 7 (multimodal) has no image corpus. At Phase 0 we decide: (a) block multimodal on image procurement, or (b) use public-domain placeholder images per product for pipeline development, then swap in real photos later.
4. **Deployment target for backend**: SPEC mentions Railway/Render free tier OR local university server. Pick before Phase 9 so the torch + CLIP memory footprint is known.

---

## Dependency Graph

```
Phase 0 (Data + Env) ──┬───▶ Phase 1 (Naive RAG CLI) ──▶ Phase 2 (Eval Harness) ──▶ Phase 3 (HTTP API) ──▶ Phase 4 (Chat Widget)
                       │                                                                                         │
                       └───▶ Phase 5 (Website Product Wiring, parallel after Phase 0) ─────────────────────────┘
                                                                                                                  │
                         ┌────────────────────────────────────────────────────────────────────────────────────────┘
                         ▼
                   Phase 6 (Advanced RAG, measured per sub-step against Phase 2 harness)
                         │
                         ▼
                   Phase 7 (Multimodal: CLIP + image upload)
                         │
                         ▼
                   Phase 8 (Systematic Experiments → cumulative gains table)
                         │
                         ▼
                   Phase 9 (Report, slides, polish, deploy)
```

**Parallelism during blocking windows** (5-person team):
- While Phase 0 runs: eval person drafts Q&A test cases; retrieval person runs Experiment 1 (embedding-model comparison) standalone against the raw product descriptions — needs only `sentence-transformers` and the JSON, not the pipeline.
- While Phase 1 runs: frontend person builds Phase 4's ChatWidget shell against a **mocked** API response fixture (shape defined in Phase 3.1 schemas).
- Phase 5 (website product wiring) runs in parallel with Phases 1–4 once Phase 0 locks the schema.

---

## Phases

Each phase = a vertical slice. Each task lists: **what**, **acceptance criteria**, **how to verify**. Checkpoints are human review gates between phases.

### Phase 0 — Data Foundation & Environment Setup ⛔ Hard gate

Everything downstream consumes normalized data. Schema must freeze here.

| # | Task | Acceptance Criteria | Verify |
|---|------|---------------------|--------|
| 0.1 | Normalize `data/products.json`: add `id` (slug), `metadata.category_slug`, `embedding_data.finishing_options` where applicable, `generation_enhancers.redirect_note` | Every product has all 6 fields; `id` is unique; slugs are ASCII kebab-case | `python -c "import json; d=json.load(open('data/products.json',encoding='utf-8')); assert all('id' in p and 'category_slug' in p['metadata'] for p in d); assert len({p['id'] for p in d})==len(d)"` |
| 0.2 | Normalize `data/business.json`: add `id` per doc; fill contact doc's `address`/`hotline`/`email` (ask team for real values); add `redirect_note` to contact doc | All 5 docs have `id`; contact fields non-empty | Same JSON schema check |
| 0.3 | Lock canonical category list in a `data/categories.json` (slug + Vietnamese label + English label if needed for URL) — resolves Open Question #2 | File exists; covers all 8 data categories; reviewed by team | Manual review |
| 0.4 | Decide & document image plan (Open Question #3); populate `data/images/` placeholders named `{product_id}.jpg` if real images unavailable | Every product has at least one image file on disk | `ls data/images/ \| wc -l >= 19` |
| 0.5 | Temporarily flip `config.py` defaults to `retrieval_strategy="dense"` and `use_reranking=False` (these reference empty modules; Phase 6 will restore) | Defaults point only to modules that exist post-Phase 1 | Run `python -c "from app.config import settings; print(settings)"` with no errors |
| 0.6 | Document CPU-only torch install in `backend/README.md` (e.g., `pip install torch --index-url https://download.pytorch.org/whl/cpu`) | Install note added | Visual |
| 0.7 | Resolve Open Question #1 (19 vs 23 products) | Decision recorded in SPEC or a decision log; count is locked | Manual |

**Checkpoint A** — Review with team. Schema frozen. Image plan decided. No further data-shape changes after this.

---

### Phase 1 — Naive RAG Walking Skeleton (CLI only, no HTTP)

Prove the loop: load JSON → embed → index → retrieve → generate → Vietnamese answer.

| # | Task | Acceptance Criteria | Verify |
|---|------|---------------------|--------|
| 1.1 | `app/indexing/indexer.py`: load products+business from `data/`, produce document-level chunks (one chunk per record) with metadata; upsert into ChromaDB with `--rebuild` flag that drops and recreates the collection | Re-running the indexer twice does NOT duplicate records; collection count = 19 + 5 = 24 | `python -m app.indexing.indexer --rebuild && python -c "..." to count` |
| 1.2 | `app/rag/embeddings.py`: thin wrapper around `sentence-transformers` reading `settings.embedding_model` | `embed(["test"])` returns `np.ndarray` of expected dim | Unit smoke test |
| 1.3 | `app/rag/retrieval.py`: implement `DenseRetriever` only for now (stubs for bm25/hybrid); returns top-k `(doc, score)` from ChromaDB | Top-k retrieval against "phong bì A5" returns the Phong bì A5 product in top-3 | CLI smoke |
| 1.4 | `app/rag/generation.py`: `GeminiGenerator` (using `google-generativeai`) + Vietnamese system prompt template that grounds in retrieved context and refuses to hallucinate prices | Returns Vietnamese-only response; includes source product names | CLI smoke |
| 1.5 | `app/rag/pipeline.py`: `RagPipeline.query(text) -> {answer, sources, metadata}` orchestrator | Callable from CLI: `python -m app.rag.pipeline "Phong bì A5 dùng giấy gì?"` returns grounded answer with `Phong bì A5` in sources | Manual 5-query smoke test (product Q, spec Q, vague Q, pricing Q, out-of-scope Q) |

**Checkpoint B** — 5-query manual smoke test; team agrees baseline is "reasonable". No quantitative threshold yet — Phase 2 adds that.

---

### Phase 2 — Evaluation Harness (moved up — ships right after baseline)

Every subsequent phase will produce a measured row in the cumulative gains table (SPEC §5.7).

| # | Task | Acceptance Criteria | Verify |
|---|------|---------------------|--------|
| 2.1 | `backend/evaluation/test_set.json`: draft 20 Q&A pairs covering the 6 SPEC categories (product-specific, comparison, business, recommendation, pricing, edge). Team members each contribute 15–20 more in Phase 6 (target 80–100) | 20 pairs exist with `question`, `ground_truth_answer`, `ground_truth_contexts`, `category` | Schema validation |
| 2.2 | `evaluation/evaluate.py`: run RAGAS (faithfulness, answer_relevancy, context_precision, context_recall) against a given `RagPipeline` instance | Produces a dict of metrics on the 20-pair test set | `python -m evaluation.evaluate --pipeline naive` runs to completion |
| 2.3 | `evaluation/metrics.py`: custom metrics — latency (ms), peak memory (MB), redirect accuracy (% pricing queries routed to Zalo message) | Callable; returns floats | Unit test on dummy response |
| 2.4 | `evaluation/run_experiments.py`: takes a YAML config (e.g. `experiments/configs/baseline.yaml`) specifying pipeline overrides; writes CSV to `experiments/results/{run_id}.csv` | Running the baseline config produces a CSV row | Inspect CSV |
| 2.5 | Run baseline experiment; log results as the "Baseline (Naive RAG)" row of the cumulative gains table (keep table in `experiments/results/cumulative_gains.csv` or markdown) | Baseline numbers captured | Row present in file |

**Checkpoint C** — Baseline RAGAS numbers exist. Team looks at faithfulness / context precision; if baseline is pathologically bad, revisit embedding model or prompt before proceeding.

---

### Phase 3 — HTTP API

Expose the pipeline over HTTP so the frontend can hit it.

| # | Task | Acceptance Criteria | Verify |
|---|------|---------------------|--------|
| 3.1 | `app/api/schemas.py`: `ChatRequest` (message, optional image, optional conversation_id, optional config), `ChatResponse` (response, sources, redirect_to_zalo, zalo_link, conversation_id, metadata) matching SPEC §8.1 | Pydantic models importable; JSON-serializable | pytest import test |
| 3.2 | `app/api/routes.py`: `POST /api/chat` — text-only path (multipart, image ignored for now), calls `RagPipeline`, returns `ChatResponse` | Curl with Vietnamese text → 200 JSON with grounded answer | `curl -X POST localhost:8000/api/chat -F "message=Phong bì A5 dùng giấy gì?"` |
| 3.3 | `GET /api/config` returns current `Settings`; `POST /api/config` accepts overrides for experiment runs (non-persistent) | Returns 200 with current settings dict | Curl |
| 3.4 | `POST /api/index/rebuild` triggers `indexer.py --rebuild` synchronously; returns collection size | Rebuilds; returns 200 | Curl |
| 3.5 | Wire routers into `main.py` | `/api/chat` shows in OpenAPI docs at `/docs` | Visit `http://localhost:8000/docs` |

**Checkpoint D** — End-to-end curl → grounded answer, all endpoints return well-formed JSON, OpenAPI docs render.

---

### Phase 4 — Frontend Chat Widget

The user-visible product. Can begin with mocked responses **during** Phase 1 if frontend person is free.

| # | Task | Acceptance Criteria | Verify |
|---|------|---------------------|--------|
| 4.1 | `frontend/types/chat.ts`: `ChatMessage`, `ChatApiRequest`, `ChatApiResponse`, `Source` types matching Phase 3.1 schemas | Types compile | `npm run build` |
| 4.2 | `frontend/services/chatApi.ts`: `sendMessage(req)` using native `fetch` (no axios). Reads `import.meta.env.VITE_API_BASE_URL` | Function round-trips; handles network errors via sonner toast | Manual |
| 4.3 | `frontend/components/chat/ChatWidget.tsx`: floating panel (400×500 desktop, full-screen mobile), uses shadcn `Dialog` or custom fixed panel + shadcn `ScrollArea`. Follows the `StickyContactButton` visual style (`bg-[#E62026]`, `fixed bottom-6 right-6`). Replaces `StickyContactButton` as the FAB. | FAB visible; clicking opens chat; message history scrollable; typing indicator shows during API call | Manual in browser |
| 4.4 | Wire `ChatWidget` into `App.tsx` (replaces `<StickyContactButton />` slot, or renders both — choose one; prefer replace so only one FAB on screen) | No duplicate FAB; existing pages unchanged | Manual |
| 4.5 | `frontend/.env.example`: `VITE_API_BASE_URL=http://localhost:8000` | File exists | Visual |
| 4.6 | Error + empty states: disconnected backend shows toast; empty input is disabled; image upload button exists but is **disabled with tooltip** "Đang phát triển" (re-enabled in Phase 7) | No console errors when backend is down | Kill backend, try to send |

**Checkpoint E** — User opens `localhost:3000`, clicks FAB, types a Vietnamese question, receives the grounded answer from the real backend. Source product names appear under the bot message.

---

### Phase 5 — Website Product Wiring (parallel with 1–4 after Phase 0)

This is a **full rewrite** of product display — not a refactor. Currently ProductsPage has 6 English category cards and ProductDetailPage has hardcoded product objects. Both must be rewritten to consume `data/products.json` via the Phase 0 schema.

| # | Task | Acceptance Criteria | Verify |
|---|------|---------------------|--------|
| 5.1 | `frontend/types/product.ts`: TypeScript mirror of the normalized products.json schema | Types compile; match Phase 0 shape | `npm run build` |
| 5.2 | `frontend/services/productData.ts`: `import products from '../../data/products.json'` + helpers `getByCategory(slug)`, `getById(id)`, `searchText(q)` | Returns typed data; Vite resolves JSON import (adjust `vite.config.ts` root/resolve if needed) | `npm run dev` + console.log |
| 5.3 | Rewrite `pages/ProductsPage.tsx`: render one card per category (from `data/categories.json`) + a product grid underneath. Add text search input + category filter dropdown. | All 19 products visible; filter narrows; search matches Vietnamese substrings | Manual |
| 5.4 | Rewrite `pages/ProductDetailPage.tsx`: consume `productData.getByCategory(slug)` or `getById(id)` — delete all hardcoded object literals | Detail pages render from JSON; no hardcoded copy remains | `grep -n "productData = {" frontend/pages/ProductDetailPage.tsx` returns nothing |
| 5.5 | Update `App.tsx` routing so navigation uses canonical slugs from `data/categories.json` (not the legacy English keys `boxes`/`notebooks`/etc.) | All Header/Footer/HomePage links work | Click through every nav link |
| 5.6 | `StickyContactButton.tsx` (if still mounted anywhere) or `ChatWidget`: replace `[YOUR_ZALO_OR_MESSENGER_LINK_HERE]` with real link from `import.meta.env.VITE_ZALO_LINK`; add to `.env.example` | Env-driven; no placeholder strings in source | Grep for `YOUR_` |
| 5.7 | Add `image_url` rendering via existing `components/figma/ImageWithFallback.tsx` with a graceful fallback to category placeholder | Broken image URLs don't break the page | Temporarily break one URL |

**Checkpoint F** — All 19 products visible, filterable, searchable on the site. No hardcoded product strings remain in `pages/`. Every in-site link resolves.

---

### Phase 6 — Advanced RAG (measured at each sub-step against Phase 2 harness)

Every sub-step adds one row to the cumulative gains table. **Order reflects correctness-before-performance**: intent routing (safety — pricing redirect) comes before HyDE (performance).

| # | Task | Acceptance Criteria | Verify |
|---|------|---------------------|--------|
| 6.1 | `app/rag/retrieval.py`: implement `BM25Retriever` using `rank_bm25`; build sparse index at startup from same documents | Standalone BM25 returns top-k for keyword-heavy queries (e.g., "A5 100gsm") | Unit test + RAGAS run |
| 6.2 | `HybridRetriever`: α-weighted merge of dense + BM25 (score normalization). Sweep α ∈ {0.0, 0.1, …, 1.0}, report optimal. | Best α recorded; Context Recall > baseline | RAGAS CSV; save α-sweep chart to `experiments/results/alpha_sweep.png` |
| 6.3 | `app/rag/reranking.py`: `CrossEncoderReranker` using `cross-encoder/ms-marco-MiniLM-L-6-v2` over top-N candidates | Context Precision improves vs Phase 6.2; latency delta ≤ +300ms | RAGAS row added |
| 6.4 | `app/rag/intent.py`: LLM-based intent classifier over {product, business, pricing, comparison, image, out-of-scope}. Pipeline routes: pricing → canned redirect (sets `redirect_to_zalo=True`, no retrieval); comparison → multi-retrieval; others → normal flow | Redirect accuracy on pricing queries = 100% in the test set | Run `evaluation/evaluate.py --pipeline intent-routed` |
| 6.5 | `app/rag/query_enhancement.py`: implement `HyDE` (LLM generates hypothetical answer; embed that instead of raw query). Gated behind `settings.use_query_enhancement`. Applies only to product/business intents (skip pricing, image) | Retrieval recall on vague-query subset improves; added latency reported | RAGAS row added with per-category breakdown |
| 6.6 | Restore `config.py` defaults (`retrieval_strategy="hybrid"`, `use_reranking=True`, `use_query_enhancement=True`) and ensure the pipeline still boots | `pytest tests/` passes; `curl /api/chat` still works | Integration run |

**Checkpoint G** — Cumulative gains table has rows for: Baseline, +Vietnamese embedding (if swapped during Exp 1 already), +Hybrid, +Rerank, +Intent routing, +HyDE. Each row measured on the same test set.

---

### Phase 7 — Multimodal (Image Input)

Adds a capability, not a quality tier. Depends on Phase 0.4 image plan and Phase 4 UI.

| # | Task | Acceptance Criteria | Verify |
|---|------|---------------------|--------|
| 7.1 | Populate `data/images/` with product reference photos (one or more per product, named `{product_id}.jpg` / `{product_id}-2.jpg`) — replaces Phase 0 placeholders with real photos where available | ≥ 1 image per product | `ls \| wc` |
| 7.2 | `app/multimodal/image_matching.py`: load CLIP model (`open_clip`, config via `settings.clip_model` / `settings.clip_pretrained`); precompute and persist product image embeddings (e.g., to `.cache/clip_index.npy`); expose `match(image_bytes, top_k=3) -> [(product_id, score)]` | Precompute is one-time; query returns top-3 with scores in [-1, 1] | Script invocation |
| 7.3 | Threshold-based fallback: if top-1 score < `settings.image_match_threshold`, return graceful Vietnamese apology | Irrelevant image → "Xin lỗi, tôi không nhận diện được sản phẩm trong ảnh này." | Pass an unrelated image |
| 7.4 | `POST /api/chat` multipart: accept `image` file; if present, route to image-matching path; feed matched product IDs into the RAG context for description generation | Multipart request with image returns matched products + description | Curl with `-F "image=@sample.jpg"` |
| 7.5 | Frontend `ChatWidget`: enable image upload button (preview + send as `FormData`); show matched product chips under the bot response | Upload works on desktop + mobile; preview displays before send | Manual, both browsers |
| 7.6 | Image-match evaluation subset: 20 test images with known product IDs; record top-1 and top-3 accuracy | Top-3 accuracy > 70% (SPEC target) | `python -m evaluation.evaluate_images` |

**Checkpoint H** — End-to-end image query works; image eval metrics recorded; table has a multimodal row.

---

### Phase 8 — Systematic Experiments

All experiments run through the Phase 2 harness using YAML configs. Each experiment produces a CSV + a chart.

| # | Experiment | Variable | Output |
|---|-----------|----------|--------|
| 8.1 | Experiment 1 (SPEC §5.1) | Embedding model — 4 candidates | Retrieval P@k / R@k / MRR / NDCG / latency table + chart |
| 8.2 | Experiment 3 (§5.3) | Retrieval strategy (dense/BM25/hybrid/hybrid+rerank/metadata-filter) | RAGAS table |
| 8.3 | Experiment 2 (§5.2) | LLM — Gemini 1.5/2.0 Flash, Llama 3.1 8B, Qwen2.5 7B, Vistral 7B | RAGAS + latency + memory |
| 8.4 | Experiment 5 (§5.5) | Query enhancement (none / HyDE / rewrite / expand) | Recall delta, per-query-category breakdown |
| 8.5 | Experiment 4 (§5.4) | Chunking (document / field / augmented / overlap) | RAGAS |
| 8.6 | Experiment 6 (§5.6) | Architectures A/B/C end-to-end | Full RAGAS + latency + memory + human eval (3 members × 20 responses each) |
| 8.7 | Consolidate: cumulative-gains line chart, Pareto plots (accuracy vs. latency, accuracy vs. memory), trade-off writeup | Chart files in `experiments/results/figures/` ready for report | Inspect |

**Checkpoint I** — All experiment CSVs present; cumulative gains table fully populated; ready for report writing.

---

### Phase 9 — Ship

| # | Task | Acceptance Criteria | Verify |
|---|------|---------------------|--------|
| 9.1 | LaTeX report under `report/`: chapters for intro, related work, system, data, experiments, results, discussion, conclusion; cites all 8 SPEC references in `references.bib` | `pdflatex main.tex` builds | Build |
| 9.2 | Slide deck under `docs/presentation/` | Covers architecture, experiment highlights, cumulative gains chart, demo video | Review |
| 9.3 | Polish: mobile chat widget, accessibility (focus trap in dialog, keyboard send, ARIA labels), error toasts, empty-state copy, latency spinners | Lighthouse ≥ 90 for accessibility on product pages; keyboard-only walkthrough works | Lighthouse + manual |
| 9.4 | Deploy: backend to Railway/Render free tier or uni server (decided Open Q #4); frontend to Vercel with `VITE_API_BASE_URL` pointing at the deployed backend | Public URL serves chat with a real query | Open in incognito |
| 9.5 | Final rehearsal + submission bundle (PDF report, slides, GitHub link) | Archive ready | Submit |

**Checkpoint J** — Final submission.

---

## Cross-cutting Technical Notes

These apply to every phase and are easy to get wrong:

- **Indexing idempotency**: `indexer.py` must always accept `--rebuild` and drop the ChromaDB collection before re-inserting. Without this, experiments produce duplicated retrieval candidates. (Phase 1.1)
- **Fetch, not axios**: One endpoint doesn't justify a new dependency. Use native `fetch` in `services/chatApi.ts`. (Phase 4.2)
- **CPU-only torch**: At least one teammate will have CUDA issues. Documented install path from Phase 0.6 saves a day. (Phase 0.6)
- **Config override for experiments**: Experiments change pipeline behavior via `POST /api/config` (non-persistent, in-memory override) OR via the YAML runner directly instantiating a `RagPipeline` with per-run overrides. Don't mutate the global `settings` singleton — thread a `RagPipelineConfig` dataclass through `RagPipeline.__init__` instead. (Phase 1.5, 2.4)
- **Vietnamese-only output enforcement**: The Gemini system prompt must explicitly forbid English replies and reinforce "never invent prices — redirect to Zalo". This prompt lives once in `generation.py`. (Phase 1.4)
- **Reproducibility**: Every experiment run writes the full `RagPipelineConfig` + git SHA + timestamp into the result CSV header. Enables exact replay. (Phase 2.4)
- **Memory budget for free-tier deploy**: CLIP + a local LLM + embedding model + ChromaDB exceeds 512MB. If Open Question #4 resolves to a free tier, the deployed config must use Gemini API (no local LLM) and lazy-load CLIP only on image routes.

---

## Critical Files to Create or Modify

Backend:
- `backend/app/indexing/indexer.py` (new)
- `backend/app/rag/{embeddings,retrieval,reranking,generation,query_enhancement,intent,pipeline,chunking}.py` (all currently 0-LOC)
- `backend/app/api/{routes,schemas}.py` (both 0-LOC)
- `backend/app/multimodal/image_matching.py` (0-LOC)
- `backend/app/main.py` (add router wiring)
- `backend/app/config.py` (temporary default flip in Phase 0.5, restored in Phase 6.6)
- `backend/evaluation/{evaluate,metrics,run_experiments}.py` (all 0-LOC)
- `backend/evaluation/test_set.json` (new)
- `backend/experiments/configs/*.yaml` (new per experiment)
- `backend/experiments/results/*.csv` (generated)

Frontend:
- `frontend/types/{chat,product}.ts` (new)
- `frontend/services/{chatApi,productData}.ts` (new)
- `frontend/components/chat/ChatWidget.tsx` (new)
- `frontend/pages/ProductsPage.tsx` (rewrite)
- `frontend/pages/ProductDetailPage.tsx` (rewrite)
- `frontend/App.tsx` (wire ChatWidget; adjust routing slugs)
- `frontend/components/StickyContactButton.tsx` (replaced by ChatWidget or retired)
- `frontend/.env.example` (new)

Data:
- `data/products.json` (normalize)
- `data/business.json` (normalize + fill contact)
- `data/categories.json` (new — canonical category list)
- `data/images/` (populate)

Docs:
- `SPEC.md` (possibly reconcile 19 vs 23 count)
- `backend/README.md` (CPU torch + run instructions)
- `README.md` (deploy instructions after Phase 9)

---

## End-to-end Verification (at project close)

1. `npm run dev` (frontend) + `uvicorn app.main:app --reload` (backend) — both start clean.
2. `python -m app.indexing.indexer --rebuild` — indexes 24 docs in < 60s.
3. Open `http://localhost:3000`:
   - Click through Header / Footer / HomePage links — no broken routes.
   - ProductsPage shows all 19 products; category filter narrows to correct subset; text search matches Vietnamese substrings.
   - ProductDetailPage for each category renders from JSON (no English hardcoded IDs in the URL or data).
4. Click the floating FAB → ChatWidget opens.
5. Type: "Phong bì A5 dùng giấy gì?" → grounded Vietnamese answer with Phong bì A5 in sources.
6. Type: "Giá in 1000 tờ rơi là bao nhiêu?" → redirect to Zalo message (no price hallucination).
7. Upload a product photo → top-3 matched products appear with short descriptions.
8. `python -m evaluation.evaluate --pipeline agentic` — RAGAS faithfulness > 0.85, answer relevancy > 0.80, context precision > 0.85 (SPEC §1 targets).
9. `cat experiments/results/cumulative_gains.csv` — 7 rows filled (baseline + 6 stages).
10. `cd report && pdflatex main.tex` — produces the PDF.
