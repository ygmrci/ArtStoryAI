#!/usr/bin/env python3
"""
API Endpoints Test Script
Tests cache endpoints and recommendation system
"""

import requests
import time
import json

def test_api_endpoints():
    """Test all cache-related API endpoints"""
    base_url = "http://localhost:8000"
    
    print("🚀 Testing API Endpoints...\n")
    
    # Wait for server to start
    print("⏳ Waiting for server to start...")
    for i in range(10):
        try:
            response = requests.get(f"{base_url}/docs", timeout=5)
            if response.status_code == 200:
                print("✅ Server is running!")
                break
        except requests.exceptions.RequestException:
            pass
        time.sleep(2)
        print(f"   Attempt {i+1}/10...")
    else:
        print("❌ Server did not start in time")
        return
    
    # Test cache stats endpoint
    print("\n📊 Testing cache stats endpoint...")
    try:
        response = requests.get(f"{base_url}/recommendations/cache/stats")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            stats = response.json()
            print("Cache Stats:")
            for key, value in stats.items():
                print(f"  {key}: {value}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"❌ Error testing cache stats: {e}")
    
    # Test cache keys endpoint
    print("\n🔑 Testing cache keys endpoint...")
    try:
        response = requests.get(f"{base_url}/recommendations/cache/keys")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            keys = response.json()
            print(f"Cache Keys: {keys}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"❌ Error testing cache keys: {e}")
    
    # Test recommendation endpoint (to populate cache)
    print("\n🎨 Testing recommendation endpoint...")
    try:
        response = requests.get(f"{base_url}/recommendations/Sunflowers?limit=3")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            recommendations = response.json()
            print(f"Recommendations for Sunflowers: {len(recommendations)} items")
            for rec in recommendations[:2]:  # Show first 2
                print(f"  - {rec.get('title', 'Unknown')}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"❌ Error testing recommendations: {e}")
    
    # Test cache stats again (should show cached data)
    print("\n📊 Testing cache stats after recommendations...")
    try:
        response = requests.get(f"{base_url}/recommendations/cache/stats")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            stats = response.json()
            print("Updated Cache Stats:")
            for key, value in stats.items():
                print(f"  {key}: {value}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"❌ Error testing cache stats: {e}")
    
    # Test cache clear endpoint
    print("\n🧹 Testing cache clear endpoint...")
    try:
        response = requests.delete(f"{base_url}/recommendations/cache/clear")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Cache cleared: {result}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"❌ Error testing cache clear: {e}")
    
    print("\n🎉 API endpoint tests completed!")

if __name__ == "__main__":
    test_api_endpoints()
