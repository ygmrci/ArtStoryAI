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
    <header className="flex justify-between items-center px-10 py-6 bg-[#1e1e1e] sticky top-0 z-50">
      <a
        href="/"
        className="flex items-center gap-2 text-white text-2xl font-extrabold tracking-tight font-heading select-none"
        tabIndex={0}
        aria-label="ArtStoryAI Ana Sayfa"
      >
        <span className="text-3xl" role="img" aria-label="Palet">
          🎨
        </span>
        <span className="ml-1">ASAI</span>
      </a>
      <nav className="hidden md:flex gap-6 text-white" aria-label="Ana menü">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="hover:text-[#ec9f05] transition-colors focus:outline-none focus:text-[#ec9f05]"
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
          className="md:hidden text-white focus:outline-none"
          aria-label={isMenuOpen ? 'Menüyü Kapat' : 'Menüyü Aç'}
          onClick={handleMenuToggle}
        >
          {isMenuOpen ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
        </button>
      </div>
      {/* Mobil menü */}
      {isMenuOpen && (
        <nav
          className="absolute top-full left-0 w-full bg-[#1e1e1e] flex flex-col gap-4 px-10 py-6 md:hidden z-50 border-b border-gray-700"
          aria-label="Mobil menü"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-white text-lg hover:text-[#ec9f05] transition-colors focus:outline-none focus:text-[#ec9f05]"
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
