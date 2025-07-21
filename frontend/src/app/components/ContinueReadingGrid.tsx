'use client';

type Artwork = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
};

const artworks: Artwork[] = [
  {
    id: '1',
    title: 'Hollandalı Kız',
    subtitle: 'Sanat Eseri',
    image:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '2',
    title: 'Avrupa...',
    subtitle: 'Sanat Eseri',
    image:
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '3',
    title: 'Johannes Ver...',
    subtitle: 'Sanatçı',
    image:
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80',
  },
];

const ContinueReadingGrid = () => {
  return (
    <section className="w-full mt-4 md:mt-8">
      <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3 px-2 md:px-0">
        Okumaya Devam Et
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 px-2 md:px-0">
        {artworks.map((art) => (
          <div
            key={art.id}
            className="bg-[#1e1e1e] dark:bg-surface rounded-xl shadow-card overflow-hidden flex flex-col group transition-transform hover:scale-105 focus-within:scale-105 duration-200"
            tabIndex={0}
            aria-label={art.title + ' ' + art.subtitle}
          >
            <div className="relative w-full aspect-[4/3] overflow-hidden">
              <img
                src={art.image}
                alt={art.title}
                className="object-cover w-full h-32 md:h-40 group-hover:scale-105 transition-transform duration-200"
                draggable={false}
              />
            </div>
            <div className="p-3 md:p-4 flex flex-col gap-1">
              <span className="text-white text-base md:text-lg font-semibold truncate">
                {art.title}
              </span>
              <span className="text-gray-400 text-xs md:text-sm truncate">{art.subtitle}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ContinueReadingGrid;
