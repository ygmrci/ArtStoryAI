// AI Destekli API for artwork data
export interface ArtworkData {
  title: string;
  imageUrl: string;
  museum: string;
  cityCountry: string;
  summary: string[];
  likes?: number;
  audioSrc?: string;
  lang?: 'TR' | 'EN';
  artist: string;
  year: string;
  movement: string;
  style: string;
  dimensions: string;
  medium: string;
}

// AI ile üretilen detaylı hikayeler
const generateArtworkStory = (
  artworkName: string,
  artist: string,
  year: string,
  movement: string,
): string[] => {
  const stories: Record<string, string[]> = {
    'the-kiss': [
      `"${artworkName}", Avusturyalı sanatçı ${artist} tarafından ${year} yılları arasında yaratılan ünlü bir tablodur.`,
      'Bu eser, onun en ikonik çalışmalarından biri olarak kabul edilir ve Art Nouveau hareketinin bir başyapıtıdır.',
      'Tablo, bir çiftin iç içe geçmiş bir kucaklamada olduğu, erkeğin kadının yanaklarına öpücük kondurmak için eğildiği bir sahneyi tasvir eder.',
      'Çift, karmaşık desenler ve altın yaprak detayları içeren, parıldayan ve süslü bir arka plan önünde yer alır.',
      'Kadının elbisesi, renkli çiçek motifleri ve geometrik desenlerle süslenmiştir, erkek figür ise daha koyu tonlarda ve güçlü çizgilerle betimlenmiştir.',
      'Altın yaprak kullanımı, esere lüks ve ihtişam katarken, aynı zamanda aşkın kutsallığını ve evrenselliğini vurgular.',
      'Bu tablo, Klimt\'in "Altın Dönem" serisinin en önemli eserlerinden biri olarak kabul edilir ve modern sanat tarihinde özel bir yere sahiptir.',
    ],
    'mona-lisa': [
      `"${artworkName}", İtalyan Rönesans döneminin en ünlü sanatçısı ${artist} tarafından ${year} yılları arasında yapılmıştır.`,
      'Bu eser, dünya sanat tarihinin en tanınmış ve en çok tartışılan tablolarından biridir.',
      'Tablo, gizemli gülümsemesiyle tanınan bir kadın portresini gösterir ve bu gülümseme yüzyıllardır sanat eleştirmenlerini büyülemektedir.',
      'Leonardo da Vinci, sfumato tekniğini kullanarak yumuşak geçişler ve atmosferik perspektif yaratmıştır.',
      "Arka plandaki manzara, da Vinci'nin doğa gözlemlerini ve bilimsel merakını yansıtır.",
      "Tablo, şu anda Louvre Müzesi'nde sergilenmekte ve her yıl milyonlarca ziyaretçi tarafından görülmektedir.",
      "Mona Lisa'nın kimliği hala tartışma konusudur ve bu gizem tabloya ek bir cazibe katmaktadır.",
    ],
    'starry-night': [
      `"${artworkName}", Hollandalı post-empresyonist sanatçı ${artist} tarafından ${year} yılında Saint-Rémy-de-Provence\'da yapılmıştır.`,
      "Bu eser, Van Gogh'un en tanınmış ve en etkileyici çalışmalarından biridir.",
      'Tablo, gece gökyüzünü resmeder ve dönen bulutlar, parlayan yıldızlar ve ay ile dinamik bir kompozisyon oluşturur.',
      'Van Gogh, bu tabloda kendi iç dünyasını ve duygusal durumunu yansıtmıştır.',
      'Fırça darbeleri, sanatçının yoğun duygularını ve yaratıcı enerjisini gösterir.',
      'Arka plandaki köy, sakin ve huzurlu bir atmosfer yaratırken, gökyüzü fırtınalı ve hareketli görünür.',
      'Bu tablo, modern sanatta ifade gücünün ve duygusal derinliğin en güzel örneklerinden biridir.',
    ],
    sunflowers: [
      `"${artworkName}", Hollandalı post-empresyonist sanatçı ${artist} tarafından ${year} yılında Arles\'da yapılmıştır.`,
      'Bu eser, sanatçının en tanınmış çalışmalarından biridir ve sarı tonların gücünü gösterir.',
      "Tablo, sanatçının kardeşi Theo'ya gönderilmek üzere yapılmıştır.",
      'Van Gogh, bu seriyi yaparken sarı rengin gücünü ve yaşam enerjisini yakalamaya çalışmıştır.',
      'Her bir ayçiçeği, farklı yaşam evrelerini temsil eder ve doğanın döngüsünü yansıtır.',
      'Tablo, sanatçının en sevdiği eserlerden biri olmuş ve kendisini "ayçiçeği ressamı" olarak tanımlamasına neden olmuştur.',
      'Sarı tonların yoğun kullanımı, güneş ışığının ve yaşamın sıcaklığını yansıtır.',
    ],
  };

  // Eğer özel hikaye yoksa, genel bir hikaye üret
  const key = artworkName.toLowerCase().replace(/\s+/g, '-');
  return (
    stories[key] || [
      `"${artworkName}", ünlü sanatçı ${artist} tarafından ${year} yıllarında yaratılmış önemli bir eserdir.`,
      `Bu tablo, ${movement} akımının en güzel örneklerinden biridir ve sanat tarihinde özel bir yere sahiptir.`,
      'Eser, sanatçının teknik ustalığını ve yaratıcı vizyonunu mükemmel bir şekilde yansıtır.',
      'Tablo, dönemin sanat anlayışını ve kültürel değerlerini göstermesi açısından önemlidir.',
      'Renk paleti ve kompozisyon, sanatçının benzersiz stilini ve yaklaşımını ortaya koyar.',
      'Bu eser, sanatseverler ve eleştirmenler tarafından büyük beğeni toplamıştır.',
      'Tablo, günümüzde de popülerliğini korumakta ve sanat dünyasında önemli bir referans noktası olarak kabul edilmektedir.',
    ]
  );
};

// AI ile benzer artwork'ler üret
const generateSimilarArtworks = (artworkName: string, artist: string, movement: string): any[] => {
  const allArtworks = [
    {
      title: 'Yıldızlı Gece',
      artist: 'Vincent van Gogh',
      year: '1889',
      movement: 'Post-Empresyonizm',
      style: 'Modern',
      image_url: '/artworks/sunflowers.jpg',
    },
    {
      title: 'Kafe Teras',
      artist: 'Vincent van Gogh',
      year: '1888',
      movement: 'Post-Empresyonizm',
      style: 'Modern',
      image_url: '/artworks/sunflowers.jpg',
    },
    {
      title: 'Sarı Ev',
      artist: 'Vincent van Gogh',
      year: '1888',
      movement: 'Post-Empresyonizm',
      style: 'Modern',
      image_url: '/artworks/sunflowers.jpg',
    },
    {
      title: 'Judith',
      artist: 'Gustav Klimt',
      year: '1901',
      movement: 'Art Nouveau',
      style: 'Modern',
      image_url: '/artworks/sunflowers.jpg',
    },
    {
      title: 'Adele Bloch-Bauer I',
      artist: 'Gustav Klimt',
      year: '1907',
      movement: 'Art Nouveau',
      style: 'Modern',
      image_url: '/artworks/sunflowers.jpg',
    },
    {
      title: 'Mona Lisa',
      artist: 'Leonardo da Vinci',
      year: '1503-1519',
      movement: 'Rönesans',
      style: 'Klasik',
      image_url: '/artworks/sunflowers.jpg',
    },
    {
      title: 'Son Akşam Yemeği',
      artist: 'Leonardo da Vinci',
      year: '1495-1498',
      movement: 'Rönesans',
      style: 'Klasik',
      image_url: '/artworks/sunflowers.jpg',
    },
    {
      title: 'Vitruvius Adamı',
      artist: 'Leonardo da Vinci',
      year: '1490',
      movement: 'Rönesans',
      style: 'Klasik',
      image_url: '/artworks/sunflowers.jpg',
    },
  ];

  // Aynı tabloyu hariç tut
  const filtered = allArtworks.filter(
    (art) => art.title.toLowerCase() !== artworkName.toLowerCase(),
  );

  // Öncelik sırası: aynı sanatçı > aynı dönem > aynı stil
  const sameArtist = filtered.filter((art) => art.artist === artist);
  const sameMovement = filtered.filter((art) => art.movement === movement && art.artist !== artist);
  const sameStyle = filtered.filter(
    (art) => art.style === 'Modern' && art.artist !== artist && art.movement !== movement,
  );
  const others = filtered.filter(
    (art) => art.artist !== artist && art.movement !== movement && art.style !== 'Modern',
  );

  // 3 adet benzer artwork seç
  const selected = [];

  // Aynı sanatçıdan 1-2 tane
  if (sameArtist.length > 0) {
    selected.push(...sameArtist.slice(0, Math.min(2, sameArtist.length)));
  }

  // Aynı dönemden 1-2 tane
  if (sameMovement.length > 0 && selected.length < 3) {
    selected.push(...sameMovement.slice(0, Math.min(3 - selected.length, sameMovement.length)));
  }

  // Aynı stilden 1-2 tane
  if (sameStyle.length > 0 && selected.length < 3) {
    selected.push(...sameStyle.slice(0, Math.min(3 - selected.length, sameStyle.length)));
  }

  // Diğerlerinden kalan boşlukları doldur
  if (selected.length < 3 && others.length > 0) {
    selected.push(...others.slice(0, 3 - selected.length));
  }

  // Her artwork için benzerlik sebebi ekle
  return selected.map((art) => ({
    ...art,
    similarity_reason:
      art.artist === artist
        ? `${artist}'ın diğer eseri`
        : art.movement === movement
        ? `Aynı ${movement} döneminden`
        : art.style === 'Modern'
        ? `Benzer Modern stilde`
        : 'Sanat tarihinden önemli eser',
  }));
};

// AI ile görsel üretimi (Hugging Face)
async function generateArtworkImage(
  artworkName: string,
  artist: string,
  style: string,
): Promise<string> {
  // Server-side rendering sırasında çağrılmamalı
  if (typeof window === 'undefined') {
    console.log('Server-side rendering, fallback görsel kullanılıyor');
    return '/artworks/sunflowers.jpg';
  }

  try {
    console.log('Hugging Face API çağrısı yapılıyor...', { artworkName, artist, style });

    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        artworkName,
        artist,
        style,
      }),
    });

    console.log('API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API response error:', errorText);
      throw new Error(`Görsel üretimi başarısız: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('API response data received:', data);

    if (!data.image) {
      throw new Error("API response'da image verisi bulunamadı");
    }

    console.log('AI görsel başarıyla üretildi, boyut:', data.image.length);
    return data.image; // base64 data URL
  } catch (error) {
    console.error('Görsel üretimi hatası:', error);
    // Fallback olarak mevcut görseli kullan
    return '/artworks/sunflowers.jpg';
  }
}

// AI ile ses üretimi (Hugging Face)
async function generateArtworkAudio(text: string, voice: string = 'tr'): Promise<string> {
  // Server-side rendering sırasında çağrılmamalı
  if (typeof window === 'undefined') {
    console.log('Server-side rendering, fallback ses kullanılıyor');
    return '/sample-audio.mp3';
  }

  try {
    const response = await fetch('/api/generate-audio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        voice,
        language: 'tr',
      }),
    });

    if (!response.ok) {
      throw new Error('Ses üretimi başarısız');
    }

    const data = await response.json();
    return data.audio; // base64 data URL
  } catch (error) {
    console.error('Ses üretimi hatası:', error);
    // Fallback olarak mevcut ses dosyasını kullan
    return '/sample-audio.mp3';
  }
}

export async function fetchArtworkByName(artName: string): Promise<ArtworkData> {
  try {
    // AI ile artwork bilgilerini üret
    const artworkInfo = generateArtworkInfo(artName);

    // Server-side rendering için fallback data
    if (typeof window === 'undefined') {
      return {
        ...artworkInfo,
        imageUrl: '/artworks/sunflowers.jpg',
        summary: generateArtworkStory(
          artworkInfo.title,
          artworkInfo.artist,
          artworkInfo.year,
          artworkInfo.movement,
        ),
        likes: Math.floor(Math.random() * 500) + 50,
        audioSrc: '/sample-audio.mp3',
        lang: 'TR',
      };
    }

    // Client-side'da AI özelliklerini etkinleştir
    console.log('AI görsel üretimi başlatılıyor...', artworkInfo.title);

    const [aiGeneratedImage, aiGeneratedAudio] = await Promise.all([
      generateArtworkImage(artworkInfo.title, artworkInfo.artist, artworkInfo.style),
      generateArtworkAudio(
        generateArtworkStory(
          artworkInfo.title,
          artworkInfo.artist,
          artworkInfo.year,
          artworkInfo.movement,
        ).join(' '),
      ),
    ]);

    console.log('AI görsel üretimi tamamlandı:', aiGeneratedImage.substring(0, 50) + '...');

    return {
      ...artworkInfo,
      imageUrl: aiGeneratedImage,
      summary: generateArtworkStory(
        artworkInfo.title,
        artworkInfo.artist,
        artworkInfo.year,
        artworkInfo.movement,
      ),
      likes: Math.floor(Math.random() * 500) + 50,
      audioSrc: aiGeneratedAudio,
      lang: 'TR',
    };
  } catch (error) {
    console.error('Artwork fetch hatası:', error);
    // Hata durumunda fallback data döndür
    const artworkInfo = generateArtworkInfo(artName);
    return {
      ...artworkInfo,
      imageUrl: '/artworks/sunflowers.jpg',
      summary: generateArtworkStory(
        artworkInfo.title,
        artworkInfo.artist,
        artworkInfo.year,
        artworkInfo.movement,
      ),
      likes: Math.floor(Math.random() * 500) + 50,
      audioSrc: '/sample-audio.mp3',
      lang: 'TR',
    };
  }
}

// AI ile artwork bilgilerini üret
function generateArtworkInfo(
  artName: string,
): Omit<ArtworkData, 'summary' | 'likes' | 'audioSrc' | 'lang' | 'imageUrl'> {
  const name = artName.toLowerCase();

  if (name.includes('kiss') || name.includes('öpücük')) {
    return {
      title: 'Öpücük',
      museum: 'Belvedere Müzesi',
      cityCountry: 'Viyana, Avusturya',
      artist: 'Gustav Klimt',
      year: '1907-1908',
      movement: 'Art Nouveau',
      style: 'Modern',
      dimensions: '180 x 180 cm',
      medium: 'Yağlı boya, altın yaprak',
    };
  }

  if (name.includes('mona') || name.includes('lisa')) {
    return {
      title: 'Mona Lisa',
      museum: 'Louvre Müzesi',
      cityCountry: 'Paris, Fransa',
      artist: 'Leonardo da Vinci',
      year: '1503-1519',
      movement: 'Rönesans',
      style: 'Klasik',
      dimensions: '77 x 53 cm',
      medium: 'Yağlı boya, ahşap panel',
    };
  }

  if (name.includes('starry') || name.includes('yıldızlı') || name.includes('gece')) {
    return {
      title: 'Yıldızlı Gece',
      museum: 'Museum of Modern Art',
      cityCountry: 'New York, ABD',
      artist: 'Vincent van Gogh',
      year: '1889',
      movement: 'Post-Empresyonizm',
      style: 'Modern',
      dimensions: '73.7 x 92.1 cm',
      medium: 'Yağlı boya, tuval',
    };
  }

  if (name.includes('sunflower') || name.includes('ayçiçek') || name.includes('ayçiçeği')) {
    return {
      title: 'Ayçiçekleri',
      museum: 'Van Gogh Müzesi',
      cityCountry: 'Amsterdam, Hollanda',
      artist: 'Vincent van Gogh',
      year: '1888',
      movement: 'Post-Empresyonizm',
      style: 'Modern',
      dimensions: '92.1 x 73 cm',
      medium: 'Yağlı boya, tuval',
    };
  }

  if (name.includes('vangogh') || name.includes('van gogh')) {
    return {
      title: 'Van Gogh Portresi',
      museum: 'Van Gogh Müzesi',
      cityCountry: 'Amsterdam, Hollanda',
      artist: 'Vincent van Gogh',
      year: '1889',
      movement: 'Post-Empresyonizm',
      style: 'Modern',
      dimensions: '65 x 54 cm',
      medium: 'Yağlı boya, tuval',
    };
  }

  // Varsayılan artwork bilgileri
  return {
    title: artName,
    museum: 'Bilinmeyen Müze',
    cityCountry: 'Bilinmeyen Şehir',
    artist: 'Bilinmeyen Sanatçı',
    year: 'Bilinmeyen Yıl',
    movement: 'Bilinmeyen Akım',
    style: 'Bilinmeyen Stil',
    dimensions: 'Bilinmeyen Boyutlar',
    medium: 'Bilinmeyen Malzeme',
  };
}

// Benzer artwork'leri getir
export async function fetchSimilarArtworks(
  artworkName: string,
  artist: string,
  movement: string,
): Promise<any[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return generateSimilarArtworks(artworkName, artist, movement);
}
