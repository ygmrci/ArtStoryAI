'use client';
import { useState, useEffect } from 'react';
import { DEFAULT_FILTER_OPTIONS, DEFAULT_SOURCES } from '../../lib/config';

interface FilterState {
  periods: string[];
  styles: string[];
  colors: string[];
  sizes: string[];
  museums: string[];
  sources: string[];
}

interface SmartFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterState) => void;
  filterOptions?: any; // Opsiyonel filterOptions prop'u
}

const SmartFilterModal = ({
  isOpen,
  onClose,
  onApplyFilters,
  filterOptions: propFilterOptions,
}: SmartFilterModalProps) => {
  // const [isVisible, setIsVisible] = useState(false); // Bu satırı kaldırıyoruz
  const [filters, setFilters] = useState<FilterState>({
    periods: [],
    styles: [],
    colors: [],
    sizes: [],
    museums: [],
    sources: [...DEFAULT_SOURCES],
  });

  // Debug için console.log
  console.log('SmartFilterModal render - isOpen:', isOpen, 'propFilterOptions:', propFilterOptions);

  // Props'tan gelen filterOptions varsa onu kullan, yoksa varsayılanları kullan
  const filterOptions =
    propFilterOptions && Object.keys(propFilterOptions).length > 0
      ? propFilterOptions
      : DEFAULT_FILTER_OPTIONS;

  useEffect(() => {
    if (isOpen) {
      console.log('Modal açılıyor...');
    } else {
      console.log('Modal kapanıyor...');
    }
  }, [isOpen]);

  const handleFilterToggle = (category: keyof FilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value],
    }));
  };

  const handleApplyFilters = () => {
    console.log('Filtreler uygulanıyor:', filters);
    onApplyFilters(filters);
    onClose(); // Modal'ı otomatik olarak kapat
  };

  const handleClearAll = () => {
    setFilters({
      periods: [],
      styles: [],
      colors: [],
      sizes: [],
      museums: [],
      sources: [...DEFAULT_SOURCES],
    });
  };

  const getSelectedCount = (category: keyof FilterState) => {
    return filters[category].length;
  };

  if (!isOpen) {
    return null;
  }

  // filterOptions kontrolü
  if (!filterOptions || !filterOptions.periods || !filterOptions.styles) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 8000, // Header'ın altında ama diğer içeriklerin üstünde
        display: isOpen ? 'block' : 'none',
      }}
    >
      {/* Arka plan overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 8000, // Header'ın altında ama diğer içeriklerin üstünde
        }}
        onClick={onClose}
      />

      {/* Modal içeriği */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '400px',
          height: '600px', // Sabit yükseklik
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          zIndex: 8001, // Modal içeriği overlay'in üstünde
          display: 'flex',
          flexDirection: 'column', // Flexbox layout
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '16px',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <h2
              style={{
                fontSize: '18px',
                fontWeight: '600',
                margin: 0,
              }}
            >
              Akıllı Filtreleme
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <svg
                style={{ width: '20px', height: '20px' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Filtre içeriği */}
        <div
          style={{
            padding: '16px',
            flex: 1, // Kalan alanı kapla
            overflowY: 'auto', // Dikey scroll
            minHeight: 0, // Flexbox için gerekli
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Dönem Filtreleri */}
            <div>
              <h3
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                Dönem
                {getSelectedCount('periods') > 0 && (
                  <span
                    style={{
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      fontSize: '12px',
                      padding: '4px 8px',
                      borderRadius: '9999px',
                    }}
                  >
                    {getSelectedCount('periods')}
                  </span>
                )}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filterOptions?.periods?.map((period: any) => (
                  <label
                    key={period}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={filters.periods.includes(period)}
                      onChange={() => handleFilterToggle('periods', period)}
                      style={{
                        width: '16px',
                        height: '16px',
                        color: '#2563eb',
                        borderRadius: '4px',
                        border: '1px solid #d1d5db',
                      }}
                    />
                    <span
                      style={{
                        fontSize: '14px',
                        color: '#374151',
                      }}
                    >
                      {period}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Stil Filtreleri */}
            <div>
              <h3
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                Stil
                {getSelectedCount('styles') > 0 && (
                  <span
                    style={{
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      fontSize: '12px',
                      padding: '4px 8px',
                      borderRadius: '9999px',
                    }}
                  >
                    {getSelectedCount('styles')}
                  </span>
                )}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filterOptions?.styles?.map((style: any) => (
                  <label
                    key={style}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={filters.styles.includes(style)}
                      onChange={() => handleFilterToggle('styles', style)}
                      style={{
                        width: '16px',
                        height: '16px',
                        color: '#2563eb',
                        borderRadius: '4px',
                        border: '1px solid #d1d5db',
                      }}
                    />
                    <span
                      style={{
                        fontSize: '14px',
                        color: '#374151',
                      }}
                    >
                      {style}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Renk Filtreleri */}
            <div>
              <h3
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                Renk
                {getSelectedCount('colors') > 0 && (
                  <span
                    style={{
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      fontSize: '12px',
                      padding: '4px 8px',
                      borderRadius: '9999px',
                    }}
                  >
                    {getSelectedCount('colors')}
                  </span>
                )}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filterOptions?.colors?.map((color: any) => (
                  <label
                    key={color}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={filters.colors.includes(color)}
                      onChange={() => handleFilterToggle('colors', color)}
                      style={{
                        width: '16px',
                        height: '16px',
                        color: '#2563eb',
                        borderRadius: '4px',
                        border: '1px solid #d1d5db',
                      }}
                    />
                    <span
                      style={{
                        fontSize: '14px',
                        color: '#374151',
                      }}
                    >
                      {color}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Boyut Filtreleri */}
            <div>
              <h3
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                Boyut
                {getSelectedCount('sizes') > 0 && (
                  <span
                    style={{
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      fontSize: '12px',
                      padding: '4px 8px',
                      borderRadius: '9999px',
                    }}
                  >
                    {getSelectedCount('sizes')}
                  </span>
                )}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filterOptions?.sizes?.map((size: any) => (
                  <label
                    key={size}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={filters.sizes.includes(size)}
                      onChange={() => handleFilterToggle('sizes', size)}
                      style={{
                        width: '16px',
                        height: '16px',
                        color: '#2563eb',
                        borderRadius: '4px',
                        border: '1px solid #d1d5db',
                      }}
                    />
                    <span
                      style={{
                        fontSize: '14px',
                        color: '#374151',
                      }}
                    >
                      {size}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Müze Filtreleri */}
            <div>
              <h3
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                Müze
                {getSelectedCount('museums') > 0 && (
                  <span
                    style={{
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      fontSize: '12px',
                      padding: '4px 8px',
                      borderRadius: '9999px',
                    }}
                  >
                    {getSelectedCount('museums')}
                  </span>
                )}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filterOptions?.museums?.map((museum: any) => (
                  <label
                    key={museum}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={filters.museums.includes(museum)}
                      onChange={() => handleFilterToggle('museums', museum)}
                      style={{
                        width: '16px',
                        height: '16px',
                        color: '#2563eb',
                        borderRadius: '4px',
                        border: '1px solid #d1d5db',
                      }}
                    />
                    <span
                      style={{
                        fontSize: '14px',
                        color: '#374151',
                      }}
                    >
                      {museum}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Görsel Kaynağı Filtreleri */}
            <div>
              <h3
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                Görsel Kaynağı
                {getSelectedCount('sources') > 0 && (
                  <span
                    style={{
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      fontSize: '12px',
                      padding: '4px 8px',
                      borderRadius: '9999px',
                    }}
                  >
                    {getSelectedCount('sources')}
                  </span>
                )}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filterOptions?.sources?.map((source: any) => (
                  <label
                    key={source}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={filters.sources.includes(source)}
                      onChange={() => handleFilterToggle('sources', source)}
                      style={{
                        width: '16px',
                        height: '16px',
                        color: '#2563eb',
                        borderRadius: '4px',
                        border: '1px solid #d1d5db',
                      }}
                    />
                    <span
                      style={{
                        fontSize: '14px',
                        color: '#374151',
                      }}
                    >
                      {source}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: '1px solid #e5e7eb',
            padding: '16px',
            backgroundColor: '#f9fafb',
            borderBottomLeftRadius: '8px',
            borderBottomRightRadius: '8px',
            flexShrink: 0, // Footer'ın küçülmemesini sağla
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <button
              onClick={handleClearAll}
              style={{
                padding: '8px 16px',
                color: '#6b7280',
                fontWeight: '500',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Tümünü Temizle
            </button>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleApplyFilters}
                style={{
                  padding: '8px 24px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  borderRadius: '6px',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Filtreleri Uygula
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartFilterModal;
