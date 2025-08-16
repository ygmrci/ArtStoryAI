"""
Create Test Images Script
Creates simple test images for artworks
"""

from PIL import Image, ImageDraw, ImageFont
import os
from pathlib import Path

def create_test_image(filename, title, artist, year):
    """Create a simple test image with artwork info"""
    try:
        # 800x600 boyutunda resim oluştur
        width, height = 800, 600
        image = Image.new('RGB', (width, height), color='#2c3e50')
        draw = ImageDraw.Draw(image)
        
        # Başlık
        try:
            # Basit font kullan
            font_large = ImageFont.load_default()
            font_small = ImageFont.load_default()
        except:
            font_large = ImageFont.load_default()
            font_small = ImageFont.load_default()
        
        # Başlık
        title_bbox = draw.textbbox((0, 0), title, font=font_large)
        title_width = title_bbox[2] - title_bbox[0]
        title_x = (width - title_width) // 2
        draw.text((title_x, 200), title, fill='white', font=font_large)
        
        # Sanatçı
        artist_bbox = draw.textbbox((0, 0), artist, font=font_small)
        artist_width = artist_bbox[2] - artist_bbox[0]
        artist_x = (width - artist_width) // 2
        draw.text((artist_x, 250), artist, fill='#ecf0f1', font=font_small)
        
        # Yıl
        year_bbox = draw.textbbox((0, 0), year, font=font_small)
        year_width = year_bbox[2] - year_bbox[0]
        year_x = (width - year_width) // 2
        draw.text((year_x, 280), year, fill='#ecf0f1', font=font_small)
        
        # Dekoratif çerçeve
        draw.rectangle([50, 50, width-50, height-50], outline='#e74c3c', width=3)
        
        # Köşe süsleri
        corner_size = 20
        for x, y in [(50, 50), (width-70, 50), (50, height-70), (width-70, height-70)]:
            draw.rectangle([x, y, x+corner_size, y+corner_size], fill='#e74c3c')
        
        # Manuel resimler klasörünü oluştur
        Path("manual_images").mkdir(exist_ok=True)
        
        # Resmi kaydet
        filepath = Path("manual_images") / filename
        image.save(filepath, "JPEG", quality=95)
        
        print(f"✅ {filename} oluşturuldu")
        return True
        
    except Exception as e:
        print(f"❌ {filename} oluşturulamadı: {e}")
        return False

def main():
    """Create test images for all artworks"""
    print("🎨 Test resimleri oluşturuluyor...")
    
    # Resim listesi
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
    
    success_count = 0
    for filename, title, artist, year in artworks:
        if create_test_image(filename, title, artist, year):
            success_count += 1
    
    print(f"\n📊 Test resimleri oluşturuldu: {success_count}/{len(artworks)} resim başarıyla oluşturuldu")
    
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
