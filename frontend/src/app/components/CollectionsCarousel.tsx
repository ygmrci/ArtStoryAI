'use client';
import { LockClosedIcon } from '@heroicons/react/24/solid';

type Collection = {
  id: string;
  title: string;
  image: string;
  locked?: boolean;
};

const collections: Collection[] = [
  {
    id: '1',
    title: 'Cehenneme İniş',
    image: 'https://images.metmuseum.org/CRDImages/ep/original/DT1567.jpg',
    locked: true,
  },
  {
    id: '2',
    title: 'Ara niche',
    image: 'https://images.metmuseum.org/CRDImages/ep/original/DT1234.jpg',
    locked: true,
  },
  {
    id: '3',
    title: 'Kurtarıcı Dünya',
    image: 'https://images.metmuseum.org/CRDImages/ep/original/DT5678.jpg',
    locked: true,
  },
  {
    id: '4',
    title: 'Atölye',
    image: 'https://images.metmuseum.org/CRDImages/ep/original/DT9101.jpg',
    locked: false,
  },
];

const CollectionsCarousel = () => {
  return (
    <section className="w-full max-w-4xl mx-auto mt-2 md:mt-4">
      <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2 px-2 md:px-0">
        Koleksiyonlar
      </h2>
      <div className="flex gap-4 md:gap-6 overflow-x-auto pb-2 px-2 md:px-0 hide-scrollbar snap-x snap-mandatory">
        {collections.map((col) => (
          <div
            key={col.id}
            className="flex flex-col items-center min-w-[64px] md:min-w-[80px] snap-center"
            tabIndex={0}
            aria-label={col.title + (col.locked ? ' (Kilitli)' : '')}
          >
            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-4 border-[#ec9f05] dark:border-[#ec9f05] flex items-center justify-center bg-[#1e1e1e] dark:bg-surface shadow-card">
              <img
                src={col.image}
                alt={col.title}
                className="object-cover w-full h-full"
                draggable={false}
              />
              {col.locked && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <LockClosedIcon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </span>
              )}
            </div>
            <span className="mt-2 text-xs md:text-sm text-gray-900 dark:text-white text-center max-w-[80px] truncate">
              {col.title}
            </span>
          </div>
        ))}
      </div>
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default CollectionsCarousel;
