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
from ragas import evaluate
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_precision,
    context_recall,
)
from ragas.llms import llm_factory
from google import genai
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
    Convert predictions to RAGAS-compatible Dataset.
    
    Each sample needs:
    - question: str
    - answer: str
    - contexts: List[str]
    - ground_truths: List[str]
    - reference: List[str]  (for context_precision, context_recall)
    """
    samples = []
    for pred in predictions:
        samples.append({
            "question": pred["query"],
            "answer": pred["answer"],
            "contexts": pred["contexts"],
            "ground_truths": [pred["ground_truth"]],  # RAGAS expects list
            "reference": pred.get("relevant_passages", []),  # For context metrics
        })
    return Dataset.from_dict({
        "question": [s["question"] for s in samples],
        "answer": [s["answer"] for s in samples],
        "contexts": [s["contexts"] for s in samples],
        "ground_truths": [s["ground_truths"] for s in samples],
        "reference": [s["reference"] for s in samples],
    })


def run_evaluation(
    test_set_path: Path,
) -> pd.DataFrame:
    """
    Run RAGAS evaluation on test set.
    
    Args:
        test_set_path: Path to test_set.json
        
    Returns:
        DataFrame with results per query
    """
    # Load test set
    test_cases = load_test_set(test_set_path)
    print(f"Loaded {len(test_cases)} test cases from {test_set_path}")
    
    # Initialize pipeline
    pipeline = RagPipeline()
    print(f"Initialized RAG pipeline")
    
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
            sources = result.get("sources", [])
            
            # contexts are the source document names
            contexts = sources if sources else []
            
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
    
    # Initialize Gemini LLM for RAGAS (new google.genai approach)
    from app.config import settings
    
    if not settings.gemini_api_key:
        raise ValueError("RAG_GEMINI_API_KEY not set in .env")
    
    # Set API key in environment
    os.environ["GOOGLE_API_KEY"] = settings.gemini_api_key
    
    # Create Gemini client
    client = genai.Client(api_key=settings.gemini_api_key)
    
    # Create LLM adapter for RAGAS
    ragas_llm = llm_factory(
        settings.gemini_model,
        provider="google",
        client=client
    )
    
    # Prepare dataset for RAGAS
    dataset = prepare_ragas_dataset(predictions)
    
    # Run evaluation with Gemini LLM
    results = evaluate(
        dataset=dataset,
        metrics=[
            faithfulness,
            answer_relevancy,
            context_precision,
            context_recall,
        ],
        llm=ragas_llm,
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
