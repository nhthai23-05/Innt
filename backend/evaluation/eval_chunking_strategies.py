"""
Experiment 4 — Chunking Strategy Comparison (Phase 8.5).

For each candidate strategy: temporarily override settings.chunking_strategy,
rebuild the ChromaDB index, run RAGAS evaluation, record results.

Usage:
    cd backend
    python -m evaluation.eval_chunking_strategies [--limit N]

Results saved to: experiments/results/chunking_strategy_results.csv
"""

import sys
import csv
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

import app.config as _cfg_module
from app.indexing.indexer import IndexBuilder
from evaluation.evaluate import run_evaluation

# Only strategies with distinct implementations:
# - "document": single chunk per product/doc combining all fields
# - "field":    separate chunks per field (description / use_cases / specs)
# "augmented" is currently an alias of "document" and is excluded.
CANDIDATE_STRATEGIES = [
    "document",
    "field",
]

RESULTS_CSV = Path(__file__).parent.parent / "experiments" / "results" / "chunking_strategy_results.csv"
TEST_SET = Path(__file__).parent / "test_set.json"


def run_chunking_experiment(strategy: str, limit: int | None = None) -> dict:
    print(f"\n{'='*70}")
    print(f"Chunking strategy: {strategy}")
    print(f"{'='*70}")

    original_strategy = _cfg_module.settings.chunking_strategy
    _cfg_module.settings.chunking_strategy = strategy

    try:
        print("  Rebuilding ChromaDB index...")
        t0 = time.time()
        builder = IndexBuilder()
        builder.rebuild_index()
        print(f"  Index built in {time.time() - t0:.1f}s")

        pipeline_config = {
            "retrieval_strategy": "dense",
            "use_reranking": False,
            "use_query_enhancement": False,
            "top_k": 5,
        }
        df = run_evaluation(TEST_SET, pipeline_config=pipeline_config, limit=limit)

        from evaluation.metrics import calculate_retrieval_metrics
        ret = calculate_retrieval_metrics(df, k=5)

        return {
            "chunking_strategy": strategy,
            "faithfulness": round(float(df["faithfulness"].mean()), 4),
            "answer_relevancy": round(float(df["answer_relevancy"].mean()), 4),
            "context_precision": round(float(df["context_precision"].mean()), 4),
            "context_recall": round(float(df["context_recall"].mean()), 4),
            "recall_at_k": round(ret["recall_at_k"], 4),
            "mrr": round(ret["mrr"], 4),
            "hit_at_3": round(ret["hit_at_3"], 4),
            "latency_mean_ms": round(float(df["latency_ms"].mean()), 1),
            "n_queries": len(df),
            "status": "success",
        }
    except Exception as e:
        print(f"  ERROR: {e}")
        return {"chunking_strategy": strategy, "status": "failed", "error": str(e)}
    finally:
        _cfg_module.settings.chunking_strategy = original_strategy


def main():
    limit = None
    args = sys.argv[1:]
    if "--limit" in args:
        idx = args.index("--limit")
        limit = int(args[idx + 1])
        print(f"Limit mode: {limit} queries per strategy")

    RESULTS_CSV.parent.mkdir(parents=True, exist_ok=True)
    results = []
    for strategy in CANDIDATE_STRATEGIES:
        results.append(run_chunking_experiment(strategy, limit=limit))

    if results:
        # Build fieldnames as union of all keys (success rows lack 'error', failed rows lack metrics)
        fieldnames = []
        seen = set()
        for r in results:
            for k in r.keys():
                if k not in seen:
                    seen.add(k)
                    fieldnames.append(k)
        with open(RESULTS_CSV, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
            writer.writeheader()
            writer.writerows(results)

    print(f"\n{'='*70}")
    print("CHUNKING STRATEGY COMPARISON RESULTS")
    print(f"{'='*70}")
    for r in results:
        if r.get("status") == "success":
            print(
                f"  {r['chunking_strategy']:<15}  "
                f"faith={r['faithfulness']:.3f}  "
                f"rel={r['answer_relevancy']:.3f}  "
                f"ctx_rec={r['context_recall']:.3f}"
            )
        else:
            print(f"  {r['chunking_strategy']:<15}  FAILED: {r.get('error', '')[:50]}")

    print(f"\nSaved: {RESULTS_CSV}")
    print(
        f"\nNOTE: ChromaDB was last rebuilt with '{CANDIDATE_STRATEGIES[-1]}'.\n"
        "Run `python -m app.indexing.indexer --rebuild` to restore your default ('document')."
    )


if __name__ == "__main__":
    main()
