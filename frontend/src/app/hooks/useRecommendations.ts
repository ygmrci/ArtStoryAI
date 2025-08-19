import { useState, useEffect } from 'react';

interface SimilarArtwork {
  title: string;
  artist: string;
  year: string;
  image_url: string;
  similarity_reason: string;
}

interface RecommendationResponse {
  success: boolean;
  recommendations: Array<{
    title: string;
    artist: string;
    year: string;
    image_url: string;
    similarity_reasons: string[];
  }>;
  total_recommendations: number;
}

export const useRecommendations = (artworkName: string) => {
  const [recommendations, setRecommendations] = useState<SimilarArtwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!artworkName) {
      setLoading(false);
      return;
    }

    // Prevent infinite loop - check if already fetched
    if (recommendations.length > 0 && !loading) {
      return;
    }

    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiUrl = `http://127.0.0.1:8000/recommendations/similar/${encodeURIComponent(
          artworkName,
        )}?limit=5`;

        // Backend API'den benzer eserleri al
        const response = await fetch(apiUrl);

        console.log('📡 Response status:', response.status);
        console.log('📡 Response ok:', response.ok);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ API Error Response:', errorText);
          throw new Error(`API error: ${response.status} - ${errorText}`);
        }

        const data: RecommendationResponse = await response.json();
        console.log('📊 API Response Data:', data);

        if (data.success && data.recommendations && data.recommendations.length > 0) {
          // Backend response'unu SimilarArtworks interface'ine uyarla
          const formattedRecommendations: SimilarArtwork[] = data.recommendations.map((rec) => ({
            title: rec.title,
            artist: rec.artist,
            year: rec.year.toString(),
            image_url: rec.image_url,
            similarity_reason: rec.similarity_reasons.join(', ') || 'Benzer eser',
          }));

          console.log('✅ Formatted recommendations:', formattedRecommendations);
          setRecommendations(formattedRecommendations);
        } else {
          console.log('⚠️ No recommendations, fetching random artworks...');
          // Öneriler boşsa random eserler getir
          await fetchRandomArtworks();
        }
      } catch (err) {
        console.error('❌ Recommendation fetch error:', err);
        setError(err instanceof Error ? err.message : 'Öneri alınamadı');
        // Hata durumunda da random eserler getir
        await fetchRandomArtworks();
      } finally {
        console.log('🏁 Setting loading to false');
        setLoading(false);
      }
    };

    const fetchRandomArtworks = async () => {
      try {
        console.log('🎲 Fetching random artworks as fallback...');

        // Explore endpoint'inden random eserler al
        const response = await fetch('http://127.0.0.1:8000/recommendations/explore?limit=10');

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.recommendations) {
            // 10 eserden rastgele 3 tanesini seç
            const shuffled = data.recommendations.sort(() => 0.5 - Math.random());
            const randomArtworks = shuffled.slice(0, 3);

            const formattedRandomArtworks: SimilarArtwork[] = randomArtworks.map((rec: any) => ({
              title: rec.title,
              artist: rec.artist,
              year: rec.year.toString(),
              image_url: rec.image_url,
              similarity_reason: 'Keşfet: ' + (rec.exploration_reason || 'Sanat eseri'),
            }));

            console.log('🎲 Random artworks fetched:', formattedRandomArtworks);
            setRecommendations(formattedRandomArtworks);
            return;
          }
        }

        // Explore endpoint de çalışmazsa hardcoded fallback
        console.log('🎲 Using hardcoded fallback artworks...');
        const fallbackArtworks: SimilarArtwork[] = [
          {
            title: "Adem'in Yaratılışı",
            artist: 'Michelangelo',
            year: '1508-1512',
            image_url: '/artworks/Adem.jpg', // Doğru eşleştirme
            similarity_reason: 'Keşfet: Rönesans başyapıtı',
          },
          {
            title: 'Sunflowers',
            artist: 'Vincent van Gogh',
            year: '1888',
            image_url: '/artworks/sunflowers.jpg', // Doğru eşleştirme
            similarity_reason: 'Keşfet: Post-Impressionism eseri',
          },
          {
            title: 'Weeping Woman',
            artist: 'Pablo Picasso',
            year: '1937',
            image_url: '/artworks/Weeping-woman.jpg', // Doğru eşleştirme
            similarity_reason: 'Keşfet: Cubism eseri',
          },
        ];

        setRecommendations(fallbackArtworks);
      } catch (err) {
        console.error('❌ Random artworks fetch error:', err);
        setRecommendations([]);
      }
    };

    fetchRecommendations();
  }, [artworkName]);

  return {
    recommendations,
    loading,
    error,
  };
};
