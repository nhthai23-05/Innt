"""
Experiment 1 — Embedding Model Comparison (Phase 8.1).

For each candidate model: temporarily override settings.embedding_model,
rebuild the ChromaDB index, run RAGAS evaluation, record results.

Usage:
    cd backend
    python -m evaluation.eval_embedding_models [--limit N]

Results saved to: experiments/results/embedding_model_results.csv
"""

import sys
import csv
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

import app.config as _cfg_module
from app.indexing.indexer import IndexBuilder
from evaluation.evaluate import run_evaluation

CANDIDATE_MODELS = [
    "bkai-foundation-models/vietnamese-bi-encoder",
    "intfloat/multilingual-e5-base",
    "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
    # Removed: "dangvantuan/vietnamese-embedding" — incompatible with raw sentence-transformers
    # (requires pyvi/underthesea word segmentation pre-tokenization). Crashes with
    # "index 258 out of bounds" during embed().
]

RESULTS_CSV = Path(__file__).parent.parent / "experiments" / "results" / "embedding_model_results.csv"
TEST_SET = Path(__file__).parent / "test_set.json"


def run_embedding_experiment(model_name: str, limit: int | None = None) -> dict:
    print(f"\n{'='*70}")
    print(f"Embedding model: {model_name}")
    print(f"{'='*70}")

    original_model = _cfg_module.settings.embedding_model
    _cfg_module.settings.embedding_model = model_name

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

        return {
            "embedding_model": model_name,
            "faithfulness": round(float(df["faithfulness"].mean()), 4),
            "answer_relevancy": round(float(df["answer_relevancy"].mean()), 4),
            "context_precision": round(float(df["context_precision"].mean()), 4),
            "context_recall": round(float(df["context_recall"].mean()), 4),
            "latency_mean_ms": round(float(df["latency_ms"].mean()), 1),
            "n_queries": len(df),
            "status": "success",
        }
    except Exception as e:
        print(f"  ERROR: {e}")
        return {"embedding_model": model_name, "status": "failed", "error": str(e)}
    finally:
        _cfg_module.settings.embedding_model = original_model


def main():
    limit = None
    args = sys.argv[1:]
    if "--limit" in args:
        idx = args.index("--limit")
        limit = int(args[idx + 1])
        print(f"Limit mode: {limit} queries per model")

    RESULTS_CSV.parent.mkdir(parents=True, exist_ok=True)
    results = []
    for model in CANDIDATE_MODELS:
        results.append(run_embedding_experiment(model, limit=limit))

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
    print("EMBEDDING MODEL COMPARISON RESULTS")
    print(f"{'='*70}")
    for r in results:
        if r.get("status") == "success":
            print(
                f"  {r['embedding_model'][:50]:<50}  "
                f"faith={r['faithfulness']:.3f}  "
                f"rel={r['answer_relevancy']:.3f}  "
                f"ctx_rec={r['context_recall']:.3f}"
            )
        else:
            print(f"  {r['embedding_model'][:50]:<50}  FAILED: {r.get('error', '')[:50]}")

    print(f"\nSaved: {RESULTS_CSV}")
    print(
        f"\nNOTE: ChromaDB was last rebuilt with '{CANDIDATE_MODELS[-1]}'.\n"
        "Run `python -m app.indexing.indexer --rebuild` to restore your preferred model."
    )


if __name__ == "__main__":
    main()
