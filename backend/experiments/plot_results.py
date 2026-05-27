"""
Phase 8.7 — Visualize experiment results.

Usage:
    cd backend
    python experiments/plot_results.py

Outputs (in experiments/results/):
  - cumulative_gains.png   : RAGAS metrics progression across all experiments
  - retrieval_compare.png  : Retrieval strategy bar chart
  - llm_compare.png        : LLM comparison bar chart
  - qe_compare.png         : Query enhancement comparison bar chart
  - arch_compare.png       : Architecture A/B/C comparison bar chart
  - embedding_compare.png  : Embedding model comparison (from embedding_model_results.csv)
"""

import sys
from pathlib import Path

import pandas as pd
import matplotlib
matplotlib.use("Agg")  # headless — no display required
import matplotlib.pyplot as plt
import matplotlib.ticker as mtick

RESULTS_DIR = Path(__file__).parent / "results"
GAINS_CSV = RESULTS_DIR / "cumulative_gains.csv"
EMBED_CSV = RESULTS_DIR / "embedding_model_results.csv"

RAGAS_METRICS = ["faithfulness_mean", "answer_relevancy_mean", "context_precision_mean", "context_recall_mean"]
METRIC_LABELS = ["Faithfulness", "Answer Relevancy", "Context Precision", "Context Recall"]
COLORS = ["#E62026", "#2563EB", "#16a34a", "#d97706"]


def _bar_chart(df: pd.DataFrame, x_col: str, metric_cols: list, labels: list,
               title: str, out_path: Path, x_label: str = "") -> None:
    fig, ax = plt.subplots(figsize=(max(8, len(df) * 1.2), 5))
    x = range(len(df))
    w = 0.2
    for i, (col, label, color) in enumerate(zip(metric_cols, labels, COLORS)):
        if col not in df.columns:
            continue
        offset = (i - len(metric_cols) / 2 + 0.5) * w
        bars = ax.bar([xi + offset for xi in x], df[col], w, label=label, color=color, alpha=0.85)
        for bar in bars:
            h = bar.get_height()
            if h > 0:
                ax.text(bar.get_x() + bar.get_width() / 2, h + 0.005, f"{h:.2f}",
                        ha="center", va="bottom", fontsize=7)
    ax.set_xticks(list(x))
    ax.set_xticklabels(df[x_col].tolist(), rotation=25, ha="right", fontsize=8)
    ax.set_ylim(0, 1.15)
    ax.yaxis.set_major_formatter(mtick.PercentFormatter(xmax=1))
    ax.set_ylabel("Score")
    ax.set_xlabel(x_label)
    ax.set_title(title, fontsize=12, fontweight="bold")
    ax.legend(loc="upper right", fontsize=8)
    ax.grid(axis="y", alpha=0.3)
    fig.tight_layout()
    fig.savefig(out_path, dpi=150)
    plt.close(fig)
    print(f"  Saved: {out_path.name}")


def plot_cumulative_gains(df: pd.DataFrame) -> None:
    success = df[df.get("status", pd.Series(["success"] * len(df))) == "success"].copy()
    if success.empty:
        print("  No successful rows for cumulative gains chart.")
        return
    fig, ax = plt.subplots(figsize=(max(10, len(success) * 0.9), 5))
    x = range(len(success))
    for col, label, color in zip(RAGAS_METRICS, METRIC_LABELS, COLORS):
        if col in success.columns:
            ax.plot(list(x), success[col].tolist(), marker="o", label=label, color=color, linewidth=2)
    ax.set_xticks(list(x))
    ax.set_xticklabels(success["experiment_name"].tolist(), rotation=30, ha="right", fontsize=7)
    ax.set_ylim(0, 1.1)
    ax.yaxis.set_major_formatter(mtick.PercentFormatter(xmax=1))
    ax.set_ylabel("RAGAS Score")
    ax.set_title("Cumulative Gains — RAG Pipeline Progression", fontsize=12, fontweight="bold")
    ax.legend(loc="lower right", fontsize=8)
    ax.grid(alpha=0.3)
    fig.tight_layout()
    out = RESULTS_DIR / "cumulative_gains.png"
    fig.savefig(out, dpi=150)
    plt.close(fig)
    print(f"  Saved: {out.name}")


def main():
    RESULTS_DIR.mkdir(parents=True, exist_ok=True)

    if not GAINS_CSV.exists():
        print(f"cumulative_gains.csv not found. Run `python -m evaluation.run_experiments` first.")
        sys.exit(1)

    df = pd.read_csv(GAINS_CSV)
    print(f"Loaded {len(df)} rows from cumulative_gains.csv\n")

    plot_cumulative_gains(df)

    def _subset(keywords):
        mask = df["experiment_name"].apply(lambda n: any(k in n.lower() for k in keywords))
        return df[mask].copy()

    ret = _subset(["baseline", "bm25", "hybrid", "phase6"])
    if not ret.empty:
        _bar_chart(ret, "experiment_name", RAGAS_METRICS, METRIC_LABELS,
                   "Exp 3 — Retrieval Strategy Comparison",
                   RESULTS_DIR / "retrieval_compare.png")

    llm = _subset(["e2_llm", "gemini", "qwen"])
    if not llm.empty:
        _bar_chart(llm, "experiment_name", RAGAS_METRICS, METRIC_LABELS,
                   "Exp 2 — LLM Comparison",
                   RESULTS_DIR / "llm_compare.png")

    qe = _subset(["e5_qe"])
    if not qe.empty:
        _bar_chart(qe, "experiment_name", RAGAS_METRICS, METRIC_LABELS,
                   "Exp 5 — Query Enhancement Comparison",
                   RESULTS_DIR / "qe_compare.png")

    arch = _subset(["e6_arch"])
    if not arch.empty:
        _bar_chart(arch, "experiment_name", RAGAS_METRICS, METRIC_LABELS,
                   "Exp 6 — Architecture A/B/C Comparison",
                   RESULTS_DIR / "arch_compare.png")

    if EMBED_CSV.exists():
        df_emb = pd.read_csv(EMBED_CSV)
        emb_metrics = ["faithfulness", "answer_relevancy", "context_precision", "context_recall"]
        _bar_chart(df_emb, "embedding_model", emb_metrics, METRIC_LABELS,
                   "Exp 1 — Embedding Model Comparison",
                   RESULTS_DIR / "embedding_compare.png")
    else:
        print("  Skipping embedding chart — run eval_embedding_models.py first")

    print("\nDone. All charts saved to experiments/results/")


if __name__ == "__main__":
    main()
