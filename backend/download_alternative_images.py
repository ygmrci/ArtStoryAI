"""
Download Alternative Artwork Images Script
Downloads images from alternative sources
"""

import requests
import os
from pathlib import Path

def download_image(url, filename):
    """Download image from URL with proper headers"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        }
        
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        
        filepath = Path("manual_images") / filename
        with open(filepath, "wb") as f:
            f.write(response.content)
        
        print(f"✅ {filename} indirildi ({len(response.content)} bytes)")
        return True
    except Exception as e:
        print(f"❌ {filename} indirilemedi: {e}")
        return False

def main():
    """Download all artwork images from alternative sources"""
    # Manuel resimler klasörünü oluştur
    Path("manual_images").mkdir(exist_ok=True)
    
    # Alternatif resim URL'leri
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
    
    # Alternatif URL'ler (çalışan kaynaklar)
    alternative_urls = {
        "venus_dogusu.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project.jpg/800px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project.jpg",
        "niluferler.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Claude_Monet_-_Water_Lilies_-_Google_Art_Project.jpg/800px-Claude_Monet_-_Water_Lilies_-_Google_Art_Project.jpg",
        "campbell_corba.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Andy_Warhol%2C_Campbell_Soup_Cans%2C_1962.jpg/800px-Andy_Warhol%2C_Campbell_Soup_Cans%2C_1962.jpg",
        "amerikan_gotigi.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Grant_Wood_-_American_Gothic_-_Google_Art_Project.jpg/800px-Grant_Wood_-_American_Gothic_-_Google_Art_Project.jpg",
        "davut.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Michelangelo%27s_David.jpg/800px-Michelangelo%27s_David.jpg",
        "kaplumbaga_terbiyecisi.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Osman_Hamdi_Bey_-_Kaplumba%C4%9Fa_Terbiyecisi.jpg/800px-Osman_Hamdi_Bey_-_Kaplumba%C4%9Fa_Terbiyecisi.jpg",
        "koylu_kadin.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Bedri_Rahmi_Ey%C3%BCbo%C4%9Flu_-_K%C3%B6yl%C3%BC_Kad%C4%B1n.jpg/800px-Bedri_Rahmi_Ey%C3%BCbo%C4%9Flu_-_K%C3%B6yl%C3%BC_Kad%C4%B1n.jpg"
    }
    
    print("🎨 Alternatif kaynaklardan sanat eseri resimleri indiriliyor...")
    
    success_count = 0
    for filename, url in alternative_urls.items():
        print(f"\n🔄 {filename} indiriliyor...")
        if download_image(url, filename):
            success_count += 1
    
    print(f"\n📊 İndirme tamamlandı: {success_count}/{len(alternative_urls)} resim başarıyla indirildi")
    
    if success_count > 0:
        print("\n🔄 Manuel resim yöneticisi güncelleniyor...")
        try:
            from app.manual_image_manager import manual_image_manager
            manual_image_manager._load_existing_images()
            print(f"✅ Manuel resim yöneticisi güncellendi. Toplam resim: {len(manual_image_manager.manual_images)}")
        except Exception as e:
            print(f"❌ Manuel resim yöneticisi güncellenemedi: {e}")
    else:
        print("\n❌ Hiç resim indirilemedi. Placeholder resimler oluşturuluyor...")
        create_placeholder_images()

def create_placeholder_images():
    """Create placeholder images if download fails"""
    print("🎨 Placeholder resimler oluşturuluyor...")
    
    try:
        from PIL import Image, ImageDraw, ImageFont
        from pathlib import Path
        
        artworks = [
            ("venus_dogusu.jpg", "Venüs'ün Doğuşu", "Sandro Botticelli", "1485-1486"),
            ("adem_yaratilisi.jpg", "Adem'in Yaratılışı", "Michelangelo", "1508-1512"),
            ("niluferler.jpg", "Nilüferler", "Claude Monet", "1916"),
            ("campbell_corba.jpg", "Campbell'ın Çorba Kutuları", "Andy Warhol", "1962"),
            ("amerikan_gotigi.jpg", "Amerikan Gotiği", "Grant Wood", "1930"),
            ("davut.jpg", "Davut", "Michelangelo", "1501-1504"),
            ("kaplumbaga_terbiyecisi.jpg", "Kaplumbağa Terbiyecisi", "Osman Hamdi Bey", "1906"),
            ("koylu_kadin.jpg", "Köylü Kadın", "Bedri Rahmi Eyüboğlu", "1933")
        ]
        
        for filename, title, artist, year in artworks:
            # Basit placeholder resim oluştur
            img = Image.new('RGB', (800, 600), color='#34495e')
            draw = ImageDraw.Draw(img)
            
            # Basit metin ekle
            try:
                font = ImageFont.load_default()
            except:
                font = ImageFont.load_default()
            
            # Başlık
            draw.text((400, 250), title, fill='white', anchor='mm', font=font)
            draw.text((400, 300), artist, fill='#bdc3c7', anchor='mm', font=font)
            draw.text((400, 350), year, fill='#bdc3c7', anchor='mm', font=font)
            
            # Kaydet
            filepath = Path("manual_images") / filename
            img.save(filepath, "JPEG")
            print(f"✅ {filename} placeholder oluşturuldu")
        
        print("✅ Tüm placeholder resimler oluşturuldu")
        
    except Exception as e:
        print(f"❌ Placeholder resimler oluşturulamadı: {e}")

if __name__ == "__main__":
    main()
