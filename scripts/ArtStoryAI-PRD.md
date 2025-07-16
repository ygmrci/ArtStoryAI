# 📝 Product Requirements Document (PRD) – ArtStoryAI

## 1. 📌 Genel Bilgiler

| Alan | Bilgi |
|------|------|
| **Proje Adı** | ArtStoryAI |
| **Versiyon** | v1.0 |
| **Hazırlayan** | Ürün Geliştirme Ekibi |
| **Hazırlanma Tarihi** | Temmuz 2025 |
| **Amaç** | Sanat eserlerini AI yardımıyla herkes için anlaşılır, sade ve etkileyici hale getirmek |

---

## 2. 🧠 Problem Tanımı

Sanatseverler, sanat eserlerinin anlamını, dönemini veya sanatçısını merak ettiklerinde akademik içeriklerle karşılaşıyor ve bu içerikleri anlamakta zorlanıyorlar. Kullanıcı dostu, sade ve etkileyici bir anlatım biçimi eksikliği mevcut.

---

## 3. 🎯 Hedef

- Kullanıcının girdiği bir **sanat eseri adı** üzerinden, API ve AI desteğiyle detaylı ama sade bilgiler sunmak.
- İçeriği hikâyeleştirerek kullanıcı deneyimini artırmak.
- Hem Türkçe hem İngilizce destek sunmak.

---

## 4. 🧍‍♀️ Hedef Kitle

- Sanatsever genel kullanıcılar  
- Öğrenciler ve sanat tarihi öğrencileri  
- Sosyal medya içerik üreticileri  
- Müze ziyaretçileri  
- Sanatçılar ve küratörler

---

## 5. 📲 Kullanıcı Akışı (User Flow)

1. **Ana Sayfa**: Arama kutusu ve sade arayüz
2. **Arama**: Kullanıcı tablo adını yazar
3. **AI Süreci**:  
   - Tablo adı düzeltilir  
   - API'lerden veri alınır  
   - AI ile hikâye, biyografi ve açıklama yazılır
4. **İçerik Sunumu**:  
   - Görsel + kısa açıklama + sanatçı bilgisi + dönem  
5. **Ekstra Özellikler**:  
   - Benzer eser önerileri  
   - Görselden tablo tanıma  
   - AI sesli anlatım (opsiyonel)

---

## 6. 🧩 MVP ve Özellik Listesi

### MVP (Minimum Viable Product)

- Tablo ismi ile içerik üretimi  
- API'den eser bilgisi çekme  
- AI ile sade açıklama, biyografi ve akım açıklaması üretimi  
- Görsel gösterimi  
- Türkçe/İngilizce dil desteği  

### Gelişmiş Özellikler

- Görsel yükleyerek tablo tanıma  
- Benzer tablo önerileri  
- AI sohbet: "Bu tablo bana ne anlatıyor?"  
- AI sesli anlatım (Text-to-Speech)  
- Kullanıcı favorileri / koleksiyon  
- Eğitim ve müze modülleri  

---

## 7. 📐 Teknik Mimari & Tech Stack

### Front-End:

- **Next.js (React)**  
- **TailwindCSS**  
- **i18next** (çoklu dil desteği)  
- **Axios** veya **Fetch API**

### Back-End:

- **Python** (ana backend dili)  
- **FastAPI** veya **Flask**  
- **PostgreSQL** (veritabanı)  
- **Redis** (cache)  
- **OpenAI GPT-4 Turbo** (AI içerik üretimi)  
- **Vision AI** (görsel tanıma)  
- **3. Parti API'ler**: MET Museum, Wikidata, Google Arts & Culture

### DevOps:

- **Git + GitHub**  
- **Vercel / Netlify** (frontend hosting)  
- **Render / Railway** (backend hosting)

---

## 8. 🔄 AI Kullanım Süreçleri

| Süreç | AI Uygulaması |
|-------|---------------|
| Girdi düzeltme | NLP + fuzzy matching |
| Açıklama üretimi | GPT-4 ile hikâyeleştirme |
| Sanatçı biyografi | LLM özetleme |
| Sanat akımı açıklaması | Bilgi sentezi |
| Benzer tablo önerisi | Embedding + similarity |
| Sesli anlatım | Text-to-Speech (TTS) |

---

## 9. 📆 Zaman Çizelgesi (Tahmini)

| Aşama | Süre | Açıklama |
|-------|------|----------|
| MVP Tasarımı | 1 hafta | Arayüz ve temel akış |
| API ve AI Entegrasyonu | 2 hafta | Veri çekme ve içerik üretimi |
| Test ve Deploy | 1 hafta | Performans + erişilebilirlik testleri |
| Gelişmiş Özellikler | 2-3 hafta | Görsel tanıma, sesli anlatım, öneriler |

---

## 10. ⚠️ Riskler ve Varsayımlar

- **API Erişim Limiti**: Üçüncü parti API'lerde erişim kısıtları olabilir.  
- **AI Hataları**: AI yanlış veya yanıltıcı içerik üretebilir → kullanıcıya "AI içeriktir" uyarısı gerekir.  
- **Görsel Tanıma Sınırları**: Yüklenen görsel tanımlanamayan eser olabilir.  
- **Çoklu dil yapısı**: Çeviri kalitesi kontrol edilmeli.