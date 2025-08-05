# ArtStoryAI

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=flat-square&logo=github)](https://github.com/ygmrci/ArtStoryAI)

**GitHub Repository:** [https://github.com/ygmrci/ArtStoryAI](https://github.com/ygmrci/ArtStoryAI)

## Proje Amacı

Sanatseverler için, tablo adıyla hızlıca sade ve etkileyici açıklamalar, sanatçı biyografisi ve sanat akımı bilgisi sunan, AI destekli bir web uygulaması.

## Teknik Mimari

- **Frontend:** Next.js (React), TailwindCSS
- **Backend:** FastAPI (Python)
- **Veritabanı:** PostgreSQL (planlı)
- **Cache:** Redis (planlı)
- **AI:** OpenAI GPT-4 Turbo (Vision API entegrasyonu planlanıyor)

## Klasör Yapısı

```
ArtStoryAI/
  frontend/   # Next.js tabanlı arayüz
  backend/    # FastAPI tabanlı API
  scripts/    # Dokümantasyon ve analizler
```

## Kurulum

### Ön Gereksinimler

- **Python 3.8+** - [Python.org](https://www.python.org/downloads/) adresinden indirebilirsiniz
- **Node.js 18+** - [Nodejs.org](https://nodejs.org/) adresinden indirebilirsiniz
- **Git** - [Git-scm.com](https://git-scm.com/) adresinden indirebilirsiniz

### Projeyi İndirme

```bash
git clone https://github.com/ygmrci/ArtStoryAI.git
cd ArtStoryAI
```

### 1. Backend Kurulumu

```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate

# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

#### .env Dosyası Oluşturma

Backend klasöründe bir `.env` dosyası oluşturun ve aşağıdaki satırı ekleyin:

```
OPENAI_API_KEY=sk-xxxxxx
```

- OpenAI API anahtarınızı [OpenAI platformundan](https://platform.openai.com/api-keys) alabilirsiniz.
- Ücretsiz anahtarlar ile dakikada 3 istek sınırı vardır.

#### Backend'i Başlatma

```bash
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### 2. Frontend Kurulumu

```bash
cd frontend
npm install
npm run dev
```

**Not:** Eğer npm install sırasında hata alırsanız, Node.js sürümünüzü kontrol edin. Node.js 18 veya üzeri gereklidir.

### 3. Uygulamayı Aç

- Frontend: http://localhost:3000
- Backend API: http://127.0.0.1:8000

### Kurulum Sırası

1. Önce backend'i kurup başlatın.
2. Sonra frontend'i kurup başlatın.

### Mac Kullanıcıları İçin Özel Notlar

- Terminal'de `python3` komutunu kullanmanız gerekebilir
- Homebrew kullanarak Python ve Node.js kurabilirsiniz:
  ```bash
  brew install python node
  ```
- M1/M2 Mac kullanıcıları için herhangi bir ek yapılandırma gerekmez

## Katkı ve Geliştirme

## Notlar

UI,

Bu projede OpenAI API entegrasyonu yapılmıştır. Gerçek bir OpenAI API key `.env` dosyasına eklendiğinde sistem sorunsuz çalışacaktır. Fonksiyonlar `features/openai_story.py` içinde yapılandırılmıştır.

Ayrıca, kullanıcı arayüzü (UI) şu anda temel haliyle hazırlanmıştır. Projenin görsel tasarımı ve kullanıcı deneyimi ilerleyen aşamalarda iyileştirilecektir.

- Tüm tasklar için: `scripts/master_task_list.md`
- Frontend ve backend için ayrı README dosyalarına bakınız.

---

Daha fazla bilgi için: [scripts/ArtStoryAI-PRD.md](scripts/ArtStoryAI-PRD.md)

---

## OpenAI API Kullanımı ve Rate Limit Uyarısı

Bu projede OpenAI API kullanılmaktadır. Ücretsiz API anahtarlarında genellikle **dakikada 3 istek** sınırı vardır. Eğer çok hızlı veya arka arkaya fazla sorgu gönderirseniz, API'dan cevap alınamaz ve ekranda şu mesajlar görünebilir:

- `AI ile üretiliyor...`
- `AI ile hikaye üretilemedi.`

Bu bir hata değildir! Sadece OpenAI'nın hız limiti dolduğu için geçici olarak bilgi alınamıyor demektir.  
**Çözüm:** 20-30 saniye bekleyip tekrar deneyin. Daha yüksek limit için OpenAI hesabınıza kredi ekleyebilirsiniz (isteğe bağlı).

Daha fazla bilgi: [OpenAI Rate Limits](https://platform.openai.com/account/rate-limits)
