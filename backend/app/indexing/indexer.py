"""ChromaDB indexing module."""

import json
import argparse
from pathlib import Path
import chromadb
from app.config import settings
from app.rag.embeddings import Embedder
from app.rag.chunking import Chunker


class IndexBuilder:
    """Builds and maintains ChromaDB index."""
    
    def __init__(self, collection_name: str = "documents"):
        """Initialize index builder.
        
        Args:
            collection_name: ChromaDB collection name
        """
        self.collection_name = collection_name
        self.embedder = Embedder()
        self.chunker = Chunker(strategy=settings.chunking_strategy)
        self.client = chromadb.PersistentClient(path=settings.chroma_persist_dir)
    
    def rebuild_index(self):
        """Rebuild the entire index from scratch (data-source of truth).
        
        This method:
        1. Deletes the existing collection (if any)
        2. Creates a fresh collection
        3. Loads all documents from data/
        4. Chunks and embeds them
        5. Upserts into ChromaDB
        """
        print(f"🔨 Rebuilding index '{self.collection_name}'...")
        
        # Step 1: Delete existing collection
        try:
            self.client.delete_collection(name=self.collection_name)
            print(f"  ✓ Deleted existing collection")
        except Exception:
            print(f"  ℹ️ No existing collection to delete")
        
        # Step 2: Create new collection with cosine distance metric
        collection = self.client.get_or_create_collection(
            name=self.collection_name,
            metadata={"hnsw:space": "cosine"}
        )
        print(f"  ✓ Created new collection with cosine distance metric")
        
        # Step 3: Load and chunk products
        products_file = settings.data_dir / "products.json"
        if products_file.exists():
            with open(products_file, "r", encoding="utf-8") as f:
                products = json.load(f)
            
            print(f"  📦 Processing {len(products)} products...")
            product_chunks = []
            for product in products:
                chunks = self.chunker.chunk_product(product)
                product_chunks.extend(chunks)
            
            print(f"    → Created {len(product_chunks)} product chunks")
        else:
            print(f"  ⚠️  Products file not found: {products_file}")
            product_chunks = []
        
        # Step 4: Load and chunk business documents
        business_file = settings.data_dir / "business.json"
        if business_file.exists():
            with open(business_file, "r", encoding="utf-8") as f:
                business_docs = json.load(f)
            
            print(f"  📄 Processing {len(business_docs)} business documents...")
            business_chunks = []
            for doc in business_docs:
                chunks = self.chunker.chunk_business(doc)
                business_chunks.extend(chunks)
            
            print(f"    → Created {len(business_chunks)} business chunks")
        else:
            print(f"  ⚠️  Business file not found: {business_file}")
            business_chunks = []
        
        # Combine all chunks
        all_chunks = product_chunks + business_chunks
        print(f"  📊 Total chunks: {len(all_chunks)}")
        
        if not all_chunks:
            print("  ⚠️  No chunks to index!")
            return
        
        # Step 5: Embed all chunks
        print(f"  🧠 Embedding {len(all_chunks)} chunks...")
        chunk_texts = [chunk["content"] for chunk in all_chunks]
        embeddings = self.embedder.embed(chunk_texts)
        print(f"    → Embedding dimension: {embeddings.shape[1]}")
        
        # Step 6: Upsert into ChromaDB
        print(f"  💾 Upserting into ChromaDB...")
        
        ids = []
        documents = []
        metadatas = []
        embeddings_list = []
        
        for i, chunk in enumerate(all_chunks):
            # Create unique ID: source_type-source_id-chunk_index
            chunk_id = f"{chunk['source_type']}-{chunk['source_id']}-{i}"
            ids.append(chunk_id)
            documents.append(chunk["content"])
            metadatas.append(chunk["metadata"])
            embeddings_list.append(embeddings[i].tolist())
        
        # Upsert in batches to avoid memory issues
        batch_size = 100
        for batch_start in range(0, len(ids), batch_size):
            batch_end = min(batch_start + batch_size, len(ids))
            collection.upsert(
                ids=ids[batch_start:batch_end],
                documents=documents[batch_start:batch_end],
                metadatas=metadatas[batch_start:batch_end],
                embeddings=embeddings_list[batch_start:batch_end],
            )
            print(f"    → Upserted batch {batch_start//batch_size + 1} ({batch_end}/{len(ids)})")
        
        print(f"  ✅ Index rebuild complete!")
        print(f"     Total documents indexed: {collection.count()}")
    
    def get_collection(self):
        """Get the ChromaDB collection."""
        return self.client.get_collection(name=self.collection_name)


def main():
    """CLI entry point."""
    parser = argparse.ArgumentParser(description="ChromaDB index management")
    parser.add_argument(
        "--rebuild",
        action="store_true",
        help="Rebuild the entire index from scratch"
    )
    
    args = parser.parse_args()
    
    builder = IndexBuilder()
    
    if args.rebuild:
        builder.rebuild_index()
    else:
        # Default: just check status
        try:
            collection = builder.get_collection()
            print(f"✓ Collection '{builder.collection_name}' exists")
            print(f"  Documents: {collection.count()}")
        except Exception as e:
            print(f"✗ Collection not found: {e}")
            print(f"  Run with --rebuild to create it first")


if __name__ == "__main__":
    main()
