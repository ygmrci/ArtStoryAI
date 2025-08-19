interface NotFoundMessageProps {
  onBack: () => void;
}

export default function NotFoundMessage({ onBack }: NotFoundMessageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-20">
          <div className="text-gray-500 text-6xl mb-4">❓</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Sanat Eseri Bulunamadı</h1>
          <p className="text-gray-600 mb-6">Aradığınız eser bulunamadı veya yüklenemedi.</p>
          <button
            onClick={onBack}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Geri Dön
          </button>
        </div>
      </div>
    </div>
  );
}
