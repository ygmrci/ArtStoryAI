"""
Download Artwork Images Script
Downloads images for manual artworks
"""

import requests
import os
from pathlib import Path

def download_image(url, filename):
    """Download image from URL"""
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        filepath = Path("manual_images") / filename
        with open(filepath, "wb") as f:
            f.write(response.content)
        
        print(f"✅ {filename} indirildi")
        return True
    except Exception as e:
        print(f"❌ {filename} indirilemedi: {e}")
        return False

def main():
    """Download all artwork images"""
    # Manuel resimler klasörünü oluştur
    Path("manual_images").mkdir(exist_ok=True)
    
    # Resim listesi
    images = {
        "venus_dogusu.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project.jpg/1280px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project.jpg",
        "adem_yaratilisi.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg/1280px-Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg",
        "niluferler.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Claude_Monet_-_Water_Lilies_-_Google_Art_Project.jpg/1280px-Claude_Monet_-_Water_Lilies_-_Google_Art_Project.jpg",
        "campbell_corba.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Andy_Warhol%2C_Campbell_Soup_Cans%2C_1962.jpg/1280px-Andy_Warhol%2C_Campbell_Soup_Cans%2C_1962.jpg",
        "amerikan_gotigi.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Grant_Wood_-_American_Gothic_-_Google_Art_Project.jpg/1280px-Grant_Wood_-_American_Gothic_-_Google_Art_Project.jpg",
        "davut.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Michelangelo%27s_David.jpg/1280px-Michelangelo%27s_David.jpg",
        "kaplumbaga_terbiyecisi.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Osman_Hamdi_Bey_-_Kaplumba%C4%9Fa_Terbiyecisi.jpg/1280px-Osman_Hamdi_Bey_-_Kaplumba%C4%9Fa_Terbiyecisi.jpg",
        "koylu_kadin.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Bedri_Rahmi_Ey%C3%BCbo%C4%9Flu_-_K%C3%B6yl%C3%BC_Kad%C4%B1n.jpg/1280px-Bedri_Rahmi_Ey%C3%BCbo%C4%9Flu_-_K%C3%B6yl%C3%BC_Kad%C4%B1n.jpg"
    }
    
    print("🎨 Sanat eseri resimleri indiriliyor...")
    
    success_count = 0
    for filename, url in images.items():
        if download_image(url, filename):
            success_count += 1
    
    print(f"\n📊 İndirme tamamlandı: {success_count}/{len(images)} resim başarıyla indirildi")
    
    # Manuel resim yöneticisini güncelle
    print("\n🔄 Manuel resim yöneticisi güncelleniyor...")
    try:
        from app.manual_image_manager import manual_image_manager
        manual_image_manager._load_existing_images()
        print(f"✅ Manuel resim yöneticisi güncellendi. Toplam resim: {len(manual_image_manager.manual_images)}")
    except Exception as e:
        print(f"❌ Manuel resim yöneticisi güncellenemedi: {e}")

if __name__ == "__main__":
    main()
