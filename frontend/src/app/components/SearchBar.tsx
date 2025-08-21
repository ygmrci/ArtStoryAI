'use client';
import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

type SearchBarProps = {
  onSearch: (query: string) => void;
};

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const { t } = useTranslation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    if (query.trim()) onSearch(query.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="search-bar w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl flex flex-col sm:flex-row items-center card-gradient rounded-lg sm:rounded-xl border border-white/20 px-3 sm:px-4 md:px-5 py-3 sm:py-4 search-glow gap-3 sm:gap-0">
      <div className="relative flex-1 w-full sm:w-auto">
        <MagnifyingGlassIcon
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:w-6 h-5 sm:h-6 text-white/80"
          aria-hidden="true"
        />
        <input
          type="text"
          className="w-full sm:flex-1 bg-transparent text-white placeholder-white/60 outline-none text-sm sm:text-base md:text-lg pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3"
          placeholder={t('search.placeholder')}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          aria-label={t('search.ariaLabel')}
        />
      </div>
      <button
        onClick={handleSearch}
        className="group relative w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm sm:text-base"
        style={{
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          color: '#ffffff',
          boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
          e.currentTarget.style.boxShadow = '0 6px 25px rgba(59, 130, 246, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(59, 130, 246, 0.4)';
        }}
        aria-label={t('search.button')}
      >
        {/* Button Glow Effect */}
        <div
          className="absolute inset-0 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg scale-110"
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            zIndex: -1,
          }}
        ></div>

        <span className="relative z-10 font-medium">{t('search.button')}</span>
      </button>
    </div>
  );
};

export default SearchBar;
