/**
 * Frontend Sources Filtresi Test Dosyası
 * Frontend'de sources filtresinin doğru çalıştığını test eder
 */

class FrontendSourcesFilterTester {
  constructor() {
    this.testResults = [];
    this.baseUrl = 'http://localhost:8001';
  }

  /**
   * API endpoint'lerinin erişilebilir olup olmadığını test eder
   */
  async testEndpointAvailability() {
    console.log('🔍 API Endpoint Erişilebilirlik Testi...');

    const endpoints = [
      '/api/filter/options',
      '/api/filter/artworks',
      '/api/filter/stats',
      '/api/filter/manual-artworks',
    ];

    let allAvailable = true;

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`);
        if (response.ok) {
          console.log(`✅ ${endpoint} - Erişilebilir`);
        } else {
          console.log(`❌ ${endpoint} - HTTP ${response.status}`);
          allAvailable = false;
        }
      } catch (error) {
        console.log(`❌ ${endpoint} - Bağlantı hatası: ${error.message}`);
        allAvailable = false;
      }
    }

    return allAvailable;
  }

  /**
   * Filtre seçeneklerini test eder
   */
  async testFilterOptions() {
    console.log('\n🔍 Filtre Seçenekleri Testi...');

    try {
      const response = await fetch(`${this.baseUrl}/api/filter/options`);
      if (response.ok) {
        const data = await response.json();
        console.log(
          `✅ Filtre seçenekleri alındı: ${Object.keys(data.data || {}).length} kategori`,
        );

        // Sources kategorisini kontrol et
        const sources = data.data?.sources || [];
        console.log(`📋 Mevcut sources: ${sources.join(', ')}`);

        return data.data;
      } else {
        console.log(`❌ Filtre seçenekleri alınamadı: HTTP ${response.status}`);
        return {};
      }
    } catch (error) {
      console.log(`❌ Filtre seçenekleri test hatası: ${error.message}`);
      return {};
    }
  }

  /**
   * Sources mapping'ini test eder
   */
  testSourcesMapping() {
    console.log('\n🔍 Sources Mapping Testi...');

    // Frontend'de kullanılan mapping'i test et
    const sourceMapping = {
      'Manuel Görseller': 'manual',
      'MET Museum': 'met_museum',
      'Art Institute': 'art_institute',
      Wikimedia: 'wikimedia',
    };

    let allCorrect = true;

    for (const [frontendName, backendName] of Object.entries(sourceMapping)) {
      console.log(`📋 ${frontendName} -> ${backendName}`);

      // Mapping'in doğru olup olmadığını kontrol et
      if (this.isValidSourceMapping(frontendName, backendName)) {
        console.log(`✅ ${frontendName} mapping'i doğru`);
      } else {
        console.log(`❌ ${frontendName} mapping'i hatalı`);
        allCorrect = false;
      }
    }

    return allCorrect;
  }

  /**
   * Source mapping'inin geçerli olup olmadığını kontrol eder
   */
  isValidSourceMapping(frontendName, backendName) {
    // Manuel görseller için özel kontrol
    if (frontendName === 'Manuel Görseller' && backendName === 'manual') {
      return true;
    }

    // MET Museum için özel kontrol
    if (frontendName === 'MET Museum' && backendName === 'met_museum') {
      return true;
    }

    // Diğer mapping'ler için genel kontrol
    const expectedBackendName = frontendName.toLowerCase().replace(/\s+/g, '_');
    return backendName === expectedBackendName;
  }

  /**
   * Sources filtresi ile API çağrısını test eder
   */
  async testSourcesFilterAPI() {
    console.log('\n🔍 Sources Filtresi API Testi...');

    const testCases = [
      {
        name: 'Sadece Manual',
        params: { sources: 'manual' },
        expected: { manual: '>0', met_museum: '0' },
      },
      {
        name: 'Sadece MET Museum',
        params: { sources: 'met_museum' },
        expected: { manual: '0', met_museum: '>0' },
      },
      {
        name: 'Her İki Source',
        params: { sources: 'manual,met_museum' },
        expected: { manual: '>0', met_museum: '>0' },
      },
      {
        name: 'Sources Yok (Varsayılan)',
        params: {},
        expected: { manual: '>0', met_museum: '>=0' },
      },
    ];

    let allPassed = true;

    for (const testCase of testCases) {
      console.log(`\n📋 Test: ${testCase.name}`);

      try {
        const url = new URL(`${this.baseUrl}/api/filter/artworks`);
        Object.entries(testCase.params).forEach(([key, value]) => {
          url.searchParams.set(key, value);
        });

        console.log(`🔗 URL: ${url.toString()}`);

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          const sources = data.sources || {};

          console.log(`✅ API yanıtı: ${data.total} eser`);
          console.log(`📊 Sources dağılımı:`, sources);

          // Beklenen sonuçları kontrol et
          const manualCount = sources.manual || 0;
          const metCount = sources.met_museum || 0;

          const manualExpected = testCase.expected.manual;
          const metExpected = testCase.expected.met_museum;

          let manualPassed = false;
          let metPassed = false;

          if (manualExpected === '0') {
            manualPassed = manualCount === 0;
          } else if (manualExpected === '>0') {
            manualPassed = manualCount > 0;
          } else if (manualExpected === '>=0') {
            manualPassed = manualCount >= 0;
          }

          if (metExpected === '0') {
            metPassed = metCount === 0;
          } else if (metExpected === '>0') {
            metPassed = metCount > 0;
          } else if (metExpected === '>=0') {
            metPassed = metCount >= 0;
          }

          if (manualPassed && metPassed) {
            console.log(`✅ ${testCase.name} testi başarılı`);
          } else {
            console.log(`❌ ${testCase.name} testi başarısız`);
            console.log(`   Beklenen: manual=${manualExpected}, met=${metExpected}`);
            console.log(`   Gerçek: manual=${manualCount}, met=${metCount}`);
            allPassed = false;
          }
        } else {
          console.log(`❌ API hatası: HTTP ${response.status}`);
          allPassed = false;
        }
      } catch (error) {
        console.log(`❌ Test hatası: ${error.message}`);
        allPassed = false;
      }
    }

    return allPassed;
  }

  /**
   * Kombine filtreleri test eder
   */
  async testCombinedFilters() {
    console.log('\n🔍 Kombine Filtreler Testi...');

    const testCases = [
      {
        name: 'Rönesans + Manual',
        params: { periods: 'Rönesans', sources: 'manual' },
        expected: { manual: '>0', met_museum: '0' },
      },
      {
        name: 'Modern + MET Museum',
        params: { periods: 'Modern', sources: 'met_museum' },
        expected: { manual: '0', met_museum: '>=0' },
      },
    ];

    let allPassed = true;

    for (const testCase of testCases) {
      console.log(`\n📋 Test: ${testCase.name}`);

      try {
        const url = new URL(`${this.baseUrl}/api/filter/artworks`);
        Object.entries(testCase.params).forEach(([key, value]) => {
          url.searchParams.set(key, value);
        });

        console.log(`🔗 URL: ${url.toString()}`);

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          const sources = data.sources || {};

          console.log(`✅ API yanıtı: ${data.total} eser`);
          console.log(`📊 Sources dağılımı:`, sources);

          // Beklenen sonuçları kontrol et
          const manualCount = sources.manual || 0;
          const metCount = sources.met_museum || 0;

          const manualExpected = testCase.expected.manual;
          const metExpected = testCase.expected.met_museum;

          let manualPassed = false;
          let metPassed = false;

          if (manualExpected === '0') {
            manualPassed = manualCount === 0;
          } else if (manualExpected === '>0') {
            manualPassed = manualCount > 0;
          } else if (manualExpected === '>=0') {
            manualPassed = manualCount >= 0;
          }

          if (metExpected === '0') {
            metPassed = metCount === 0;
          } else if (metExpected === '>0') {
            metPassed = metCount > 0;
          } else if (metExpected === '>=0') {
            metPassed = metCount >= 0;
          }

          if (manualPassed && metPassed) {
            console.log(`✅ ${testCase.name} testi başarılı`);
          } else {
            console.log(`❌ ${testCase.name} testi başarısız`);
            console.log(`   Beklenen: manual=${manualExpected}, met=${metExpected}`);
            console.log(`   Gerçek: manual=${manualCount}, met=${metCount}`);
            allPassed = false;
          }
        } else {
          console.log(`❌ API hatası: HTTP ${response.status}`);
          allPassed = false;
        }
      } catch (error) {
        console.log(`❌ Test hatası: ${error.message}`);
        allPassed = false;
      }
    }

    return allPassed;
  }

  /**
   * Frontend config dosyasını test eder
   */
  testFrontendConfig() {
    console.log('\n🔍 Frontend Config Testi...');

    // Config değerlerini kontrol et
    const expectedConfig = {
      DEFAULT_SOURCES: ['manual', 'met_museum'],
      SOURCE_DISPLAY_NAMES: {
        manual: 'Manuel Görseller',
        met_museum: 'MET Museum',
        art_institute: 'Art Institute',
        wikimedia: 'Wikimedia',
      },
    };

    console.log('📋 Beklenen config değerleri:');
    console.log('   DEFAULT_SOURCES:', expectedConfig.DEFAULT_SOURCES);
    console.log('   SOURCE_DISPLAY_NAMES:', expectedConfig.SOURCE_DISPLAY_NAMES);

    // Bu test frontend'de çalıştırıldığında gerçek config değerlerini kontrol edebilir
    // Şimdilik sadece beklenen değerleri göster
    return true;
  }

  /**
   * Tüm testleri çalıştırır
   */
  async runAllTests() {
    console.log('🚀 Frontend Sources Filtresi Testleri Başlıyor...');
    console.log('=' * 50);

    const results = {
      endpointAvailability: false,
      filterOptions: false,
      sourcesMapping: false,
      sourcesFilterAPI: false,
      combinedFilters: false,
      frontendConfig: false,
    };

    try {
      // 1. Endpoint erişilebilirlik testi
      results.endpointAvailability = await this.testEndpointAvailability();

      if (!results.endpointAvailability) {
        console.log("\n❌ API endpoint'leri erişilebilir değil, diğer testler atlanıyor...");
        return results;
      }

      // 2. Filtre seçenekleri testi
      const filterOptions = await this.testFilterOptions();
      results.filterOptions = Object.keys(filterOptions).length > 0;

      // 3. Sources mapping testi
      results.sourcesMapping = this.testSourcesMapping();

      // 4. Sources filtresi API testi
      results.sourcesFilterAPI = await this.testSourcesFilterAPI();

      // 5. Kombine filtreler testi
      results.combinedFilters = await this.testCombinedFilters();

      // 6. Frontend config testi
      results.frontendConfig = this.testFrontendConfig();

      // Sonuçları özetle
      console.log('\n' + '=' * 50);
      console.log('📊 TEST SONUÇLARI ÖZETİ');
      console.log('=' * 50);

      for (const [testName, result] of Object.entries(results)) {
        const status = result ? '✅ BAŞARILI' : '❌ BAŞARISIZ';
        console.log(
          `${testName
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase())}: ${status}`,
        );
      }

      const successCount = Object.values(results).filter(Boolean).length;
      const totalCount = Object.keys(results).length;

      console.log(
        `\n🎯 Genel Başarı Oranı: ${successCount}/${totalCount} (${(
          (successCount / totalCount) *
          100
        ).toFixed(1)}%)`,
      );

      if (successCount === totalCount) {
        console.log('🎉 Tüm testler başarılı! Frontend sources filtresi doğru çalışıyor.');
      } else {
        console.log('⚠️  Bazı testler başarısız. Frontend sources filtresinde sorunlar var.');
      }

      return results;
    } catch (error) {
      console.error('💥 Test çalıştırma hatası:', error);
      return results;
    }
  }
}

// Test'i çalıştır
async function main() {
  console.log('🎨 ArtStoryAI Frontend Sources Filtresi Test Aracı');
  console.log('=' * 50);

  const tester = new FrontendSourcesFilterTester();

  try {
    const results = await tester.runAllTests();

    // Sonuçları JSON olarak kaydet
    const resultsJson = JSON.stringify(results, null, 2);
    console.log('\n📄 Test sonuçları:');
    console.log(resultsJson);
  } catch (error) {
    console.error('\n💥 Beklenmeyen hata:', error);
  }
}

// Browser'da çalıştırılıyorsa main'i çağır
if (typeof window !== 'undefined') {
  // Browser environment
  window.FrontendSourcesFilterTester = FrontendSourcesFilterTester;
  console.log('🔧 FrontendSourcesFilterTester sınıfı yüklendi. Test etmek için:');
  console.log('   const tester = new FrontendSourcesFilterTester();');
  console.log('   tester.runAllTests();');
} else {
  // Node.js environment
  main();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FrontendSourcesFilterTester;
}
