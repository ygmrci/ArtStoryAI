# ArtStoryAI

## Proje Amacı

Sanatseverler için, tablo adıyla hızlıca sade ve etkileyici açıklamalar, sanatçı biyografisi ve sanat akımı bilgisi sunan, AI destekli bir web uygulaması.

## Teknik Mimari

- **Frontend:** Next.js (React), TailwindCSS
- **Backend:** FastAPI (Python)
- **Veritabanı:** PostgreSQL (planlı)
- **Cache:** Redis (planlı)
- **AI:** OpenAI GPT-4 Turbo, Vision API (planlı)

## Klasör Yapısı

```
ArtStoryAI/
  frontend/   # Next.js tabanlı arayüz
  backend/    # FastAPI tabanlı API
  scripts/    # Dokümantasyon ve analizler
```

## Kurulum

### 1. Frontend

```bash
cd frontend
npm install
npm run dev
```

### 2. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

### 3. Uygulamayı Aç

- Frontend: http://localhost:3000
- Backend API: http://127.0.0.1:8000

## Katkı ve Geliştirme

## Notlar

Bu projede OpenAI API entegrasyonu yapılmıştır. Ancak şu anda geçerli bir OpenAI API anahtarı bulunmadığından dolayı, demo sırasında hikaye üretimi çalışmayabilir.

Fonksiyonlar `features/openai_story.py` içinde yapılandırılmıştır. Gerçek bir OpenAI API key `.env` dosyasına eklendiğinde sistem sorunsuz çalışacaktır.

- Tüm tasklar için: `scripts/master_task_list.md`
- Frontend ve backend için ayrı README dosyalarına bakınız.

---

Daha fazla bilgi için: [scripts/ArtStoryAI-PRD.md](scripts/ArtStoryAI-PRD.md)
