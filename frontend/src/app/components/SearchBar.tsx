'use client';
import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

type SearchBarProps = {
  onSearch: (query: string) => void;
};

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('');

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
    <div className="w-full max-w-2xl flex items-center bg-[#1e1e1e] rounded-lg border border-gray-700 px-5 py-4 shadow focus-within:ring-2 ring-[#ec9f05]">
      <MagnifyingGlassIcon className="w-6 h-6 text-white mr-3" aria-hidden="true" />
      <input
        type="text"
        className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-lg"
        placeholder="Sanatçı veya eser adı yazın..."
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        aria-label="Sanatçı veya eser adı arayın"
      />
      <button
        onClick={handleSearch}
        className="ml-3 px-4 py-2 rounded-lg bg-gradient-to-r from-[#ff4e00] to-[#ec9f05] text-black font-semibold focus:outline-none focus:ring-2 focus:ring-[#ec9f05]"
        aria-label="Ara"
      >
        Ara
      </button>
    </div>
  );
};

export default SearchBar;
