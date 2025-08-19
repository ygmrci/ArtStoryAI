"""
Simple In-Memory Cache Service for ArtStoryAI
Temporary replacement for Redis cache
"""

import time
from typing import Any, Optional, Dict
import asyncio

class SimpleCacheService:
    """Simple in-memory cache service"""
    
    def __init__(self):
        self.cache: Dict[str, Any] = {}
        self.cache_ttl: Dict[str, float] = {}
        self.default_ttl = 3600
        self.stats = {
            "hits": 0,
            "misses": 0,
            "sets": 0,
            "deletes": 0
        }
    
    async def connect(self):
        """Initialize cache (no-op for simple cache)"""
        print("✅ Simple cache initialized")
        return True
    
    async def disconnect(self):
        """Cleanup cache (no-op for simple cache)"""
        print("✅ Simple cache disconnected")
        return True
    
    async def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        if key in self.cache:
            # Check TTL
            if key in self.cache_ttl:
                if time.time() > self.cache_ttl[key]:
                    # Expired, remove
                    del self.cache[key]
                    del self.cache_ttl[key]
                    self.stats["misses"] += 1
                    return None
            
            self.stats["hits"] += 1
            return self.cache[key]
        
        self.stats["misses"] += 1
        return None
    
    async def set(self, key: str, value: Any, ttl: Optional[int] = None) -> bool:
        """Set value in cache"""
        self.cache[key] = value
        
        if ttl is None:
            ttl = self.default_ttl
        
        self.cache_ttl[key] = time.time() + ttl
        self.stats["sets"] += 1
        return True
    
    async def delete(self, key: str) -> bool:
        """Delete key from cache"""
        if key in self.cache:
            del self.cache[key]
            if key in self.cache_ttl:
                del self.cache_ttl[key]
            self.stats["deletes"] += 1
            return True
        return False
    
    async def exists(self, key: str) -> bool:
        """Check if key exists and is not expired"""
        if key in self.cache:
            if key in self.cache_ttl:
                if time.time() > self.cache_ttl[key]:
                    # Expired, remove
                    del self.cache[key]
                    del self.cache_ttl[key]
                    return False
            return True
        return False
    
    async def expire(self, key: str, ttl: int) -> bool:
        """Set TTL for key"""
        if key in self.cache:
            self.cache_ttl[key] = time.time() + ttl
            return True
        return False
    
    async def clear_pattern(self, pattern: str) -> int:
        """Clear keys matching pattern"""
        cleared_count = 0
        keys_to_delete = []
        
        for key in list(self.cache.keys()):
            if pattern == "*" or pattern in key:
                keys_to_delete.append(key)
        
        for key in keys_to_delete:
            await self.delete(key)
            cleared_count += 1
        
        return cleared_count
    
    async def clear_all(self) -> int:
        """Clear all cache"""
        count = len(self.cache)
        self.cache.clear()
        self.cache_ttl.clear()
        return count
    
    async def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        return {
            "total_keys": len(self.cache),
            "hits": self.stats["hits"],
            "misses": self.stats["misses"],
            "sets": self.stats["sets"],
            "deletes": self.stats["deletes"],
            "hit_rate": self.stats["hits"] / (self.stats["hits"] + self.stats["misses"]) if (self.stats["hits"] + self.stats["misses"]) > 0 else 0
        }
    
    async def health_check(self) -> Dict[str, Any]:
        """Check cache health"""
        return {
            "status": "healthy",
            "type": "simple_in_memory",
            "total_keys": len(self.cache),
            "memory_usage": "minimal"
        }

# Create global instance
redis_cache = SimpleCacheService()

def redis_cache_decorator(ttl: int = 3600, key_prefix: str = ""):
    """Cache decorator for functions"""
    def decorator(func):
        async def wrapper(*args, **kwargs):
            # Generate cache key
            cache_key = f"{key_prefix}:{func.__name__}:{hash(str(args) + str(kwargs))}"
            
            # Try to get from cache
            cached_result = await redis_cache.get(cache_key)
            if cached_result is not None:
                return cached_result
            
            # Execute function
            result = await func(*args, **kwargs)
            
            # Cache result
            await redis_cache.set(cache_key, result, ttl)
            
            return result
        return wrapper
    return decorator
