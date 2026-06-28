"""
Quick test script to verify backend functionality
"""
import asyncio
import httpx
import json


async def test_backend():
    """Test all major backend endpoints"""
    
    base_url = "http://localhost:8000"
    
    print("=" * 70)
    print("InsightMail Backend Test Suite")
    print("=" * 70)
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        
        # Test 1: Health check
        print("\n[1/6] Testing health endpoint...")
        try:
            response = await client.get(f"{base_url}/health")
            if response.status_code == 200:
                print("    ✓ Health check passed")
            else:
                print(f"    ✗ Health check failed: {response.status_code}")
        except Exception as e:
            print(f"    ✗ Error: {str(e)}")
            return
        
        # Test 2: Get settings
        print("\n[2/6] Testing settings endpoint...")
        try:
            response = await client.get(f"{base_url}/api/settings")
            if response.status_code == 200:
                print("    ✓ Settings retrieved successfully")
            else:
                print(f"    ✗ Failed: {response.status_code}")
        except Exception as e:
            print(f"    ✗ Error: {str(e)}")
        
        # Test 3: Add to knowledge base
        print("\n[3/6] Testing knowledge base...")
        try:
            kb_data = {
                "title": "Test Policy - Email Etiquette",
                "content": "Always use professional language in business emails. Respond within 24 hours.",
                "document_type": "policy",
                "source": "Test Suite"
            }
            response = await client.post(f"{base_url}/api/kb/add", json=kb_data)
            if response.status_code == 200:
                print("    ✓ Knowledge base document added")
            else:
                print(f"    ✗ Failed: {response.status_code}")
        except Exception as e:
            print(f"    ✗ Error: {str(e)}")
        
        # Test 4: List knowledge base
        print("\n[4/6] Testing knowledge base list...")
        try:
            response = await client.get(f"{base_url}/api/kb/list")
            if response.status_code == 200:
                data = response.json()
                print(f"    ✓ Knowledge base has {data['total']} documents")
            else:
                print(f"    ✗ Failed: {response.status_code}")
        except Exception as e:
            print(f"    ✗ Error: {str(e)}")
        
        # Test 5: Analyze email
        print("\n[5/6] Testing email analysis...")
        try:
            email_data = {
                "email": "URGENT: We have a critical security breach. Customer data may be exposed. Need immediate action!",
                "tone": "professional"
            }
            print("    Analyzing email (this may take 10-30 seconds)...")
            response = await client.post(f"{base_url}/api/analyze", json=email_data)
            if response.status_code == 200:
                result = response.json()
                print("    ✓ Email analyzed successfully")
                print(f"      - Intent: {result['intent']}")
                print(f"      - Emotion: {result['emotion']}")
                print(f"      - Urgency: {result['urgency']}")
                print(f"      - Risk Score: {result['risk_score']}")
                print(f"      - Compliance Flags: {len(result['compliance_flags'])}")
            else:
                print(f"    ✗ Failed: {response.status_code}")
        except Exception as e:
            print(f"    ✗ Error: {str(e)}")
        
        # Test 6: Get analytics
        print("\n[6/6] Testing analytics endpoint...")
        try:
            response = await client.get(f"{base_url}/api/analytics")
            if response.status_code == 200:
                data = response.json()
                print(f"    ✓ Analytics generated")
                print(f"      - Total emails analyzed: {data['total_emails_analyzed']}")
                print(f"      - Average risk score: {data['average_risk_score']}")
            else:
                print(f"    ✗ Failed: {response.status_code}")
        except Exception as e:
            print(f"    ✗ Error: {str(e)}")
    
    print("\n" + "=" * 70)
    print("Testing Complete!")
    print("=" * 70)
    print("\nNext steps:")
    print("  1. Run seed_knowledge_base.py to add more RAG documents")
    print("  2. Start your frontend application")
    print("  3. Test the full integration\n")


if __name__ == "__main__":
    print("\nTesting backend endpoints...\n")
    print("Prerequisites:")
    print("  ✓ Backend running on http://localhost:8000")
    print("  ✓ Ollama running with gemma:2b and nomic-embed-text")
    
    try:
        asyncio.run(test_backend())
    except KeyboardInterrupt:
        print("\n\nTesting interrupted by user.")
    except Exception as e:
        print(f"\n\nError: {str(e)}")
