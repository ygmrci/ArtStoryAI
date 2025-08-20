#!/usr/bin/env python3
"""
Test script for Redis Cache System
Tests Redis connection and cache functionality
"""

import asyncio
import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

async def test_redis_cache():
    """Test Redis cache functionality"""
    print("🧪 Testing Redis Cache System...")
    
    try:
        from app.redis_cache_service import redis_cache
        
        # Test connection
        print("  🔌 Testing Redis connection...")
        connected = await redis_cache.connect()
        
        if connected:
            print("  ✅ Redis connection successful!")
            
            # Test basic operations
            print("  📝 Testing cache operations...")
            
            # Test set
            test_key = "test:artwork:mona_lisa"
            test_value = {
                "title": "Mona Lisa",
                "artist": "Leonardo da Vinci",
                "year": 1503
            }
            
            set_result = await redis_cache.set(test_key, test_value, ttl=60)
            print(f"  📤 Set operation: {'✅' if set_result else '❌'}")
            
            # Test get
            get_result = await redis_cache.get(test_key)
            if get_result == test_value:
                print("  📥 Get operation: ✅")
            else:
                print(f"  📥 Get operation: ❌ (Expected: {test_value}, Got: {get_result})")
            
            # Test stats
            stats = await redis_cache.get_stats()
            print(f"  📊 Cache stats: {stats}")
            
            # Test health check
            health = await redis_cache.health_check()
            print(f"  🏥 Health check: {'✅' if health else '❌'}")
            
            # Cleanup
            await redis_cache.delete(test_key)
            print("  🧹 Cleanup completed")
            
        else:
            print("  ❌ Redis connection failed!")
            print("  💡 Make sure Redis server is running")
            print("  💡 Or Redis is not available in your environment")
        
        # Disconnect
        await redis_cache.disconnect()
        print("  🔌 Redis disconnected")
        
    except ImportError as e:
        print(f"  ❌ Import error: {e}")
        print("  💡 Make sure Redis dependencies are installed")
    except Exception as e:
        print(f"  ❌ Test failed: {e}")

async def test_hybrid_cache():
    """Test hybrid cache (Redis + In-Memory)"""
    print("\n🔄 Testing Hybrid Cache System...")
    
    try:
        from app.cache_service import artwork_cache
        
        # Test hybrid cache
        test_key = "hybrid:test:starry_night"
        test_value = {
            "title": "The Starry Night",
            "artist": "Vincent van Gogh",
            "year": 1889
        }
        
        # Set in hybrid cache (sync version)
        artwork_cache.set_sync(test_key, test_value, ttl=60)
        print("  📤 Value set in hybrid cache")
        
        # Get from hybrid cache (sync version)
        result = artwork_cache.get_sync(test_key)
        if result == test_value:
            print("  📥 Hybrid cache get: ✅")
        else:
            print(f"  📥 Hybrid cache get: ❌ (Expected: {test_value}, Got: {result})")
        
        # Get stats
        stats = artwork_cache.get_stats()
        print(f"  📊 Hybrid cache stats: {stats}")
        
        # Cleanup
        artwork_cache.delete(test_key)
        print("  🧹 Hybrid cache cleanup completed")
        
    except Exception as e:
        print(f"  ❌ Hybrid cache test failed: {e}")

async def main():
    """Main test function"""
    print("🚀 ArtStoryAI Redis Cache Test Suite")
    print("=" * 50)
    
    # Test Redis cache
    await test_redis_cache()
    
    # Test hybrid cache
    await test_hybrid_cache()
    
    print("\n" + "=" * 50)
    print("✨ Redis Cache Test Suite Completed!")

if __name__ == "__main__":
    asyncio.run(main())
