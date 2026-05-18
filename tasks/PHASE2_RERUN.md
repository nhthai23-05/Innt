# Phase 2 Baseline Re-run — Action Required

## Why

Bug found 2026-05-18: `backend/evaluation/evaluate.py:110` was reading the wrong dict key from the RAG pipeline.

```diff
- answer = result.get("answer", "")
+ answer = result.get("response", result.get("answer", ""))
```

`RagPipeline.query()` returns its generated text under the key `response` (matching the `ChatResponse` schema), but the evaluator was reading `answer` and falling back to an empty string. **Every RAGAS metric in the previous baseline run was therefore computed against empty answers**, which makes those numbers meaningless.

The fix is committed. The numbers need to be re-collected.

## What to run

```bash
cd backend

# 1. Make sure the .env has the Gemini key
cp .env.example .env   # if not already done
# Edit .env, paste RAG_GEMINI_API_KEY=<your key from https://aistudio.google.com/app/apikey>

# 2. Build the index (downloads BKAI embedding model the first time, ~135MB)
python -m app.indexing.indexer --rebuild

# 3. Re-run the baseline experiment
python -m evaluation.run_experiments baseline
```

## Expected output

`backend/experiments/results/cumulative_gains.csv` should contain one row:
`Baseline (Naive RAG)` with non-empty faithfulness / answer_relevancy / context_precision / context_recall numbers.

If the row already exists, the script replaces it (see `record_baseline` in `run_experiments.py`).

## Verify

```bash
# Inspect the CSV
python -c "import pandas as pd; print(pd.read_csv('experiments/results/cumulative_gains.csv'))"
```

A healthy baseline (for our data scale) should show:
- `faithfulness_mean` between 0.5 and 0.9
- `answer_relevancy_mean` between 0.5 and 0.9
- `latency_mean_ms` somewhere in the 3,000–10,000 range (Gemini API + retrieval)

If `faithfulness_mean` is ~0 again, the bug isn't fully fixed — check that `result.get("response", ...)` is in `evaluate.py:110`.

## Checkpoint C — Re-open

The Phase 2.5 checkpoint should be re-signed-off only after this run produces non-zero metrics. Then we can trust later Phase-6 experiments measure real improvements against a real baseline.
