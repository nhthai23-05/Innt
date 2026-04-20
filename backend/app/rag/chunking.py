"""Document chunking strategies."""

from typing import List, TypedDict
from enum import Enum


class Chunk(TypedDict):
    """A text chunk with metadata."""
    content: str
    source_id: str
    source_type: str  # "product" or "business"
    metadata: dict


class ChunkingStrategy(str, Enum):
    """Chunking strategy options."""
    DOCUMENT = "document"
    FIELD = "field"
    AUGMENTED = "augmented"
    OVERLAP = "overlap"


class Chunker:
    """Document chunking engine."""
    
    def __init__(self, strategy: str = "document"):
        """Initialize chunker.
        
        Args:
            strategy: ChunkingStrategy enum value
        """
        self.strategy = strategy
    
    def chunk_product(self, product: dict) -> List[Chunk]:
        """Chunk a single product document.
        
        Args:
            product: Product dict from products.json
            
        Returns:
            List of chunks
        """
        if self.strategy == ChunkingStrategy.DOCUMENT:
            return self._chunk_product_document(product)
        elif self.strategy == ChunkingStrategy.FIELD:
            return self._chunk_product_field(product)
        elif self.strategy == ChunkingStrategy.AUGMENTED:
            return self._chunk_product_augmented(product)
        else:
            return self._chunk_product_document(product)
    
    def chunk_business(self, doc: dict) -> List[Chunk]:
        """Chunk a single business document.
        
        Args:
            doc: Business doc dict from business.json
            
        Returns:
            List of chunks
        """
        if self.strategy == ChunkingStrategy.DOCUMENT:
            return self._chunk_business_document(doc)
        elif self.strategy == ChunkingStrategy.FIELD:
            return self._chunk_business_field(doc)
        elif self.strategy == ChunkingStrategy.AUGMENTED:
            return self._chunk_business_augmented(doc)
        else:
            return self._chunk_business_document(doc)
    
    def _chunk_product_document(self, product: dict) -> List[Chunk]:
        """Document-level chunking: one chunk per product (Phase 1)."""
        product_id = product.get('id', 'unknown')
        product_name = product.get('embedding_data', {}).get('product_name', 'Unknown Product')
        
        # Combine all product information into a single comprehensive chunk
        parts = [
            f"📦 Sản phẩm: {product_name}",
            f"ID: {product_id}",
        ]
        
        # Detailed description
        if 'embedding_data' in product:
            desc = product['embedding_data'].get('detailed_description', '')
            if desc:
                parts.append(f"Mô tả: {desc}")
            
            # Use cases
            use_cases = product['embedding_data'].get('use_cases', [])
            if use_cases:
                parts.append("Công dụng: " + ", ".join(use_cases))
        
        # Technical specs
        if 'metadata' in product:
            specs = product['metadata'].get('technical_specs', {})
            if specs:
                spec_strs = [f"{k}: {v}" for k, v in specs.items()]
                parts.append("Thông số kỹ thuật: " + "; ".join(spec_strs))
        
        content = "\n".join(parts)
        
        return [Chunk(
            content=content,
            source_id=product_id,
            source_type="product",
            metadata={
                "category": product.get('metadata', {}).get('category', 'Unknown'),
                "category_slug": product.get('metadata', {}).get('category_slug', ''),
                "product_name": product_name,
                "image_urls": product.get('generation_enhancers', {}).get('image_url', []),
            }
        )]
    
    def _chunk_product_field(self, product: dict) -> List[Chunk]:
        """Field-level chunking: separate chunks for each product field."""
        chunks = []
        product_id = product.get('id', 'unknown')
        product_name = product.get('embedding_data', {}).get('product_name', 'Unknown Product')
        
        base_metadata = {
            "category": product.get('metadata', {}).get('category', 'Unknown'),
            "category_slug": product.get('metadata', {}).get('category_slug', ''),
            "product_name": product_name,
        }
        
        # Chunk 1: Product description
        if 'embedding_data' in product:
            desc = product['embedding_data'].get('detailed_description', '')
            if desc:
                chunks.append(Chunk(
                    content=f"Sản phẩm: {product_name}\nMô tả: {desc}",
                    source_id=product_id,
                    source_type="product",
                    metadata={**base_metadata, "field": "description"}
                ))
        
        # Chunk 2: Use cases
        if 'embedding_data' in product:
            use_cases = product['embedding_data'].get('use_cases', [])
            if use_cases:
                content = f"Sản phẩm: {product_name}\nCông dụng: " + ", ".join(use_cases)
                chunks.append(Chunk(
                    content=content,
                    source_id=product_id,
                    source_type="product",
                    metadata={**base_metadata, "field": "use_cases"}
                ))
        
        # Chunk 3: Technical specs
        if 'metadata' in product:
            specs = product['metadata'].get('technical_specs', {})
            if specs:
                spec_strs = [f"{k}: {v}" for k, v in specs.items()]
                content = f"Sản phẩm: {product_name}\nThông số kỹ thuật: " + "; ".join(spec_strs)
                chunks.append(Chunk(
                    content=content,
                    source_id=product_id,
                    source_type="product",
                    metadata={**base_metadata, "field": "specs"}
                ))
        
        # If no chunks created, create document-level chunk as fallback
        if not chunks:
            chunks = self._chunk_product_document(product)
        
        return chunks
    
    def _chunk_product_augmented(self, product: dict) -> List[Chunk]:
        """Augmented chunking: combines descriptions with use cases and specs."""
        # For Phase 1, same as document-level
        return self._chunk_product_document(product)
    
    def _chunk_business_document(self, doc: dict) -> List[Chunk]:
        """Document-level chunking for business docs."""
        doc_id = doc.get('id', 'unknown')
        doc_title = doc.get('embedding_data', {}).get('document_title', 'Unknown Document')
        
        # Combine all information
        parts = [
            f"📄 Tài liệu: {doc_title}",
            f"ID: {doc_id}",
        ]
        
        # Description
        if 'embedding_data' in doc:
            desc = doc['embedding_data'].get('detailed_description', '')
            if desc:
                parts.append(f"Nội dung: {desc}")
            
            # Key highlights
            highlights = doc['embedding_data'].get('key_highlights', [])
            if highlights:
                parts.append("Điểm nổi bật: " + "; ".join(highlights))
        
        content = "\n".join(parts)
        
        return [Chunk(
            content=content,
            source_id=doc_id,
            source_type="business",
            metadata={
                "category": doc.get('metadata', {}).get('category', 'Unknown'),
                "doc_title": doc_title,
            }
        )]
    
    def _chunk_business_field(self, doc: dict) -> List[Chunk]:
        """Field-level chunking for business docs."""
        chunks = []
        doc_id = doc.get('id', 'unknown')
        doc_title = doc.get('embedding_data', {}).get('document_title', 'Unknown Document')
        
        base_metadata = {
            "category": doc.get('metadata', {}).get('category', 'Unknown'),
            "doc_title": doc_title,
        }
        
        # Chunk 1: Main description
        if 'embedding_data' in doc:
            desc = doc['embedding_data'].get('detailed_description', '')
            if desc:
                chunks.append(Chunk(
                    content=f"Tài liệu: {doc_title}\nNội dung: {desc}",
                    source_id=doc_id,
                    source_type="business",
                    metadata={**base_metadata, "field": "description"}
                ))
        
        # Chunk 2: Key highlights
        if 'embedding_data' in doc:
            highlights = doc['embedding_data'].get('key_highlights', [])
            if highlights:
                content = f"Tài liệu: {doc_title}\nĐiểm nổi bật: " + "; ".join(highlights)
                chunks.append(Chunk(
                    content=content,
                    source_id=doc_id,
                    source_type="business",
                    metadata={**base_metadata, "field": "highlights"}
                ))
        
        # If no chunks created, create document-level chunk as fallback
        if not chunks:
            chunks = self._chunk_business_document(doc)
        
        return chunks
    
    def _chunk_business_augmented(self, doc: dict) -> List[Chunk]:
        """Augmented chunking for business docs."""
        # For Phase 1, same as document-level
        return self._chunk_business_document(doc)
