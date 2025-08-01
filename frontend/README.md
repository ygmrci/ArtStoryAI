# ArtStoryAI Frontend

Next.js tabanlı kullanıcı arayüzü.

## Kurulum

```bash
npm install
```

## Environment Variables

Proje çalışması için aşağıdaki environment variables'ları `.env.local` dosyasında tanımlayın:

```bash
# Base URL for metadata (production'da gerçek domain'inizi kullanın)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Development/Production Mode
NODE_ENV=development
```

## Çalıştırma

```bash
npm run dev
```

## Kod Kalitesi

- Lint: `npm run lint`
- Otomatik format: `npx prettier --write .`

### Kullanım

```bash
npm run lint
npx prettier --write .
```

## Metadata ve SEO

Proje, Next.js 13+ App Router kullanarak gelişmiş metadata desteği sunar:

- **Open Graph**: Sosyal medya paylaşımları için
- **Twitter Cards**: Twitter paylaşımları için
- **Dynamic Metadata**: Sayfa bazlı meta veriler
- **Structured Data**: Arama motorları için yapılandırılmış veri

### MetadataBase Uyarısı

Eğer "metadataBase property in metadata export is not set" uyarısı alırsanız:

1. `.env.local` dosyasında `NEXT_PUBLIC_BASE_URL` değişkenini tanımlayın
2. Production'da gerçek domain URL'inizi kullanın
3. Development'ta `http://localhost:3000` kullanın
