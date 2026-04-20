#!/usr/bin/env python3
"""Analyze current data structure for Phase 0 normalization."""

import json
import sys

# Load products
with open('data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

# Extract unique categories
categories = {}
for i, p in enumerate(products):
    cat = p['metadata']['category']
    if cat not in categories:
        categories[cat] = []
    categories[cat].append((i, p.get('embedding_data', {}).get('product_name', f'Product {i}')))

print(f"Total products: {len(products)}\n")
print("Categories found:")
for cat in sorted(categories.keys()):
    print(f"  {cat}: {len(categories[cat])} products")
    for idx, name in categories[cat]:
        print(f"    [{idx}] {name}")

print("\n" + "="*60)
print("Missing fields analysis:")
print("="*60)

missing = {
    'id': 0,
    'category_slug': 0,
    'finishing_options': 0,
    'redirect_note': 0,
}

for p in products:
    if 'id' not in p:
        missing['id'] += 1
    if 'metadata' in p and 'category_slug' not in p['metadata']:
        missing['category_slug'] += 1
    if 'embedding_data' in p and 'finishing_options' not in p['embedding_data']:
        missing['finishing_options'] += 1
    if 'generation_enhancers' in p and 'redirect_note' not in p['generation_enhancers']:
        missing['redirect_note'] += 1

for field, count in missing.items():
    print(f"  Missing '{field}': {count}/{len(products)} products")
