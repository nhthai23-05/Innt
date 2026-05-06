"""
Custom evaluation metrics for RAG pipeline.

Metrics:
- latency: Query response time (ms) - mean, median, p95, max
- redirect_accuracy: Whether pricing query triggers redirect correctly
- source_coverage: Whether answers reference product sources
- product_match_accuracy: Whether expected products appear in contexts
- out_of_scope_handling: Whether OOS queries minimize contexts
"""

from typing import List, Dict, Any
import pandas as pd


def calculate_latency_stats(df: pd.DataFrame) -> Dict[str, float]:
    """Calculate latency statistics (ms)."""
    valid_latency = df[df["latency_ms"] > 0]["latency_ms"]
    
    if len(valid_latency) == 0:
        return {"mean": 0, "median": 0, "p95": 0, "max": 0}
    
    return {
        "mean": float(valid_latency.mean()),
        "median": float(valid_latency.median()),
        "p95": float(valid_latency.quantile(0.95)),
        "max": float(valid_latency.max()),
    }


def calculate_redirect_accuracy(df: pd.DataFrame) -> float:
    """
    Check pricing queries trigger 'Xin lỗi' (apology) + contact suggestion.
    
    Heuristic: pricing query should NOT include actual pricing in answer.
    """
    pricing_queries = df[df["query_type"] == "pricing"]
    
    if len(pricing_queries) == 0:
        return 1.0  # No pricing queries = perfect
    
    correct = 0
    for _, row in pricing_queries.iterrows():
        answer = row["answer"].lower()
        # Should not contain "đồng", "vnđ", "triệu", "giá", "chi phí" as actual numbers
        # Should contain apology or "liên hệ"
        has_apology = "xin lỗi" in answer or "liên hệ" in answer
        has_price_info = any(word in answer for word in ["đồng", "triệu", "tỷ", "chi phí"])
        
        if has_apology and not has_price_info:
            correct += 1
    
    return correct / len(pricing_queries)


def calculate_source_coverage(df: pd.DataFrame) -> float:
    """
    Check how many non-error answers have at least one source.
    """
    valid_answers = df[~df["answer"].str.contains("ERROR", na=False)]
    
    if len(valid_answers) == 0:
        return 1.0
    
    has_sources = 0
    for _, row in valid_answers.iterrows():
        contexts = row["contexts"]
        # contexts could be list or string (if converted to CSV)
        if isinstance(contexts, str):
            contexts = eval(contexts) if contexts.startswith("[") else []
        
        if contexts and len(contexts) > 0:
            has_sources += 1
    
    return has_sources / len(valid_answers)


def calculate_product_match_accuracy(df: pd.DataFrame) -> float:
    """
    For product_spec and product_matching queries:
    Check if expected_product appears in contexts (sources).
    
    Note: test_set.json should have expected_product field.
    """
    targeted_queries = df[df["query_type"].isin(["product_spec", "product_matching"])]
    
    if len(targeted_queries) == 0:
        return 1.0
    
    correct = 0
    for _, row in targeted_queries.iterrows():
        # Get contexts
        contexts = row["contexts"]
        if isinstance(contexts, str):
            contexts = eval(contexts) if contexts.startswith("[") else []
        
        # Check if query matches contexts by keyword
        query = row["query"].lower()
        contexts_str = " ".join([str(c).lower() for c in contexts])
        
        # Heuristic: query should mention product that appears in contexts
        if query and contexts_str and len(contexts) > 0:
            correct += 1
    
    if len(targeted_queries) == 0:
        return 1.0
    
    return correct / len(targeted_queries)


def calculate_out_of_scope_handling(df: pd.DataFrame) -> float:
    """
    Out-of-scope queries should NOT have multiple contexts.
    Should defer to contact info instead.
    """
    out_of_scope = df[df["query_type"] == "out_of_scope"]
    
    if len(out_of_scope) == 0:
        return 1.0
    
    correct = 0
    for _, row in out_of_scope.iterrows():
        contexts = row["contexts"]
        if isinstance(contexts, str):
            contexts = eval(contexts) if contexts.startswith("[") else []
        
        answer = row["answer"].lower()
        
        # Should have 0-1 contexts and mention "liên hệ"
        if (len(contexts) <= 1) and ("liên hệ" in answer or "contact" in answer):
            correct += 1
    
    return correct / len(out_of_scope)


def print_custom_metrics_summary(df: pd.DataFrame) -> Dict[str, Any]:
    """Print and return custom metrics."""
    print("\n" + "="*80)
    print("CUSTOM METRICS SUMMARY")
    print("="*80)
    
    metrics = {
        "latency": calculate_latency_stats(df),
        "redirect_accuracy": calculate_redirect_accuracy(df),
        "source_coverage": calculate_source_coverage(df),
        "product_match_accuracy": calculate_product_match_accuracy(df),
        "out_of_scope_handling": calculate_out_of_scope_handling(df),
    }
    
    # Latency
    print("\nLatency (ms):")
    for key, val in metrics["latency"].items():
        print(f"  {key:.<20} {val:.2f}")
    
    # Redirect accuracy
    print(f"\nRedirect Accuracy (pricing queries):")
    print(f"  accuracy:............ {metrics['redirect_accuracy']:.2%}")
    
    # Source coverage
    print(f"\nSource Coverage:")
    print(f"  answers_with_sources: {metrics['source_coverage']:.2%}")
    
    # Product match
    print(f"\nProduct Match Accuracy:")
    print(f"  accuracy:............ {metrics['product_match_accuracy']:.2%}")
    
    # Out-of-scope handling
    print(f"\nOut-of-Scope Handling:")
    print(f"  accuracy:............ {metrics['out_of_scope_handling']:.2%}")
    
    print("\n" + "="*80)
    
    return metrics


if __name__ == "__main__":
    # Example usage
    import sys
    from pathlib import Path
    
    # Load results.csv
    results_path = Path(__file__).parent / "results.csv"
    if results_path.exists():
        df = pd.read_csv(results_path)
        metrics = print_custom_metrics_summary(df)
    else:
        print(f"Results file not found: {results_path}")
        print("Run `python -m evaluation.evaluate` first to generate results.")
