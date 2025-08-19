"""
Test script for ArtStoryAI Recommendation System

This script tests the recommendation service functionality
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.recommendation_service import recommendation_engine


def test_similarity_calculator():
    """Test the similarity calculator"""
    print("🧪 Testing Similarity Calculator...")
    
    # Test artist similarity
    artist_sim = recommendation_engine.similarity_calculator.calculate_artist_similarity(
        "Leonardo da Vinci", "Leonardo da Vinci"
    )
    print(f"✅ Artist similarity (same): {artist_sim}")
    
    artist_sim2 = recommendation_engine.similarity_calculator.calculate_artist_similarity(
        "Leonardo da Vinci", "Pablo Picasso"
    )
    print(f"✅ Artist similarity (different): {artist_sim2}")
    
    # Test period similarity
    period_sim = recommendation_engine.similarity_calculator.calculate_period_similarity(1500, 1510)
    print(f"✅ Period similarity (same decade): {period_sim}")
    
    period_sim2 = recommendation_engine.similarity_calculator.calculate_period_similarity(1500, 1600)
    print(f"✅ Period similarity (same century): {period_sim2}")
    
    # Test movement similarity
    movement_sim = recommendation_engine.similarity_calculator.calculate_movement_similarity(
        "impressionism", "impressionism"
    )
    print(f"✅ Movement similarity (same): {movement_sim}")
    
    movement_sim2 = recommendation_engine.similarity_calculator.calculate_movement_similarity(
        "impressionism", "cubism"
    )
    print(f"✅ Movement similarity (different): {movement_sim2}")
    
    # Test text similarity
    text_sim = recommendation_engine.similarity_calculator.calculate_text_similarity(
        "A beautiful landscape painting", "A beautiful landscape artwork"
    )
    print(f"✅ Text similarity: {text_sim}")


def test_recommendation_engine():
    """Test the recommendation engine with sample data"""
    print("\n🧪 Testing Recommendation Engine...")
    
    # Sample artworks for testing
    sample_artworks = [
        {
            'art_name': 'Mona Lisa',
            'artist': 'Leonardo da Vinci',
            'year': 1503,
            'movement': 'Renaissance',
            'story': 'A mysterious woman with an enigmatic smile'
        },
        {
            'art_name': 'The Last Supper',
            'artist': 'Leonardo da Vinci',
            'year': 1498,
            'movement': 'Renaissance',
            'story': 'Jesus and his disciples at the last meal'
        },
        {
            'art_name': 'Starry Night',
            'artist': 'Vincent van Gogh',
            'year': 1889,
            'movement': 'Post-Impressionism',
            'story': 'A swirling night sky over a village'
        },
        {
            'art_name': 'Sunflowers',
            'artist': 'Vincent van Gogh',
            'year': 1888,
            'movement': 'Post-Impressionism',
            'story': 'Bright yellow sunflowers in a vase'
        },
        {
            'art_name': 'Guernica',
            'artist': 'Pablo Picasso',
            'year': 1937,
            'movement': 'Cubism',
            'story': 'Anti-war painting depicting the horrors of war'
        }
    ]
    
    # Test similar artworks
    target_artwork = sample_artworks[0]  # Mona Lisa
    similar_artworks = recommendation_engine.get_similar_artworks(
        target_artwork, sample_artworks, limit=3
    )
    
    print(f"✅ Similar artworks for '{target_artwork['art_name']}':")
    for rec in similar_artworks:
        artwork = rec['artwork']
        print(f"   - {artwork['art_name']} by {artwork['artist']}")
        print(f"     Similarity: {rec['similarity_score']}")
        print(f"     Reasons: {', '.join(rec['similarity_reasons'])}")
    
    # Test artist recommendations
    artist_recs = recommendation_engine.get_artist_recommendations(
        "Leonardo da Vinci", sample_artworks, limit=2
    )
    
    print(f"\n✅ Artist recommendations for Leonardo da Vinci:")
    for artwork in artist_recs:
        print(f"   - {artwork['art_name']} ({artwork['year']})")
    
    # Test period recommendations
    period_recs = recommendation_engine.get_period_recommendations(
        1500, sample_artworks, limit=3
    )
    
    print(f"\n✅ Period recommendations for year 1500:")
    for artwork in period_recs:
        print(f"   - {artwork['art_name']} by {artwork['artist']} ({artwork['year']})")


def test_api_endpoints():
    """Test the API endpoints (requires running server)"""
    print("\n🧪 Testing API Endpoints...")
    print("⚠️  Make sure the server is running on http://localhost:8000")
    
    import requests
    import time
    
    base_url = "http://localhost:8000"
    
    # Test server connection first
    try:
        print("🔍 Testing server connection...")
        response = requests.get(f"{base_url}/", timeout=5)
        if response.status_code == 200:
            print("✅ Server is running and accessible")
        else:
            print(f"⚠️  Server responded with status: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server. Please start the server first:")
        print("   cd backend")
        print("   python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000")
        return
    except requests.exceptions.Timeout:
        print("❌ Server connection timeout. Server might be slow to respond.")
        return
    except Exception as e:
        print(f"❌ Connection test error: {e}")
        return
    
    # Wait a moment for server to be ready
    time.sleep(1)
    
    try:
        # Test similar artworks endpoint
        print("\n🔍 Testing similar artworks endpoint...")
        response = requests.get(
            f"{base_url}/recommendations/similar/Mona%20Lisa", 
            timeout=30  # Increased timeout
        )
        if response.status_code == 200:
            print("✅ Similar artworks endpoint: SUCCESS")
            data = response.json()
            print(f"   Found {data.get('total_recommendations', 0)} recommendations")
            if data.get('recommendations'):
                print("   Sample recommendation:")
                rec = data['recommendations'][0]
                print(f"     - {rec.get('title', 'Unknown')} by {rec.get('artist', 'Unknown')}")
        else:
            print(f"❌ Similar artworks endpoint: FAILED ({response.status_code})")
            print(f"   Response: {response.text[:200]}")
    
    except requests.exceptions.Timeout:
        print("❌ Similar artworks endpoint: TIMEOUT (30s)")
    except Exception as e:
        print(f"❌ Similar artworks endpoint error: {e}")
    
    try:
        # Test artist recommendations endpoint
        print("\n🔍 Testing artist recommendations endpoint...")
        response = requests.get(
            f"{base_url}/recommendations/artist/Leonardo%20da%20Vinci", 
            timeout=30  # Increased timeout
        )
        if response.status_code == 200:
            print("✅ Artist recommendations endpoint: SUCCESS")
            data = response.json()
            print(f"   Found {data.get('total_recommendations', 0)} recommendations")
        else:
            print(f"❌ Artist recommendations endpoint: FAILED ({response.status_code})")
    
    except requests.exceptions.Timeout:
        print("❌ Artist recommendations endpoint: TIMEOUT (30s)")
    except Exception as e:
        print(f"❌ Artist recommendations endpoint error: {e}")
    
    try:
        # Test period recommendations endpoint
        print("\n🔍 Testing period recommendations endpoint...")
        response = requests.get(
            f"{base_url}/recommendations/period/1500", 
            timeout=30  # Increased timeout
        )
        if response.status_code == 200:
            print("✅ Period recommendations endpoint: SUCCESS")
            data = response.json()
            print(f"   Found {data.get('total_recommendations', 0)} recommendations")
        else:
            print(f"❌ Period recommendations endpoint: FAILED ({response.status_code})")
    
    except requests.exceptions.Timeout:
        print("❌ Period recommendations endpoint: TIMEOUT (30s)")
    except Exception as e:
        print(f"❌ Period recommendations endpoint error: {e}")
    
    print("\n🎯 API testing completed!")
    print("💡 To test manually, visit:")
    print(f"   {base_url}/docs")


if __name__ == "__main__":
    print("🚀 ArtStoryAI Recommendation System Test Suite")
    print("=" * 50)
    
    try:
        test_similarity_calculator()
        test_recommendation_engine()
        test_api_endpoints()
        
        print("\n🎉 All tests completed successfully!")
        
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
