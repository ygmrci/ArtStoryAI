'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();
  const navItems = [
    { id: 'dailyart', label: 'DailyArt', icon: '🎨', href: '/dailyart' },
    { id: 'search', label: 'Ara', icon: '🔍', href: '/search' },
    { id: 'listen', label: 'Dinle', icon: '🎧', href: '/listen' },
    { id: 'favorites', label: 'Favoriler', icon: '❤️', href: '/favorites' },
    { id: 'settings', label: 'Ayarlar', icon: '⚙️', href: '/settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-700 z-50 lg:hidden">
      <div className="flex justify-around items-center py-2 sm:py-3">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`group flex flex-col items-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-md transition-all duration-200 ${
                isActive
                  ? 'text-purple-400 bg-purple-400/10'
                  : 'text-gray-400 hover:text-purple-300 hover:bg-purple-400/5'
              }`}
              aria-label={`${item.label} sayfasına git`}
            >
              <span className="text-base sm:text-lg">{item.icon}</span>
              <span className="text-[10px] sm:text-[11px] font-medium tracking-tight mt-0.5 sm:mt-1">
                {item.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-purple-500 rounded-full mt-1 sm:mt-1.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
