#!/usr/bin/env python3
"""
Görsel yükleme endpoint'ini test etmek için script
"""

import requests
import os
from PIL import Image
import io

def test_image_upload():
    """Görsel yükleme endpoint'ini test eder"""
    
    # Test görseli oluştur
    test_image = create_test_image()
    
    # API endpoint
    url = "http://localhost:8000/artwork/upload"
    
    # Form data hazırla
    files = {
        'image': ('test_image.jpg', test_image, 'image/jpeg')
    }
    
    try:
        print("Görsel yükleniyor...")
        response = requests.post(url, files=files)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            print("\n✅ Başarılı!")
            print(f"Eser Adı: {data.get('artwork_name')}")
            print(f"Sanatçı: {data.get('artist')}")
            print(f"Yıl: {data.get('year')}")
            print(f"Akım: {data.get('movement')}")
            print(f"Güven: %{data.get('confidence', 0) * 100}")
        else:
            print("❌ Hata!")
            
    except requests.exceptions.ConnectionError:
        print("❌ Backend bağlantısı kurulamadı. Backend'in çalıştığından emin olun.")
    except Exception as e:
        print(f"❌ Beklenmeyen hata: {e}")

def create_test_image():
    """Test için basit bir görsel oluşturur"""
    # 100x100 boyutunda basit bir görsel
    img = Image.new('RGB', (100, 100), color='red')
    
    # BytesIO'ya kaydet
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='JPEG')
    img_bytes.seek(0)
    
    return img_bytes

if __name__ == "__main__":
    print("🎨 ArtStoryAI Görsel Yükleme Testi")
    print("=" * 40)
    
    # Backend'in çalışıp çalışmadığını kontrol et
    try:
        health_check = requests.get("http://localhost:8000/")
        if health_check.status_code == 200:
            print("✅ Backend çalışıyor")
            test_image_upload()
        else:
            print("❌ Backend yanıt vermiyor")
    except requests.exceptions.ConnectionError:
        print("❌ Backend bağlantısı kurulamadı")
        print("Backend'i başlatmak için: cd backend && python -m uvicorn app.main:app --reload")
