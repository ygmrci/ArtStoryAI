'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchBar from '@/app/components/SearchBar';
import CollectionsCarousel from '@/app/components/CollectionsCarousel';
import FeaturedCollectionSlider from '@/app/components/FeaturedCollectionSlider';
import ContinueReadingGrid from '@/app/components/ContinueReadingGrid';
import Card from '@/app/components/Card';
import { useRef } from 'react';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Lütfen bir sanatçı veya eser adı girin.');
      inputRef.current?.focus();
      return;
    }
    setError('');
    router.push(`/artwork/${encodeURIComponent(query.trim())}`);
  };

  return (
    <main className="min-h-screen bg-[#121212] text-[#ffffff] font-body px-4 py-6 md:px-8 md:py-12">
      {/* Hero */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 mb-10 md:mb-16">
        <div className="flex-1 flex flex-col gap-4 md:gap-6 min-w-0">
          <h1 className="text-3xl md:text-5xl font-heading font-bold mb-1 md:mb-2">
            Sanat eserlerine hayat verin
          </h1>
          <p className="text-base md:text-lg text-muted mb-4 md:mb-6">
            Bir tablo adı yazın, AI sizin için hikayesini anlatsın.
          </p>
          <div className="w-full">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full max-w-md"
            >
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setError('');
                }}
                placeholder="Sanatçı veya eser adı yazın"
                className="flex-1 px-3 py-2 md:px-4 md:py-2 rounded-button border border-muted bg-surface text-text focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-muted shadow-sm text-sm md:text-base"
                autoFocus
                aria-label="Sanatçı veya eser adı"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-4 md:px-6 py-2 rounded-button bg-accent text-white font-bold shadow-card hover:bg-primary active:scale-95 transition-all duration-150 text-sm md:text-base"
                aria-label="Ara"
              >
                Ara
              </button>
            </form>
            {error && (
              <span className="text-red-500 text-sm mt-1" role="alert">
                {error}
              </span>
            )}
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center w-full md:w-auto mt-8 md:mt-0 max-w-xs md:max-w-md mx-auto">
          <img
            src="/globe.svg"
            alt="ArtStoryAI"
            className="w-40 h-40 md:w-64 md:h-64 max-w-full object-contain rounded-card shadow-card"
          />
        </div>
      </section>

      {/* Koleksiyonlar */}
      <section className="mb-10 md:mb-16">
        <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6 md:mb-8">Koleksiyonlar</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {/* Her koleksiyon için bir kart */}
          <Card className="flex flex-col items-center">
            <img
              src="/sunflowers.jpg"
              alt="Van Gogh'un Sunflowers tablosu"
              className="w-full max-w-[160px] aspect-square object-cover rounded-card mb-4 border border-muted bg-surface"
            />
            <h3 className="text-xl font-bold mb-2">Sunflowers</h3>
            <p className="text-muted text-center">
              Van Gogh'un bir başka ünlü eseri. AI hikayesi burada yer alacak.
            </p>
          </Card>
          {/* ... diğer koleksiyonlar */}
        </div>
      </section>

      {/* Öne Çıkanlar */}
      <section className="mb-10 md:mb-16">
        <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6 md:mb-8">Öne Çıkanlar</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {/* Her öne çıkan için bir kart */}
          <Card className="flex flex-col items-center">
            <img
              src="/globe.svg"
              alt="Vincent van Gogh - Yıldızlı Gece"
              className="w-full max-w-[160px] aspect-square object-cover rounded-card mb-4 border border-muted bg-surface"
            />
            <h3 className="text-xl font-bold mb-2">Yıldızlı Gece</h3>
            <p className="text-muted text-center">
              Vincent van Gogh'un ünlü eseri. AI tarafından oluşturulan hikaye burada yer alacak.
            </p>
          </Card>
          {/* ... diğer öne çıkanlar */}
        </div>
      </section>

      {/* Devam Ettikleriniz */}
      <section>
        <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6 md:mb-8">
          Okumaya Devam Et
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {/* Her devam edilen için bir kart */}
          <Card className="flex flex-col items-center">
            <img
              src="/globe.svg"
              alt="Devam Ettiğiniz Eser"
              className="w-full max-w-[160px] aspect-square object-cover rounded-card mb-4 border border-muted bg-surface"
            />
            <h3 className="text-xl font-bold mb-2">Devam Ettiğiniz Eser</h3>
            <p className="text-muted text-center">Burada yarım bıraktığınız hikaye devam edecek.</p>
          </Card>
          {/* ... diğer devam ettikleriniz */}
        </div>
      </section>
    </main>
  );
}
