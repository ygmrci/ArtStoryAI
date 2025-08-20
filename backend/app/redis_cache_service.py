"""
Redis Cache Service for ArtStoryAI
Provides Redis-based caching for artwork information and AI responses
"""

import json
import hashlib
from typing import Dict, Any, Optional, Union
import redis.asyncio as redis
from redis.asyncio import Redis
import logging

logger = logging.getLogger(__name__)

class RedisCacheService:
    """Redis-based cache service for ArtStoryAI"""
    
    def __init__(self, redis_url: str = "redis://localhost:6379"):
        self.redis_url = redis_url
        self.redis_client: Optional[Redis] = None
        self.default_ttl = 3600  # 1 saat
        self.is_connected = False
    
    async def connect(self) -> bool:
        """Connect to Redis server"""
        try:
            self.redis_client = redis.from_url(
                self.redis_url,
                decode_responses=True,
                socket_connect_timeout=5,
                socket_timeout=5
            )
            # Test connection
            await self.redis_client.ping()
            self.is_connected = True
            logger.info("Redis connection established successfully")
            return True
        except Exception as e:
            logger.warning(f"Redis connection failed: {e}")
            self.is_connected = False
            # Don't raise exception, just return False
            return False
    
    async def disconnect(self):
        """Disconnect from Redis"""
        if self.redis_client:
            await self.redis_client.close()
            self.is_connected = False
            logger.info("Redis connection closed")
    
    def _generate_key(self, prefix: str, data: str) -> str:
        """Generate cache key with prefix"""
        hash_data = hashlib.md5(data.encode()).hexdigest()
        return f"{prefix}:{hash_data}"
    
    async def get(self, key: str) -> Optional[Any]:
        """Get value from Redis cache"""
        if not self.is_connected or not self.redis_client:
            return None
        
        try:
            value = await self.redis_client.get(key)
            if value:
                return json.loads(value)
            return None
        except Exception as e:
            logger.error(f"Redis get error: {e}")
            return None
    
    async def set(self, key: str, value: Any, ttl: int = None) -> bool:
        """Set value in Redis cache"""
        if not self.is_connected or not self.redis_client:
            return False
        
        try:
            ttl = ttl or self.default_ttl
            serialized_value = json.dumps(value, ensure_ascii=False)
            await self.redis_client.setex(key, ttl, serialized_value)
            return True
        except Exception as e:
            logger.error(f"Redis set error: {e}")
            return False
    
    async def delete(self, key: str) -> bool:
        """Delete key from Redis cache"""
        if not self.is_connected or not self.redis_client:
            return False
        
        try:
            await self.redis_client.delete(key)
            return True
        except Exception as e:
            logger.error(f"Redis delete error: {e}")
            return False
    
    async def clear(self) -> bool:
        """Clear all cache (use with caution!)"""
        if not self.is_connected or not self.redis_client:
            return False
        
        try:
            await self.redis_client.flushdb()
            return True
        except Exception as e:
            logger.error(f"Redis clear error: {e}")
            return False
    
    async def get_stats(self) -> Dict[str, Any]:
        """Get Redis cache statistics"""
        if not self.is_connected or not self.redis_client:
            return {"error": "Redis not connected"}
        
        try:
            info = await self.redis_client.info()
            return {
                "connected": True,
                "total_keys": info.get("db0", {}).get("keys", 0),
                "memory_usage": info.get("used_memory_human", "N/A"),
                "uptime": info.get("uptime_in_seconds", 0),
                "redis_version": info.get("redis_version", "N/A")
            }
        except Exception as e:
            logger.error(f"Redis stats error: {e}")
            return {"error": str(e)}
    
    async def health_check(self) -> bool:
        """Check Redis health"""
        if not self.is_connected or not self.redis_client:
            return False
        
        try:
            await self.redis_client.ping()
            return True
        except Exception:
            return False

# Global Redis cache instance
redis_cache = RedisCacheService()

# Cache decorator for Redis
def redis_cache_result(ttl: int = 3600, prefix: str = "artwork"):
    """Decorator to cache function results in Redis"""
    def decorator(func):
        async def wrapper(*args, **kwargs):
            # Generate cache key
            cache_key = f"{prefix}:{hash(str(args) + str(kwargs))}"
            
            # Try to get from Redis cache
            cached_result = await redis_cache.get(cache_key)
            if cached_result is not None:
                logger.info(f"Redis cache hit for {func.__name__}")
                return cached_result
            
            # Execute function and cache result
            result = await func(*args, **kwargs)
            await redis_cache.set(cache_key, result, ttl)
            logger.info(f"Redis cache miss for {func.__name__}, cached for {ttl}s")
            
            return result
        return wrapper
    return decorator
