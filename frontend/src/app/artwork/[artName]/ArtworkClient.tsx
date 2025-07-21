'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ArtworkData {
  art_name: string;
  artist: string;
  year: number;
  movement: string;
  museum: string;
  story: string;
  artist_bio: string;
  movement_desc: string;
  image_url: string;
}

export default function ArtworkClient({ artName }: { artName: string }) {
  const [artwork, setArtwork] = useState<ArtworkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!artName) return;

    const fetchArtwork = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://127.0.0.1:8000/artwork/${encodeURIComponent(artName)}`);
        if (!res.ok) {
          throw new Error('API yanıtı başarısız');
        }
        const data = await res.json();
        setArtwork(data);
      } catch (err) {
        setError('Eser bilgileri alınırken bir hata oluştu.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtwork();
  }, [artName]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">Yükleniyor...</div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>
    );
  }

  if (!artwork) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        Eser bulunamadı.
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center px-10 py-16 bg-[#121212] text-[#ffffff] min-h-screen">
      <div className="bg-[#1e1e1e] p-8 rounded-[1rem] shadow-[0_6px_16px_rgba(0,0,0,0.4)] max-w-3xl w-full flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <Image
            src={artwork.image_url || '/globe.svg'}
            alt={artwork.art_name}
            width={400}
            height={400}
            className="rounded-[1rem] object-cover w-full h-auto"
            priority
          />
        </div>
        <div className="md:w-1/2 flex flex-col justify-center">
          <h1 className="text-4xl font-heading font-bold mb-4 text-[#ffffff]">
            {artwork.art_name}
          </h1>
          <p className="text-lg text-[#999999] mb-2">
            <strong>Sanatçı:</strong> {artwork.artist}
          </p>
          <p className="text-lg text-[#999999] mb-2">
            <strong>Yıl:</strong> {artwork.year}
          </p>
          <p className="text-lg text-[#999999] mb-2">
            <strong>Akım:</strong> {artwork.movement}
          </p>
          <p className="text-lg text-[#999999] mb-6">
            <strong>Müze:</strong> {artwork.museum}
          </p>

          <h2 className="text-2xl font-bold mt-4 mb-2">Hikayesi</h2>
          <p className="text-base text-[#cccccc] mb-4">{artwork.story}</p>

          <h2 className="text-2xl font-bold mt-4 mb-2">Sanatçı Biyografisi</h2>
          <p className="text-sm text-[#aaaaaa] mb-4">{artwork.artist_bio}</p>

          <h2 className="text-2xl font-bold mt-4 mb-2">Akım Açıklaması</h2>
          <p className="text-sm text-[#aaaaaa]">{artwork.movement_desc}</p>
        </div>
      </div>
    </main>
  );
}
