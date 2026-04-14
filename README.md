# RAG-Driven Chatbot for Product Catalogs Website

A conversational chatbot using Retrieval-Augmented Generation (RAG) to deliver accurate product consultations for [innt.vn](https://innt.vn) — a printing and packaging company based in Hanoi, Vietnam.

**Course**: Natural Language Processing (University Project)
**Team**: 5 members

## Project Goals

1. Build a multimodal RAG chatbot (text + image input) embedded in the company website
2. Compare RAG configurations through systematic experiments (embeddings, retrieval strategies, LLMs, chunking, query enhancement)
3. Measure improvements using RAGAS evaluation metrics and custom benchmarks

## Architecture

```
Frontend (React + Vite)          Backend (Python + FastAPI)
┌──────────────────┐             ┌──────────────────────────┐
│  Chat Widget     │────────────▶│  RAG Pipeline            │
│  (Text + Image)  │  POST /api  │  ┌─────────────────────┐ │
│                  │◀────────────│  │ Query Enhancement    │ │
│  Product Pages   │    JSON     │  │ Hybrid Search        │ │
│  About / Contact │             │  │ Re-ranking           │ │
└──────────────────┘             │  │ LLM Generation       │ │
                                 │  └─────────────────────┘ │
                                 │  ChromaDB  │  CLIP       │
                                 └────────────┴─────────────┘
```

Three RAG architectures compared progressively:
- **Naive RAG** — baseline (embed → search → generate)
- **Advanced RAG** — hybrid search + re-ranking + HyDE query enhancement
- **Agentic RAG** — intent routing + category-aware retrieval + multi-step reasoning

See `SPEC.md` for full specification.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Radix UI |
| Backend | Python 3.11+, FastAPI |
| Vector Store | ChromaDB |
| Embeddings | Vietnamese-specific (BKAI, dangvantuan) + multilingual (E5, MiniLM) |
| LLMs | Gemini Flash (free API), Llama 3.1, Qwen2.5, Vistral (Ollama) |
| Image Matching | CLIP (ViT-B/32) |
| Evaluation | RAGAS + custom metrics |
| Deployment | Vercel (frontend), Local/Railway (backend) |

## Getting Started

### Frontend

```bash
npm install
npm run dev        # http://localhost:3000
```

### Backend (to be set up)

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Project Structure

```
├── src/                    # Frontend (React SPA)
│   ├── components/         # UI components (chat widget, product cards, etc.)
│   └── pages/              # Home, About, Products, ProductDetail, Process, Contact
├── backend/                # Python backend (to be built)
│   ├── app/                # FastAPI application
│   │   ├── rag/            # RAG pipeline (embeddings, retrieval, generation)
│   │   └── multimodal/     # CLIP image-to-product matching
│   └── evaluation/         # RAGAS evaluation & experiment runner
├── report/                 # LaTeX report
├── products.json           # Product catalog (23 products, Vietnamese)
├── business.json           # Company information (5 documents, Vietnamese)
└── SPEC.md                 # Full project specification
```

## Data

- **products.json** — 23 printing products across 7 categories (envelopes, flyers, folded materials, paper bags, labels, forms, business cards)
- **business.json** — 5 company documents (overview, production capability, delivery timeline, key clients, contact info)

All content is in Vietnamese. Pricing is intentionally excluded (business-sensitive — users are redirected to Zalo for quotes).

## Experiments

| Experiment | Variables |
|-----------|----------|
| Embedding Models | BKAI vietnamese-bi-encoder, multilingual-e5, MiniLM, dangvantuan |
| LLMs | Gemini Flash, Llama 3.1 8B, Qwen2.5 7B, Vistral-7B |
| Retrieval | Dense, BM25, Hybrid, Hybrid + Re-rank, Metadata-filtered |
| Chunking | Document-level, Field-level, Augmented, Overlapping |
| Query Enhancement | None, HyDE, Query Rewriting, Query Expansion |
| Architecture | Naive RAG, Advanced RAG, Agentic RAG |

## References

1. Lewis et al. "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks." NeurIPS 2020.
2. Gao et al. "Precise Zero-Shot Dense Retrieval without Relevance Labels" (HyDE). ACL 2023.
3. Robertson & Zaragoza. "The Probabilistic Relevance Framework: BM25 and Beyond." 2009.
4. Nogueira & Cho. "Passage Re-ranking with BERT." 2019.
5. Gao et al. "Retrieval-Augmented Generation for Large Language Models: A Survey." 2023.
6. Asai et al. "Self-RAG: Learning to Retrieve, Generate, and Critique." NeurIPS 2023.
7. Radford et al. "Learning Transferable Visual Models From Natural Language Supervision" (CLIP). ICML 2021.
8. Es et al. "RAGAS: Automated Evaluation of Retrieval Augmented Generation." 2023.
