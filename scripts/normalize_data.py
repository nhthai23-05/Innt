#!/usr/bin/env python3
"""Phase 0.1 & 0.2: Normalize products.json and business.json"""

import json
import re
from pathlib import Path
from typing import Dict, List


def slugify(text: str) -> str:
    """Convert Vietnamese text to ASCII kebab-case slug."""
    # Vietnamese character mapping
    vietnamese_map = {
        'á': 'a', 'à': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
        'ă': 'a', 'ắ': 'a', 'ằ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
        'â': 'a', 'ấ': 'a', 'ầ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
        'é': 'e', 'è': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
        'ê': 'e', 'ế': 'e', 'ề': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
        'í': 'i', 'ì': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
        'ó': 'o', 'ò': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
        'ô': 'o', 'ố': 'o', 'ồ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
        'ơ': 'o', 'ớ': 'o', 'ờ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
        'ú': 'u', 'ù': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
        'ư': 'u', 'ứ': 'u', 'ừ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
        'ý': 'y', 'ỳ': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
        'đ': 'd',
    }
    
    # Convert to lowercase and replace Vietnamese chars
    slug = text.lower()
    for viet, latin in vietnamese_map.items():
        slug = slug.replace(viet, latin)
    
    # Remove non-alphanumeric and replace spaces/hyphens with dash
    slug = re.sub(r'[^a-z0-9\s\-]', '', slug)
    slug = re.sub(r'[\s\-]+', '-', slug).strip('-')
    
    return slug


def create_category_map() -> Dict[str, str]:
    """Map Vietnamese category names to slugs."""
    return {
        "Phong bì": "phong-bi",
        "Tờ rơi": "to-roi",
        "Tờ gấp": "to-gap",
        "Túi giấy": "tui-giay",
        "Tem nhãn": "tem-nhan",
        "Biểu mẫu - Hóa đơn": "bieu-mau-hoa-don",
        "Danh thiếp - Name card": "danh-thiep-name-card",
    }


def normalize_products(input_file: str, output_file: str) -> None:
    """Normalize products.json with id, category_slug, and other required fields."""
    
    print(f"Reading {input_file}...")
    with open(input_file, 'r', encoding='utf-8') as f:
        products = json.load(f)
    
    category_map = create_category_map()
    
    # Track used IDs to avoid duplicates
    used_ids = set()
    
    print(f"Normalizing {len(products)} products...")
    
    for i, product in enumerate(products):
        # 1. Generate ID from product name
        product_name = product.get('embedding_data', {}).get('product_name', f'product-{i}')
        base_slug = slugify(product_name)
        slug = base_slug
        counter = 1
        while slug in used_ids:
            slug = f"{base_slug}-{counter}"
            counter += 1
        used_ids.add(slug)
        product['id'] = slug
        
        # 2. Add category_slug from category mapping
        category = product.get('metadata', {}).get('category', 'unknown')
        if category in category_map:
            product['metadata']['category_slug'] = category_map[category]
        else:
            product['metadata']['category_slug'] = slugify(category)
            print(f"  WARNING: Unmapped category '{category}' for product {i}")
        
        # 3. Add finishing_options (extract from technical_specs if present)
        if 'embedding_data' not in product:
            product['embedding_data'] = {}
        
        finishing_options = []
        specs = product.get('metadata', {}).get('technical_specs', {})
        
        # Extract finishing options from technical specs
        if 'colors' in specs:
            finishing_options.append(specs['colors'])
        
        # Product-specific finishing detection
        product_name_lower = product_name.lower()
        if 'cán' in product_name_lower or 'cán màng' in product.get('embedding_data', {}).get('detailed_description', '').lower():
            finishing_options.append('Cán màng')
        if 'bế' in product_name_lower or 'bế khuôn' in product.get('embedding_data', {}).get('detailed_description', '').lower():
            finishing_options.append('Bế khuôn')
        if 'xén' in product_name_lower or 'xén' in product.get('embedding_data', {}).get('detailed_description', '').lower():
            finishing_options.append('Xén')
        if 'gập' in product_name_lower:
            finishing_options.append('Gập')
        if 'dán' in product_name_lower or 'dán' in product.get('embedding_data', {}).get('detailed_description', '').lower():
            finishing_options.append('Dán')
        
        product['embedding_data']['finishing_options'] = list(set(finishing_options)) if finishing_options else []
        
        # 4. Add redirect_note (empty for now, will be filled during generation)
        if 'generation_enhancers' not in product:
            product['generation_enhancers'] = {}
        product['generation_enhancers']['redirect_note'] = ""
    
    print(f"Writing normalized products to {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=2)
    
    print(f"✓ Normalized {len(products)} products")
    print(f"  - Added 'id' field to all products")
    print(f"  - Added 'category_slug' mapping")
    print(f"  - Added 'finishing_options' from specs")
    print(f"  - Added empty 'redirect_note' field")


def normalize_business(input_file: str, output_file: str) -> None:
    """Normalize business.json with id and other required fields."""
    
    print(f"\nReading {input_file}...")
    with open(input_file, 'r', encoding='utf-8') as f:
        docs = json.load(f)
    
    print(f"Normalizing {len(docs)} business documents...")
    
    for i, doc in enumerate(docs):
        # 1. Generate ID from document title
        doc_title = doc.get('embedding_data', {}).get('document_title', f'doc-{i}')
        doc['id'] = slugify(doc_title)
        
        # 2. Add redirect_note (empty for now)
        if 'generation_enhancers' not in doc:
            doc['generation_enhancers'] = {}
        doc['generation_enhancers']['redirect_note'] = ""
        
        # 3. Handle contact information (fill empty fields with placeholders)
        if doc['metadata'].get('category') == 'Contact Information':
            # These should be filled by the team later
            if not doc['metadata'].get('address'):
                doc['metadata']['address'] = "[TO_BE_FILLED: Company Address]"
            if not doc['metadata'].get('hotline'):
                doc['metadata']['hotline'] = "[TO_BE_FILLED: Hotline Number]"
            if not doc['metadata'].get('email'):
                doc['metadata']['email'] = "[TO_BE_FILLED: Email Address]"
    
    print(f"Writing normalized business docs to {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(docs, f, ensure_ascii=False, indent=2)
    
    print(f"✓ Normalized {len(docs)} business documents")
    print(f"  - Added 'id' field to all documents")
    print(f"  - Added empty 'redirect_note' field")
    print(f"  - Filled empty contact info with placeholders")


if __name__ == '__main__':
    # Phase 0.1: Normalize products
    normalize_products('data/products.json', 'data/products.json')
    
    # Phase 0.2: Normalize business docs
    normalize_business('data/business.json', 'data/business.json')
    
    print("\n" + "="*60)
    print("Phase 0.1 & 0.2 Complete!")
    print("="*60)
