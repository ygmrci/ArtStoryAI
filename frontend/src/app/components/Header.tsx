'use client';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import LanguageSwitcher from './LanguageSwitcher';

const navItems = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Keşfet', href: '/kesfet' },
  { label: 'Hakkında', href: '/hakkinda' },
  { label: 'İletişim', href: '/iletisim' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleMenuToggle = () => setIsMenuOpen((v) => !v);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-md shadow-md border-b border-gray-200 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <a
          href="/"
          className="flex items-center gap-2 text-gray-900 text-2xl font-extrabold tracking-tight font-heading select-none drop-shadow-lg hover:scale-105 transition-transform duration-200"
          tabIndex={0}
          aria-label="ArtStoryAI Ana Sayfa"
        >
          <span className="text-3xl" role="img" aria-label="Palet">
            🎨
          </span>
          <span className="ml-1">ArtStoryAI</span>
        </a>
        <nav className="hidden md:flex gap-8 text-gray-700 font-medium" aria-label="Ana menü">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative px-2 py-1 hover:text-indigo-600 focus:text-indigo-600 transition-colors duration-200 focus:outline-none after:content-[''] after:block after:h-0.5 after:bg-indigo-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200"
              tabIndex={0}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          {/* Mobil menü butonu */}
          <button
            className="md:hidden text-gray-700 focus:outline-none hover:scale-110 transition-transform duration-200"
            aria-label={isMenuOpen ? 'Menüyü Kapat' : 'Menüyü Aç'}
            onClick={handleMenuToggle}
          >
            {isMenuOpen ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
          </button>
        </div>
      </div>
      {/* Mobil menü */}
      {isMenuOpen && (
        <nav
          className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md flex flex-col gap-4 px-6 py-6 z-50 border-b border-gray-200 shadow-md"
          aria-label="Mobil menü"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-gray-900 text-lg hover:text-indigo-600 focus:text-indigo-600 transition-colors duration-200 focus:outline-none"
              tabIndex={0}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
