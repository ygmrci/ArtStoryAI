import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-white/80 border-t border-gray-200 py-8 mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-6">
        <div className="text-gray-500 text-sm">© 2025 ArtStoryAI</div>
        <div className="flex gap-6 text-gray-500 text-sm">
          <a href="#" className="hover:text-indigo-600 transition-colors">
            Gizlilik Politikası
          </a>
          <a href="#" className="hover:text-indigo-600 transition-colors">
            Kullanım Şartları
          </a>
        </div>
        <div className="flex gap-4">{/* Sosyal medya ikonları eklenebilir */}</div>
      </div>
    </footer>
  );
}
