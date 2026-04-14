# CLAUDE.md — Project Context for Claude Code

## Project Overview

**Innt** (innt.vn) is a corporate website for Cong ty TNHH In N&T, a printing and packaging company in Hanoi, Vietnam. The project has two tracks:

1. **Website** — React SPA showcasing products and company info (existing, needs completion)
2. **RAG Chatbot** — NLP university project building a Retrieval-Augmented Generation chatbot embedded in the website (to be built)

Full specification: `SPEC.md`

## Project Structure

```
├── frontend/               # Frontend (React + Vite + TypeScript)
│   ├── components/
│   │   ├── ui/             #   shadcn/ui primitives (~50 files)
│   │   ├── chat/           #   Chat widget (to build)
│   │   └── *.tsx           #   Header, Footer, ProductCard, etc.
│   ├── pages/              #   Home, About, Products, ProductDetail, Process, Contact
│   ├── services/           #   API clients (to build)
│   └── types/              #   TypeScript types (to build)
├── backend/                # Python backend (FastAPI)
│   ├── app/
│   │   ├── api/            #   REST endpoints
│   │   ├── rag/            #   RAG pipeline (embeddings, retrieval, generation)
│   │   ├── multimodal/     #   CLIP image matching
│   │   └── indexing/       #   Document indexing into vector store
│   ├── evaluation/         #   RAGAS metrics + experiment runner
│   └── experiments/        #   Configs (YAML) and results (CSV/JSON)
├── data/                   # Shared knowledge base (source of truth)
│   ├── products.json       #   23 products with embedding_data + metadata
│   ├── business.json       #   5 company info documents
│   └── images/             #   Product reference images (for CLIP)
├── report/                 # LaTeX report
└── docs/                   # Presentation slides
```

## Tech Stack

### Frontend (existing)
- React 18 + TypeScript + Vite (SWC)
- Tailwind CSS + Radix UI (shadcn/ui components)
- Deployed on Vercel
- Dev server: `npm run dev` (port 3000)
- Build: `npm run build` (outputs to `/build`)

### Backend
- Python 3.11+ / FastAPI
- ChromaDB (vector store)
- Ollama (local LLM serving) + Google AI Studio (Gemini free tier)
- CLIP (image-to-product matching)
- Config via environment variables with `RAG_` prefix (see `backend/.env.example`)

## Commands

```bash
# Frontend
npm run dev                    # Dev server at http://localhost:3000
npm run build                  # Production build to /build

# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Docker (both services)
docker compose up
```

## Key Files

| File | Purpose |
|------|---------|
| `SPEC.md` | Full project specification — architecture, experiments, timeline |
| `data/products.json` | 23 printing products with embedding_data + metadata (Vietnamese) |
| `data/business.json` | 5 company info documents (Vietnamese) |
| `backend/app/config.py` | All RAG pipeline settings (embedding model, LLM, retrieval strategy) |
| `backend/app/rag/pipeline.py` | RAG orchestrator — configurable for experiments |
| `frontend/App.tsx` | Frontend root — client-side SPA routing |

## Conventions

- All user-facing content is **Vietnamese only**
- Brand primary color: `#E62026` (red)
- Images hosted on Cloudinary (URLs to be added to `data/products.json`)
- No pricing information in the codebase — redirect users to Zalo for quotes
- Environment variables: `VITE_` prefix for frontend, `RAG_` prefix for backend
- Python style: type hints, async where appropriate

## Boundaries

- Never commit API keys or `.env` files
- Never display or hardcode pricing information
- Never modify product data without checking `data/products.json` as source of truth
- Keep RAG pipeline modular — each component (embedding, retrieval, generation) must be independently swappable for experiments
