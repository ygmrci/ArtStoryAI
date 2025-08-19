#!/usr/bin/env python3
"""
Redis Cache Test Script
Redis cache entegrasyonunu test eder
"""

import asyncio
import requests
import json
from datetime import datetime

def test_redis_endpoints():
    """Redis endpoint'lerini test eder"""
    base_url = "http://localhost:8000"
    
    print("🔍 Redis Cache Test Başlıyor...")
    print("=" * 50)
    
    # 1. Redis Health Check
    try:
        print("1️⃣ Redis Health Check...")
        response = requests.get(f"{base_url}/redis/health")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Redis Health: {data}")
        else:
            print(f"❌ Redis Health Error: {response.status_code}")
    except Exception as e:
        print(f"❌ Redis Health Exception: {e}")
    
    print()
    
    # 2. Cache Stats
    try:
        print("2️⃣ Cache Stats...")
        response = requests.get(f"{base_url}/cache/stats")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Cache Stats: {data}")
        else:
            print(f"❌ Cache Stats Error: {response.status_code}")
    except Exception as e:
        print(f"❌ Cache Stats Exception: {e}")
    
    print()
    
    # 3. Redis Stats
    try:
        print("3️⃣ Redis Stats...")
        response = requests.get(f"{base_url}/redis/stats")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Redis Stats: {data}")
        else:
            print(f"❌ Redis Stats Error: {response.status_code}")
    except Exception as e:
        print(f"❌ Redis Stats Exception: {e}")
    
    print()
    
    # 4. Test Cache Set/Get
    try:
        print("4️⃣ Cache Set/Get Test...")
        test_key = "test_redis_cache"
        test_value = {"message": "Redis cache test", "timestamp": str(datetime.now())}
        
        # Set cache - POST body ile key, value ve ttl gönder
        set_response = requests.post(f"{base_url}/cache/set", json={
            "key": test_key,
            "value": test_value,
            "ttl": 60
        })
        
        if set_response.status_code == 200:
            print(f"✅ Cache Set: {set_response.json()}")
            
            # Get cache
            get_response = requests.get(f"{base_url}/cache/get/{test_key}")
            if get_response.status_code == 200:
                data = get_response.json()
                print(f"✅ Cache Get: {data}")
            else:
                print(f"❌ Cache Get Error: {get_response.status_code}")
        else:
            print(f"❌ Cache Set Error: {set_response.status_code}")
            print(f"Response: {set_response.text}")
            
    except Exception as e:
        print(f"❌ Cache Set/Get Exception: {e}")
    
    print()
    print("=" * 50)
    print("🎯 Redis Cache Test Tamamlandı!")

if __name__ == "__main__":
    test_redis_endpoints()
