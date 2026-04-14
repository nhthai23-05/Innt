# CLAUDE.md — Project Context for Claude Code

## Project Overview

**Innt** (innt.vn) is a corporate website for Cong ty TNHH In N&T, a printing and packaging company in Hanoi, Vietnam. The project has two tracks:

1. **Website** — React SPA showcasing products and company info (existing, needs completion)
2. **RAG Chatbot** — NLP university project building a Retrieval-Augmented Generation chatbot embedded in the website (to be built)

Full specification: `SPEC.md`

## Tech Stack

### Frontend (existing)
- React 18 + TypeScript + Vite (SWC)
- Tailwind CSS + Radix UI (shadcn/ui components)
- Deployed on Vercel
- Dev server: `npm run dev` (port 3000)
- Build: `npm run build` (outputs to `/build`)

### Backend (to be built)
- Python 3.11+ / FastAPI
- ChromaDB (vector store)
- Ollama (local LLM serving) + Google AI Studio (Gemini free tier)
- CLIP (image-to-product matching)

## Key Files

| File | Purpose |
|------|---------|
| `SPEC.md` | Full project specification — architecture, experiments, timeline |
| `products.json` | 23 printing products with embedding_data + metadata (Vietnamese) |
| `business.json` | 5 company info documents (Vietnamese) |
| `src/App.tsx` | Frontend root — client-side SPA routing |
| `src/pages/` | 6 pages: Home, About, Products, ProductDetail, Process, Contact |
| `src/components/ui/` | 50+ shadcn/ui components |

## Commands

```bash
npm run dev          # Start frontend dev server (port 3000)
npm run build        # Production build to /build
```

## Conventions

- All user-facing content is **Vietnamese only**
- Brand primary color: `#E62026` (red)
- Images hosted on Cloudinary (URLs to be added to JSON files)
- No pricing information in the codebase — redirect users to Zalo for quotes
- Environment variables prefixed with `VITE_` for frontend

## Architecture Notes

- Frontend is a single-page app with manual routing (no react-router) — see `App.tsx`
- No backend exists yet — the `backend/` directory and Python stack are part of the RAG chatbot work
- `products.json` and `business.json` are the single source of truth for all product/company data
- The JSON files have `embedding_data` fields designed for RAG indexing

## Boundaries

- Never commit API keys or `.env` files
- Never display or hardcode pricing information
- Never modify product data without checking `products.json` as source of truth
- Keep RAG pipeline modular — each component (embedding, retrieval, generation) must be independently swappable for experiments
