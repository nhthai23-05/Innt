"""
Custom evaluation metrics for RAG pipeline.

Two groups:

1. Retrieval metrics (the academically defensible ones — they compare the
   product/document IDs the pipeline actually retrieved against the
   `relevant_passages` ground truth in test_set.json):
     - recall@k, precision@k, MRR, hit@1, hit@3

2. Behavioural metrics:
     - latency (ms): mean / median / p95 / max
     - redirect_accuracy: pricing queries redirect to Zalo without quoting a price
     - source_coverage: non-error answers that are grounded in ≥1 retrieved doc
     - out_of_scope_handling: OOS queries minimise context + defer to contact

NOTE: retrieval metrics require `retrieved_ids` and `relevant_passages` columns
(produced by evaluate.py). Queries with no `relevant_passages` (pricing /
out_of_scope) are excluded from the retrieval averages.
"""

import ast
from typing import List, Dict, Any
import pandas as pd


def _parse_list(cell: Any) -> List[str]:
    """Coerce a cell that may be a list or a stringified list into list[str]."""
    if isinstance(cell, list):
        return [str(x) for x in cell]
    if isinstance(cell, str):
        s = cell.strip()
        if s.startswith("["):
            try:
                parsed = ast.literal_eval(s)
                if isinstance(parsed, list):
                    return [str(x) for x in parsed]
            except (ValueError, SyntaxError):
                return []
        return [s] if s else []
    return []


def _dedupe(seq: List[str]) -> List[str]:
    """Order-preserving dedupe (field chunking can return a product twice)."""
    seen, out = set(), []
    for x in seq:
        if x not in seen:
            seen.add(x)
            out.append(x)
    return out


# ---------------------------------------------------------------------------
# Retrieval metrics
# ---------------------------------------------------------------------------

def calculate_retrieval_metrics(df: pd.DataFrame, k: int = 5) -> Dict[str, float]:
    """Recall@k, Precision@k, MRR, hit@1, hit@3 over queries with ground truth.

    Compares `retrieved_ids` (ordered product/doc slugs the pipeline returned)
    against `relevant_passages` (ground-truth slugs). Returns NaN-safe means.
    """
    if "retrieved_ids" not in df.columns or "relevant_passages" not in df.columns:
        return {"recall_at_k": 0.0, "precision_at_k": 0.0, "mrr": 0.0,
                "hit_at_1": 0.0, "hit_at_3": 0.0, "n_eval": 0}

    recalls, precisions, rrs, hit1, hit3 = [], [], [], [], []

    for _, row in df.iterrows():
        relevant = set(_parse_list(row["relevant_passages"]))
        if not relevant:
            continue  # pricing / out_of_scope have no gold passages → skip
        retrieved = _dedupe(_parse_list(row["retrieved_ids"]))[:k]

        hits = [r for r in retrieved if r in relevant]
        recalls.append(len(set(hits)) / len(relevant))
        precisions.append(len(hits) / k)

        # MRR — rank of first relevant hit
        rr = 0.0
        for rank, r in enumerate(retrieved, 1):
            if r in relevant:
                rr = 1.0 / rank
                break
        rrs.append(rr)

        hit1.append(1.0 if retrieved[:1] and retrieved[0] in relevant else 0.0)
        hit3.append(1.0 if any(r in relevant for r in retrieved[:3]) else 0.0)

    def _mean(xs):
        return float(sum(xs) / len(xs)) if xs else 0.0

    return {
        "recall_at_k": _mean(recalls),
        "precision_at_k": _mean(precisions),
        "mrr": _mean(rrs),
        "hit_at_1": _mean(hit1),
        "hit_at_3": _mean(hit3),
        "n_eval": len(recalls),
    }


def calculate_product_match_accuracy(df: pd.DataFrame, k: int = 5) -> float:
    """Top-k hit rate for product-targeted queries.

    Correct iff `expected_product` appears in the retrieved IDs (top-k).
    This is the FIXED version — it actually compares against the expected
    product, instead of merely checking that something was retrieved.
    """
    if "expected_product" not in df.columns or "retrieved_ids" not in df.columns:
        return 0.0

    targeted = df[df["query_type"].isin(["product_spec", "product_matching"])]
    if len(targeted) == 0:
        return 1.0

    correct = 0
    for _, row in targeted.iterrows():
        expected = row.get("expected_product")
        if not expected or (isinstance(expected, float) and pd.isna(expected)):
            continue
        retrieved = _dedupe(_parse_list(row["retrieved_ids"]))[:k]
        if str(expected) in retrieved:
            correct += 1
    return correct / len(targeted)


# ---------------------------------------------------------------------------
# Behavioural metrics
# ---------------------------------------------------------------------------

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
    """Pricing queries should apologise / redirect and NOT quote a price."""
    pricing_queries = df[df["query_type"] == "pricing"]
    if len(pricing_queries) == 0:
        return 1.0

    correct = 0
    for _, row in pricing_queries.iterrows():
        answer = str(row["answer"]).lower()
        has_apology = "xin lỗi" in answer or "liên hệ" in answer
        has_price_info = any(w in answer for w in ["đồng", "triệu", "tỷ", "chi phí"])
        if has_apology and not has_price_info:
            correct += 1
    return correct / len(pricing_queries)


def calculate_source_coverage(df: pd.DataFrame) -> float:
    """Fraction of non-error answers grounded in ≥1 retrieved context."""
    valid_answers = df[~df["answer"].str.contains("ERROR", na=False)]
    if len(valid_answers) == 0:
        return 1.0

    has_sources = 0
    for _, row in valid_answers.iterrows():
        if len(_parse_list(row["contexts"])) > 0:
            has_sources += 1
    return has_sources / len(valid_answers)


def calculate_out_of_scope_handling(df: pd.DataFrame) -> float:
    """OOS queries should keep ≤1 context and defer to contact."""
    out_of_scope = df[df["query_type"] == "out_of_scope"]
    if len(out_of_scope) == 0:
        return 1.0

    correct = 0
    for _, row in out_of_scope.iterrows():
        contexts = _parse_list(row["contexts"])
        answer = str(row["answer"]).lower()
        if (len(contexts) <= 1) and ("liên hệ" in answer or "contact" in answer):
            correct += 1
    return correct / len(out_of_scope)


def print_custom_metrics_summary(df: pd.DataFrame, k: int = 5) -> Dict[str, Any]:
    """Print and return custom metrics."""
    print("\n" + "=" * 80)
    print("CUSTOM METRICS SUMMARY")
    print("=" * 80)

    retrieval = calculate_retrieval_metrics(df, k=k)
    metrics = {
        "latency": calculate_latency_stats(df),
        "redirect_accuracy": calculate_redirect_accuracy(df),
        "source_coverage": calculate_source_coverage(df),
        "product_match_accuracy": calculate_product_match_accuracy(df, k=k),
        "out_of_scope_handling": calculate_out_of_scope_handling(df),
        # retrieval metrics (flattened for easy CSV columns)
        "recall_at_k": retrieval["recall_at_k"],
        "precision_at_k": retrieval["precision_at_k"],
        "mrr": retrieval["mrr"],
        "hit_at_1": retrieval["hit_at_1"],
        "hit_at_3": retrieval["hit_at_3"],
        "retrieval_n_eval": retrieval["n_eval"],
    }

    print(f"\nRetrieval Metrics (over {retrieval['n_eval']} queries with gold passages, k={k}):")
    print(f"  Recall@{k}:.......... {metrics['recall_at_k']:.4f}")
    print(f"  Precision@{k}:....... {metrics['precision_at_k']:.4f}")
    print(f"  MRR:............... {metrics['mrr']:.4f}")
    print(f"  Hit@1:............. {metrics['hit_at_1']:.4f}")
    print(f"  Hit@3:............. {metrics['hit_at_3']:.4f}")

    print("\nLatency (ms):")
    for key, val in metrics["latency"].items():
        print(f"  {key:.<20} {val:.2f}")

    print(f"\nRedirect Accuracy (pricing):  {metrics['redirect_accuracy']:.2%}")
    print(f"Source Coverage:............. {metrics['source_coverage']:.2%}")
    print(f"Product Match Acc (top-{k}):.. {metrics['product_match_accuracy']:.2%}")
    print(f"Out-of-Scope Handling:....... {metrics['out_of_scope_handling']:.2%}")

    print("\n" + "=" * 80)
    return metrics


if __name__ == "__main__":
    from pathlib import Path

    results_path = Path(__file__).parent / "results.csv"
    if results_path.exists():
        df = pd.read_csv(results_path)
        print_custom_metrics_summary(df)
    else:
        print(f"Results file not found: {results_path}")
        print("Run `python -m evaluation.evaluate` first to generate results.")
