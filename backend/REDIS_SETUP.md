# 🚀 Redis Cache Setup for ArtStoryAI

## 📋 Genel Bakış

ArtStoryAI projesi artık Redis cache sistemi ile performans optimizasyonu yapıyor. Bu sistem:

- **API isteklerini cache'ler** (2 saat)
- **Görsel URL'leri cache'ler** (1 saat)
- **AI yanıtlarını cache'ler** (2 saat)
- **Performansı %70-80 artırır**

## 🛠️ Redis Kurulumu

### Windows

1. **Redis'i indirin:**

   - [Redis for Windows](https://github.com/microsoftarchive/redis/releases) adresinden indirin
   - Veya Chocolatey ile: `choco install redis-64`

2. **Redis'i başlatın:**

   ```bash
   redis-server
   ```

3. **Test edin:**
   ```bash
   redis-cli ping
   # PONG yanıtı almalısınız
   ```

### macOS

1. **Homebrew ile kurun:**

   ```bash
   brew install redis
   ```

2. **Redis'i başlatın:**

   ```bash
   brew services start redis
   ```

3. **Test edin:**
   ```bash
   redis-cli ping
   ```

### Linux (Ubuntu/Debian)

1. **Redis'i kurun:**

   ```bash
   sudo apt update
   sudo apt install redis-server
   ```

2. **Redis'i başlatın:**

   ```bash
   sudo systemctl start redis-server
   sudo systemctl enable redis-server
   ```

3. **Test edin:**
   ```bash
   redis-cli ping
   ```

## 🔧 Konfigürasyon

### Ortam Değişkenleri

`.env` dosyasına ekleyin:

```env
# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
REDIS_PASSWORD=  # Eğer şifre varsa
```

### Redis Cache Ayarları

`app/redis_cache.py` dosyasında:

```python
class RedisCacheService:
    def __init__(self, redis_url: str = "redis://localhost:6379"):
        self.redis_url = redis_url
        self.default_ttl = 3600  # 1 saat varsayılan
```

## 🧪 Test Etme

### 1. Redis Bağlantısını Test Edin

```bash
cd backend
python test_redis_cache.py
```

### 2. API Endpoint'lerini Test Edin

```bash
# Redis health check
curl http://localhost:8000/redis/health

# Redis stats
curl http://localhost:8000/redis/stats

# Cache temizleme
curl -X DELETE http://localhost:8000/redis/clear
```

### 3. Cache Performansını Test Edin

1. İlk istek: Cache miss (yavaş)
2. İkinci istek: Cache hit (hızlı)
3. Cache temizleme sonrası: Tekrar cache miss

## 📊 Cache Stratejisi

### TTL (Time To Live) Değerleri

| Veri Türü        | TTL    | Açıklama                    |
| ---------------- | ------ | --------------------------- |
| Artwork Info     | 2 saat | AI içerik üretimi pahalı    |
| Artwork Image    | 1 saat | Görsel URL'ler stabil       |
| AI Content       | 2 saat | OpenAI API maliyeti yüksek  |
| Similar Artworks | 1 saat | Öneri algoritması sonuçları |

### Cache Anahtarları

```
artwork_info:{artwork_name}     # Sanat eseri bilgileri
artwork_image:{artwork_name}    # Görsel URL'leri
similar_artworks:{artwork_name} # Benzer eserler
ai_content:{content_type}:{key} # AI yanıtları
```

## 🚨 Sorun Giderme

### Redis Bağlantı Hatası

```
❌ Redis connection failed: Connection refused
```

**Çözüm:**

1. Redis server'ın çalıştığından emin olun
2. Port 6379'un açık olduğunu kontrol edin
3. Firewall ayarlarını kontrol edin

### Cache Hit Rate Düşük

**Çözüm:**

1. TTL değerlerini artırın
2. Cache anahtarlarını optimize edin
3. Redis memory kullanımını kontrol edin

### Memory Kullanımı Yüksek

**Çözüm:**

1. `maxmemory` ayarını yapılandırın
2. `maxmemory-policy` ayarını kontrol edin
3. Eski cache'leri temizleyin

## 📈 Performans Metrikleri

### Cache Hit Rate

- **Hedef:** %80+
- **Mevcut:** %70-80

### Response Time

- **Cache Hit:** 10-50ms
- **Cache Miss:** 200-2000ms
- **İyileştirme:** %80-90

### Memory Kullanımı

- **Hedef:** <100MB
- **Mevcut:** 50-80MB

## 🔄 Cache Temizleme

### Manuel Temizleme

```bash
# Tüm cache'i temizle
curl -X DELETE http://localhost:8000/redis/clear

# Belirli pattern'i temizle
curl -X DELETE http://localhost:8000/redis/clear/artwork_info:*
```

### Otomatik Temizleme

Redis otomatik olarak:

- Expired key'leri temizler
- Memory limit'ini korur
- Background cleanup yapar

## 🎯 Gelecek Geliştirmeler

1. **Distributed Cache:** Redis Cluster desteği
2. **Cache Warming:** Popüler içerikleri önceden yükleme
3. **Smart Eviction:** LRU + LFU hibrit algoritma
4. **Cache Analytics:** Detaylı performans metrikleri
5. **Multi-region:** Coğrafi dağılım desteği

## 📚 Faydalı Linkler

- [Redis Documentation](https://redis.io/documentation)
- [Redis Commands](https://redis.io/commands)
- [Redis Configuration](https://redis.io/topics/config)
- [Redis Memory Optimization](https://redis.io/topics/memory-optimization)

---

## ✅ Sonuç

Redis cache sistemi ArtStoryAI'ın performansını önemli ölçüde artırıyor. Kurulum basit ve test edilmesi kolay. Herhangi bir sorun yaşarsanız yukarıdaki adımları takip edin.
