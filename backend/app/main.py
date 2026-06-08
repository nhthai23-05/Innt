"""FastAPI application entry point for the RAG chatbot backend."""

import logging
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as api_router

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup/shutdown lifecycle (replaces deprecated @app.on_event)."""
    logger.info("🚀 Innt RAG Chatbot API starting...")
    logger.info("📚 To rebuild the index, run: POST /api/index/rebuild")
    logger.info("📖 API docs available at: /docs")
    yield
    logger.info("🛑 Innt RAG Chatbot API shutting down...")


app = FastAPI(
    title="Innt RAG Chatbot API",
    description="RAG-driven chatbot for product catalog consultation (Phase 1+)",
    version="0.1.0",
    openapi_url="/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS — origins from env var (comma-separated) with localhost fallback for dev
_raw_origins = os.getenv(
    "CORS_ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:5173",
)
_allowed_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router)

