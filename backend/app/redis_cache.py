"""
Redis Cache Service for ArtStoryAI
Provides Redis-based caching for improved performance and scalability
"""

import json
import pickle
from typing import Any, Optional, Union
import redis
from fastapi import HTTPException
import logging

logger = logging.getLogger(__name__)

class RedisCacheService:
    """Redis-based cache service for ArtStoryAI"""
    
    def __init__(self, redis_url: str = "redis://localhost:6379"):
        self.redis_url = redis_url
        self.redis_client: Optional[redis.Redis] = None
        self.default_ttl = 3600  # 1 saat
        self.connection_pool = None
    
    async def connect(self):
        """Connect to Redis server"""
        try:
            self.redis_client = redis.Redis.from_url(
                self.redis_url,
                decode_responses=True,  # Redis'ten gelen verileri otomatik decode et
                max_connections=20
            )
            # Test connection
            self.redis_client.ping()
            logger.info("Redis connection established successfully")
        except Exception as e:
            logger.error(f"Failed to connect to Redis: {e}")
            raise HTTPException(status_code=500, detail="Redis connection failed")
    
    async def disconnect(self):
        """Disconnect from Redis server"""
        if self.redis_client:
            self.redis_client.close()
            logger.info("Redis connection closed")
    
    async def get(self, key: str) -> Optional[Any]:
        """Get value from Redis cache"""
        if not self.redis_client:
            return None
        
        try:
            value = self.redis_client.get(key)
            if value:
                # Try to deserialize as JSON first, then as pickle
                try:
                    return json.loads(value)
                except (json.JSONDecodeError, UnicodeDecodeError):
                    try:
                        return pickle.loads(value.encode('latin1'))
                    except:
                        return value
            return None
        except Exception as e:
            logger.error(f"Error getting key {key} from Redis: {e}")
            return None
    
    async def set(self, key: str, value: Any, ttl: int = None) -> bool:
        """Set value in Redis cache with TTL"""
        if not self.redis_client:
            return False
        
        try:
            # Try to serialize as JSON first, fallback to pickle
            try:
                serialized_value = json.dumps(value, ensure_ascii=False)
            except (TypeError, ValueError):
                serialized_value = pickle.dumps(value).decode('latin1')
            
            ttl = ttl or self.default_ttl
            self.redis_client.setex(key, ttl, serialized_value)
            return True
        except Exception as e:
            logger.error(f"Error setting key {key} in Redis: {e}")
            return False
    
    async def delete(self, key: str) -> bool:
        """Delete key from Redis cache"""
        if not self.redis_client:
            return False
        
        try:
            result = self.redis_client.delete(key)
            return result > 0
        except Exception as e:
            logger.error(f"Error deleting key {key} from Redis: {e}")
            return False
    
    async def exists(self, key: str) -> bool:
        """Check if key exists in Redis cache"""
        if not self.redis_client:
            return False
        
        try:
            return bool(self.redis_client.exists(key))
        except Exception as e:
            logger.error(f"Error checking key {key} in Redis: {e}")
            return False
    
    async def expire(self, key: str, ttl: int) -> bool:
        """Set expiration time for a key"""
        if not self.redis_client:
            return False
        
        try:
            return bool(self.redis_client.expire(key, ttl))
        except Exception as e:
            logger.error(f"Error setting expiration for key {key} in Redis: {e}")
            return False
    
    async def get_ttl(self, key: str) -> int:
        """Get remaining TTL for a key"""
        if not self.redis_client:
            return -1
        
        try:
            return self.redis_client.ttl(key)
        except Exception as e:
            logger.error(f"Error getting TTL for key {key} in Redis: {e}")
            return -1
    
    async def clear_pattern(self, pattern: str) -> int:
        """Clear all keys matching a pattern"""
        if not self.redis_client:
            return 0
        
        try:
            keys = self.redis_client.keys(pattern)
            if keys:
                return self.redis_client.delete(*keys)
            return 0
        except Exception as e:
            logger.error(f"Error clearing pattern {pattern} in Redis: {e}")
            return 0
    
    async def get_stats(self) -> dict:
        """Get Redis cache statistics"""
        if not self.redis_client:
            return {"error": "Redis not connected"}
        
        try:
            info = self.redis_client.info()
            return {
                "connected_clients": info.get("connected_clients", 0),
                "used_memory_human": info.get("used_memory_human", "0B"),
                "total_commands_processed": info.get("total_commands_processed", 0),
                "keyspace_hits": info.get("keyspace_hits", 0),
                "keyspace_misses": info.get("keyspace_misses", 0),
                "uptime_in_seconds": info.get("uptime_in_seconds", 0)
            }
        except Exception as e:
            logger.error(f"Error getting Redis stats: {e}")
            return {"error": str(e)}
    
    async def health_check(self) -> bool:
        """Check Redis health"""
        if not self.redis_client:
            return False
        
        try:
            self.redis_client.ping()
            return True
        except Exception:
            return False

# Global Redis cache instance
redis_cache = RedisCacheService()

# Cache decorator for functions
def redis_cache_decorator(ttl: int = 3600, key_prefix: str = ""):
    """Decorator to cache function results in Redis"""
    def decorator(func):
        async def wrapper(*args, **kwargs):
            # Generate cache key
            cache_key = f"{key_prefix}:{func.__name__}:{hash(str(args) + str(kwargs))}"
            
            # Try to get from cache
            cached_result = await redis_cache.get(cache_key)
            if cached_result is not None:
                logger.info(f"Redis cache hit for {func.__name__}")
                return cached_result
            
            # Execute function and cache result
            result = await func(*args, **kwargs) if hasattr(func, '__await__') else func(*args, **kwargs)
            await redis_cache.set(cache_key, result, ttl)
            logger.info(f"Redis cache miss for {func.__name__}, cached for {ttl}s")
            
            return result
        return wrapper
    return decorator
