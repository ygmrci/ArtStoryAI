# ArtStoryAI – Master Görev Listesi

## 1. Proje Kurulumu & Altyapı

- [x] Proje için frontend (Next.js) ve backend (FastAPI) repo'larını oluştur
- [x] Versiyon kontrolü (Git/GitHub) yapılandır
- [x] Ortak README ve temel dökümantasyon hazırla
- [x] Ortak kodlama standartları ve linter ayarlarını kur (hem frontend hem backend)
- [x] Ortam değişkenleri (.env) ve örnek dosyalarını oluştur

---

## 2. Frontend (Next.js + TailwindCSS)

### 2.1. Temel Yapı

- [x] Next.js projesi başlat
- [x] TailwindCSS'i projeye entegre et
- [x] i18next ile çoklu dil desteği altyapısını kur
- [x] Ana layout ve temel sayfa yapısını oluştur
- [x] Erişilebilirlik (a11y) ayarlarını uygula

### 2.2. Ana Sayfa

- [x] Ana sayfa bileşenini oluştur
- [x] Arama kutusu (input) bileşenini ekle
- [x] Arama butonu ve klavye ile tetikleme desteği ekle
- [x] Placeholder ve hata mesajlarını çoklu dil desteğiyle hazırla

### 2.3. Sonuç Ekranı

- [x] Sanat eseri görseli gösterimi için bileşen oluştur
- [x] Sanatçı, yıl, dönem, akım, müze bilgisi alanlarını ekle
- [x] AI tarafından üretilen kısa hikaye alanı ekle
- [x] Sanatçı biyografisi alanı ekle
- [x] Sanat akımı açıklaması alanı ekle
- [x] API'den gelen hata ve yükleniyor durumlarını yönet

### 2.4. Keşif & Ek Özellikler

- [x] Benzer tabloları listeleyen bileşen oluştur
- [x] Yeni arama başlatma butonu ekle
- [x] Sesli anlatım (TTS) butonu ve oynatıcı ekle (gelişmiş)

### 2.5. UI/UX

- [x] Responsive tasarım ve mobil uyumluluk
- [x] Yükleniyor animasyonları ve iskelet ekranlar
- [x] Hata mesajları ve kullanıcıya dost bildirimler
- [x] Temiz ve sade görsel hiyerarşi

---

## 3. Backend (FastAPI)

### 3.1. Temel API Altyapısı

- [x] FastAPI projesi başlat
- [x] Temel API endpoint'lerini oluştur
- [x] CORS ve güvenlik ayarlarını yapılandır
- [x] Ortam değişkenleri ve yapılandırma dosyalarını hazırla

### 3.2. Sanat Eseri Bilgi Toplama

- [x] Kullanıcıdan gelen tablo adını normalize eden endpoint yaz
- [x] Fuzzy-matching ve çoklu dil desteği için yardımcı fonksiyonlar ekle
- [x] Wikidata, MET Museum, Google Arts & Culture, Harvard Art Museums, Europeana API'lerine bağlan
- [x] API'lerden sanatçı, yıl, dönem, akım, müze, görsel URL gibi bilgileri çek
- [x] API sonuçlarını normalize eden yardımcı fonksiyonlar yaz

### 3.3. AI ile İçerik Üretimi

- [x] OpenAI API (GPT-4 Turbo) entegrasyonunu kur
- [x] Prompt şablonlarını oluştur (hikaye, biyografi, akım açıklaması için)
- [x] Eser açıklaması (hikaye) üretimi endpoint'i yaz
- [x] Sanatçı biyografisi üretimi endpoint'i yaz
- [x] Sanat akımı açıklaması üretimi endpoint'i yaz
- [x] Uzman modu için teknik açıklama desteği ekle

### 3.4. Benzer Eserler & Öneri Sistemi

- [x] Embedding ve benzerlik hesaplama fonksiyonlarını ekle
- [x] Benzer eserleri döndüren endpoint yaz
- [x] Sanatçının diğer önemli işlerini döndüren endpoint yaz
- [x] Kullanıcı beğenilerine göre öneri altyapısı hazırla (gelişmiş)

### 3.5. Performans & Cache

- [x] Redis entegrasyonunu kur
- [x] API isteklerini ve AI çıktısını cache'le
- [x] Sık kullanılan veri için cache stratejisi uygula

### 3.6. Veritabanı

- [x] PostgreSQL bağlantısını kur
- [x] Sanat eserleri ve kullanıcı verileri için temel tabloları oluştur
- [x] ORM (SQLAlchemy) ile modelleri yaz
- [x] Migration altyapısı kur

### 3.7. Hata Yönetimi & Loglama

- [x] API için merkezi hata yönetimi middleware'i ekle
- [x] Kullanıcıya dost hata mesajları döndür
- [x] Loglama ve monitoring altyapısı kur

---

## 4. Entegrasyon & Test

- [x] Frontend ve backend'i entegre et (API endpoint'lerini bağla)
- [x] API endpoint'leri için birim ve entegrasyon testleri yaz
- [x] Frontend için temel kullanıcı senaryolarını test et
- [x] Erişilebilirlik ve performans testleri yap
- [x] Çoklu dil desteği testleri yap

---

## 5. Deployment & DevOps

- [ ] Frontend'i Vercel/Netlify'a deploy et
- [ ] Backend'i Render/Railway'a deploy et
- [ ] Ortam değişkenlerini production için ayarla
- [ ] Temel monitoring ve hata bildirimi kur

---

## 6. Gelişmiş & Gelecek Özellikler

- [x] Kullanıcı favorileri/koleksiyon oluşturma modülü ekle

---

## 7. Agent Mimarisi & Otomasyon

- [x] Base Agent sınıfı oluştur
- [x] Artwork Analyzer Agent implement et
- [x] Content Generator Agent implement et
- [x] Agent Manager sistemi kur
- [x] Workflow orchestration sistemi
- [x] Örnek kullanımlar ve dokümantasyon
- [x] Otomasyon süreçleri tanımla
