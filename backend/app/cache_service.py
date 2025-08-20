"""
Cache Service for ArtStoryAI
Provides hybrid caching (in-memory + Redis) for artwork information and images
"""

import time
from typing import Dict, Any, Optional
from functools import lru_cache
import hashlib
import json
import logging

logger = logging.getLogger(__name__)

class ArtworkCache:
    """Hybrid cache for artwork data (in-memory + Redis)"""
    
    def __init__(self):
        self.cache: Dict[str, Dict[str, Any]] = {}
        self.cache_ttl: Dict[str, float] = {}
        self.default_ttl = 3600  # 1 saat
        self.redis_enabled = False
        
        # Try to import Redis cache
        try:
            from .redis_cache_service import redis_cache
            self.redis_cache = redis_cache
            self.redis_enabled = True
            logger.info("Redis cache enabled")
        except ImportError:
            logger.warning("Redis cache not available, using in-memory only")
            self.redis_cache = None
    
    def _generate_key(self, data: str) -> str:
        """Generate cache key from data"""
        return hashlib.md5(data.encode()).hexdigest()
    
    async def get(self, key: str) -> Optional[Any]:
        """Get value from cache if not expired (Redis first, then in-memory)"""
        # Try Redis first if available
        if self.redis_enabled and self.redis_cache:
            try:
                redis_result = await self.redis_cache.get(key)
                if redis_result is not None:
                    logger.info(f"Redis cache hit for key: {key}")
                    return redis_result
            except Exception as e:
                logger.warning(f"Redis get error, falling back to in-memory: {e}")
        
        # Fallback to in-memory cache
        if key not in self.cache:
            return None
        
        # Check if expired
        if time.time() > self.cache_ttl.get(key, 0):
            self.delete(key)
            return None
        
        logger.info(f"In-memory cache hit for key: {key}")
        return self.cache[key]
    
    async def set(self, key: str, value: Any, ttl: int = None) -> None:
        """Set value in cache with TTL (Redis first, then in-memory)"""
        # Try Redis first if available
        if self.redis_enabled and self.redis_cache:
            try:
                await self.redis_cache.set(key, value, ttl or self.default_ttl)
                logger.info(f"Value cached in Redis for key: {key}")
            except Exception as e:
                logger.warning(f"Redis set error, falling back to in-memory: {e}")
        
        # Always set in in-memory cache as backup
        self.cache[key] = value
        self.cache_ttl[key] = time.time() + (ttl or self.default_ttl)
        logger.info(f"Value cached in memory for key: {key}")
    
    def delete(self, key: str) -> None:
        """Delete key from cache"""
        if key in self.cache:
            del self.cache[key]
        if key in self.cache_ttl:
            del self.cache_ttl[key]
    
    def clear(self) -> None:
        """Clear all cache"""
        self.cache.clear()
        self.cache_ttl.clear()
    
    def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        return {
            "total_keys": len(self.cache),
            "memory_usage": len(str(self.cache)),
            "expired_keys": len([k for k, v in self.cache_ttl.items() if time.time() > v])
        }
    
    # Sync methods for backward compatibility
    def get_sync(self, key: str) -> Optional[Any]:
        """Synchronous version of get for backward compatibility"""
        if key not in self.cache:
            return None
        
        # Check if expired
        if time.time() > self.cache_ttl.get(key, 0):
            self.delete(key)
            return None
        
        return self.cache[key]
    
    def set_sync(self, key: str, value: Any, ttl: int = None) -> None:
        """Synchronous version of set for backward compatibility"""
        self.cache[key] = value
        self.cache_ttl[key] = time.time() + (ttl or self.default_ttl)

# Global cache instance
artwork_cache = ArtworkCache()

# Decorator for caching functions
def cache_result(ttl: int = 3600):
    """Decorator to cache function results"""
    def decorator(func):
        def wrapper(*args, **kwargs):
            # Generate cache key from function name and arguments
            cache_key = f"{func.__name__}:{hash(str(args) + str(kwargs))}"
            
            # Try to get from cache (sync version for backward compatibility)
            cached_result = artwork_cache.get_sync(cache_key)
            if cached_result is not None:
                print(f"Cache hit for {func.__name__}")
                return cached_result
            
            # Execute function and cache result
            result = func(*args, **kwargs)
            artwork_cache.set_sync(cache_key, result, ttl)
            print(f"Cache miss for {func.__name__}, cached for {ttl}s")
            
            return result
        return wrapper
    return decorator

# LRU cache for expensive operations
@lru_cache(maxsize=1000)
def get_cached_artwork_image(art_name: str) -> str:
    """Cached version of artwork image retrieval"""
    from app.artwork_service import ArtworkService
    return ArtworkService.get_artwork_image(art_name)

@lru_cache(maxsize=500)
def get_cached_artwork_content(art_name: str) -> Dict[str, str]:
    """Cached version of artwork content generation"""
    from app.artwork_service import ArtworkService
    return ArtworkService.generate_artwork_content(art_name)
