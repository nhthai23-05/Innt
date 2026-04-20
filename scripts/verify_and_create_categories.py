#!/usr/bin/env python3
"""Verify normalized data and create categories.json"""

import json

# Verify products
with open('data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

print("✓ Products verified:")
print(f"  - Total: {len(products)}")
print(f"  - All have 'id': {all('id' in p for p in products)}")
print(f"  - All have 'category_slug': {all('metadata' in p and 'category_slug' in p['metadata'] for p in products)}")
print(f"  - All have 'finishing_options': {all('embedding_data' in p and 'finishing_options' in p['embedding_data'] for p in products)}")
print(f"  - All have 'redirect_note': {all('generation_enhancers' in p and 'redirect_note' in p['generation_enhancers'] for p in products)}")

# Sample product
print(f"\n  Sample product keys: {list(products[0].keys())}")
print(f"  Sample ID: {products[0]['id']}")
print(f"  Sample category_slug: {products[0]['metadata']['category_slug']}")

# Verify business docs
with open('data/business.json', 'r', encoding='utf-8') as f:
    docs = json.load(f)

print("\n✓ Business docs verified:")
print(f"  - Total: {len(docs)}")
print(f"  - All have 'id': {all('id' in d for d in docs)}")
print(f"  - All have 'redirect_note': {all('generation_enhancers' in d and 'redirect_note' in d['generation_enhancers'] for d in docs)}")

# Extract unique categories for categories.json
categories = {}
for p in products:
    cat = p['metadata']['category']
    slug = p['metadata']['category_slug']
    if slug not in categories:
        categories[slug] = {
            'slug': slug,
            'name_vi': cat,
            'name_en': cat,  # Will be filled manually if needed
            'description': '',
            'product_count': 0
        }
    categories[slug]['product_count'] += 1

# Sort by product count
categories_list = sorted(categories.values(), key=lambda x: x['product_count'], reverse=True)

print("\n✓ Categories extracted:")
for cat in categories_list:
    print(f"  - {cat['slug']}: {cat['product_count']} products")

# Save categories.json
output = {
    'categories': categories_list,
    'metadata': {
        'total_products': len(products),
        'total_categories': len(categories_list),
        'created': 'Phase 0.3'
    }
}

with open('data/categories.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"\n✓ Created data/categories.json with {len(categories_list)} categories")
