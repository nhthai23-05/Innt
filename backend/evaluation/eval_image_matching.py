"""
Evaluate CLIP image matching accuracy (Phase 7.6).

For each product that has image URLs, downloads the images and checks whether
the correct product appears in the top-3 results returned by CLIPImageMatcher.

Usage:
    cd backend
    python -m evaluation.eval_image_matching

Metrics:
    - Top-1 accuracy: correct product is rank-1 result
    - Top-3 accuracy: correct product is in top-3 results  (target > 70%)
"""

import io
import json
import sys
from pathlib import Path

import requests

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.multimodal.image_matching import CLIPImageMatcher


def run_eval(limit_per_product: int = 2) -> None:
    """Download product images and measure top-1 / top-3 accuracy."""
    matcher = CLIPImageMatcher()

    products_path = Path(__file__).parent.parent.parent / "data" / "products.json"
    with open(products_path, "r", encoding="utf-8") as f:
        products = json.load(f)

    total = 0
    top1_hits = 0
    top3_hits = 0
    failures: list = []

    print(f"\n{'='*70}")
    print("CLIP Image Matching — Accuracy Evaluation")
    print(f"{'='*70}\n")

    for product in products:
        product_id = product["id"]
        product_name = product["embedding_data"]["product_name"]
        image_urls = product.get("generation_enhancers", {}).get("image_url") or []
        if isinstance(image_urls, str):
            image_urls = [image_urls]

        urls_to_test = [u for u in image_urls if u][:limit_per_product]
        if not urls_to_test:
            continue

        for url in urls_to_test:
            try:
                resp = requests.get(url, timeout=20)
                resp.raise_for_status()
                image_bytes = resp.content
            except Exception as exc:
                print(f"  SKIP  {product_name}: download failed — {exc}")
                failures.append(f"{product_id}: {exc}")
                continue

            matches = matcher.match(image_bytes, top_k=3)
            matched_ids = [m["product_id"] for m in matches]

            is_top1 = len(matched_ids) > 0 and matched_ids[0] == product_id
            is_top3 = product_id in matched_ids

            total += 1
            if is_top1:
                top1_hits += 1
            if is_top3:
                top3_hits += 1

            rank_str = f"rank-{matched_ids.index(product_id)+1}" if is_top3 else "miss"
            score_str = f"{matches[0]['score']:.3f}" if matches else "below-threshold"
            status = "ok" if is_top3 else "MISS"
            print(
                f"  {status:<5} {product_name[:40]:<40}  {rank_str:<8}  top1_score={score_str}"
            )

    print(f"\n{'='*70}")
    if total == 0:
        print("No images evaluated — check that product image URLs are reachable.")
        return

    print(f"Evaluated : {total} images across {len(products)} products")
    print(f"Top-1 acc : {top1_hits}/{total} = {top1_hits/total*100:.1f}%")
    print(f"Top-3 acc : {top3_hits}/{total} = {top3_hits/total*100:.1f}%  (target > 70%)")
    if failures:
        print(f"Failures  : {len(failures)} download errors")
    print(f"{'='*70}\n")

    if top3_hits / total >= 0.70:
        print("PASS — top-3 accuracy meets the 70% target.")
    else:
        print("FAIL — top-3 accuracy below 70% target.")


if __name__ == "__main__":
    run_eval()
