"""FastAPI application entry point for the RAG chatbot backend."""

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as api_router

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Innt RAG Chatbot API",
    description="RAG-driven chatbot for product catalog consultation (Phase 1+)",
    version="0.1.0",
    openapi_url="/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware to allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Vite default
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router)


@app.on_event("startup")
async def startup():
    """Initialize on startup."""
    logger.info("🚀 Innt RAG Chatbot API starting...")
    logger.info("📚 To rebuild the index, run: POST /api/index/rebuild")
    logger.info("📖 API docs available at: /docs")


@app.on_event("shutdown")
async def shutdown():
    """Cleanup on shutdown."""
    logger.info("🛑 Innt RAG Chatbot API shutting down...")

