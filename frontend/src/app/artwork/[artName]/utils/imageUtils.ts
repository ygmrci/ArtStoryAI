export function getImageUrl(artName: string, imageUrl: string): string {
  if (!artName) return '/globe.svg';

  const title = artName.toLowerCase();

  // Manuel resimler için özel kontrol
  const manualImages: Record<string, string> = {
    'kaplumbağa terbiyecisi': '/artworks/kaplumbagaTerbiyecisi.jpg',
    'avignonlu kızlar': '/artworks/avignonluKızlar.jpg',
    'avignonlu-kızlar': '/artworks/avignonluKızlar.jpg', // URL slug için
    'avignonlu kizlar': '/artworks/avignonluKızlar.jpg', // Türkçe karakter olmadan
    avignonlu: '/artworks/avignonluKızlar.jpg', // Kısaltma
    'mona lisa': '/artworks/ladywithandermine.jpg',
    'venüs doğuşu': '/artworks/VenüsDogusu.jpg',
    nilüferler: '/artworks/Nilüferler.jpg',
    'koylu kadın': '/artworks/koyluKadın.jpg',
    'amerikan gotiği': '/artworks/amerikanGotiği.jpg',
    'adem yaratılışı': '/artworks/Adem.jpg',
    davut: '/artworks/David.jpg',
    'campbell çorbası': '/artworks/campbell_corba.jpg',
    'cennet bahçesi': '/artworks/cennetbahcesindenkovulma.jpg',
    'cafe teras': '/artworks/kafeTerastaGece.webp',
    'sarı ev': '/artworks/sarıev.jpg',
    ayçiçekleri: '/artworks/sunflowers.jpg',
    'süt çocuğu': '/artworks/themilkmaid.jpg',
    'ağlayan kadın': '/artworks/Weeping-woman.jpg',
    guernica: '/artworks/Picasso_Guernica.jpg',
    cans: '/artworks/Cans.jpg',
  };

  // Manuel resim kontrolü - daha esnek eşleştirme
  for (const [key, value] of Object.entries(manualImages)) {
    if (
      title.includes(key) ||
      key.includes(title) ||
      title.replace(/[^a-z0-9]/g, '').includes(key.replace(/[^a-z0-9]/g, ''))
    ) {
      console.log(`✅ Görsel eşleşti: "${artName}" -> "${key}" -> "${value}"`);
      return value;
    }
  }

  // Backend'den gelen resim için
  if (imageUrl) {
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    if (imageUrl.startsWith('/')) {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      return `${backendUrl}${imageUrl}`;
    }
  }

  // Fallback
  console.log(`❌ Görsel bulunamadı: "${artName}" -> fallback kullanılıyor`);
  return 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png';
}
