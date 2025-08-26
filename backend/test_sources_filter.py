#!/usr/bin/env python3
"""
Sources Filtresi Test Dosyası
Backend'de sources filtresinin doğru çalıştığını test eder
"""

import requests
import json
import time
from typing import Dict, List

class SourcesFilterTester:
    def __init__(self, base_url: str = "http://localhost:8001"):
        self.base_url = base_url
        self.test_results = []
        
    def test_endpoint_availability(self) -> bool:
        """API endpoint'lerinin erişilebilir olup olmadığını test eder"""
        print("🔍 API Endpoint Erişilebilirlik Testi...")
        
        endpoints = [
            "/api/filter/options",
            "/api/filter/artworks",
            "/api/filter/stats",
            "/api/filter/manual-artworks"
        ]
        
        all_available = True
        for endpoint in endpoints:
            try:
                response = requests.get(f"{self.base_url}{endpoint}", timeout=5)
                if response.status_code == 200:
                    print(f"✅ {endpoint} - Erişilebilir")
                else:
                    print(f"❌ {endpoint} - HTTP {response.status_code}")
                    all_available = False
            except requests.exceptions.RequestException as e:
                print(f"❌ {endpoint} - Bağlantı hatası: {e}")
                all_available = False
        
        return all_available
    
    def test_filter_options(self) -> Dict:
        """Filtre seçeneklerini test eder"""
        print("\n🔍 Filtre Seçenekleri Testi...")
        
        try:
            response = requests.get(f"{self.base_url}/api/filter/options", timeout=5)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Filtre seçenekleri alındı: {len(data.get('data', {}))} kategori")
                
                # Sources kategorisini kontrol et
                sources = data.get('data', {}).get('sources', [])
                print(f"📋 Mevcut sources: {sources}")
                
                return data.get('data', {})
            else:
                print(f"❌ Filtre seçenekleri alınamadı: HTTP {response.status_code}")
                return {}
        except Exception as e:
            print(f"❌ Filtre seçenekleri test hatası: {e}")
            return {}
    
    def test_sources_filter_manual_only(self) -> bool:
        """Sadece manual sources filtresini test eder"""
        print("\n🔍 Manual Sources Filtresi Testi...")
        
        try:
            params = {"sources": "manual"}
            response = requests.get(f"{self.base_url}/api/filter/artworks", params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                total = data.get('total', 0)
                sources = data.get('sources', {})
                artworks = data.get('artworks', [])
                
                print(f"✅ Manual filtresi sonucu:")
                print(f"   - Toplam eser: {total}")
                print(f"   - Sources dağılımı: {sources}")
                print(f"   - Eser sayısı: {len(artworks)}")
                
                # Sadece manual source'dan gelen eserler olmalı
                manual_count = sources.get('manual', 0)
                met_count = sources.get('met_museum', 0)
                
                if manual_count > 0 and met_count == 0:
                    print("✅ Manual filtresi doğru çalışıyor - sadece manual eserler")
                    return True
                else:
                    print(f"❌ Manual filtresi hatalı - manual: {manual_count}, met: {met_count}")
                    return False
            else:
                print(f"❌ Manual filtresi test hatası: HTTP {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Manual filtresi test hatası: {e}")
            return False
    
    def test_sources_filter_met_only(self) -> bool:
        """Sadece met_museum sources filtresini test eder"""
        print("\n🔍 MET Museum Sources Filtresi Testi...")
        
        try:
            params = {"sources": "met_museum"}
            response = requests.get(f"{self.base_url}/api/filter/artworks", params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                total = data.get('total', 0)
                sources = data.get('sources', {})
                artworks = data.get('artworks', [])
                
                print(f"✅ MET Museum filtresi sonucu:")
                print(f"   - Toplam eser: {total}")
                print(f"   - Sources dağılımı: {sources}")
                print(f"   - Eser sayısı: {len(artworks)}")
                
                # Sadece met_museum source'dan gelen eserler olmalı
                manual_count = sources.get('manual', 0)
                met_count = sources.get('met_museum', 0)
                
                if met_count > 0 and manual_count == 0:
                    print("✅ MET Museum filtresi doğru çalışıyor - sadece met eserler")
                    return True
                else:
                    print(f"❌ MET Museum filtresi hatalı - manual: {manual_count}, met: {met_count}")
                    return False
            else:
                print(f"❌ MET Museum filtresi test hatası: HTTP {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ MET Museum filtresi test hatası: {e}")
            return False
    
    def test_sources_filter_both(self) -> bool:
        """Her iki source'u da test eder"""
        print("\n🔍 Her İki Source Filtresi Testi...")
        
        try:
            params = {"sources": "manual,met_museum"}
            response = requests.get(f"{self.base_url}/api/filter/artworks", params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                total = data.get('total', 0)
                sources = data.get('sources', {})
                artworks = data.get('artworks', [])
                
                print(f"✅ Her iki source filtresi sonucu:")
                print(f"   - Toplam eser: {total}")
                print(f"   - Sources dağılımı: {sources}")
                print(f"   - Eser sayısı: {len(artworks)}")
                
                # Her iki source'dan da eserler gelmeli
                manual_count = sources.get('manual', 0)
                met_count = sources.get('met_museum', 0)
                
                if manual_count > 0 and met_count > 0:
                    print("✅ Her iki source filtresi doğru çalışıyor")
                    return True
                else:
                    print(f"❌ Her iki source filtresi hatalı - manual: {manual_count}, met: {met_count}")
                    return False
            else:
                print(f"❌ Her iki source filtresi test hatası: HTTP {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Her iki source filtresi test hatası: {e}")
            return False
    
    def test_sources_filter_none(self) -> bool:
        """Sources parametresi olmadan test eder (varsayılan davranış)"""
        print("\n🔍 Varsayılan Sources Filtresi Testi...")
        
        try:
            # Sources parametresi olmadan
            response = requests.get(f"{self.base_url}/api/filter/artworks", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                total = data.get('total', 0)
                sources = data.get('sources', {})
                artworks = data.get('artworks', [])
                
                print(f"✅ Varsayılan sources filtresi sonucu:")
                print(f"   - Toplam eser: {total}")
                print(f"   - Sources dağılımı: {sources}")
                print(f"   - Eser sayısı: {len(artworks)}")
                
                # Varsayılan olarak her iki source da dahil edilmeli
                manual_count = sources.get('manual', 0)
                met_count = sources.get('met_museum', 0)
                
                if manual_count > 0 and met_count >= 0:  # met_count 0 olabilir (API hatası durumunda)
                    print("✅ Varsayılan sources filtresi doğru çalışıyor")
                    return True
                else:
                    print(f"❌ Varsayılan sources filtresi hatalı - manual: {manual_count}, met: {met_count}")
                    return False
            else:
                print(f"❌ Varsayılan sources filtresi test hatası: HTTP {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Varsayılan sources filtresi test hatası: {e}")
            return False
    
    def test_combined_filters(self) -> bool:
        """Sources filtresi ile diğer filtrelerin birlikte çalışmasını test eder"""
        print("\n🔍 Kombine Filtreler Testi...")
        
        try:
            # Dönem + Sources filtresi
            params = {
                "periods": "Rönesans",
                "sources": "manual"
            }
            response = requests.get(f"{self.base_url}/api/filter/artworks", params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                total = data.get('total', 0)
                sources = data.get('sources', {})
                artworks = data.get('artworks', [])
                
                print(f"✅ Kombine filtreler sonucu (Rönesans + Manual):")
                print(f"   - Toplam eser: {total}")
                print(f"   - Sources dağılımı: {sources}")
                print(f"   - Eser sayısı: {len(artworks)}")
                
                # Sadece manual source'dan Rönesans dönemi eserler gelmeli
                manual_count = sources.get('manual', 0)
                met_count = sources.get('met_museum', 0)
                
                if manual_count > 0 and met_count == 0:
                    print("✅ Kombine filtreler doğru çalışıyor")
                    return True
                else:
                    print(f"❌ Kombine filtreler hatalı - manual: {manual_count}, met: {met_count}")
                    return False
            else:
                print(f"❌ Kombine filtreler test hatası: HTTP {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Kombine filtreler test hatası: {e}")
            return False
    
    def run_all_tests(self) -> Dict:
        """Tüm testleri çalıştırır"""
        print("🚀 Sources Filtresi Testleri Başlıyor...")
        print("=" * 50)
        
        # Test sonuçlarını sakla
        results = {
            "endpoint_availability": False,
            "filter_options": False,
            "manual_only": False,
            "met_only": False,
            "both_sources": False,
            "default_sources": False,
            "combined_filters": False
        }
        
        # 1. Endpoint erişilebilirlik testi
        results["endpoint_availability"] = self.test_endpoint_availability()
        
        if not results["endpoint_availability"]:
            print("\n❌ API endpoint'leri erişilebilir değil, diğer testler atlanıyor...")
            return results
        
        # 2. Filtre seçenekleri testi
        filter_options = self.test_filter_options()
        results["filter_options"] = len(filter_options) > 0
        
        # 3. Sources filtreleri testleri
        results["manual_only"] = self.test_sources_filter_manual_only()
        results["met_only"] = self.test_sources_filter_met_only()
        results["both_sources"] = self.test_sources_filter_both()
        results["default_sources"] = self.test_sources_filter_none()
        results["combined_filters"] = self.test_combined_filters()
        
        # Sonuçları özetle
        print("\n" + "=" * 50)
        print("📊 TEST SONUÇLARI ÖZETİ")
        print("=" * 50)
        
        for test_name, result in results.items():
            status = "✅ BAŞARILI" if result else "❌ BAŞARISIZ"
            print(f"{test_name.replace('_', ' ').title()}: {status}")
        
        success_count = sum(results.values())
        total_count = len(results)
        
        print(f"\n🎯 Genel Başarı Oranı: {success_count}/{total_count} ({success_count/total_count*100:.1f}%)")
        
        if success_count == total_count:
            print("🎉 Tüm testler başarılı! Sources filtresi doğru çalışıyor.")
        else:
            print("⚠️  Bazı testler başarısız. Sources filtresinde sorunlar var.")
        
        return results

def main():
    """Ana test fonksiyonu"""
    print("🎨 ArtStoryAI Sources Filtresi Test Aracı")
    print("=" * 50)
    
    # Backend'in çalışıp çalışmadığını kontrol et
    print("🔍 Backend bağlantısı kontrol ediliyor...")
    
    tester = SourcesFilterTester()
    
    try:
        # Tüm testleri çalıştır
        results = tester.run_all_tests()
        
        # Sonuçları JSON olarak kaydet
        with open("sources_filter_test_results.json", "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        
        print(f"\n📄 Test sonuçları 'sources_filter_test_results.json' dosyasına kaydedildi.")
        
    except KeyboardInterrupt:
        print("\n\n⏹️  Test kullanıcı tarafından durduruldu.")
    except Exception as e:
        print(f"\n\n💥 Beklenmeyen hata: {e}")

if __name__ == "__main__":
    main()
