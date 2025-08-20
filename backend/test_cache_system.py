#!/usr/bin/env python3
"""
Cache System Test Script
Tests both Redis and Simple cache implementations
"""

import asyncio
import time
from app.simple_cache import SimpleCacheService
from app.redis_cache import RedisCacheService

async def test_simple_cache():
    """Test simple in-memory cache"""
    print("🧪 Testing Simple Cache...")
    
    cache = SimpleCacheService()
    await cache.connect()
    
    # Test basic operations
    print("  📝 Setting test key...")
    await cache.set("test_key", "test_value", 10)
    
    print("  🔍 Getting test key...")
    value = await cache.get("test_key")
    print(f"  ✅ Retrieved value: {value}")
    
    print("  🔍 Checking if key exists...")
    exists = await cache.exists("test_key")
    print(f"  ✅ Key exists: {exists}")
    
    # Test TTL
    print("  ⏰ Testing TTL (5 seconds)...")
    await cache.set("ttl_test", "ttl_value", 5)
    value = await cache.get("ttl_test")
    print(f"  ✅ Value before TTL: {value}")
    
    print("  ⏳ Waiting 6 seconds for TTL...")
    await asyncio.sleep(6)
    
    value = await cache.get("ttl_test")
    print(f"  ✅ Value after TTL: {value}")
    
    # Test stats
    print("  📊 Cache stats:")
    stats = await cache.get_stats()
    for key, value in stats.items():
        print(f"    {key}: {value}")
    
    await cache.disconnect()
    print("  ✅ Simple cache test completed!\n")

async def test_redis_cache():
    """Test Redis cache (if available)"""
    print("🧪 Testing Redis Cache...")
    
    try:
        cache = RedisCacheService()
        await cache.connect()
        
        print("  📝 Setting test key...")
        await cache.set("redis_test", "redis_value", 10)
        
        print("  🔍 Getting test key...")
        value = await cache.get("redis_test")
        print(f"  ✅ Retrieved value: {value}")
        
        await cache.disconnect()
        print("  ✅ Redis cache test completed!\n")
        
    except Exception as e:
        print(f"  ❌ Redis cache test failed: {e}")
        print("  ℹ️  Redis server is not running or not available\n")

async def test_recommendation_cache():
    """Test recommendation cache integration"""
    print("🧪 Testing Recommendation Cache...")
    
    try:
        from app.recommendation_system import ArtworkRecommendationSystem
        from app.simple_cache import SimpleCacheService
        
        cache = SimpleCacheService()
        await cache.connect()
        
        # Test recommendation caching
        print("  📝 Setting recommendation cache...")
        test_recommendations = {
            "artwork_id": "test_artwork",
            "recommendations": ["rec1", "rec2", "rec3"],
            "timestamp": time.time()
        }
        
        await cache.set("rec:test_artwork", test_recommendations, 3600)
        
        print("  🔍 Getting recommendation cache...")
        cached_recs = await cache.get("rec:test_artwork")
        print(f"  ✅ Retrieved recommendations: {cached_recs}")
        
        await cache.disconnect()
        print("  ✅ Recommendation cache test completed!\n")
        
    except Exception as e:
        print(f"  ❌ Recommendation cache test failed: {e}\n")

async def main():
    """Run all cache tests"""
    print("🚀 Starting Cache System Tests...\n")
    
    await test_simple_cache()
    await test_redis_cache()
    await test_recommendation_cache()
    
    print("🎉 All cache tests completed!")

if __name__ == "__main__":
    asyncio.run(main())
