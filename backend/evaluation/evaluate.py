"""
RAGAS evaluation runner for Innt RAG pipeline.

Metrics:
- faithfulness: Does the answer stay true to the retrieved context?
- answer_relevancy: Is the answer relevant to the query?
- context_precision: How many of the retrieved docs are actually relevant?
- context_recall: How many relevant docs were successfully retrieved?
"""

import json
import sys
import time
import os
from pathlib import Path
from typing import Any, Dict, List

import pandas as pd
from ragas import evaluate, RunConfig
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_precision,
    context_recall,
)
from datasets import Dataset

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.rag.pipeline import RagPipeline


def load_test_set(test_set_path: Path) -> List[Dict[str, Any]]:
    """Load test_set.json."""
    with open(test_set_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data["test_cases"]


def prepare_ragas_dataset(
    predictions: List[Dict[str, Any]],
) -> Dataset:
    """
    Convert predictions to RAGAS-compatible Dataset (RAGAS 0.4.x API).

    Each SingleTurnSample needs:
    - user_input: str
    - response: str
    - retrieved_contexts: List[str]
    - reference: str  (ground truth answer — NOT passage IDs)
    """
    return Dataset.from_dict({
        "user_input": [p["query"] for p in predictions],
        "response": [p["answer"] for p in predictions],
        "retrieved_contexts": [p["contexts"] for p in predictions],
        "reference": [p["ground_truth"] for p in predictions],
    })


def run_evaluation(
    test_set_path: Path,
    pipeline_config: dict = None,
    limit: int = None,
) -> pd.DataFrame:
    """
    Run RAGAS evaluation on test set.

    Args:
        test_set_path: Path to test_set.json
        pipeline_config: Optional dict from experiment YAML to override pipeline defaults
        limit: Optional max number of test cases to run (for quick testing)

    Returns:
        DataFrame with results per query
    """
    # Load test set
    test_cases = load_test_set(test_set_path)
    if limit:
        test_cases = test_cases[:limit]
    print(f"Loaded {len(test_cases)} test cases from {test_set_path}")

    # Initialize pipeline — apply overrides from experiment config if provided
    cfg = pipeline_config or {}
    pipeline = RagPipeline(
        top_k=cfg.get("top_k"),
        retrieval_strategy=cfg.get("retrieval_strategy"),
        use_reranking=cfg.get("use_reranking"),
        use_query_enhancement=cfg.get("use_query_enhancement"),
        query_enhancement_method=cfg.get("query_enhancement_method"),
        hybrid_alpha=cfg.get("hybrid_alpha"),
        llm_model=cfg.get("llm_model"),
        llm_provider=cfg.get("llm_provider"),
    )
    print(f"Initialized RAG pipeline (top_k={pipeline.top_k}, strategy={pipeline.retrieval_strategy}, rerank={pipeline.use_reranking}, enhance={pipeline.use_query_enhancement})")
    
    predictions = []
    print("\n--- Running queries ---")
    for i, test_case in enumerate(test_cases):
        query_id = test_case["id"]
        query = test_case["query"]
        ground_truth = test_case["ground_truth"]
        
        print(f"[{i+1}/{len(test_cases)}] {query_id}: {query[:60]}...")
        
        try:
            # Run query with timing
            start_time = time.time()
            result = pipeline.query(query)
            latency_ms = (time.time() - start_time) * 1000
            
            # Extract answer and contexts from result dict
            # NOTE: pipeline.query() returns the answer under "response" (matches ChatResponse schema)
            answer = result.get("response", result.get("answer", ""))
            # Use actual document text (not source names) so RAGAS can verify claims.
            # Truncate each context to avoid single-prompt token limit on faithfulness/context_precision.
            _MAX = 800
            contexts = [c[:_MAX] for c in result.get("retrieved_contents", [])]
            
            predictions.append({
                "query_id": query_id,
                "query": query,
                "category": test_case.get("category", "unknown"),
                "query_type": test_case.get("query_type", "unknown"),
                "answer": answer,
                "contexts": contexts,
                "ground_truth": ground_truth,
                "relevant_passages": test_case.get("relevant_passages", []),
                "latency_ms": latency_ms,
            })
        except Exception as e:
            print(f"  ERROR: {e}")
            predictions.append({
                "query_id": query_id,
                "query": query,
                "category": test_case.get("category", "unknown"),
                "query_type": test_case.get("query_type", "unknown"),
                "answer": f"ERROR: {str(e)}",
                "contexts": [],
                "ground_truth": ground_truth,
                "relevant_passages": test_case.get("relevant_passages", []),
                "latency_ms": -1,
            })
    
    print(f"\n--- Running RAGAS metrics on {len(predictions)} predictions ---")

    # Allow nested event loops in script context (fixes "coroutine was never awaited" in RAGAS executor)
    import nest_asyncio as _nest
    _nest.apply()
    
    # Initialize Gemini LLM for RAGAS (new google.genai approach)
    from app.config import settings
    
    if not settings.gemini_api_key:
        raise ValueError("RAG_GEMINI_API_KEY not set in .env")
    
    # Set API key in environment
    os.environ["GOOGLE_API_KEY"] = settings.gemini_api_key

    # RAGAS 0.4.3 uses InstructorLLM internally (not LangchainLLMWrapper).
    # Metrics call llm.agenerate(prompt, response_model) — LangchainLLMWrapper is missing this method,
    # causing "coroutine never awaited" + TimeoutError. llm_factory returns proper InstructorLLM.
    # AsyncOpenAI ensures the async path works correctly end-to-end.
    from openai import AsyncOpenAI as _AsyncOpenAI
    from ragas.llms import llm_factory
    _async_client = _AsyncOpenAI(
        api_key=settings.gemini_api_key,
        base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
        timeout=350.0,
    )
    # max_tokens=4096: InstructorModelArgs defaults to 1024 — too low for faithfulness JSON statements.
    # Passed via **kwargs → merged into InstructorLLM.model_args → forwarded in agenerate().
    ragas_llm = llm_factory("gemini-2.5-flash-lite", client=_async_client, max_tokens=4096)
    # Note: instructor's default max_retries=1 in create() — no patching needed.
    # Earlier patch caused "got multiple values for keyword argument 'max_retries'" conflict.

    # Local embeddings via sentence-transformers (no API quota).
    # Simple duck-typing wrapper: RAGAS only calls embed_query / embed_documents.
    from sentence_transformers import SentenceTransformer as _ST
    _st_model = _ST("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")

    class _LocalEmbeddings:
        def embed_query(self, text: str) -> list:
            return _st_model.encode(text, convert_to_numpy=True).tolist()
        def embed_documents(self, texts: list) -> list:
            return _st_model.encode(texts, convert_to_numpy=True).tolist()

    ragas_embeddings = _LocalEmbeddings()

    # Prepare dataset for RAGAS
    dataset = prepare_ragas_dataset(predictions)

    # timeout=600s: wraps the ENTIRE metric evaluation (faithfulness can make 10+ sub-LLM-calls
    # for statement extraction + per-statement NLI verification). 300s was too tight for long answers.
    # asyncio.wait_for(timeout=N) at ragas/metrics/base.py:481 is the source of TimeoutError.
    run_config = RunConfig(timeout=600, max_retries=2, max_wait=30, max_workers=5)

    # Run evaluation — pass embeddings explicitly to prevent RAGAS from auto-creating GoogleEmbeddings
    results = evaluate(
        dataset=dataset,
        metrics=[
            faithfulness,
            answer_relevancy,
            context_precision,
            context_recall,
        ],
        llm=ragas_llm,
        embeddings=ragas_embeddings,
        run_config=run_config,
    )
    
    # Convert RAGAS results to DataFrame
    df_ragas = results.to_pandas()
    
    # Merge with predictions metadata
    df_meta = pd.DataFrame(predictions)
    df_results = df_meta.merge(
        df_ragas,
        left_index=True,
        right_index=True,
    )
    
    # Reorder columns for readability
    column_order = [
        "query_id",
        "query",
        "category",
        "query_type",
        "answer",
        "contexts",
        "ground_truth",
        "faithfulness",
        "answer_relevancy",
        "context_precision",
        "context_recall",
        "latency_ms",
    ]
    df_results = df_results[[col for col in column_order if col in df_results.columns]]
    
    return df_results


def print_summary(df: pd.DataFrame) -> None:
    """Print evaluation summary."""
    print("\n" + "="*80)
    print("EVALUATION SUMMARY")
    print("="*80)
    
    # Overall metrics
    metrics = ["faithfulness", "answer_relevancy", "context_precision", "context_recall"]
    print("\nOverall Metrics:")
    for metric in metrics:
        if metric in df.columns:
            mean = df[metric].mean()
            std = df[metric].std()
            print(f"  {metric:.<30} {mean:.4f} ± {std:.4f}")
    
    # By category
    if "category" in df.columns:
        print("\nMetrics by Category:")
        for category in df["category"].unique():
            df_cat = df[df["category"] == category]
            print(f"\n  {category} ({len(df_cat)} queries):")
            for metric in metrics:
                if metric in df.columns:
                    mean = df_cat[metric].mean()
                    print(f"    {metric:.<25} {mean:.4f}")
    
    # By query type
    if "query_type" in df.columns:
        print("\nMetrics by Query Type:")
        for qtype in df["query_type"].unique():
            df_type = df[df["query_type"] == qtype]
            print(f"\n  {qtype} ({len(df_type)} queries):")
            for metric in metrics:
                if metric in df.columns:
                    mean = df_type[metric].mean()
                    print(f"    {metric:.<25} {mean:.4f}")
    
    print("\n" + "="*80)


if __name__ == "__main__":
    # Paths
    test_set_path = Path(__file__).parent / "test_set.json"
    output_csv = Path(__file__).parent / "results.csv"
    
    # Run evaluation
    df_results = run_evaluation(test_set_path)
    
    # Save to CSV
    df_results.to_csv(output_csv, index=False)
    print(f"\nResults saved to {output_csv}")
    
    # Print summary
    print_summary(df_results)
