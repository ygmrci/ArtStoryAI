'use client';
import { useState } from 'react';
import { LockClosedIcon } from '@heroicons/react/24/solid';

const featuredCollections = [
  {
    id: '1',
    title: 'Kübizmin Büyüleyici Yaratıcıları: Estetik Yenilikçiler',
    description:
      'Kübizmin büyüleyici dünyasına adım atın ve bu çığır açan hareketin en ünlü sanatçılarını içeren koleksiyonumuzu keşfedin.',
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    locked: true,
  },
  {
    id: '2',
    title: 'Rönesans’ın Ustaları',
    description: 'Rönesans döneminin en önemli sanatçılarını ve eserlerini keşfedin.',
    image:
      'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80',
    locked: false,
  },
];

const FeaturedCollectionSlider = () => {
  const [current, setCurrent] = useState(0);
  const total = featuredCollections.length;
  const col = featuredCollections[current];

  const handleDotClick = (idx: number) => setCurrent(idx);

  return (
    <section className="w-full max-w-4xl mx-auto mt-4 md:mt-8">
      <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-card bg-[#1e1e1e] dark:bg-surface min-h-[192px] md:min-h-[256px] flex items-end">
        <img
          src={col.image}
          alt={col.title}
          className="absolute inset-0 w-full h-48 md:h-64 object-cover object-center opacity-80"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="relative z-10 p-6 md:p-10 flex flex-col gap-2 md:gap-4 w-full">
          <span className="text-xs md:text-sm text-[#ec9f05] font-semibold mb-1">Koleksiyon</span>
          <h3 className="text-white text-lg md:text-2xl font-bold leading-tight mb-1 md:mb-2 max-w-2xl">
            {col.title}
          </h3>
          <p className="text-white/90 text-sm md:text-base max-w-2xl line-clamp-2 md:line-clamp-3">
            {col.description}
          </p>
        </div>
        {col.locked && (
          <span className="absolute top-4 right-4 bg-black/60 rounded-full p-2">
            <LockClosedIcon className="w-6 h-6 md:w-7 md:h-7 text-white" />
          </span>
        )}
      </div>
      {/* Slider noktaları */}
      <div className="flex justify-center gap-2 mt-3">
        {featuredCollections.map((_, idx) => (
          <button
            key={idx}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-200 focus:outline-none ${
              idx === current ? 'bg-[#ec9f05] scale-110' : 'bg-gray-400 dark:bg-gray-600 opacity-60'
            }`}
            aria-label={`Koleksiyon ${idx + 1}`}
            onClick={() => handleDotClick(idx)}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedCollectionSlider;
