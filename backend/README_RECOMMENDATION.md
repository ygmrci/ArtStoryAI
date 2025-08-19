# 🎨 ArtStoryAI Recommendation System

Bu dokümantasyon, ArtStoryAI projesinin akıllı öneri sistemini açıklar.

## 📋 İçindekiler

- [Genel Bakış](#genel-bakış)
- [Özellikler](#özellikler)
- [API Endpoint'leri](#api-endpointleri)
- [Kullanım Örnekleri](#kullanım-örnekleri)
- [Kurulum](#kurulum)
- [Test](#test)

---

## 🌟 Genel Bakış

ArtStoryAI Recommendation System, kullanıcılara kişiselleştirilmiş sanat eseri önerileri sunan akıllı bir sistemdir. Sistem şu faktörlere dayalı olarak öneriler üretir:

- **Sanatçı Benzerliği** (%40 ağırlık)
- **Dönem Benzerliği** (%20 ağırlık)
- **Sanat Akımı Benzerliği** (%25 ağırlık)
- **Tema Benzerliği** (%15 ağırlık)

---

## ✨ Özellikler

### 🔍 Benzerlik Hesaplama

- **TF-IDF Vektörleri**: Metin açıklamaları için
- **Cosine Similarity**: Benzerlik skorları için
- **Ağırlıklı Ortalama**: Çoklu faktör analizi için

### 🎯 Öneri Türleri

1. **Benzer Eserler**: Seçilen esere benzer eserler
2. **Sanatçı Önerileri**: Aynı sanatçının diğer eserleri
3. **Dönem Önerileri**: Aynı dönemdeki eserler
4. **Akım Önerileri**: Aynı sanat akımındaki eserler
5. **Keşif Önerileri**: Çeşitli dönem ve akımlardan eserler

---

## 🚀 API Endpoint'leri

### 1. Benzer Eserler

```http
GET /recommendations/similar/{artwork_name}?limit=5
```

**Örnek:**

```bash
curl "http://localhost:8000/recommendations/similar/Mona%20Lisa?limit=3"
```

**Yanıt:**

```json
{
  "success": true,
  "target_artwork": "Mona Lisa",
  "recommendations": [
    {
      "title": "The Last Supper",
      "artist": "Leonardo da Vinci",
      "year": 1498,
      "image_url": "...",
      "similarity_score": 0.85,
      "similarity_reasons": ["Aynı sanatçı", "Aynı dönem"]
    }
  ],
  "total_recommendations": 1
}
```

### 2. Sanatçı Önerileri

```http
GET /recommendations/artist/{artist_name}?limit=5
```

**Örnek:**

```bash
curl "http://localhost:8000/recommendations/artist/Leonardo%20da%20Vinci?limit=3"
```

### 3. Dönem Önerileri

```http
GET /recommendations/period/{year}?limit=5
```

**Örnek:**

```bash
curl "http://localhost:8000/recommendations/period/1500?limit=5"
```

### 4. Akım Önerileri

```http
GET /recommendations/movement/{movement_name}?limit=5
```

**Örnek:**

```bash
curl "http://localhost:8000/recommendations/movement/renaissance?limit=5"
```

### 5. Keşif Önerileri

```http
GET /recommendations/explore?limit=10
```

**Örnek:**

```bash
curl "http://localhost:8000/recommendations/explore?limit=15"
```

---

## 💡 Kullanım Örnekleri

### Python ile Kullanım

```python
from app.services.recommendation_service import recommendation_engine

# Benzer eserler bul
similar_artworks = recommendation_engine.get_similar_artworks(
    target_artwork,
    all_artworks,
    limit=5
)

# Sanatçı önerileri
artist_recs = recommendation_engine.get_artist_recommendations(
    "Leonardo da Vinci",
    all_artworks,
    limit=3
)

# Dönem önerileri
period_recs = recommendation_engine.get_period_recommendations(
    1500,
    all_artworks,
    limit=5
)
```

### JavaScript/Frontend ile Kullanım

```javascript
// Benzer eserler al
const getSimilarArtworks = async (artworkName, limit = 5) => {
  try {
    const response = await fetch(
      `/api/recommendations/similar/${encodeURIComponent(
        artworkName
      )}?limit=${limit}`
    );
    const data = await response.json();
    return data.recommendations;
  } catch (error) {
    console.error("Öneri alma hatası:", error);
    return [];
  }
};

// Kullanım
const recommendations = await getSimilarArtworks("Mona Lisa", 3);
console.log("Öneriler:", recommendations);
```

---

## 🛠️ Kurulum

### 1. Gerekli Paketler

```bash
pip install scikit-learn numpy
```

### 2. Dosya Yapısı

```
backend/
├── app/
│   ├── services/
│   │   └── recommendation_service.py    # Ana öneri motoru
│   ├── recommendation_routes.py         # API endpoint'leri
│   └── main.py                         # Ana uygulama
├── test_recommendation.py               # Test dosyası
└── requirements.txt                     # Bağımlılıklar
```

### 3. Sunucuyu Başlat

```bash
cd backend
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

---

## 🧪 Test

### 1. Otomatik Test

```bash
cd backend
python test_recommendation.py
```

### 2. Manuel API Test

```bash
# Benzer eserler
curl "http://localhost:8000/recommendations/similar/Mona%20Lisa"

# Sanatçı önerileri
curl "http://localhost:8000/recommendations/artist/Leonardo%20da%20Vinci"

# Dönem önerileri
curl "http://localhost:8000/recommendations/period/1500"

# Keşif önerileri
curl "http://localhost:8000/recommendations/explore"
```

### 3. Test Sonuçları

```
🚀 ArtStoryAI Recommendation System Test Suite
==================================================
🧪 Testing Similarity Calculator...
✅ Artist similarity (same): 1.0
✅ Artist similarity (different): 0.0
✅ Period similarity (same decade): 0.9
✅ Period similarity (same century): 0.7
✅ Movement similarity (same): 1.0
✅ Movement similarity (different): 0.0
✅ Text similarity: 0.85

🧪 Testing Recommendation Engine...
✅ Similar artworks for 'Mona Lisa':
   - The Last Supper by Leonardo da Vinci
     Similarity: 0.85
     Reasons: Aynı sanatçı, Aynı dönem

🎉 All tests completed successfully!
```

---

## 🔧 Konfigürasyon

### Ağırlık Ayarları

```python
# recommendation_service.py içinde
self.weights = {
    'artist': 0.4,      # Sanatçı benzerliği ağırlığı
    'period': 0.2,      # Dönem benzerliği ağırlığı
    'movement': 0.25,   # Akım benzerliği ağırlığı
    'theme': 0.15       # Tema benzerliği ağırlığı
}
```

### Benzerlik Eşikleri

```python
# Minimum benzerlik skoru
if similarity_score > 0.1:  # %10'dan düşük öneriler filtrelenir
    recommendations.append(...)
```

---

## 📊 Performans

### Hız Optimizasyonları

- **TF-IDF Vektörleri**: Metin analizi için optimize edilmiş
- **Ağırlıklı Hesaplama**: Hızlı matematiksel işlemler
- **Filtreleme**: Düşük benzerlik skorları önceden filtrelenir

### Ölçeklenebilirlik

- **Modüler Yapı**: Yeni öneri algoritmaları kolayca eklenebilir
- **Cache Desteği**: Redis entegrasyonu için hazır
- **Async Desteği**: FastAPI ile uyumlu

---

## 🚀 Gelecek Geliştirmeler

### Planlanan Özellikler

1. **Machine Learning**: Daha gelişmiş benzerlik algoritmaları
2. **User Preferences**: Kullanıcı beğenilerine göre öneriler
3. **Real-time Updates**: Gerçek zamanlı öneri güncellemeleri
4. **Collaborative Filtering**: Kullanıcı davranışlarına dayalı öneriler

### Entegrasyon Hazırlıkları

- **Redis Cache**: Performans optimizasyonu
- **Database**: PostgreSQL ile veri yönetimi
- **Monitoring**: Öneri kalitesi izleme

---

## 📞 Destek

Herhangi bir sorun veya öneri için:

- **GitHub Issues**: [ArtStoryAI Repository](https://github.com/ygmrci/ArtStoryAI)
- **Dokümantasyon**: Bu README dosyası
- **Test Dosyası**: `test_recommendation.py`

---

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
