# ArtStoryAI – Master Görev Listesi

## 1. Proje Kurulumu & Altyapı

- [x] Proje için frontend (Next.js) ve backend (FastAPI) repo’larını oluştur
- [ ] Versiyon kontrolü (Git/GitHub) yapılandır
- [ ] Ortak README ve temel dökümantasyon hazırla
- [ ] Ortak kodlama standartları ve linter ayarlarını kur (hem frontend hem backend)
- [ ] Ortam değişkenleri (.env) ve örnek dosyalarını oluştur

---

## 2. Frontend (Next.js + TailwindCSS)

### 2.1. Temel Yapı

- [ ] Next.js projesi başlat
- [ ] TailwindCSS’i projeye entegre et
- [ ] i18next ile çoklu dil desteği altyapısını kur
- [ ] Ana layout ve temel sayfa yapısını oluştur
- [ ] Erişilebilirlik (a11y) ayarlarını uygula

### 2.2. Ana Sayfa

- [ ] Ana sayfa bileşenini oluştur
- [ ] Arama kutusu (input) bileşenini ekle
- [ ] Arama butonu ve klavye ile tetikleme desteği ekle
- [ ] Placeholder ve hata mesajlarını çoklu dil desteğiyle hazırla

### 2.3. Sonuç Ekranı

- [ ] Sanat eseri görseli gösterimi için bileşen oluştur
- [ ] Sanatçı, yıl, dönem, akım, müze bilgisi alanlarını ekle
- [ ] AI tarafından üretilen kısa hikaye alanı ekle
- [ ] Sanatçı biyografisi alanı ekle
- [ ] Sanat akımı açıklaması alanı ekle
- [ ] API’den gelen hata ve yükleniyor durumlarını yönet

### 2.4. Keşif & Ek Özellikler

- [ ] Benzer tabloları listeleyen bileşen oluştur
- [ ] Yeni arama başlatma butonu ekle
- [ ] Görsel yükleme (image upload) bileşeni ekle (gelişmiş)
- [ ] Sesli anlatım (TTS) butonu ve oynatıcı ekle (gelişmiş)

### 2.5. UI/UX

- [ ] Responsive tasarım ve mobil uyumluluk
- [ ] Yükleniyor animasyonları ve iskelet ekranlar
- [ ] Hata mesajları ve kullanıcıya dost bildirimler
- [ ] Temiz ve sade görsel hiyerarşi

---

## 3. Backend (FastAPI)

### 3.1. Temel API Altyapısı

- [ ] FastAPI projesi başlat
- [ ] Temel API endpoint’lerini oluştur
- [ ] CORS ve güvenlik ayarlarını yapılandır
- [ ] Ortam değişkenleri ve yapılandırma dosyalarını hazırla

### 3.2. Sanat Eseri Bilgi Toplama

- [ ] Kullanıcıdan gelen tablo adını normalize eden endpoint yaz
- [ ] Fuzzy-matching ve çoklu dil desteği için yardımcı fonksiyonlar ekle
- [ ] Wikidata, MET Museum, Google Arts & Culture, Harvard Art Museums, Europeana API’lerine bağlan
- [ ] API’lerden sanatçı, yıl, dönem, akım, müze, görsel URL gibi bilgileri çek
- [ ] API sonuçlarını normalize eden yardımcı fonksiyonlar yaz

### 3.3. AI ile İçerik Üretimi

- [ ] OpenAI API (GPT-4 Turbo) entegrasyonunu kur
- [ ] Prompt şablonlarını oluştur (hikaye, biyografi, akım açıklaması için)
- [ ] Eser açıklaması (hikaye) üretimi endpoint’i yaz
- [ ] Sanatçı biyografisi üretimi endpoint’i yaz
- [ ] Sanat akımı açıklaması üretimi endpoint’i yaz
- [ ] Uzman modu için teknik açıklama desteği ekle

### 3.4. Görsel Tanıma (Vision AI)

- [ ] Kullanıcıdan gelen görseli işleyen endpoint yaz
- [ ] Vision AI API’si ile tablo tanıma fonksiyonunu entegre et
- [ ] Tanınan tabloya göre bilgi çekme akışını kur

### 3.5. Benzer Eserler & Öneri Sistemi

- [ ] Embedding ve benzerlik hesaplama fonksiyonlarını ekle
- [ ] Benzer eserleri döndüren endpoint yaz
- [ ] Sanatçının diğer önemli işlerini döndüren endpoint yaz
- [ ] Kullanıcı beğenilerine göre öneri altyapısı hazırla (gelişmiş)

### 3.6. Performans & Cache

- [ ] Redis entegrasyonunu kur
- [ ] API isteklerini ve AI çıktısını cache’le
- [ ] Sık kullanılan veri için cache stratejisi uygula

### 3.7. Veritabanı

- [ ] PostgreSQL bağlantısını kur
- [ ] Sanat eserleri ve kullanıcı verileri için temel tabloları oluştur
- [ ] ORM (SQLAlchemy) ile modelleri yaz
- [ ] Migration altyapısı kur

### 3.8. Hata Yönetimi & Loglama

- [ ] API için merkezi hata yönetimi middleware’i ekle
- [ ] Kullanıcıya dost hata mesajları döndür
- [ ] Loglama ve monitoring altyapısı kur

---

## 4. Entegrasyon & Test

- [ ] Frontend ve backend’i entegre et (API endpoint’lerini bağla)
- [ ] API endpoint’leri için birim ve entegrasyon testleri yaz
- [ ] Frontend için temel kullanıcı senaryolarını test et
- [ ] Erişilebilirlik ve performans testleri yap
- [ ] Çoklu dil desteği testleri yap

---

## 5. Deployment & DevOps

- [ ] Frontend’i Vercel/Netlify’a deploy et
- [ ] Backend’i Render/Railway’a deploy et
- [ ] Ortam değişkenlerini production için ayarla
- [ ] Temel monitoring ve hata bildirimi kur

---

## 6. Gelişmiş & Gelecek Özellikler

- [ ] Kullanıcı favorileri/koleksiyon oluşturma modülü ekle
- [ ] Eğitim modülü (okullar için) geliştir
- [ ] Müze işbirliği için QR kod ile AI açıklama desteği ekle
