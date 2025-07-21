'use client';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };
  return (
    <select
      aria-label="Dil seçimi"
      className="border rounded px-2 py-1 text-sm"
      value={i18n.language}
      onChange={handleChange}
    >
      <option value="tr">Türkçe</option>
      <option value="en">English</option>
    </select>
  );
};

export default LanguageSwitcher;
