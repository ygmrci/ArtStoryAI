"""
Artwork Search Service - Görsel arama işlevselliği
"""

import urllib.parse
from typing import Optional
from app.features.image_sources import (
    get_art_institute_image,
    get_met_museum_image,
    get_wikimedia_image,
    search_artwork_image
)
from app.features.fallback import get_fallback_images

class ArtworkSearchService:
    """Görsel arama işlemlerini yöneten servis"""
    
    @staticmethod
    async def search_artwork_image(art_name: str) -> str:
        """
        Sanat eseri görselini öncelik sırasına göre arar:
        1. Web arama (Google, Bing) - En güncel ve doğru
        2. Müze API'leri (Art Institute, MET, Wikimedia)
        3. Fallback görseller
        4. Placeholder resim
        """
        decoded_name = urllib.parse.unquote(art_name)
        print(f"🔍 Görsel aranıyor: {decoded_name}")
        
        # 1. Web'de ara (en güncel ve doğru)
        try:
            print(f"🌐 Web'de aranıyor: {decoded_name}")
            web_image = search_artwork_image(decoded_name)
            if web_image and web_image.startswith('http'):
                print(f"✅ Web'de görsel bulundu: {decoded_name}")
                print(f"🔗 URL: {web_image}")
                return web_image
            else:
                print(f"⚠️ Web'de görsel bulunamadı: {decoded_name}")
        except Exception as e:
            print(f"⚠️ Web arama hatası: {e}")
        
        # 2. Müze API'lerini dene
        try:
            print(f"🏛️ Art Institute'da aranıyor: {decoded_name}")
            museum_image = get_art_institute_image(decoded_name)
            if museum_image:
                print(f"✅ Art Institute'da bulundu: {decoded_name}")
                print(f"🔗 URL: {museum_image}")
                return museum_image
        except Exception as e:
            print(f"⚠️ Art Institute hatası: {e}")
            
        try:
            print(f"🏛️ MET Museum'da aranıyor: {decoded_name}")
            met_image = get_met_museum_image(decoded_name)
            if met_image:
                print(f"✅ MET Museum'da bulundu: {decoded_name}")
                print(f"🔗 URL: {met_image}")
                return met_image
        except Exception as e:
            print(f"⚠️ MET Museum hatası: {e}")
            
        try:
            print(f"🌐 Wikimedia'da aranıyor: {decoded_name}")
            wikimedia_image = get_wikimedia_image(decoded_name)
            if wikimedia_image:
                print(f"✅ Wikimedia'da bulundu: {decoded_name}")
                print(f"🔗 URL: {wikimedia_image}")
                return wikimedia_image
        except Exception as e:
            print(f"⚠️ Wikimedia hatası: {e}")
        
        # 3. Fallback görsel
        try:
            print(f"🔄 Fallback görsel deneniyor: {decoded_name}")
            fallback_image = get_fallback_images(decoded_name)
            if fallback_image:
                print(f"✅ Fallback görsel bulundu: {decoded_name}")
                return fallback_image
        except Exception as e:
            print(f"⚠️ Fallback hatası: {e}")
        
        # 4. Placeholder resim
        print(f"❌ Hiçbir görsel bulunamadı: {decoded_name}")
        return "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png"
