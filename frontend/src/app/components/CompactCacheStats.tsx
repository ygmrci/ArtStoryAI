'use client';

import { useState } from 'react';
import useCacheStats from '../hooks/useCacheStats';

const CompactCacheStats = () => {
  const { stats, loading, error, refreshStats } = useCacheStats();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleRefresh = () => {
    refreshStats();
  };

  if (error) {
    return (
      <div className="bg-red-50/90 backdrop-blur-md border border-red-200 rounded-lg shadow-lg p-2">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
          <span className="text-xs text-red-700">Cache Hatası</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white/95 backdrop-blur-md border-2 border-blue-500/50 rounded-lg shadow-xl"
      style={{
        position: 'relative',
        right: '0',
        left: 'auto',
      }}
    >
      <div className="px-3 py-2 border-b border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-blue-900">Cache</span>
            {stats && (
              <span className="text-xs text-blue-600 font-semibold">{stats.total_keys} key</span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Yenile"
            >
              {loading ? (
                <svg className="animate-spin h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              )}
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              title={isExpanded ? 'Gizle' : 'Detaylar'}
            >
              {isExpanded ? '−' : '+'}
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-3 py-2 bg-white/95">
          {loading ? (
            <div className="flex items-center justify-center py-2">
              <svg className="animate-spin h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="ml-2 text-xs text-gray-600">Yükleniyor...</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{stats?.hits || 0}</div>
                  <div className="text-xs text-gray-500">Hit</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-red-600">{stats?.misses || 0}</div>
                  <div className="text-xs text-gray-500">Miss</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded p-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Hit Rate</span>
                  <span className="font-medium text-gray-900">
                    {stats ? `${(stats.hit_rate * 100).toFixed(1)}%` : '0%'}
                  </span>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${(stats?.hit_rate || 0) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompactCacheStats;
