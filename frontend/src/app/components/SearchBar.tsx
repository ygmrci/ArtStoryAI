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
    <div className="w-full max-w-2xl flex items-center card-gradient rounded-lg border border-white/20 px-5 py-4 search-glow">
      <MagnifyingGlassIcon className="w-6 h-6 text-white mr-3" aria-hidden="true" />
      <input
        type="text"
        className="flex-1 bg-transparent text-white placeholder-white/60 outline-none text-lg"
        placeholder={t('search.placeholder')}
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        aria-label={t('search.ariaLabel')}
      />
      <button
        onClick={handleSearch}
        className="ml-3 px-4 py-2 rounded-lg glow-button text-white font-semibold focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label={t('search.button')}
      >
        {t('search.button')}
      </button>
    </div>
  );
};

export default SearchBar;
