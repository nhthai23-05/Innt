"""
Experiment runner for RAG pipeline evaluation.

Supports:
- Multiple configurations (YAML)
- Automatic git SHA + timestamp tracking
- Cumulative results aggregation
- Parameter sweep experiments
"""

import json
import sys
import time
import subprocess
from pathlib import Path
from typing import Any, Dict, List
from datetime import datetime

import pandas as pd
import yaml

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.rag.pipeline import RagPipeline
from evaluation.evaluate import run_evaluation, print_summary
from evaluation.metrics import print_custom_metrics_summary


def get_git_info() -> Dict[str, str]:
    """Get current git SHA and branch."""
    try:
        sha = subprocess.check_output(
            ["git", "rev-parse", "HEAD"],
            cwd=Path(__file__).parent.parent.parent,
            text=True
        ).strip()
        branch = subprocess.check_output(
            ["git", "rev-parse", "--abbrev-ref", "HEAD"],
            cwd=Path(__file__).parent.parent.parent,
            text=True
        ).strip()
        return {"sha": sha[:8], "branch": branch}
    except Exception:
        return {"sha": "unknown", "branch": "unknown"}


def load_experiment_config(config_path: Path) -> Dict[str, Any]:
    """Load experiment configuration from YAML."""
    with open(config_path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def run_experiment(
    name: str,
    config: Dict[str, Any],
    test_set_path: Path,
    limit: int = None,
) -> Dict[str, Any]:
    """
    Run a single experiment with given config.

    Args:
        name: Experiment name
        config: Configuration dict with RAG pipeline parameters
        test_set_path: Path to test_set.json
        limit: Optional max number of test cases to run

    Returns:
        Result dict with metrics and metadata
    """
    print(f"\n{'='*80}")
    print(f"Running Experiment: {name}")
    print(f"{'='*80}")

    start_time = datetime.now()
    git_info = get_git_info()

    try:
        # Run evaluation — pass config so pipeline uses experiment-specific overrides
        df_results = run_evaluation(test_set_path, pipeline_config=config, limit=limit)
        
        # Calculate RAGAS metrics
        print_summary(df_results)
        
        # Calculate custom metrics
        from evaluation.metrics import print_custom_metrics_summary as print_custom
        custom_metrics = print_custom(df_results)
        
        # Aggregate results
        result = {
            "experiment_name": name,
            "timestamp": start_time.isoformat(),
            "git_sha": git_info["sha"],
            "git_branch": git_info["branch"],
            "status": "success",
            # RAGAS metrics
            "faithfulness_mean": float(df_results["faithfulness"].mean()),
            "faithfulness_std": float(df_results["faithfulness"].std()),
            "answer_relevancy_mean": float(df_results["answer_relevancy"].mean()),
            "answer_relevancy_std": float(df_results["answer_relevancy"].std()),
            "context_precision_mean": float(df_results["context_precision"].mean()),
            "context_recall_mean": float(df_results["context_recall"].mean()),
            # Retrieval metrics (compared against relevant_passages ground truth)
            "recall_at_k": custom_metrics["recall_at_k"],
            "precision_at_k": custom_metrics["precision_at_k"],
            "mrr": custom_metrics["mrr"],
            "hit_at_1": custom_metrics["hit_at_1"],
            "hit_at_3": custom_metrics["hit_at_3"],
            # Custom metrics (from metrics.py)
            "latency_mean_ms": custom_metrics["latency"]["mean"],
            "latency_p95_ms": custom_metrics["latency"]["p95"],
            "redirect_accuracy": custom_metrics["redirect_accuracy"],
            "source_coverage": custom_metrics["source_coverage"],
            "product_match_accuracy": custom_metrics["product_match_accuracy"],
            # Config
            **{f"config_{k}": v for k, v in config.items()},
        }
        
        print(f"\n✅ Experiment completed: {name}")
        return result
        
    except Exception as e:
        print(f"\n❌ Experiment failed: {name}")
        print(f"Error: {e}")
        return {
            "experiment_name": name,
            "timestamp": start_time.isoformat(),
            "git_sha": git_info["sha"],
            "git_branch": git_info["branch"],
            "status": "failed",
            "error": str(e),
        }


def run_experiment_suite(
    config_dir: Path,
    test_set_path: Path,
    output_csv: Path,
    limit: int = None,
    recursive: bool = False,
    start_from: str = None,
) -> pd.DataFrame:
    """
    Run all experiments from config directory.

    Args:
        config_dir: Directory containing YAML config files
        test_set_path: Path to test_set.json
        output_csv: Path to output CSV
        limit: Optional max number of test cases per experiment
        recursive: Search all subdirectories when True (used for root config_dir)
        start_from: Skip configs whose stem sorts before this value (e.g. "05_intent_routed")

    Returns:
        DataFrame with all results
    """
    results = []

    # Recursive scan for root dir; flat scan for a specific experiment subfolder
    if recursive:
        config_files = sorted(config_dir.rglob("*.yaml"))
    else:
        config_files = sorted(config_dir.glob("*.yaml"))

    if start_from:
        config_files = [f for f in config_files if f.stem >= start_from]
        print(f"⏩ Skipping configs before '{start_from}' ({len(config_files)} remaining)")
    print(f"\nFound {len(config_files)} experiment configs in {config_dir}")

    if len(config_files) == 0:
        print("No experiment configs found. Create YAML files in experiments/configs/")
        return pd.DataFrame()

    # Run each experiment
    for config_file in config_files:
        try:
            config = load_experiment_config(config_file)
            name = config_file.stem  # filename without extension
            result = run_experiment(name, config, test_set_path, limit=limit)
            results.append(result)
        except Exception as e:
            print(f"Failed to load config {config_file}: {e}")
    
    # Combine results
    df_results = pd.DataFrame(results)
    
    # Save to CSV
    df_results.to_csv(output_csv, index=False)
    print(f"\n✅ All results saved to {output_csv}")
    
    # Print summary table
    print("\n" + "="*80)
    print("EXPERIMENT SUITE SUMMARY")
    print("="*80)
    if len(df_results) > 0:
        # Show key metrics
        display_cols = [
            "experiment_name",
            "faithfulness_mean",
            "answer_relevancy_mean",
            "latency_mean_ms",
            "redirect_accuracy",
            "status",
        ]
        existing_cols = [c for c in display_cols if c in df_results.columns]
        print(df_results[existing_cols].to_string(index=False))
    
    return df_results


def record_baseline(
    test_set_path: Path,
    config_dir: Path,
    output_csv: Path,
    limit: int = None,
) -> pd.DataFrame:
    """
    Record Phase 1 baseline (Naive RAG) to cumulative_gains.csv.

    Args:
        test_set_path: Path to test_set.json
        config_dir: Directory containing configs
        output_csv: Path to cumulative_gains.csv
        limit: Optional max number of test cases

    Returns:
        DataFrame with baseline result
    """
    print("\n" + "="*80)
    print("PHASE 2.5: Recording Baseline (Naive RAG)")
    print("="*80)

    baseline_config = config_dir / "baseline_naive_rag.yaml"

    if not baseline_config.exists():
        print(f"❌ Baseline config not found: {baseline_config}")
        return pd.DataFrame()

    # Load baseline config
    config = load_experiment_config(baseline_config)

    # Run baseline experiment
    result = run_experiment("Baseline (Naive RAG)", config, test_set_path, limit=limit)
    
    # Convert to DataFrame
    df_baseline = pd.DataFrame([result])
    
    # Append or create cumulative results
    if output_csv.exists():
        df_existing = pd.read_csv(output_csv)
        # Check if baseline already exists
        baseline_existing = df_existing[df_existing["experiment_name"] == "Baseline (Naive RAG)"]
        if len(baseline_existing) > 0:
            print("\n⚠️  Baseline already exists in cumulative_gains.csv")
            print("Replacing with new baseline...")
            df_existing = df_existing[df_existing["experiment_name"] != "Baseline (Naive RAG)"]
            df_results = pd.concat([df_existing, df_baseline], ignore_index=True)
        else:
            df_results = pd.concat([df_existing, df_baseline], ignore_index=True)
    else:
        df_results = df_baseline
    
    # Save to CSV
    df_results.to_csv(output_csv, index=False)
    print(f"\n✅ Baseline recorded to {output_csv}")
    
    # Print baseline metrics
    print("\n" + "="*80)
    print("BASELINE METRICS")
    print("="*80)
    if len(df_baseline) > 0:
        row = df_baseline.iloc[0]
        print(f"\nExperiment: {row['experiment_name']}")
        print(f"Timestamp: {row['timestamp']}")
        print(f"Git SHA: {row['git_sha']}")
        if row.get("status") == "failed":
            print(f"\n❌ Experiment failed: {row.get('error', 'unknown error')}")
            print(f"\nCheckpoint C: ⛔ BLOCKED — re-run after fixing the error above")
        else:
            print(f"\nRAGAS Metrics:")
            print(f"  Faithfulness:........ {row['faithfulness_mean']:.4f} ± {row['faithfulness_std']:.4f}")
            print(f"  Answer Relevancy:... {row['answer_relevancy_mean']:.4f} ± {row['answer_relevancy_std']:.4f}")
            print(f"  Context Precision:.. {row['context_precision_mean']:.4f}")
            print(f"  Context Recall:..... {row['context_recall_mean']:.4f}")
            print(f"\nCustom Metrics:")
            print(f"  Latency (mean):...... {row['latency_mean_ms']:.2f} ms")
            print(f"  Latency (p95):...... {row['latency_p95_ms']:.2f} ms")
            print(f"  Redirect Accuracy:.. {row['redirect_accuracy']:.2%}")
            print(f"  Source Coverage:.... {row['source_coverage']:.2%}")
            print(f"  Product Match Acc:.. {row['product_match_accuracy']:.2%}")
            print(f"\nCheckpoint C: ✅ READY")
    
    return df_results


if __name__ == "__main__":
    # Paths
    test_set_path = Path(__file__).parent / "test_set.json"
    config_dir = Path(__file__).parent.parent / "experiments" / "configs"
    output_csv = Path(__file__).parent.parent / "experiments" / "results" / "cumulative_gains.csv"

    # Create directories if needed
    config_dir.mkdir(parents=True, exist_ok=True)
    output_csv.parent.mkdir(parents=True, exist_ok=True)

    args = sys.argv[1:]

    # --limit N
    limit = None
    if "--limit" in args:
        idx = args.index("--limit")
        limit = int(args[idx + 1])
        args = [a for i, a in enumerate(args) if i != idx and i != idx + 1]
    if limit:
        print(f"⚠️  Limit mode: running first {limit} test cases only")

    # --start-from <stem>  (e.g. --start-from 05_intent_routed)
    start_from = None
    if "--start-from" in args:
        idx = args.index("--start-from")
        start_from = args[idx + 1]
        args = [a for i, a in enumerate(args) if i != idx and i != idx + 1]
        print(f"⏩ Starting from config: '{start_from}'")

    # --config-dir <subdir|all>  (e.g. --config-dir exp3_retrieval  or  --config-dir all)
    target_dir = config_dir
    recursive = True
    run_all_subdirs = False
    if "--config-dir" in args:
        idx = args.index("--config-dir")
        sub = args[idx + 1]
        args = [a for i, a in enumerate(args) if i != idx and i != idx + 1]
        if sub == "all":
            run_all_subdirs = True
        else:
            target_dir = config_dir / sub
            output_csv = output_csv.parent / f"{target_dir.name}.csv"
            recursive = False
            if not target_dir.exists():
                print(f"❌ Config dir not found: {target_dir}")
                print(f"Available: {[d.name for d in config_dir.iterdir() if d.is_dir()]}")
                sys.exit(1)

    # Check if running Phase 2.5 (record baseline)
    if args and args[0] == "baseline":
        print("RAG Baseline Recording (Phase 2.5)")
        df_results = record_baseline(test_set_path, config_dir, output_csv, limit=limit)
    elif run_all_subdirs:
        # Run each subfolder separately, each saved to its own CSV
        subdirs = sorted(d for d in config_dir.iterdir() if d.is_dir())
        print(f"RAG Experiment Suite Runner — all subdirs ({len(subdirs)} found)")
        all_results = []
        for subdir in subdirs:
            sub_csv = output_csv.parent / f"{subdir.name}.csv"
            print(f"\n{'#'*80}")
            print(f"# Subfolder: {subdir.name}  →  {sub_csv.name}")
            print(f"{'#'*80}")
            df_sub = run_experiment_suite(subdir, test_set_path, sub_csv, limit=limit, recursive=False, start_from=start_from)
            all_results.append(df_sub)
        df_results = pd.concat(all_results, ignore_index=True) if all_results else pd.DataFrame()
        if len(df_results) > 0:
            print(f"\n📊 Total experiments across all subdirs: {len(df_results)}")
            print(f"📁 Individual CSVs saved in: {output_csv.parent}")
    else:
        print("RAG Experiment Suite Runner")
        df_results = run_experiment_suite(
            target_dir, test_set_path, output_csv, limit=limit, recursive=recursive, start_from=start_from
        )
        if len(df_results) > 0:
            print(f"\n📊 Total experiments: {len(df_results)}")
            print(f"📁 Results: {output_csv}")
