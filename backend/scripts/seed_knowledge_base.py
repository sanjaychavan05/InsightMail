"""
Script to seed the knowledge base with sample documents
Run this after starting the backend to populate RAG knowledge
"""
import sys
import os
import asyncio
import httpx

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sample_data.sample_documents import SAMPLE_DOCUMENTS


async def seed_knowledge_base():
    """Seed knowledge base with sample documents"""
    
    api_url = "http://localhost:8000/api/kb/add"
    
    print("=" * 70)
    print("InsightMail Knowledge Base Seeding Script")
    print("=" * 70)
    print(f"\nSeeding {len(SAMPLE_DOCUMENTS)} documents into knowledge base...")
    print(f"API Endpoint: {api_url}\n")
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        success_count = 0
        failed_count = 0
        
        for idx, doc in enumerate(SAMPLE_DOCUMENTS, 1):
            try:
                print(f"[{idx}/{len(SAMPLE_DOCUMENTS)}] Adding: {doc['title']}")
                
                response = await client.post(api_url, json=doc)
                
                if response.status_code == 200:
                    print(f"    ✓ Successfully added (embedding generated)")
                    success_count += 1
                else:
                    print(f"    ✗ Failed: {response.status_code} - {response.text}")
                    failed_count += 1
                    
            except Exception as e:
                print(f"    ✗ Error: {str(e)}")
                failed_count += 1
            
            print()
    
    print("=" * 70)
    print("Seeding Complete!")
    print("=" * 70)
    print(f"✓ Successfully added: {success_count}")
    print(f"✗ Failed: {failed_count}")
    print(f"Total: {len(SAMPLE_DOCUMENTS)}\n")
    
    if success_count > 0:
        print("Knowledge base is now ready for RAG-powered email analysis!")
        print("The backend will use these documents to provide context-aware insights.\n")
    else:
        print("Warning: No documents were added successfully.")
        print("Please ensure:")
        print("  1. Backend is running on http://localhost:8000")
        print("  2. Ollama is running with nomic-embed-text model")
        print("  3. Run: ollama pull nomic-embed-text\n")


if __name__ == "__main__":
    print("\nStarting knowledge base seeding...\n")
    print("Prerequisites:")
    print("  ✓ Backend must be running on http://localhost:8000")
    print("  ✓ Ollama must be running with nomic-embed-text model")
    print("  ✓ Run: ollama pull nomic-embed-text if not installed\n")
    
    input("Press Enter to continue...")
    
    try:
        asyncio.run(seed_knowledge_base())
    except KeyboardInterrupt:
        print("\n\nSeeding interrupted by user.")
    except Exception as e:
        print(f"\n\nFatal error: {str(e)}")
        print("Please check that the backend is running and accessible.")
