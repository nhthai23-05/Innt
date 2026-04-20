#!/usr/bin/env python3
"""Interactive RAG testing - type queries and get responses."""

import sys
import io

# Force UTF-8 encoding
if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from app.rag.pipeline import RagPipeline

def main():
    """Interactive RAG loop."""
    print("=" * 80)
    print("RAG INTERACTIVE TESTING")
    print("=" * 80)
    print("Initializing RAG pipeline...")
    
    rag = RagPipeline()
    
    print("✓ RAG pipeline loaded!")
    print("\nType your question in Vietnamese and press Enter.")
    print("Type 'exit' or 'quit' to stop.\n")
    
    while True:
        try:
            question = input("\n📝 Your question: ").strip()
            
            if question.lower() in ['exit', 'quit', 'q']:
                print("\nGoodbye! 👋")
                break
            
            if not question:
                print("⚠️  Please enter a question!")
                continue
            
            print("\n⏳ Processing...")
            result = rag.query(question)
            
            print("\n" + "=" * 80)
            print("ANSWER:")
            print("=" * 80)
            print(result['answer'])
            
            print("\n" + "=" * 80)
            print("SOURCES (Retrieved Documents):")
            print("=" * 80)
            for i, source in enumerate(result['sources'], 1):
                print(f"{i}. {source}")
            
        except Exception as e:
            print(f"\n❌ Error: {e}")
            print("Please try again.\n")

if __name__ == "__main__":
    main()
