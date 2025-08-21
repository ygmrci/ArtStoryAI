# ArtStoryAI 🎨

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=flat-square&logo=github)](https://github.com/ygmrci/ArtStoryAI)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

**GitHub Repository:** [https://github.com/ygmrci/ArtStoryAI](https://github.com/ygmrci/ArtStoryAI)

## 🌟 Proje Amacı

Sanatseverler için, **sanat eseri adıyla hızlıca** detaylı bilgiler, sanatçı biyografisi ve sanat akımı bilgisi sunan, **AI destekli responsive web uygulaması**.

## ✨ Özellikler

### 🎯 **Ana Özellikler**

- **Hızlı Arama**: Sanat eseri adını yazın, anında bilgi alın
- **AI Destekli**: OpenAI GPT-4 ile detaylı sanat analizi
- **Responsive Tasarım**: Tüm cihazlarda mükemmel görünüm
- **Favori Sistemi**: Beğendiğiniz eserleri kaydedin
- **Akıllı Filtreleme**: Dönem, stil, renk ve müze bazında arama

### 📱 **Responsive Tasarım**

- **Mobile-First**: Mobil cihazlarda optimize edilmiş deneyim
- **Breakpoint Sistemi**: xs, sm, md, lg, xl, 2xl, 3xl, 4xl
- **Touch-Friendly**: Mobil cihazlarda dokunmatik optimizasyon
- **Adaptive Layout**: Ekran boyutuna göre otomatik düzenleme

## 🚀 Teknik Mimari

### **Frontend Stack**

- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 3.3
- **State Management**: React Context API
- **Responsive**: Custom breakpoints + CSS Grid/Flexbox

### **Backend Stack**

- **Framework**: FastAPI (Python 3.8+)
- **AI Integration**: OpenAI GPT-4 Turbo
- **API Design**: RESTful + Async operations
- **Performance**: Async/await pattern

### **Responsive Breakpoints**

```css
xs: 320px    /* Mobile */
sm: 640px    /* Large Mobile */
md: 768px    /* Small Tablet */
lg: 1024px   /* Tablet */
xl: 1280px   /* Small Desktop */
2xl: 1536px  /* Desktop */
3xl: 1920px  /* Large Desktop */
4xl: 2560px  /* Ultra Wide */
```

## 📁 Klasör Yapısı

```
ArtStoryAI/
├── frontend/                 # Next.js tabanlı arayüz
│   ├── src/
│   │   ├── app/             # App Router
│   │   │   ├── components/  # React components
│   │   │   ├── contexts/    # Context providers
│   │   │   └── globals.css  # Global styles
│   │   └── ...
│   ├── tailwind.config.js   # Tailwind configuration
│   └── package.json
├── backend/                  # FastAPI tabanlı API
│   ├── app/
│   │   ├── main.py         # FastAPI app
│   │   ├── features/       # Business logic
│   │   └── ...
│   └── requirements.txt
└── scripts/                 # Dokümantasyon
```

## 🎨 **Kullanıcılar İçin Sanat Eseri Önerileri**

Projeyi test etmek için aşağıdaki popüler sanat eserlerini deneyebilirsiniz:

### 🌟 **Klasik Eserler**

- **The Starry Night** - Vincent van Gogh
- **Mona Lisa** - Leonardo da Vinci
- **The Scream** - Edvard Munch
- **Girl with a Pearl Earring** - Johannes Vermeer
- **The Persistence of Memory** - Salvador Dalí

### 🎭 **Modern Eserler**

- **Guernica** - Pablo Picasso
- **Water Lilies** - Claude Monet
- **The Birth of Venus** - Sandro Botticelli
- **American Gothic** - Grant Wood
- **The Night Watch** - Rembrandt

### 🖼️ **Türk Sanatı**

- **Kaplumbağa Terbiyecisi** - Osman Hamdi Bey
- **Silah Taciri** - Osman Hamdi Bey
- **Vedat Tek'in Evi** - Mimar Vedat Tek

## 🛠️ Kurulum

### Ön Gereksinimler

- **Python 3.8+** - [Python.org](https://www.python.org/downloads/)
- **Node.js 18+** - [Nodejs.org](https://nodejs.org/)
- **Git** - [Git-scm.com](https://git-scm.com/)

### 1. Projeyi İndirme

```bash
git clone https://github.com/ygmrci/ArtStoryAI.git
cd ArtStoryAI
```

### 2. Backend Kurulumu

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

Backend klasöründe `.env` dosyası oluşturun:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

#### Backend'i Başlatma

```bash
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### 3. Frontend Kurulumu

```bash
cd frontend
npm install
npm run dev
```

### 4. Uygulamayı Aç

- **Frontend**: http://localhost:3000
- **Backend API**: http://127.0.0.1:8000

## 📱 Responsive Özellikler

### **Mobile-First Design**

- Touch-friendly butonlar (min 44px)
- Responsive typography (clamp() fonksiyonu)
- Adaptive spacing ve padding
- Mobile-optimized navigation

### **Component Responsiveness**

- **Header**: Kompakt mobile tasarım
- **Landing**: Adaptive layout (mobile: dikey, desktop: yatay)
- **SearchBar**: Responsive input boyutları
- **ArtworkCard**: Grid-based responsive layout
- **Footer**: Responsive grid ve spacing

### **Performance Optimizations**

- Lazy loading images
- Responsive image sizing
- Touch device optimizations
- CSS-in-JS minimal usage

## 🔧 Geliştirme

### **Responsive Development**

```bash
# Development server
npm run dev

# Build production
npm run build

# Preview production build
npm run start
```

### **Tailwind CSS Customization**

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      screens: {
        xs: "320px",
        "3xl": "1920px",
        "4xl": "2560px",
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
      },
    },
  },
};
```

## 📊 API Endpoints

### **Sanat Eseri Arama**

```
GET /artwork/{eser_adi}
```

### **Favori Sistemi**

```
GET /favorites          # Favori listesi
POST /favorites         # Favori ekleme
DELETE /favorites/{id}  # Favori silme
```

### **Akıllı Filtreleme**

```
GET /discover?periods=renaissance&styles=oil_painting
```

## ⚠️ OpenAI API Kullanımı

### **Rate Limits**

- **Ücretsiz**: Dakikada 3 istek
- **Ücretli**: Planınıza göre değişir

### **Çözüm Önerileri**

- Hızlı istekler arasında 20-30 saniye bekleyin
- API key'inizi `.env` dosyasına ekleyin
- Gerekirse OpenAI hesabınıza kredi ekleyin

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Commit yapın (`git commit -m 'Add AmazingFeature'`)
4. Push yapın (`git push origin feature/AmazingFeature`)
5. Pull Request açın

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🙏 Teşekkürler

- **OpenAI** - GPT-4 API
- **Next.js Team** - React framework
- **FastAPI Team** - Python web framework
- **Tailwind CSS** - Utility-first CSS framework

---

**ArtStoryAI** - Sanat tarihini keşfetmenin en kolay yolu! 🎨✨

**GitHub**: [https://github.com/ygmrci/ArtStoryAI](https://github.com/ygmrci/ArtStoryAI)
